# Spelloids v0.11

Tablet-first spelling practice for ages 5–10. Children work only with their assigned weekly list, build a Spelloid through practice badges and collect its baby after making every word green.

## Install this update

Follow UPDATE-V11-INSTRUCTIONS.txt. The small update ZIP includes the previous dashboard/content changes plus the new features below. Include its audio folder; these are additional recordings, not replacement large downloads. Keep saved site data and existing audio/vendor assets. Nothing is published by this source package.

## Learning and rewards

Parents enter 1–20 words and a school-test date, or choose a curriculum pack in Grown-ups. The offline authored glossary has 1,159 meanings/example pairs including the tracked England spelling-appendix words and supplied examples. Unsupported words need a parent meaning and exact-target sentence. No online dictionary fallback is used. Definitions can have different school meanings; parents can edit them. See lexicon/README.md for coverage, limits and Crown copyright/OGL attribution.

All six core modules must be passed for each word to turn green. One wrong answer gives a clean retry; a second moves on and keeps that word unfinished. Showing/skipping answers does not award a challenge light. Drawing and writing a sentence are creative scrapbook extras. The full-list test remains available at the bottom of This Week.

The Den contains two included starter games, Word Rocket and Cloud Hopper. It opens after all weekly words pass in any one of the six core modules. Attempts and whole-list test scores alone do not unlock it. A new set needs its own completed module. Existing cycle-based additions to the library remain. Den/care play does not award spelling mastery.

## Preview before confirming

Newly earned clothes preview on the actual Spelloid. Trying them on does not save, claim or equip the reward. Confirm the chosen item to keep it. Weekly identity choices stay fixed after confirmation; owned accessories and eye colours remain changeable in My collection. Freckles/earrings now preview and confirm too.

## Nursery and creche

All collected babies for the current profile are visible together, retaining the inherited look from their spelling sets. Selecting one opens a live care area with strawberries, rocking, cuddles, a teddy, dummy, drinking bottle and fresh nappy. Care saves independently per baby. Only the selected baby has a live renderer; thumbnails share one studio to avoid creating a WebGL context for every baby. Demo hatches do not add babies to real progress. No neglect timers.

## Speech

The six approved options and natural speaking speed remain. The twelve reported words (endeavour, glamour, conclusion, favourite, flavour, journey, neighbour, confusion, persuasion, supervision, television, colour) now have word and context recordings in all three base banks. Additional files are audio/v11-weekly-*.pcm and the updated manifest.

Target audio is prepared before any spelling introduction plays. A missing optional context does not prevent a ready spelling from being heard. Other unrecorded words generate on-device; Grown-ups can prepare a whole list before a lesson. Generated raw audio is retained in a bounded IndexedDB cache so reloading does not require regenerating it. Browser audio resumes are checked, suspended/interrupted playback is reported, and failed automatic questions are retained for a retry. No paid service, remote generation or device-TTS voice substitution. Website offline use requires its assets downloaded once.

The parent's symptom was narrowed to the newer list: sounds/introductions were audible but target words were silent. This pointed to the unrecorded-word path, not a general volume issue. Browser generation and actual sample playback have been checked; the exact physical iPad failure was not reproduced here. See VALIDATION-V11.json. Background audio recovery also accounts for WebKit's reported interrupted-state behaviour: https://bugs.webkit.org/show_bug.cgi?id=273511 . This report does not establish the parent's specific cause.

## Run and build

Node 22+: npm start, npm test, npm run build. Static app output is dist/. Capacitor/Codemagic configuration retains com.spelloids.spelling and the existing Codemagic integration. package.json is 0.11.0; the saved journey schema stays compatible with v10. No state reset or account/cloud-sync service is added. See CODEMAGIC-SETUP.md for native setup.

Earlier feature/testing notes are retained in README-v10-history.md. Current release behaviour and instructions take precedence. Physical Safari/iPad and native iOS verification remain device tests.
