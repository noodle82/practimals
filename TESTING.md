# Validation for v0.4

33 automated tests passed. Static build passed with locally bundled Three.js modules and licence.

Browser walkthrough verified:

- Empty new profiles, with no invented/demo targets or pre-equipped clothing.
- Parent input of 15 words and a test date; all 15 visible on the home page.
- No fantasy map, times-table activity, shop or currencies in the child interface.
- Live WebGL 3D rendering; fitted hat, coat and shoe meshes.
- The Practimal asking the current question aloud in a mocked female voice, with visible dialogue. All speech text was checked against the selected weekly target. Actual installed voice quality still depends on the device.
- Full-list hear/spell, missing-letter, look/cover/check, missing-word and meaning rounds. Builder letter interaction and assigned-word-only distractors.
- Pause/resume within a round and no early reward before all words were covered.
- Hat after 1 completed game, coat after 3, shoes after 5; no extra reward from same-method repeats on one day.
- Writing and drawing about a selected word from the weekly list, and saving the creation.
- Whole-list test scoring 15/15 without granting a score-dependent egg/baby.
- Date-based egg readiness the day before the test, hatching, collection persistence and a fresh egg in a later week.
- Actual simulated touch single/double/hold/release reactions in the live 3D view.
- Separate profiles, saved wardrobe/babies, word-list-first phone layout and no horizontal overflow at phone/tablet/desktop sizes.

Unit tests also cover 10-, 15- and 20-word lists, wardrobe thresholds, date/DST/leap-day calculations, earlier waiting eggs, meaning lookup failures and source attribution, and female-voice selection without a male fallback.

Physical tablet GPU performance, touch comfort, sound quality and the children's responses need a family trial. No GitHub upload or public deployment was performed for this delivery.
