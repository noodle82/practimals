# Practimals · v0.6

Weekly spelling practice for ages 5–10. Colourful challenges, a cleaner little alien, practice badges and a personal family wall. The name remains Practimals.

## Upload to GitHub

Extract **practimals-v6-github-upload.zip** and upload **all extracted files and folders** into the existing repository root, alongside index.html. Replace matching files. Include vendor and tests. Do not upload the ZIP itself or an extra enclosing folder.

The upload ZIP has no hidden files or folders. Keep existing unrelated repository files; the .github folder is not required to serve the app. Existing check workflows can run the updated tests and build. The included workflow in the complete source archive checks and builds only; it does not deploy.

For a simple static GitHub Pages site, serve main / (root). All runtime modules, Three.js and its licence are bundled. The app needs HTTP, so use Pages or a local server rather than double-clicking index.html.

Node.js 20 or later, no dependency installation needed:

- `npm start` — local server on http://127.0.0.1:4173/.
- `npm test` — 51 automated tests.
- `npm run build` — standalone static output in dist/.

## Colours, symbols and phone layout

Open **Colours** in the header for a single-page comparison of **Soft stone** and **Warm oat**. Choosing one saves it on this device. Both retain the pastel game cards. Neutral surfaces replace the purple background; Fredoka and DM Sans remain.

The original Aa, music, blocks, missing-letter, gap and question-mark symbols are back. Each word shows six of these: grey before completion and the matching activity colour afterwards. A word is complete only after all six independent correct answers. Showing an answer, retrying, drawing or writing a sentence cannot fake a challenge completion.

Word labels measure available space and reduce their font size where necessary, with wrapping and sensible phone layouts. Game titles and controls wrap. Layouts were checked at 320, 375, 390, 430, 768 and 1024 pixels; this is not a guarantee for every physical browser or accessibility text-size setting.

## Weekly words and spoken questions

The requested 15-word example remains the default: forgotten, forgetting, gardener, gardening, beginner, beginning, prefer, preferred, limiting, limited, happiest, happier, benefited, drizzling, multiplying.

Parents can use 1–20 assigned words, choose a school-test date and edit simple meanings and example sentences. Six full-list methods use only those target words; multiple-choice distractors also come from the same list. Partial rounds resume that day's remaining words. Creative sentence and drawing activities remain, including rubber, brush, stamps and undo/redo. Text fields request keyboard autocorrect and spellcheck off; a tablet keyboard may keep its own suggestion strip.

Spelling prompts read the example sentence, pause, then say **Spell**, followed by the word as its own slower utterance. Hear again repeats just that word. Meaning and sentence-gap games retain spoken clues so the automatic question does not disclose the answer. The practice test uses the same clear word delivery.

Bubbles, Mallow and Ziggle select distinct actual female English device voices when there are enough installed, as well as having different pace, phrasing and pitch. Their names and underlying device voice are visible in My pal. When fewer than three suitable voices exist, styles share voices; no male default is substituted. **These are temporary speech tests, not finished cute alien voices.** Pitch and pace changes cannot deliver a convincing character voice by themselves. Purpose-made recorded or generated character voices remain a separate design task. There are no bespoke recorded voices or hosted speech service in this build. Word delivery is slower and steadier than the cheerful question/feedback voice.

Device voice reference: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices

## Practice badges and a monster for each spelling set

A new spelling set starts with a grey Bobble, no antennae, no freckles and no clothing equipped. Owned accessories stay in the wardrobe.

Different answered word/method questions count once per day, including brave incorrect attempts. Repeated guesses on the same question do not farm questions. Revealing an answer without an attempt does not count. Whole-list practice-test answers count as questions; den games and baby care do not.

Badges arrive at 10, 20, 30, 40, 50, 60, 75 and 90 answered questions in the current set:

- Badge 1 opens a body colour and shape choice.
- Badge 2 opens an antenna choice.
- Badge 3 opens optional freckles.
- Badges 1–6 open the hat, coat, shoe, glasses, glove and earring collections respectively.
- Badge 8 earns rainbow for the colour library. It remains available in future sets after that set's first badge.

Colour, shape and antenna selections are each **one choice for the spelling set** and are saved immediately. All regular colour and shape options are offered at their relevant badge. Accessories, eye colours, voice and optional freckles can change; chosen accessories stay owned. A wardrobe badge opens the collection, rather than restricting the child to one accessory from it.

