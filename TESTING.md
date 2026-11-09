# Validation · Practimals v0.5

41 automated tests pass. Static build passes with locally bundled Three.js and its licence.

Browser checks in Chromium:

- Exact saved 15-word example, 90 independent challenge lights, all six complete rounds, and only assigned words in multiple-choice answers and letter banks.
- Shown answers and wrong answers do not earn mastery. Repeated starts vary. Look/cover visibly covers the word and marks hidden word text inaccessible to assistive reading while covered.
- The last successful challenge unlocks the real hatch, then one persistent baby. Reopening cannot duplicate the hatch.
- A demo hatch and feeding/cot actions leave real saved progress unchanged.
- Actual school test records retain wrong words and score; a shuffled 15-question practice test correctly marks against its question order.
- Three distinct pitch/pace styles use the chosen explicit female base voice; iris colours and locked rainbow selection work.
- Live WebGL rendered starter monsters, rainbow and all six fitted clothing categories. Full-list bulk checks skipped repeated renderer allocation; 3D was independently verified before and after them.
- Real touch events distinguish single oof, double giggle, hold purr and release. Dance and yawn buttons produce separate gestures.
- Real drawing input, eraser, undo, redo, stamps and saved image work, including its next wardrobe unlock.
- No horizontal overflow at 390px, 768px or 1024px; desktop visuals inspected at 1280px.
- Legacy migration preserves name, belongings, previous target list and meanings while avoiding invented mastery.
- Nursery teaching stores independently correct weekly words in the real baby’s own word collection. Visible colour unlock labels were checked at phone and tablet widths.
- No browser exceptions during the walkthrough.

Limits: desktop Chromium and simulated tablet touch were used. Physical iPad/Android voice sound and keyboard behaviour need checking on the intended device. Three choices are device speech styles, not recorded custom monster voices. Keyboard autocorrect attributes are requests; the OS can retain its own suggestions. Photo OCR remains unconnected. Nothing was published to GitHub during these checks.
