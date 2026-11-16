import fs from'node:fs';import path from'node:path';import{execFileSync,spawnSync}from'node:child_process';
if(process.platform!=='darwin')throw Error('The native speech integration check requires Codemagic macOS/Xcode. It is not a browser test.');
const run=(command,args,options={})=>execFileSync(command,args,{encoding:'utf8',maxBuffer:12*1024*1024,...options});
const out=path.resolve('build/speech-diagnostics');fs.mkdirSync(out,{recursive:true});
const devices=JSON.parse(run('xcrun',['simctl','list','devices','available','--json'])).devices;
const available=Object.entries(devices).filter(([runtime])=>runtime.includes('iOS')).reverse().flatMap(([,items])=>items.filter(d=>d.isAvailable!==false));
const simulator=available.find(d=>d.name.includes('iPad'))||available.find(d=>d.name.includes('iPhone'));
if(!simulator)throw Error('No iOS simulator runtime is installed on this Mac; native speech has not been validated.');
const derive=path.resolve('build/speech-simulator');
const result=spawnSync('xcodebuild',['-workspace','ios/App/App.xcworkspace','-scheme','App','-configuration','Debug','-sdk','iphonesimulator','-destination','id='+simulator.udid,'-derivedDataPath',derive,'CODE_SIGNING_ALLOWED=NO','build'],{encoding:'utf8',maxBuffer:32*1024*1024,timeout:900000});
fs.writeFileSync(out+'/simulator-build.log',(result.stdout||'')+'\n'+(result.stderr||''));
if(result.status!==0)throw Error('Native simulator compilation failed. See speech-diagnostics/simulator-build.log; no TestFlight upload should proceed.');
const app=derive+'/Build/Products/Debug-iphonesimulator/App.app';if(!fs.existsSync(app))throw Error('Simulator app not found');
if(simulator.state!=='Booted')run('xcrun',['simctl','boot',simulator.udid]);
run('xcrun',['simctl','bootstatus',simulator.udid,'-b']);
// Use an isolated simulator app container, never a child's real save.
spawnSync('xcrun',['simctl','uninstall',simulator.udid,'com.spelloids.spelling'],{encoding:'utf8'});
run('xcrun',['simctl','install',simulator.udid,app]);
run('xcrun',['simctl','launch',simulator.udid,'com.spelloids.spelling','--spelloids-speech-self-test']);
const container=run('xcrun',['simctl','get_app_container',simulator.udid,'com.spelloids.spelling','data']).trim(),reportPath=path.join(container,'Documents/spelloids-speech-self-test.json');
let report;for(let second=0;second<330;second++){if(fs.existsSync(reportPath)){report=JSON.parse(fs.readFileSync(reportPath,'utf8'));break;}await new Promise(r=>setTimeout(r,1000));}
spawnSync('xcrun',['simctl','io',simulator.udid,'screenshot',out+'/simulator.png'],{encoding:'utf8'});
if(!report)report={pass:false,error:'The running app did not produce a native speech report. Verify that SceneDelegate starts SpelloidsViewController.'};
report.simulator=simulator.name;report.physicalIPadVerified=false;fs.writeFileSync(out+'/speech-report.json',JSON.stringify(report,null,2));
if(!report.pass||!report.registered||report.clips?.length!==2||report.clips.some(c=>c.parts!==4))throw Error('Native speech integration failed: '+(report.error||'incomplete audio')+'. See speech-report.json; no TestFlight upload should proceed.');
console.log('PASS running iOS app: speech bridge registered; physician and interruption each generated and saved 4/4 audio parts. '+JSON.stringify(report));