At hatching, the current body identity is frozen, including any default grey/no-antenna choices. The child is invited to finish the monster first. Starting a new spelling set in Grown-ups resets the body choices and creates another egg, while keeping owned accessories, baby care, school records and family portraits. Highest badge collections stay unlocked across sets.

Existing v4/v5 monsters are preserved on migration rather than stripped of chosen colours or clothes. Prior attempts are not invented as successful challenges or today's question count.

## Cleaner adults, inherited babies and the hatch

Hard-coded white eye sparkle spots are removed. Faces use smoother, less glossy materials; freckles are optional. Adults keep tap/oof, double-tap/giggle, hold/purr and the Dance button, plus funny expression buttons and occasional idle faces. Keyboard: Enter/space to greet, G to giggle, hold P to purr, D to dance. Reduced-motion preferences are respected.

All six successful challenges for every word unlock the egg: **90 completions for this 15-word set**. Calendar time never hatches it. The final round invites the child to finish their monster and visit the nursery.

Tap the egg four times to add cracks, then watch it rumble, split and reveal the baby. The baby inherits the actual colour, shape, eye colour, antennae and optional freckles of that spelling set's adult, without clothes. It has a rounder, shorter body, larger eyes, shorter arms and smaller antennae. Babies no longer use an unrelated random rare-creature appearance.

In the nursery:

- Drag the berry spoon with a finger or mouse to the mouth to feed it. Enter on the spoon provides a keyboard alternative.
- Tap the baby five times to rock it to sleep. A cot button also allows direct bedtime/wake-up.
- Cuddle, rename it or teach it weekly words. Learned words are saved in that baby's own collection.
- There is no hunger timer or loss of happiness while away.

**Preview a hatch** uses a temporary baby and does not complete words, grant a real baby or alter real care. If you choose to practise from the preview, ordinary spelling progress is recorded. Close preview returns to the real family.

## Family wall and school records

Hatching saves one framed illustration of the adult embracing its inherited baby. It preserves the adult's appearance at hatching, the creature names, achievement date and exact spelling list. Tap a frame to see the names and words. A saved school test result for that set also appears there. Later weeks and changed accessories cannot rewrite old portraits; renaming a baby deliberately updates its portrait's name.

The wall records completed spelling sets at hatching; it does not claim that a child passed the real school test. Grown-ups can separately record the school score, wrong words and notes. Existing legacy babies are retained, but the app does not invent historical portraits when their original adult appearance is unknown.

## Secret den: two starter games and a growing library

Ten different answered questions in a day open that day's den. Once all words are green, it stays open every day for that spelling set. The gate is checked when entering and during play. Access is local practice logic, not an account or parental-security mechanism.

Two starter games:

1. **Word Rocket** — drag up/down or use arrows to avoid asteroids and fly through the assigned word capsules.
2. **Cloud Hopper** — steer left/right to bounce onto word clouds and collect the list.

Each run reshuffles the weekly words and generates a different course. The rider is the live 3D monster with the child's actual body and equipped accessories. Three chances, pause/resume, new-course replay and word collection are included. Completing a game never marks spelling challenges correct.

Each additional spelling set adds a new course edition to the library, using the two existing engines. Moon editions have lower gravity and moving clouds; later rocket editions add drifting comets. These are course/physics variants, not a promise of an unlimited library of distinct game engines. More game types can be developed later.

## Storage and limits

Data stays in this browser's localStorage under the existing practimals-spelling-v4 key, with schema version 6. There are two child profiles, no accounts, cloud sync or school sharing. Clearing browser storage clears local progress; the supplied example list remains bundled for fresh profiles.

Common meanings work offline; unfamiliar words may use a dictionary suggestion for parent review, sending only the word. Photo preview remains available, but photo transcription is not connected. Google Fonts is used when online, with local CSS font fallbacks. Device speech can depend on installed/online voices. WebGL is needed for the full fitted 3D wardrobe; unsupported devices use a simpler SVG view.

A desktop Chromium walkthrough and simulated touch were used. Physical iPad/Android voice sound, finger feel and keyboard behaviour still need trying on the intended tablet.
