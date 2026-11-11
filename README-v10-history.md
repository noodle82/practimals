# Spelloids · spelling prototype v0.10 — offline word-content repair

Spelling practice for ages 5–10, with a child-created alien, six ways to master each weekly word, a growing game den and a family record. Multiploids remains the possible future tables companion.

## Offline word-content repair

This source replaces the earlier dictionary-based suggestion system. It also upgrades previously saved teaching words on opening, including archived lists and family records. Unverified older text is kept as a parent-only draft; it is never treated as an approved parent edit simply because it is nonempty. Week IDs, scores, word mastery, clothes and children’s scrapbook writing are preserved. Explicit parent edits are marked and retained. Example sentences must include the exact assigned spelling.

Both KS2 statutory lists are covered, with their alternative forms, together with KS1 examples/common-exception words and the appendix’s illustrated spelling examples. This is England’s reference, not an exhaustive list of every spelling that any UK teacher might set. The DfE document supplies spelling guidance and words; the simple meanings and sentences are original app content. Unknown words remain available in spelling rounds, but meaning and missing-sentence rounds wait for parent input. Further details and attribution: lexicon/README.md.

Use the small **spelloids-offline-words-upload.zip** to update an existing v10 repository. Follow its OFFLINE-WORDS-INSTRUCTIONS.txt; no audio/vendor upload is required.

## Open and upload

For a local preview run `npm start`, then open http://127.0.0.1:4173/. Node.js 22+ is sufficient; no dependency install is needed for the web preview, tests or static build. Native preparation installs the locked Capacitor packages. `npm test` runs the learning checks. `npm run build` copies the static app into dist/. Use an HTTP server, not a double-clicked index.html.

Extract **spelloids-v10-github-upload.zip** and upload its contents into your existing GitHub repository, replacing matching files. Keep the audio, fonts and vendor folders intact. Upload the extracted contents, not the ZIP or an enclosing folder. If GitHub reports too many files, upload root files, audio, fonts and vendor as separate batches, keeping their folder names. This package contains no hidden folders, and each file is below GitHub’s browser-upload size limit. GitHub Pages can serve main / (root). The separate complete-source ZIP also includes the optional .github test/build workflow; it is not needed for Pages to serve the app. Nothing has been published or changed in your GitHub account by this update.

## Start a spelling set

The saved example remains: forgotten, forgetting, gardener, gardening, beginner, beginning, prefer, preferred, limiting, limited, happiest, happier, benefited, drizzling, multiplying.

Parents can enter 1–20 assigned spellings and a test date, then edit simple meanings and examples. The six core methods always use these words: Look/cover/check, Hear & spell, Build the word, Missing letters, Missing word and Match the meaning. Correct independent answers colour each word’s six icons. All six are needed to turn the word green. Passed words stay out of their module; completed modules return their full list as extra practice without additional badge points. Skip and show-answer controls remain available.

**Pick 20 new words** offers four school-year groups: Year 1 (usually 5–6), Year 2 (6–7), Years 3–4 (7–9), Years 5–6 (9–11). These are England curriculum selections, not a single UK-wide curriculum or a full spelling scheme. Each bank has 32 words and original short meanings/examples. Shuffling prioritises words outside the current/recent preview list. The child previews all 20 and explicitly confirms before replacing their current spelling set. Old learning records, babies, scrapbook and portraits are retained.

Curriculum source: https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study — English Appendix 1. Word-list material is Crown copyright, reused under the Open Government Licence v3.0: https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/. Definitions and sentences in curriculum.js are original Spelloids writing. KS1 selections use example/common-exception words and patterns; KS2 selections use the statutory lists. Parents should choose the group that suits their child’s current learning.

## Badges build the monster

Each new set starts with a grey, bare blob. Choosing **I’m ready to learn** earns Badge 1 immediately.

