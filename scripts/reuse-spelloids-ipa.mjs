import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pipeline} from 'node:stream/promises';
import {Transform} from 'node:stream';
import {fileURLToPath} from 'node:url';

// Re-sign only the exact successful IPA inspected on 23 November 2026.
export const SOURCE = Object.freeze({
  sha256: '6c6ca6d4869b7a2e5b92da0faa1c8882d0b8ae635e07bfe44d33e3c509ebc57d',
  bytes: 454059428,
  bundle: 'com.spelloids.spelling', version: '0.19.0', build: '30'
});
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const run = (file, args, options = {}) => execFileSync(file, args, {maxBuffer: 16 * 1024 * 1024, ...options});
const pythonPlist = 'import sys,json,plistlib,base64,datetime; d=plistlib.loads(sys.stdin.buffer.read()); json.dump(d,sys.stdout,default=lambda x: base64.b64encode(x).decode() if isinstance(x,bytes) else x.isoformat() if isinstance(x,(datetime.datetime,datetime.date)) else str(x))';
const readPlist = data => JSON.parse(run('python3', ['-c', pythonPlist], {input: data}).toString());
const readProfile = file => readPlist(run('/usr/bin/security', ['cms', '-D', '-i', file]));
const stable = value => JSON.stringify(sort(value));
function sort(value) {
  if (Array.isArray(value)) return value.map(sort);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, sort(value[k])]));
  return value;
}
export function checkSource(info, bytes, sha256) {
  if (bytes !== SOURCE.bytes || sha256 !== SOURCE.sha256) throw Error('The download is not the inspected build-30 IPA. Use its App.ipa artifact link; do not use the artifacts ZIP or a different build.');
  if (info.CFBundleIdentifier !== SOURCE.bundle || String(info.CFBundleVersion) !== SOURCE.build || info.CFBundleShortVersionString !== SOURCE.version) throw Error('Unexpected app identifier or version.');
}
export function checkProfile(profile, sourceProfile, now = Date.now()) {
  const ent = profile.Entitlements || {}, sourceEnt = sourceProfile.Entitlements || {};
  if (!profile.TeamIdentifier?.[0] || profile.TeamIdentifier[0] !== sourceProfile.TeamIdentifier?.[0]) throw Error('Family profile belongs to a different Apple team.');
  if (ent['application-identifier'] !== sourceEnt['application-identifier'] || !ent['application-identifier']?.endsWith('.' + SOURCE.bundle)) throw Error('Family profile must have the exact same Spelloids app identifier.');
  if (ent['com.apple.developer.team-identifier'] !== sourceEnt['com.apple.developer.team-identifier']) throw Error('Family profile has a different entitlement team.');
  if (!Array.isArray(profile.ProvisionedDevices) || !profile.ProvisionedDevices.length || profile.ProvisionsAllDevices || ent['get-task-allow'] !== false || ent['beta-reports-active']) throw Error('A distribution Ad Hoc profile with registered devices is required.');
  const expiry = Date.parse(profile.ExpirationDate + (/Z$|[+-]\d\d:\d\d$/.test(profile.ExpirationDate) ? '' : 'Z'));
  if (!Number.isFinite(expiry) || expiry <= now) throw Error('Family profile has expired.');
  return true;
}

