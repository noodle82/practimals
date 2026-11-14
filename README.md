# Spelloids v0.19

Ready-made audio for all 2,613 library words, meanings, examples and missing-word clues in both retained base banks. All three character choices keep their existing voice settings and speed. Normal library practice needs no speech generation.

Grown-up handover checks the full spoken content in both bases. Parent-written changes or words outside the library retain the free offline fallback and are prepared before handing over. The ready bar counts a word only after all its spoken parts succeed. Missing indexed audio is reported rather than silently regenerated.

Follow UPDATE-V19-INSTRUCTIONS.txt: upload audio batches first, then code last. The new audio adds 296.6 MiB. Old assets and signing configuration remain required; do not delete them.

AAC sprites preserve source sample ranges and include restored encoder headroom. Encoded file buffers and decoded segments each have a two-entry bound. The existing pitch/formant settings still apply without changing speed. The local engine remains for exceptional parent text; it is not needed for the default library.

All added compressed clips are independently decoded/verified. VALIDATION-V19.json records complete test and browser results. No native/physical iPad build was run on Windows. See lexicon/recorded-library-v19.json for verifiable asset/index evidence and LIBRARY-REVIEW-V17.csv for teaching text/inclusion decisions.

Node 22+: npm test; npm run build; npm start. Version 0.19.0, Bundle ID com.spelloids.spelling; storage key practimals-spelling-v4; schema 10. Existing app data and both Codemagic workflows stay compatible. Nothing is published externally.
