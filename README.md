# Spelloids v0.15

Spelling practice for ages 5–10, using only the weekly assigned list. Follow UPDATE-V15-INSTRUCTIONS.txt for this cumulative update over v12–v14. Keep existing assets, saved website data and live signing settings. Include the small audio additions in the ZIP.

## This update

Baby care uses drag-on/tap-off on the same nappy/teddy/dummy menu items. The hanger removes clothes with a tap; three outfits go on by dragging. New Moon pyjamas join the blue starry onesie and lilac hoodie. The baby holds a smaller rounded 3D teddy and wears a fitted 3D cloth nappy with closed safety pin. Both props share the baby’s lighting/rendering; nappy visibility respects clothes.

The large grown-up voice panel becomes a collapsed Speech & offline help section with question-sound and local preparation tools. The website's offline-download control is not shown in the native app, whose speech files are bundled. Child voice selection and speech processing are unchanged.

Six core challenge passes per word, slower correct-only badges, one-attempt recorded tests, optional baseline, scrapbook special colours, always-visible coloured egg and new-week confirmation remain from earlier updates.

## Run/build

Node 22+: npm start, npm test, npm run build. Static output: dist/. Version: 0.15.0. Bundle ID: com.spelloids.spelling. Storage key: practimals-spelling-v4; schema: 10. Existing records and collectibles are preserved. No cloud or browser/native sync has been added.

The source retains both Codemagic workflows: Spelloids Family iPad — Ad Hoc for the registered family iPad via Diawi, and Spelloids iOS TestFlight for adult testers. The upload patch does not overwrite live codemagic.yaml. Native camera/photo permissions and bundled assets remain. Build numbers follow the cloud counter or explicit IOS_BUILD_NUMBER override; no live Apple counter was available locally.

136 tests pass, plus browser checks for pointer/touch removal, clothes, 3D props, persistence and speech-help branches. See VALIDATION-V15.json. Physical iPad and native signing/build remain device/cloud checks. No external publication was performed.

The authored offline glossary has 1,164 entries; see lexicon/README.md for coverage/attribution. Existing local speech and Tesseract assets/licences are unchanged.
