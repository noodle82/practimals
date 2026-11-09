# Practimals · spelling first · v0.5

Weekly spelling practice for children aged 5–10, with a funny, customisable alien companion. Times tables and fantasy worlds remain parked.

## Upload to GitHub Pages

Use **practimals-v5-github-upload.zip**. Extract it on your computer. Upload **all the extracted contents** to the repository root, alongside the existing index.html, and commit the replacement files. Include the entire vendor and tests folders. Upload the contents, not the ZIP or an extra enclosing folder.

This upload package contains no hidden folders. The .github folder is not needed to serve the app. Existing unrelated repository files can remain; there is no need to delete the repository or clear browser data.

For a simple static site, GitHub Pages can serve the main branch / (root). This package is source code; it does not publish itself. The optional workflow in the complete source archive runs checks and builds, but does not deploy a site.

## Run or build locally

Requires Node.js 20 or later. No dependency installation is needed; Three.js is bundled locally with its MIT licence.

- `npm start` serves http://127.0.0.1:4173/.
- `npm test` runs 41 domain, voice and gesture tests.
- `npm run build` creates a self-contained static site in dist/.

Use a server or GitHub Pages, rather than double-clicking index.html. JavaScript modules need HTTP.

## The weekly learning loop

The supplied example set is saved automatically for both profiles: forgotten, forgetting, gardener, gardening, beginner, beginning, prefer, preferred, limiting, limited, happiest, happier, benefited, drizzling, multiplying.

Parents can replace the list with 1–20 words, set a school test date and edit all meanings and example sentences. Common words have offline glossary meanings; other words use a dictionary suggestion for parent review. Only the word is sent to the dictionary. Photo preview is available, but automatic photo transcription is not connected.

The six core challenges are look/cover/check, hear/spell, letter building, missing letters, sentence gaps and meaning matches. Each word needs one independent correct response in **each** challenge to turn green. Six small dashboard lights show exactly what is done. Incorrect answers and shown answers do not earn a challenge light; no lights are taken away. Older versions' attempts cannot prove which challenges were correct, so they are not converted into green lights.

Every full round covers the complete assigned list, in shuffled order. A round paused on the same day resumes remaining words. Starting another activity avoids repeating the previous starting word when possible. Multiple-choice distractors also come only from the assigned list. Drawing and creating sentences are optional bonus activities on a selected weekly word.

Look/cover uses a visible sliding cover over the word. Practice and test text fields request autocorrect, spellcheck, capitalisation and autocomplete off. Some tablet keyboards may still display suggestions; those are controlled by the device and may need turning off in keyboard settings.

## Customisation is the main reward

A completed full-list round earns one wardrobe credit per activity per day. A saved drawing or own sentence earns one creative credit per activity per day. Correctness is needed for green word lights; **having a go** earns the round credit. Repeating a completed round still gives practice but does not farm extra same-day credits.

Lifetime completed-game credits unlock hats (1), coats (3), shoes (5), glasses (7), gloves (9) and earrings (11). Each unlocked category offers a choice of three items once per spelling week. Owned clothes remain available to wear or remove. New colours unlock at 2, 4, 6, 8, 10, 12 and 18 games, with rainbow at 24. Four starter colours, six eye colours and three creature shapes are freely available. Games and belongings carry across weeks; the first creature starts without clothes.

Choose Bubbles, Mallow or Ziggle in My pal to hear three playful pitch/pace styles. These use an explicitly selected female English device voice; they are not bespoke recordings or guaranteed child voices. Sound varies across browsers and tablets. If none is available, enable an English female voice in the device settings or use a grown-up to read. Grown-ups can choose a base voice. The child’s actual Practimal name appears in question bubbles.

Tap the monster for an oof, double-tap to giggle, or hold for a purr. The visible **Dance** button avoids gesture confusion. Keyboard: Enter/space to greet, G to giggle, hold P to purr, D to dance. Yawn, silly cross-eyes and eye roll also have buttons and occasional idle appearances. Automatic funny expressions are suppressed while questions are being asked. Reduced-motion preferences are respected.

## Eggs and the nursery

Each spelling week supplies one egg. Its cracks reflect completed challenge lights, never calendar time. For this 15-word list, all **90 lights** are needed. The final challenge invites the child into a three-step hatch scene. The school test date is only a reminder and a date for school records.

Babies stay in the nursery across weeks. Feed a berry, cuddle, tuck into a cot or wake them up. They never become hungry or unhappy through absence. **Teach a weekly word** starts a normal spelling round with the baby learning alongside the child; correctly answered words join that baby's word collection. Care itself does not grant wardrobe credits. Six baby variants include common, rare and super-rare appearances.

**My egg → Preview a hatch** shows the full scene and a temporary super-rare baby. You can try feeding, cuddling and the cot. Previewing does not grant a real baby, complete a word or change real progress. Close the preview to return to the real family. If you choose to practise from the preview, normal spelling practice is recorded.

## Actual school tests

Grown-ups can record a school test date, tick the words that were wrong and save notes. The score is calculated from that week's list. Records retain the complete list and wrong words even after starting another week. These records are separate from the app's shuffled whole-list practice tests.

## Storage and migration

Profiles, spelling lists, progress, wardrobe, pictures, babies and school records save in this browser's localStorage, under the existing practimals-spelling-v4 key. Version 5 migrates that data, preserving names, owned items and babies. It loads the requested example list on the first upgrade; a different previous list is archived and can be loaded back into the parent editor, including its saved meanings.

There are no accounts, cloud sync, school sharing or server database. Clearing browser data clears this device's saved progress. The example list itself is bundled in sample.js and remains the default for a fresh browser. Standard speech may rely on the device's installed or online voices. Google Fonts supplies Fredoka and DM Sans when online; local fallback fonts are included in CSS.

WebGL enables the fitted 3D wardrobe and facial animations. Unsupported browsers show a simpler SVG character; the detailed wardrobe requires WebGL.
