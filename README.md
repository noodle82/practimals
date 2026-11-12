# Spelloids v0.13

Spelling practice for ages 5–10, using only the assigned weekly list.

See UPDATE-V13-INSTRUCTIONS.txt for upload instructions, feature rules and verification limits. Preserve the existing repository assets and saved website data. Upload the new audio files too.

## Learning and rewards

Six core challenge passes make each word green. A practice question offers one retry, with no credit for misses, assisted answers or repeated passes. Badge 1 celebrates starting; seven later badges use progressively spaced correct-challenge thresholds. Drawing/sentence work is separate: ten keepsakes per spelling set earn one permanent special finish, across five sets. Existing collections survive upgrades.

Whole-list tests use one attempt per word and grant no badges or challenge lights. An optional starting check gives the first recorded reference score. Test results stores practice and school records with wrong words. The nursery combines babies, care, outfits and clickable family pictures/archived scrapbooks.

## Speech and photos

Three voices retain their v12 settings and speed. New local audio/v13-feedback-*.pcm banks contain eight positive phrases, three retry and two move-on prompts. audio/v13-photo-words-*.pcm adds five supplied-list words and examples. Every voice choice uses these banks. New spellings outside the recordings still generate locally using the existing offline engine.

Tesseract.js 6.0.1 / core 6.0.0 remains bundled in vendor/ocr. Automatic paper detection, adjustable crop, enlargement, contrast and stricter extraction reduce background fragments. Words must be reviewed. Uncertain recognition is flagged, with no silent dictionary substitution. Versions/hashes/licences remain in vendor/ocr/SOURCES.json. The app never uploads photos. Website runtime files must be available once before offline use.

## Build and state

Node 22+: npm start, npm test, npm run build. Static output: dist/. Package version: 0.13.0. Storage key: practimals-spelling-v4; schema: 10. Compatible additions preserve progress, wardrobes, babies, portraits, scrapbooks and test results. No browser/app/cloud sync has been added. Capacitor/Codemagic signing configuration and com.spelloids.spelling remain unchanged.

The authored glossary has 1,164 entries; see lexicon/README.md for curriculum coverage, attribution and limits. Update TSV teaching sources and run node scripts/build-word-bank.mjs when maintaining it.

125 tests and desktop-browser checks passed; see VALIDATION-V13.json and TESTING.md. Physical iPad camera/audio and native iOS builds were not run here. Nothing has been published by preparing this package.
