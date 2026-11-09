# Practimals · spelling first (v0.4)

**This week’s words. Your own little monster. A little practice every day.**

This is a separate, simpler direction from the earlier adventure prototype. Times tables, fantasy worlds, currencies and the shop are parked. The full parent-entered weekly spelling list is the centre of the app. No demo list is automatically added to a child profile.

## What the child sees

1. **This week:** every assigned word is displayed up front, with the spelling-test date and a simple practice indicator. A word can be opened to hear it and read its meaning/example.
2. **Choose a way to practise:** look/cover/check, hear and spell, build the word, missing letters, missing-word sentences, match the meaning, make a sentence or draw a word.
3. **The Practimal asks:** the animated alien/monster gives the question in a speech bubble and, when a suitable voice is available, asks it aloud in a calm female English voice. It responds to attempts, speaks encouragement and moves its mouth while speech plays.
4. **Dress your pal:** it begins without clothes. Complete 1 game for a hat choice, 3 for a coat choice and 5 for a shoe choice. Pick from three styles in each category. Clothes fit the 3D rig and move with the body. Earned clothes stay in the wardrobe in later weeks.
5. **Check the egg:** setting up a week grants an egg immediately. Calendar days advance the glow/cracks. It is ready to hatch the day before the parent-entered school test. Missing days does not reset it. Hatching does not require full marks. Babies remain in the collection.

## The weekly words are the only targets

- Parents enter 10 words for younger children or 15–20 for older children; lists from 1 to 20 are supported.
- The six spelling/recognition methods cover **all assigned words**, not a hidden selection of three. A partly completed round resumes the remaining words that day.
- Every multiple-choice answer and distractor is an exact word from the same weekly list. Letter tiles come only from the current word.
- Creative activities show a selector containing only that weekly list. A child draws or writes about one selected word at a time.
- Missing-word sentences use the parent's editable example with the target removed. If there is no suitable sentence, the activity uses the editable meaning as a clue. It does not invent a new target.
- Replaying a completed method starts the full list again. The whole-list practice test is available whenever the child wants it, without a mastery gate or fictional destination.

## What counts towards clothing

The six spelling/recognition games count when every weekly word has been worked through. Drawing and sentence games count when one selected-word creation is saved. Each method counts once per calendar day; replaying still records practice but cannot repeatedly unlock rewards that day.

Clothing is awarded for **having a go**, including supported practice, not for perfect scores. The home indicators distinguish a try from a correct spelling-game answer. A correct tile/letter answer is not proof of unaided recall; the whole-list test provides a separate score. Creative work is logged as an attempt and is not automatically graded for grammar or artistic meaning.

## The creature

Three original code-built alien/monster forms: Bobble (two eyes/feelers), Blip (three eyes/one antenna), and Wiggle (taller, with floppy feelers and side fins). Children choose their own name and colour. These are original prototypes inspired by the requested mischievous companion feel, not copies of an existing Fib model.

The creature is rendered live in 3D, rather than animating a fixed picture. It breathes, blinks, follows pointer movement with its eyes, changes its mouth during questions, and reacts to touch:

- Tap once: a little oof and a small lean back.
- Double-tap: giggle, smiling mouth and wiggling arms.
- Hold: relaxed eyes, gentle sway, hearts and a purr that stops on release or cancellation.
- Keyboard: Enter/Space to greet, G to giggle, hold P to purr. Greeting/tickle/cuddle buttons are also provided.

Clothing choices are fitted 3D meshes attached to the same body and arm rig. The renderer respects reduced-motion settings for body movement. WebGL2 is required for the full 3D view; an illustrative 2D fallback keeps activities usable when 3D is unavailable. That fallback is a basic character and does not render the full wardrobe. Test on the children's actual tablets before relying on visual quality or performance.

Three.js r180 is bundled locally with its MIT licence in vendor/. There is no renderer CDN dependency or package-install step.

## Parent setup

Open **Grown-ups**, answer the illustrative check (**29**), select the child and enter the actual list and school test date. The initial date suggestion is the next Friday and can be changed.

- **Save list & suggest meanings** edits the current week and keeps its egg and earned clothing. Changed target words reset partial activity rounds; unchanged words retain progress.
- **Start a new spelling week** begins another egg and a fresh clothing-reward path. Previously earned clothes, babies, scrapbook creations and waiting eggs are retained.
- Edit meanings and example sentences independently. Common primary meanings are supplied locally. Other words use short dictionary suggestions through [Free Dictionary API](https://dictionaryapi.dev/); only the unfamiliar word is sent. Parents should review for age and intended meaning. A failed lookup is flagged for parent input rather than given an invented definition. Suggestions use a glossary and dictionary rules, not an AI model.
- Dictionary-derived source/licence metadata is retained and displayed when supplied.
- Choose typing or letter-tile support, a female English system voice, and whether the Practimal speaks questions automatically. Voice quality depends on the browser/device. A male/default voice is never silently substituted when no recognised female voice is available.
- The sound toggle stops automatic speech and creature sounds; a deliberately requested word-reading button can still speak. Device speech voices may use an operating-system service.
- Photo attachment is a local preview for manual transcription. OCR is not implemented.

The arithmetic settings check is a convenience gate, not a secure parental account system.

## Put the source on GitHub

1. Extract the ZIP and upload the **contents of the practimals-spelling folder** to your repository root, including vendor/ and .github/workflows/ci.yml. Do not upload the ZIP itself.
2. If reusing an earlier repository, remove the old source files and its old automatic Pages deployment workflow first, or use a fresh repository so the versions do not get mixed together.
3. The included workflow tests and builds the code. It does not publish a site.
4. If you want GitHub Pages, index.html is at the root and all browser dependencies are bundled. Pages can publish from the main branch/root. The optional dist/ build can also be hosted as a static site.

## Run locally

Node.js 20 or later:

```sh
node server.js
```

Open the local address printed in the terminal. Serve over HTTP; do not double-click index.html.

```sh
node --test tests/*.test.js
node build.js
```

## Storage and limits

Two separate profiles are saved in the current browser only. No accounts, school dashboard, cloud sync, analytics or microphone access. Clearing browser data removes saved progress. The latest 20 drawings/sentences and 20 practice-test results are retained per child.

This version uses its own storage key (practimals-spelling-v4), leaving earlier prototype data untouched. It does not automatically import earlier demo spellings. Add the actual current weekly lists in settings.

This is a family-test prototype. Reward logic and test marking run on the client. A future shared school service would need proper accounts, server-side controls and further child/teacher testing. The working name has not received formal trade mark clearance.

## Source map

- app.js / app.css: simple weekly-list interface and child/parent flows.
- spelling.js: strict weekly targets, round coverage, rewards, calendar eggs and test marking.
- monster.js: native 3D creature, wardrobe and facial/body animation.
- meanings.js / learning.js: automatic meaning suggestions and word parsing helpers.
- voice.js / pal-interaction.js / pal-gestures.js: female read-aloud, touch reactions and sound.
- tests/: 33 automated tests. build.js creates a static dist/ folder.
