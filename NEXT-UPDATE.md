## Completed separately: offline word-content repair

The following earlier definition diagnosis/patch notes are historical. The current repair removes the dictionary entirely, covers the appendix reference words, quarantines unverified saved text and preserves explicit parent edits. See OFFLINE-WORDS-VALIDATION.json and lexicon/README.md. Other queued features remain pending.

# Next Spelloids update

Recorded 10 November 2026. These are requested follow-up changes, not features already implemented in v0.10.

## Special rewards and character variety

Retain rainbow as the final Badge 8 colour reward and a permanent collection unlock. Add the following ideas in the next update:

- **Galaxy skin:** deep blue and purple with gently drifting stars.
- **Opal skin:** soft colours that shimmer as the creature moves.
- **Colour-changing skin:** a gentle transition between two colours.
- **Special antennae:** tiny planets, flowers or glowing tips.
- **Footprints:** brief stars or hearts when the creature dances.
- **Signature celebrations:** moonwalk, happy tumble and a silly victory wiggle.
- **Matching baby traits:** the baby inherits the parent's special finish or antennae, preserved in that spelling set's Family Wall portrait.

Keep these as permanent unlocks earned through learning. Skin/body traits are previewed and confirmed once per spelling set, with a fresh choice next set. Allow the selected celebration to change. Reward thresholds and their placement in the badge progression still need to be designed; no new thresholds were agreed in this conversation.

## Fix: Hear my list must toggle off

Parent report: pressing “Hear my list” again currently leaves the voice reading through the entire spelling list.

Required behaviour:

- First press starts reading the current week's list.
- Pressing the same button again stops the current word immediately and cancels all remaining queued words.
- Show a clear playing state, such as “Stop reading”, while the list is active, and restore “Hear my list” when stopped or finished.
- A later press starts a fresh reading; do not overlap, resume a cancelled queue or start duplicate readings.
- Reuse the selected/default voice and preserve the approved speaking speed.
- Keep playback state accurate when changing screens/profiles or interrupting speech with another voice action.

Check a second press during the first word, between words and while initial audio is preparing. Verify that no later word starts after stopping and that normal completion resets the button.

## Parent control: choosing word packs

Parent request: children should focus on their assigned weekly spelling list. The “Pick 20 new words” button must only be visible to children when a parent explicitly enables this option.

- Add an option in the gated Grown-ups settings: **Allow my child to choose word packs**.
- Default this permission to **off**, including for existing profiles that have no saved preference. Save it separately for each child.
- Hide “Pick 20 new words” and other child-facing word-pack entry points when permission is off.
- Apply the permission to the word-pack page and confirmation action too, so an old link, open preview or direct route cannot replace an assigned list without parental permission.
- Keep parent access to word packs within Grown-ups settings. Parents can choose a pack themselves or explicitly enable the child's chooser.
- Switching permission on/off must preserve the current weekly words, progress, egg and scrapbook. Selecting a different set must still use the existing explicit confirmation and archive flow.
- Turning permission off while a pack preview is open must prevent that preview from replacing the assigned list.

Check the default hidden state, parent enable/disable, persistence across reloads, separate child profiles and protection of the assigned spelling list.

## Definitions for parent-entered spelling lists

Parent report: after entering a new weekly list, only a couple of words received definitions. This is a core learning requirement, not an optional extra. Confirmed on the website. Reported examples: endeavour, glamour, conclusion, favourite, flavour, journey, neighbour, confusion, persuasion, supervision; missing examples also affected television and colour.

Inspection of v10:

- Parent-entered lists use the example/starter/primary glossary first, then an online Dictionary API lookup for other words.
- That lookup times out after five seconds. A failed request, missing entry or no accepted short definition leaves a blank meaning labelled “Needs a parent meaning”. The app's final list-ready notice does not explain how many definitions failed or why.
- The selection filter only accepts short dictionary definitions and picks the shortest; this does not reliably ensure age-appropriate language or the intended meaning.
- Definitions already authored in curriculum.js are not consulted by localWord/suggestMeaning when a parent types those same words into a custom list. Reuse these local meanings and examples.
- Preserve existing parent edits; do not overwrite a school-specific definition or sentence.

Next-update requirements: broaden offline child-friendly coverage, reuse all existing local curriculum entries, show a clear definition-completion summary, distinguish offline/time-out/not-found failures, provide a retry for missing suggestions, and let parents review/edit the result. Keep unresolved meanings clearly flagged; never pretend a missing definition was generated. Check the reported list once received. Speech being fully offline does not mean every dictionary lookup is currently offline.

## Scope

The user asked to record these items for the next update. Do not change the current Codemagic/TestFlight submission solely to include these notes.

## Definition patch prepared

A separate small definition patch is ready in outputs/spelloids-definition-fix-upload.zip. It covers the 12 reported words offline, reuses all existing curriculum meanings/examples for typed lists, fills empty fields on resave while retaining parent text, and adds completion counts, failure reasons and a retry. All 99 checks and real browser resave/retry checks pass. The live dictionary returned meanings for all examples during diagnosis; the earlier browser failure remains unexplained. Broader offline coverage and reliable age/sense review remain follow-up work. Other next-update features are still queued.

## Practice and customisation update

All six spelling challenges and the whole-list practice test offer one retry after a wrong answer. The first error clears typed/arranged answers; letter tiles return to the same original bank positions. A second error moves on automatically after a short pause. The missed word stays unfinished and available in a later module visit. Empty answers and manual skips do not consume the retry. Correct retries can complete a challenge; test scores use the final submitted answer. Drawings/sentences remain ungraded. The Secret Den's arcade and memory rules are separate from the spelling-question flow.

The new-week Choose my Spelloid action is above the weekly content. Confirmed name, shape, voice, body colour, antennae and finishing choices disappear from the main creation controls. A claimed hat/coat/shoes/accessory category folds away independently; its owned items remain changeable inside My collection, with eye colours. Badges remain in a folded album. The preview stays beside the choices at iPad portrait/landscape widths. New weeks still reset the weekly identity choices.
