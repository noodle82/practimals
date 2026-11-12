# Spelloids v0.14

Spelling practice for ages 5–10 using the assigned weekly list. Follow UPDATE-V14-INSTRUCTIONS.txt for uploading this combined update over v12 or v13. It includes the v13 audio and other changes as well as v14. Keep previous audio/vendor/font files and saved website data.

## Current learning rules

Six independent core challenge passes make a word green. Badge 1 celebrates starting; later badges count correct distinct core answers, with the slower v13 thresholds. Whole-list tests use one answer per word, save results and earn no badge/mastery credit. An optional starting check gives a reference score. Ten scrapbook creations unlock one permanent special finish per set across five sets. These rules are unchanged here.

## This release

Normal top navigation and one under-Spelloid return button in activities; always-visible coloured egg with clear progress; hatch-specific rapid-touch handling; drag-and-drop toys, bottle, nappy and baby outfits; timed drinking/burp; properly covered onesie limbs; hidden nappy under clothes; red parent meaning/example action flags; and an explicit confirmation for starting a new spelling week.

The rotating egg palette is saved per egg. Care timers and drag listeners clean up on navigation. Keyboard activation remains available for drag items. Touch-action restrictions apply to the cracking/drag controls, not page-wide zoom. Parent confirmation does not mutate the week until its confirm action.

## Build and state

Node 22+: npm start, npm test, npm run build. Static output is dist/. Package version 0.14.0. Storage remains practimals-spelling-v4, schema 10. Existing signing configuration and com.spelloids.spelling are unchanged. No cloud/browser/native sync or external publication has been added.

133 tests pass, with mouse and emulated touch browser checks. See TESTING.md and VALIDATION-V14.json. Physical iPad Safari/TestFlight behaviour and sound remain device checks.

Speech and photo reading remain free and local. The existing Tesseract assets are in vendor/ocr with attribution/hashes. The 1,164-entry authored glossary and curriculum attribution are described in lexicon/README.md.