| Badge | Different questions attempted | Reward revealed once earned |
| --- | ---: | --- |
| 1 · Ready to learn | Choose to start | Name, shape and voice |
| 2 · A splash of colour | 5 | Body colour and changeable eye colours |
| 3 · Hello, antennae! | 10 | Antennae |
| 4 · Dress-up time | 20 | Hats, coats and shoes |
| 5 · Extra personality | 35 | Glasses and gloves |
| 6 · The finishing touch | 55 | Freckles or earrings |
| 7 · Practice star | 70 | Achievement for sticking with practice |
| 8 · Rainbow keeper | 85 | Rainbow joins the permanent colour collection |

The table above applies to 15–20-word sets. Later targets scale down for shorter sets, so a ten-word set can earn all eight badges within its 60 core questions. The first colour and antenna badges remain at five and ten for normal weekly lists. The app shows the exact targets for the current set.

Future rewards appear as surprises with badge numbers and clear question targets. Each earned customisation section uses a consistent Badge N title. Preview different shapes, colours, antennae and voices before confirming. The chosen name, shape, colour, antennae and voice stay for this spelling set; next week offers fresh choices. Accessories and eye colour can change. Rainbow is available for the next monster if the current colour is already confirmed. Badge 6 offers freckles OR earrings. The celebration offers Keep playing or Update my pal and can pause/resume a practice round or whole-list test.

A different word/method attempt earns one creation point even when initially incorrect. Repeated guesses, repeats on another day, skips, reveals, completed-module replays, sentence/drawing saves, den games and baby care cannot farm additional creation points. Six successful challenges per word and creation badges remain separate goals. Existing saved monsters and owned items are preserved on migration.

## Whole-list test opens the Secret Den

One complete whole-list practice test must have no more than three wrong spellings: 17/20 or 12/15. For tiny custom lists, at least one correct answer is required. Skipped words count as wrong. A qualifying result keeps the Den open across days for that spelling set; a later lower score does not remove the earned key. Starting a new set resets access. Editing the target list invalidates its previous key even when the length stays the same. Daily answer counts and green words no longer open the Den.

The first set offers **Word Rocket** and **Cloud Hopper**, using the weekly words and actual monster appearance. A completed cycle (all words green or a qualifying whole-list test) adds one game when the next set starts:

1. **Word Nest:** a replayable wordsearch with all weekly words, touch drag or first/last-letter taps, and the child’s Spelloid.
2. **Memory Mates:** match weekly words with their simple meanings in several memory-card rounds.
3. **Monster Bingo:** the named Spelloid gives meaning clues; find the weekly words and fill the board.

Later cycles add clearly labelled remixes of these games. This prototype has five distinct game types, not an unlimited set of unique engines. New game types can extend the catalogue. Every run generates fresh order/layout; the mini-games never mark spelling challenges complete or add creation points. The developer panel can simulate multiple completed cycles to review the whole library.

## Egg, baby and Family Wall

An egg is warm golden amber against a cooler nest. Each fully green word adds visible cracking; partial method progress fills its challenge counter but cannot fake a green word. Only all-green mastery makes the egg hatchable. Dates never hatch it. Four deliberate taps add separate cracks, followed by a short rumble, split shell and baby reveal.

The baby inherits its actual parent’s shape, colour, eyes, antennae, freckles and voice identity with smaller proportions and no clothes. After hatching it looks around and makes a soft two-vowel hello sound. Drag three separate strawberries into its open mouth: it munches, then asks for the next. There is no spoon. The tray stops when empty, with an optional refill. Five gentle taps rock it to sleep in a layered mint-and-wood bassinet. Cuddle, name, wake and teach it a weekly word. There is no hunger timer or penalty while away.

Hatching creates a framed photograph of the actual parent and baby. The parent’s arm reaches around the little one. Tap the frame for names, original spellings, total different questions, whole-list tests with wrong words, separately recorded school test results and tricky words that needed another attempt before all six challenges were complete. Results saved after a hatch are added to that set’s frame too. Old eggs keep their own learning snapshot when hatched after another set begins. Photos preserve the original monster’s look.

## Scrapbook and writing fonts

