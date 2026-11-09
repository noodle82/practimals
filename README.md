# Practimals · source project v0.3

Create your own Practimal. Practise and learn together.

A tablet-first adventure for ages 5–10 with spelling and tables, a personal creature, full-list spelling tests, collectible babies and an outfit shop. This is complete source code and bundled artwork, ready for GitHub. No website was published for this delivery.

## Upload to GitHub

1. Extract the source ZIP.
2. Create a repository called practimals, or use your existing repository.
3. Upload the **contents** of the extracted practimals folder to the repository root, including assets/, tests/ and .github/workflows/ci.yml. Upload files, not the ZIP. Individual image files work with normal browser uploads.
4. The included workflow runs tests and a build. It does **not** deploy a website. If updating an existing repository, remove its old .github/workflows/pages.yml deployment file.

No packages or API keys are required. Node.js 20 or later is needed to run the project locally:

    node server.js

Open the local address printed in the terminal. Do not double-click index.html; browser modules and sprite colouring need HTTP. Checks:

    node --test tests/*.test.js
    node build.js

The optional static build is written to dist/. You can choose how to host it later.

## Weekly spelling journey

- Add 10 words for younger children or 15–20 for older children. Any list from 1 to 20 works. New sample profiles have 10 and 20 words.
- Saving words supplies simple meanings from a bundled primary glossary. Other words get short suggestions using [Free Dictionary API](https://dictionaryapi.dev/). Every meaning and example is editable by a parent. If no useful explanation is found, the app flags it for parent input rather than inventing a definition.
- Common-word meanings work offline. For other lookups, only the spelling word is sent to the dictionary service. Suggestions use short-definition selection and plain-word substitutions, not an AI model. Parent review is needed for age, context and accuracy.
- Whispering Woods prioritises words not yet answered correctly. Hints and tiles are allowed while learning. Revealing an answer does not mark that word as mastered. Correct-word progress saves immediately.
- Answering every word correctly unlocks the Spelling Sanctuary. The child is invited after practice and from the map.
- The full test uses every assigned word once, with one submitted answer per word, no hints, no answer reveals and no timer. Results and corrections appear at the end. A grown-up can read the numbered list if device speech is unavailable.
- Full marks earns a baby Practimal choice. Lower scores encourage more practice; missed words appear first in the next practice session. The child can retry the whole test.

## Nursery rewards

Six original babies: Leaflet, Peach Puff, Petal, Ripple, Nova and Moonbeam. Some are rare or super rare. A perfect test offers up to three distinct unowned visitors. The choice is saved, so reopening the screen or retaking the test cannot reroll it. Choose one baby per weekly assignment. Adopted babies and unclaimed offers survive list changes and browser reloads on the same device.

Rarity weights are configurable in progression.js: common 35, rare 12 and super rare 3 for each design. These are weighted draws without replacement, not fixed percentages per offered set. Collected babies are excluded, so the collection can eventually be completed. Once every baby is collected, future full marks still produce a score and celebration. There are no paid draws or real-money purchases.

## Outfits, accessories and currency

Stars, fireflies and crystals have spendable wallet balances separate from lifetime star totals. Daily completion gives 10 stars per world, spelling also gives 5 fireflies and creative work also gives 5 crystals. Completing all three adds 15 stars. Each world pays out once per local calendar day; replay stays available.

The Woodland Explorer bundle (fitted coat, neckerchief and hat) costs 30 stars + 5 fireflies. The Cosy Cloud Companion bundle (coat, scarf and beanie) costs 20 stars + 5 crystals. Each outfit is rendered separately for every creature. Purchased outfits can be worn again without another charge; unaffordable purchases change nothing. School uniform is always free.

Clothing is part of the creature render, with correctly fitting sleeves, collars and fabric texture. Live uniform colour changes follow actual blue textile pixels and preserve shading; the old polygon clothes and floating hats/glasses were removed. The oof reaction uses a restrained lean and bob, with no artificial mouth circle or extreme squash. Giggle, purr, mute, keyboard controls and cancellation remain. These are detailed sprites with code animation, not rigged 3D models.

## Parent controls

Open Grown-ups and answer the illustrative gate: 29. It is a convenience gate, not a secure account lock. Saving an unchanged word list preserves mastery and parental meanings. Changing the words starts a fresh assignment. **Start a new week with this list** explicitly starts a fresh assignment when the school repeats its words. Existing babies, outfits, wallets, history and unclaimed choices are retained.

Meanings and examples can be saved independently. Tables, age, spelling support and female English voice can be selected. Speech prefers recognised female English system voices at a gentle pace and never silently substitutes a male default. Voice availability and quality vary by device; preview the voice in settings. Creature sounds are synthesised locally, with a separate mute control.

## Existing activities and limits

Tables cover chosen tables 1–12, with equal groups and optional missing factors. Crystal Lagoon supports drawings and sentences; the latest 12 creations per profile are saved. Sentence feedback checks only for the target word, not grammar or understanding.

Two browser-saved profiles; no accounts, backend, school dashboard, cloud sync, analytics or child-data uploads. Clearing browser data removes local progress. External requests are optional fonts and unfamiliar-word dictionary lookups. Photos are local previews only; OCR is not connected. Balances and grading run locally; a shared school product would need server-side validation and proper accounts.

## Source map

- app.js: interface, profiles, practice and test orchestration.
- progression.js: mastery, marking, adoption ledger, shop and wallet rules.
- reward-pages.js: sanctuary, test, nursery and shop screens.
- meanings.js: glossary and optional dictionary suggestions.
- creature-v3.js / sprite-colour.js: fitted sprites and colour rendering.
- learning.js / worlds.js: learning helpers, daily rewards and adventure scenes.
- pal-gestures.js / pal-interaction.js / voice.js: interaction, sound and speech.
- styles.css / adventure.css / progression.css: responsive layout.
- tests/: automated checks. build.js validates bundled assets and makes a static build.

All artwork is bundled in assets/. Original art and outfit variants were made with the built-in image-generation tool; prompt records are included. No image-generation API key is needed. The working name has not received formal trade mark clearance.

Dictionary-derived suggestions retain source and licence metadata when supplied by the service. The parent editor displays the source and licence alongside each suggestion. Common glossary explanations are bundled with this project.

Live dictionary access can fail under browser network restrictions; the app then clearly requests a parent meaning. The dictionary endpoint was separately verified from Node.js during validation.
