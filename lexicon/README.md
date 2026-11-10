# Offline spelling content

The app bundles 1,159 original child-friendly meaning/example pairs. The tracked reference set has 1,085 distinct forms: 1,076 from England's spelling appendix plus nine supplied words (endeavour, glamour, conclusion, flavour, persuasion, supervision, benefited, drizzling, multiplying). All tracked forms have both fields. The 1,076 are not all statutory words: they include KS1 examples, common exceptions, KS2 statutory entries and illustrated examples.

Reference: Department for Education, English Appendix 1: Spelling.
https://assets.publishing.service.gov.uk/media/5a7ccc06ed915d63cc65ce61/English_Appendix_1_-_Spelling.pdf

Word-list material is Crown copyright, reused under the Open Government Licence v3.0:
https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/

The original reference PDF is retained in reference/. No DfE endorsement is implied. The appendix does not provide the app's definitions or sentences. Those are original Spelloids writing. It is England's curriculum reference, not a comprehensive UK dictionary or a promise to cover every teacher-assigned word.

## Maintenance

base-reviewed.json keeps earlier authored app content. The pipe-separated .tsv files provide new/updated pairs: word|meaning|sentence. An equals sign in the meaning field retains the base meaning. official-wordlists.json records the transcribed source groups and expansions.

Run node scripts/build-word-bank.mjs, then npm test, then npm run build. The compiler rejects duplicates, missing tracked entries, incorrect target spellings and selected unsuitable/US wording. These automatic checks do not establish that every definition has the best possible meaning, reading level or example; content still benefits from educational review.

## Saved-text upgrade

Only explicitly approved parent edits with current provenance are retained as teaching text. Old nonempty text without that marker is replaced by an authored pair where available. Differing legacy text is kept in a parent-only review draft. If a word is unsupported, unchecked fields are withheld and the parent is asked to supply them. Child-made scrapbook sentences are not changed. Additional phrase/UK checks supplement this provenance model; a keyword filter is not the safety system.
