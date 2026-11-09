# Validation for source v0.3

34 automated tests passed with `node --test tests/*.test.js`. `node build.js` passed and verified the nine fitted outfit sprites, baby atlas and world artwork before building the static app.

Browser walkthrough passed for:

- Fresh profiles with 10 and 20 starter spellings, and a parent-created 15-word list.
- Automatic common-word meanings, editable parent meanings, and preserving edits.
- Answer reveals not counting as mastery; all 15 correct practice answers unlocking the test.
- A full test scoring 14/15 without a baby offer, followed by 15/15 with a saved three-baby choice.
- Baby choices surviving reload, one adoption per assignment, and no extra adoption from repeating a perfect score.
- Daily earnings, insufficient funds leaving a wallet unchanged, successful purchase, free re-equipping, and lifetime stars retained.
- A new week resetting mastery while retaining babies, outfits, wallet and parent meanings.
- Fitted sprite loading and gentle oof animation without the old artificial mouth, glasses, hat or garment-mask overlays.
- Shop, nursery and map layouts at tablet and phone sizes with no horizontal overflow.
- External dictionary response handling, attribution and editing using a controlled browser response. The live dictionary endpoint was separately verified from Node.js; browser access in the test environment was restricted and correctly fell back to parent input.

Earlier gesture checks also verified single tap, double tap, hold, release and cancellation. Physical tablet speakers, installed voices, actual touch comfort and the educational wording still need a family trial. No GitHub upload or website deployment was performed for this source delivery.
