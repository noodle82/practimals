# Spelloids v0.16

Spelling practice for ages 5–10, using only the assigned weekly list. Follow UPDATE-V16-INSTRUCTIONS.txt for this cumulative app update over v12–v15. Include audio/lexicon files and preserve existing assets and live signing settings.

## Library repair and expansion

All twenty words in lexicon/weekly-list-v16.json have authored meanings/examples. Nine were missing in v15. lexicon/word-families-v16.tsv adds 108 original pairs, bringing the total to 1,272. The wider library does not change the assigned list or question distractors. Explicit parent edits remain preferred. Unsupported words still need parent input; no claim of exhaustive UK teacher-word coverage is made. WORD-LIST-REVIEW.csv shows the twenty entries for review.

The original appendix count (1,076 forms) is unchanged. These include examples, exceptions and statutory words. The new parent-list/family metadata is kept separate from the official transcription. See lexicon/README.md for attribution and limits. Regenerate teaching content with node scripts/build-word-bank.mjs.

## Ready speech

The twenty words and exact authored contexts are in audio/v16-school-list-natural.pcm and audio/v16-school-list-heart.pcm. All three retained character options use these two base banks at unchanged speed. Existing banks/voice processing stay untouched. Parent-written alternative contexts and other new words retain the local engine path. No paid or remote speech/content service is added.

## Run/build and state

Node 22+: npm start, npm test, npm run build. Static output: dist/. Version: 0.16.0; Bundle ID: com.spelloids.spelling; storage key: practimals-spelling-v4; schema: 10. Current weekly progress, wardrobe, babies, scrapbook, portraits and test records remain compatible. No list reset or cloud/browser/native sync has been added.

Both existing iOS workflows remain in the source, including the family Ad Hoc workflow. The app upload ZIP does not overwrite codemagic.yaml. Make a new family build/installation to update a native iPad app; GitHub Pages changes alone do not update it.

143 tests pass. Browser content and audio checks are recorded in VALIDATION-V16.json. No physical iPad/macOS native build was available here; the muted browser audio render checks establish available non-silent clips, not an independent pronunciation review. Nothing has been published externally.
