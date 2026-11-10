# This Week dashboard checks

Browser checks passed at 820x1180, 1024x768, 768x1024, 1366x900, 390x844 and 320x740. Confirmed: spellings/challenges/Spelloid align side by side above 700px, creative extras follow below, exactly six core plus two creative modules, exactly one bottom test button, no horizontal page overflow, readable untruncated words and progress icons below the words inside each tile. A 20-word set retained all 120 progress icons. Word details/progress, activity instructions, drawing and the bottom test button were exercised. No runtime exceptions. These are browser viewport checks, not physical iPad testing.

# Practice-flow and customisation validation

102 automated checks pass. A dedicated muted browser exercised all six spelling challenges: one clean retry, a second error advancing automatically, and no challenge completion for twice-missed words. Build-word tiles returned to their original order with no disabled tiles left over. A correct retry earned its light. The one-word whole-list practice test finished automatically after a second error with a zero score. Leaving during auto-advance cancelled it without awarding mastery.

Onboarding launch was visible above the weekly list at 820px. Confirmed name/shape/voice controls disappeared and the spelling button became enabled. Body colour, antennae, finishing touch and a claimed hat category disappeared after selection. Owned hats could still be removed/re-equipped from the folded collection. Antenna previews stayed within the screen at 820x1180 and 1024x768 with no horizontal overflow. No browser runtime exceptions. These are desktop browser checks at iPad sizes, not physical iPad testing.

# Offline word-content repair validation

10 November 2026: 102 automated checks pass. All 1,085 tracked word forms have a meaning and an exact-target example. This includes 1,076 appendix forms plus nine additional supplied words; total bank size is 1,159.

A dedicated muted browser was seeded with the reported Linux/flavor and abortion examples. Reopening repaired the active teaching text automatically while retaining the week ID, progress, identity locks and scrapbook. Real parent edits survived save/resave. Unknown words stayed flagged with networking disabled; incomplete meaning/sentence modules were blocked. Actual missing-word gameplay and its speech payload used the repaired examples. No browser runtime exceptions. Static build succeeds and includes the new modules in its offline manifest.

Original speech assets and approved voice profiles are unchanged. Automated content checks catch missing fields, target mismatches and selected wording problems; they are not a substitute for specialist educational review. Safari/iOS device behaviour still needs device validation. The following sections record earlier v10 testing, not additional checks performed for this repair.

# Spelloids v0.10 validation

Validated on 10 November 2026. No website, repository or Apple app record was published or changed.

## Automated checks

`node --test tests/*.test.js`: **94 passed, 0 failed**. Covers assignment-only questions, six-method mastery, residual word lists, reward anti-farming, weekly identity locks, tests, Den access, eggs, family records, curriculum packs and games. New checks cover setup gating, sentence fitting/highlighting, scrapbook archives beyond twenty pictures, temporary developer media, finite strawberry trays and constant-gain speech.

Speech checks cover 990 recordings, included spelling/example coverage, sample meaning/gap prompts, audible non-clipping audio, per-bank hashes/sizes, all five model-part hashes and the reassembled hash, bundled Emma/Bella/Heart data, and the exact three approved natural C reference recordings. Build succeeds without a dependency install.

## Browser interactions

Headless Chrome on Windows, audio muted throughout automated runs:

- Confirmed name/shape/voice required before Let’s get spelling activates; pal guidance and jump to practice checked.
- Wrote a sentence, changed font/paper, checked its 900 × 600 picture pixels for large centred text and a coloured target word, then saved/read it through IndexedDB.
- Drew with real pointer events; changing paper preserved strokes. Saved and reopened the result.
- Four real hatch taps, baby hello expression, three real strawberry mouse drags to the projected mouth, munching, empty tray, five-tap bedtime and revised cot checked.
- Repeated all three strawberry drags with actual touch events at 390 and 768 px. No nursery overflow or abandoned drag ghost.
- Checked Family Wall albums, fresh-set scrapbook clearing, retained original pictures, unfinished-set covers and exact localStorage preservation on leaving developer mode.
- Separate side-by-side preview checked at 1280/1024/768 px, default layout unchanged; main screens checked at 320/390 px. Zero JavaScript exceptions in these flows.
- Visually reviewed setup, sentence/scrapbook, nursery/cot and tablet preview screenshots.

## Offline speech

Used the actual Grown-ups preparation button. All **87 required assets** were in the versioned cache and a service worker controlled the page. Switched browser networking off and reloaded. All six voice choices rendered “forgotten” offline without audible playback, with pitch options preserving their base clip’s sample count.

After offline reload, unfamiliar speech generated in Bella (86,400 samples at 24 kHz, RMS 0.104, peak 0.900) and Heart 3 C (82,200 samples, RMS 0.115, peak 0.690). Their workers used the locally bundled voice data. The installed-app preparation branch initialized speech without fetching the website offline manifest. These are browser simulations of the native branch, not an actual iOS run. The baby hello also rendered correctly into a silent OfflineAudioContext.

## New v10 checks

Six approved voice settings, natural default until confirmation, fresh-set reset, legacy migration without learning loss, target prompts without added punctuation and sample-count preservation are checked. A known tone verifies the requested pitch change independently of its duration. A native-compatible SHA-256 fallback matches standard SHA-256 on a model-part-sized buffer; record IDs work without the secure-context UUID API.

The two multi-character activity icons fit their rounded squares at 1280, 1024, 768, 540, 390 and 320 px. Real browser interactions cover six voice choices, audition/confirmation, practice using the confirmed voice, setup launch and an actual v9-to-v10 saved-data migration. No JavaScript exceptions occurred.

The native Bundle ID and version configuration pass the local check. The pinned Capacitor CocoaPods template contains the expected Xcode project/workspace and icon paths. A 1024 × 1024 opaque app icon is verified. Native dependencies are locked to Capacitor 8.6.0. The Codemagic workflow prepares the project on macOS, signs and uploads an .ipa after account/signing setup; it leaves beta review submission manual. Xcode compilation/signing has not been run on this Windows host.

## Requires device and listening review

Automated audio checks cannot certify pronunciation or a young/cute character quality. Listen to the three supplied samples and review new words on the intended iPad. The choices use the natural British Emma voice, Bella and Heart, plus selected pitch/resonance settings. They are not child actors.

Physical Safari storage retention, download time, CPU/memory limits, touch feel, audio permissions, keyboard suggestions and animation smoothness still need device testing. About 205 MiB of source/app assets are delivered before ZIP compression. Offline preparation requires HTTPS or localhost and retained browser storage.

Progress remains local. Photo preview is available; photo-to-text is not connected. No native App Store build or signing certificate is included.