Scrapbook is in the top navigation between Secret Den and Nursery. Sentence writing offers Handwriting, Joined up, Silly and Simple. Fonts are bundled locally with their licences. These are decorative choices, not a school’s prescribed handwriting scheme. Both drawing and writing have seven background colours. A sentence becomes a 900 × 600 picture with large text fitted and centred in the box, no ruled lines, and the spelling word in a contrasting colour. An accessible caption remains below it. Changing drawing paper preserves strokes and undo history. Drawing includes rubber, brush, highlighter, stamps, sizes, white/gold pens and undo/redo.

New pictures use IndexedDB, with their metadata in saved progress, rather than filling the smaller localStorage allowance with image data. Existing inline pictures remain readable. Starting another spelling set clears the current book and archives it with that set’s Family Wall record. Tap the frame and open its scrapbook. An unfinished archived set with artwork has a separate saved-set cover; no baby is invented. The old twenty-picture truncation is removed. Developer-mode artwork remains in memory and cannot replace real pictures.

## Starting practice and layout preview

Badge 1 opens name, shape and voice. Preview and confirm all three; the checklist and pal’s speech bubble explain any missing choice. **Let’s get spelling** stays disabled until all are confirmed, then opens This Week at **How shall we practise?** The weekly identity stays fixed as described above.

The separate **?view=week-preview** page puts words and practice methods alongside each other on desktop and iPad widths. The main layout remains unchanged. Its activity buttons are preview controls and cannot award progress. Grown-ups also links to this preview.

## Approved voices and unchanged speed

The untouched British **Natural** voice (approved comparison C, Emma) is used until a voice is confirmed. The child can retain Natural or choose **Soft sprite** (option 1), **Little monster** (option 2), **Bella**, **Heart 2**, or **Heart 3 C**. Bella and the Heart voices use American English. Voice choice is confirmed and fixed for the current spelling set, like shape. New sets reopen it.

All speech now generates at **speed 1.0**. Isolated target words are generated without an appended full stop, matching the approved C comparison. No playback-rate change or artificial slowing is applied. Soft sprite uses +2 semitones/+1 resonance; Little monster and Heart 2 use +4/+2.5; Heart 3 C uses −3/+4. Natural and Bella are unprocessed. Pitch/resonance processing keeps exactly the original sample count. The current app uses the MIT-licensed Signalsmith processing library with those approved settings; the earlier audio auditions used the Rubber Band review tool. Listen to the integrated voices on the intended device as part of beta testing.

The local Kokoro 82M v1.0 Q8 engine supplies three base voices: Emma, Bella and Heart. Each has 330 pre-generated clips covering all example/curriculum words and sentences, the example meanings/gaps, greetings and common cues. Character options share these base banks, avoiding duplicate model downloads. The three natural C reference words are the exact approved recordings. Older saved voices reopen selection once; word progress, clothes, names, shapes, babies and scrapbook entries are retained.

The website’s **Grown-ups → Prepare our voice for offline use** saves the app and speech files into browser storage. Wait for the ready message before disconnecting. A cleared browser needs preparation again. Unknown parent-entered words generate locally and may take several seconds or longer on a tablet. The installed iOS build bundles the speech/model files inside the app, so its preparation button initializes local speech without an internet download. No paid speech service, API key or device-voice fallback is used.

Questions still give an example sentence, pause, say Spell, then the isolated target. Hear again gives only the word. All voices retain the same model speed. Speech SDK/model licences and pinned source data are in vendor/speech; the pitch/resonance library and MIT notice are in vendor/voice-tone. Required fonts and runtime files are local. Speech rejects external fetches.

## iPhone/iPad and Codemagic

See **CODEMAGIC-SETUP.md** for GitHub connection, Apple API integration, distribution signing and TestFlight submission. This package adds a pinned Capacitor 8.6.0 wrapper, package-lock.json, opaque app icon and root codemagic.yaml. The Bundle ID is **com.spelloids.spelling** and the Apple integration is named **Codemagic**. The native Xcode project is generated on Codemagic’s Mac, with the app assets bundled locally. Node 22+ is required for native preparation.

