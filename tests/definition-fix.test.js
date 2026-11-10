import test from 'node:test';import assert from 'node:assert/strict';
import {suggestMeaning,meaningSummary} from '../meanings.js';
test('parent-entered UK words normalise case without changing their spelling or target example',async()=>{const w=await suggestMeaning('  FAVOURITE  ');assert.equal(w.word,'favourite');assert.match(w.sentence,/\bfavourite\b/);assert.ok(!/\bfavorite\b/.test(w.sentence));assert.deepEqual(meaningSummary([w]),{total:1,meanings:1,sentences:1,missingMeanings:[],missingSentences:[]});});