// Re-signing changes Mach-O signature blobs and their size fields. Hash all other
// binary bytes so changed machine code, constants or linked data are rejected.
export function unsignedMachO(data) {
  const magic = data.length >= 4 ? data.readUInt32LE(0) : 0;
  if (magic !== 0xfeedfacf && magic !== 0xfeedface) return null;
  const header = magic === 0xfeedfacf ? 32 : 28;
  const commandEnd = header + data.readUInt32LE(20), commands = data.readUInt32LE(16);
  if (commandEnd > data.length) throw Error('Invalid Mach-O command table.');
  const clean = Buffer.from(data); let at = header, signature = null;
  for (let i = 0; i < commands; i++) {
    const cmd = data.readUInt32LE(at), size = data.readUInt32LE(at + 4);
    if (size < 8 || at + size > commandEnd) throw Error('Invalid Mach-O load command.');
    if ((cmd === 0x21 || cmd === 0x2c) && data.readUInt32LE(at + 16) !== 0) throw Error('Encrypted App Store apps cannot be reused. Use the original Codemagic artifact.');
    if (cmd === 0x1d) {
      if (signature) throw Error('Multiple Mach-O signature commands.');
      signature = {offset: data.readUInt32LE(at + 8), size: data.readUInt32LE(at + 12)};
      clean.fill(0, at + 8, at + 16);
    }
    if (cmd === 0x19 && data.subarray(at + 8, at + 24).toString().replace(/\0/g, '') === '__LINKEDIT') {
      clean.fill(0, at + 32, at + 40); // Signature-dependent virtual size.
      clean.fill(0, at + 48, at + 56); // Signature-dependent file size.
    }
    if (cmd === 0x1 && data.subarray(at + 8, at + 24).toString().replace(/\0/g, '') === '__LINKEDIT') {
      clean.fill(0, at + 28, at + 32); clean.fill(0, at + 36, at + 40);
    }
    at += size;
  }
  if (!signature || signature.offset < commandEnd || signature.offset + signature.size > data.length) throw Error('Missing or invalid Mach-O signature.');
  const h = crypto.createHash('sha256');
  h.update(clean.subarray(0, signature.offset));
  h.update(clean.subarray(signature.offset + signature.size));
  return h.digest('hex');
}
export function appManifest(root, plistReader = readPlist) {
  const result = {};
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const file = path.join(dir, entry.name), relative = path.relative(root, file).replaceAll(path.sep, '/');
      if (relative === 'embedded.mobileprovision' || relative === '_CodeSignature' || relative.startsWith('_CodeSignature/') || relative.includes('/_CodeSignature/')) continue;
      if (entry.isSymbolicLink()) {
        const target = fs.readlinkSync(file), resolved = path.resolve(path.dirname(file), target);
        if (path.isAbsolute(target) || !resolved.startsWith(path.resolve(root) + path.sep)) throw Error('App has an escaping symlink.');
        result[relative] = 'symlink:' + target;
      } else if (entry.isDirectory()) walk(file);
      else {
        const bytes = fs.readFileSync(file), magic = bytes.length >= 4 ? bytes.readUInt32LE(0) : 0;
        if ([0xbebafeca, 0xcafebabe, 0xbfbafeca, 0xcafebabf].includes(magic)) throw Error('Unexpected universal binary; this reuse workflow supports the inspected device IPA only.');
        const macho = unsignedMachO(bytes);
        result[relative] = macho ? 'macho:' + macho : relative.endsWith('Info.plist') ? 'plist:' + hash(stable(plistReader(bytes))) : hash(bytes);
      }
    }
  }
  walk(root); return result;
}
export function compareManifests(before, after) {
  const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(k => before[k] !== after[k]);
  if (changed.length) throw Error('Re-signing changed app content: ' + changed.slice(0, 12).join(', '));
  return Object.keys(before).length;
}
async function shaFile(file) {
  const h = crypto.createHash('sha256'); for await (const chunk of fs.createReadStream(file)) h.update(chunk); return h.digest('hex');
}
export function normaliseArtifactLink(value) {
  const text = String(value || '').trim();
  if (!text) throw Error('Enter the App.ipa download link from the successful build in the workflow input.');
  if (/\$\{\{|inputs\.source_ipa_url/.test(text)) throw Error('Codemagic did not resolve the source_ipa_url input. Check the workflow input and SPELLOIDS_SOURCE_IPA_URL mapping; no download was attempted.');
  // Pasting a clickable chat link may supply [label](address), <address>,
  // quotes, or a fenced block. Extract addresses as data; never evaluate them.
  const candidates = [...new Set((text.match(/https:\/\/[^\s<>"'`\[\]()]+/gi) || []).map(s => s.replace(/&amp;/g, '&')))];
  if (candidates.length !== 1) throw Error(candidates.length ? 'More than one different address was pasted. Enter only the App.ipa artifact link.' : 'The input is not a web download link. Right-click App.ipa in the successful Codemagic build and choose Copy link address.');
  let parsed;
  try { parsed = new URL(candidates[0]); } catch { throw Error('The artifact link is malformed. Copy the App.ipa link address again from Codemagic.'); }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.hostname !== 'api.codemagic.io' || !/^\/+artifacts\//.test(parsed.pathname)) throw Error('Paste the direct App.ipa artifact link from Codemagic, starting with https://api.codemagic.io/.');
  return parsed.href;
}
export async function download(url, destination) {
  let next = new URL(normaliseArtifactLink(url));
  for (let redirects = 0; redirects < 6; redirects++) {
    if (next.protocol !== 'https:' || next.username || next.password) throw Error('The source must use HTTPS without embedded login details.');
    const response = await fetch(next, {redirect: 'manual', signal: AbortSignal.timeout(300000)});
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location'); await response.body?.cancel();
      if (!location) throw Error('Artifact redirect is missing its destination.');
      try { next = new URL(location, next); } catch { throw Error('The artifact server returned an invalid redirect address. Copy a fresh App.ipa download link.'); }
      continue;
    }
    if (!response.ok || !response.body) throw Error('Artifact download failed (HTTP ' + response.status + '). Copy a fresh App.ipa link from the successful build.');
    if (response.headers.has('content-length') && Number(response.headers.get('content-length')) !== SOURCE.bytes) {
      await response.body.cancel(); throw Error('Artifact size is different from the inspected IPA. Check that the link is for App.ipa.');
    }
    let bytes = 0;
    const limit = new Transform({transform(chunk, encoding, done) { bytes += chunk.length; done(bytes > SOURCE.bytes ? Error('Artifact exceeds the expected size.') : null, chunk); }});
    await pipeline(response.body, limit, fs.createWriteStream(destination, {flags: 'wx'}));
    if (bytes !== SOURCE.bytes) throw Error('Incomplete artifact download.');
    return;
  }
  throw Error('Too many artifact redirects.');
}
function unpack(ipa, destination) {
  const names = run('/usr/bin/unzip', ['-Z1', ipa]).toString().split(/\r?\n/).filter(Boolean);
  if (names.some(n => n.startsWith('/') || n.split('/').includes('..') || n.includes('\\'))) throw Error('Unsafe archive path.');
  const apps = names.filter(n => /^Payload\/[^/]+\.app\/Info\.plist$/.test(n));
  if (apps.length !== 1 || names.some(n => n.endsWith('.appex/Info.plist') || /\.app\/.*\.app\/Info.plist$/.test(n))) throw Error('Expected the single Spelloids app without extensions.');
  run('/usr/bin/ditto', ['-x', '-k', ipa, destination]);
  return path.join(destination, path.dirname(apps[0]));
}
function selectSigningProfile(sourceProfile) {
  const identities = run('/usr/bin/security', ['find-identity', '-v', '-p', 'codesigning']).toString();
  const valid = new Set([...identities.matchAll(/\b([0-9A-F]{40})\b\s+"/gi)].map(m => m[1].toUpperCase()));
  const directory = path.join(os.homedir(), 'Library/MobileDevice/Provisioning Profiles');
  if (!fs.existsSync(directory)) throw Error('Codemagic did not install any signing profiles. Check the Spelloids Ad Hoc profile and matching certificate.');
  const matches = [];
  for (const name of fs.readdirSync(directory).filter(n => n.endsWith('.mobileprovision'))) {
    const file = path.join(directory, name); let profile;
    try { profile = readProfile(file); checkProfile(profile, sourceProfile); } catch { continue; }
    const certificate = (profile.DeveloperCertificates || []).map(b64 => crypto.createHash('sha1').update(Buffer.from(b64, 'base64')).digest('hex').toUpperCase()).find(fingerprint => valid.has(fingerprint));
    if (certificate) matches.push({file, profile, certificate});
  }
  matches.sort((a, b) => String(b.profile.ExpirationDate).localeCompare(String(a.profile.ExpirationDate)));
  if (!matches.length) throw Error('No valid Spelloids Ad Hoc profile with registered devices and a matching installed signing certificate was found. Check Codemagic Code signing identities.');
  return matches[0];
}
export async function main() {
  if (process.platform !== 'darwin') throw Error('Run this workflow on Codemagic macOS; Apple signing is not available on Windows.');
  const url = normaliseArtifactLink(process.env.SPELLOIDS_SOURCE_IPA_URL);
  for (const key of ['FASTLANE_SKIP_UPDATE_CHECK', 'FASTLANE_HIDE_CHANGELOG', 'FASTLANE_OPT_OUT_USAGE', 'FASTLANE_DISABLE_COLORS']) process.env[key] = '1';
  run('fastlane', ['--version']); // Installed on the Codemagic macOS image.
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'spelloids-family-'));
  const source = path.join(temp, 'source.ipa');
  console.log('Downloading the existing successful Spelloids build (no speech dependency download).');
  await download(url, source);
  const sha = await shaFile(source);
  if (sha !== SOURCE.sha256) throw Error('Downloaded IPA checksum does not match the file inspected locally.');
  const app = unpack(source, path.join(temp, 'original'));
  const info = readPlist(fs.readFileSync(path.join(app, 'Info.plist')));
  checkSource(info, fs.statSync(source).size, sha);
  run('/usr/bin/codesign', ['--verify', '--deep', '--strict', app]);
  const sourceProfile = readProfile(path.join(app, 'embedded.mobileprovision'));
  const before = appManifest(app);
  const selection = selectSigningProfile(sourceProfile);
  const output = path.join(temp, 'family.ipa');
  fs.copyFileSync(source, output, fs.constants.COPYFILE_EXCL);
  console.log('Re-signing build 30 with the matching family Ad Hoc profile.');
  run('fastlane', ['run', 'resign', 'ipa:' + output, 'signing_identity:' + selection.certificate, 'provisioning_profile:' + selection.file], {stdio: 'inherit'});
  const finalApp = unpack(output, path.join(temp, 'verified'));
  run('/usr/bin/codesign', ['--verify', '--deep', '--strict', finalApp]);
  const installedProfile = readProfile(path.join(finalApp, 'embedded.mobileprovision'));
  checkProfile(installedProfile, sourceProfile);
  if (installedProfile.UUID !== selection.profile.UUID) throw Error('The output does not contain the chosen family profile.');
  const entitlements = readPlist(run('/usr/bin/codesign', ['-d', '--entitlements', ':-', finalApp]));
  for (const key of ['application-identifier', 'com.apple.developer.team-identifier']) if (entitlements[key] !== installedProfile.Entitlements[key]) throw Error('Signed entitlement mismatch: ' + key);
  if (entitlements['get-task-allow'] !== false || entitlements['beta-reports-active']) throw Error('The output still has development or TestFlight entitlements.');
  const checkedFiles = compareManifests(before, appManifest(finalApp));
  const report = {pass: true, version: SOURCE.version, build: SOURCE.build, bundle: SOURCE.bundle, sourceSha256: sha, outputSha256: await shaFile(output), distribution: 'ad_hoc', registeredDevices: installedProfile.ProvisionedDevices.length, profileExpires: installedProfile.ExpirationDate, sameAppleTeam: true, sameAppIdentifier: true, signatureVerified: true, unchangedAppFilesChecked: checkedFiles, nativeSpeechRecompiled: false, newSpeechDownloads: false, physicalIPadInstallTested: false};
  const artifact = path.resolve('build/ios/ipa/App.ipa');
  fs.mkdirSync(path.dirname(artifact), {recursive: true});
  fs.copyFileSync(output, artifact, fs.constants.COPYFILE_EXCL);
  fs.writeFileSync('build/family-reuse-report.json', JSON.stringify(report, null, 2));
  console.log('PASS: family IPA signed; ' + checkedFiles + ' app files and unsigned binary content match build 30. Download build/ios/ipa/App.ipa.');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error('Family IPA preparation failed: ' + error.message); process.exitCode = 1; });
}