The workflow uploads a signed build to App Store Connect once you configure the account/signing and run it. It does not automatically submit public App Store review or external Beta App Review. You must add the processed build to an external group and submit it in TestFlight. No Apple upload, signing or GitHub publishing has been performed here. macOS compilation and a physical iPad test remain necessary.

The Missing letters and Missing word icons are smaller and constrained to their tile squares. Browser geometry checks cover desktop, tablet and 320–540 px phones.

## Developer tools: safe test playground

Open **Grown-ups → Developer tools**, or visit **?view=developer**. Press **Open a test copy**. A gold banner stays visible throughout test mode.

- Add five different answers; turn the next word or all words green.
- Try four-wrong, three-wrong and full-mark whole-list scores.
- See crack stages, make an egg ready, use the real four-tap hatch and inspect the baby/Family Wall.
- Start another spelling cycle to see the next game unlock and reset the Den key.
- Compare slow target-word speech, sentence-plus-word prompts, greetings and character expressions.
- Reset the test copy or leave it at any point.

The playground clones the entire app state in memory. save() refuses persistent writes while it is active. Real progress in localStorage stays unchanged through games, hatching, parent settings and new cycles. Leaving or refreshing returns to the saved real profile. Test mode is intentionally easy to access in this review prototype; a production version should hide it from the child’s normal navigation.

The Studio remains available at **?view=studio** and the neutral colour comparison at **?view=themes**. Neither voice-review page starts speech automatically.

## Storage and limits

Saved-data key **practimals-spelling-v4** is deliberately retained for compatibility, with schema version 10. This remains device/browser storage with two profiles; no school accounts or cloud sync. Use the same browser/site to keep progress. Full storage displays a save notice rather than silently promising persistence. Keyboard fields request autocorrect, capitalisation, spellcheck and autocomplete off; some tablet keyboards have their own suggestion settings.

The speech SDK/model and runtime are bundled under vendor/speech with their upstream licence/source notices. Analytics are disabled; speech, fonts and practice-pack data are local. Word preparation is fully offline. The authored bank contains 1,159 words including 1,076 distinct appendix word forms, plus existing app vocabulary and reported words. Unknown words need an explicit parent meaning and example. No dictionary requests are made. Parents can edit all teaching text. Photo preview is available, but photo-to-text is not connected.

WebGL/WebAssembly are needed for the full model/voice experience; unsupported graphics get an SVG character fallback. Real tablet performance, voice taste, audio permissions and keyboard behaviour still require physical-device review. No account connections, App Store submissions or publishing were performed.

## Practice and customisation update

All six spelling challenges and the whole-list practice test offer one retry after a wrong answer. The first error clears typed/arranged answers; letter tiles return to the same original bank positions. A second error moves on automatically after a short pause. The missed word stays unfinished and available in a later module visit. Empty answers and manual skips do not consume the retry. Correct retries can complete a challenge; test scores use the final submitted answer. Drawings/sentences remain ungraded. The Secret Den's arcade and memory rules are separate from the spelling-question flow.

The new-week Choose my Spelloid action is above the weekly content. Confirmed name, shape, voice, body colour, antennae and finishing choices disappear from the main creation controls. A claimed hat/coat/shoes/accessory category folds away independently; its owned items remain changeable inside My collection, with eye colours. Badges remain in a folded album. The preview stays beside the choices at iPad portrait/landscape widths. New weeks still reset the weekly identity choices.

## This Week dashboard update

This Week now shows the assigned spellings, six core mastery challenges and Your Spelloid alongside each other at tablet/desktop widths. iPad portrait uses one column of six challenge cards; shorter landscape screens use a two-by-three challenge grid. Sentence and drawing activities sit underneath the spelling/challenge columns as creative extras. Challenge descriptions appear inside the activity instead of on dashboard tiles. There is a single whole-list test button at the bottom. Word packs remain accessible in Grown-ups. The dashboard and navigation use Your Spelloid instead of Practice Pal/My pal.

The existing weekly progress icons, word detail, test threshold and retry rules are retained. Narrow screens stack the sections and use a spaced two-row navigation grid. The earlier preview route now shows this dashboard too.
