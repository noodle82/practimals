import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanWords, practiceWords, normaliseTables, makeQuestions, awardActivity, hasWord, localDay } from '../learning.js';

test('homework import removes duplicates, rejects invalid input and preserves apostrophes',()=>{
 assert.deepEqual(cleanWords("Cat, cat\nsun; can't; twenty-one;123; <script>"),['cat','sun',"can't",'twenty-one']);
 assert.equal(cleanWords(Array.from({length:30},(_,i)=>'a'+String.fromCharCode(97+i)).join(',')).length,20);
});
test('questions only use selected tables, have correct answers and do not repeat facts in a session',()=>{
 assert.deepEqual(normaliseTables([2,'5',2,0,13,2.5]),[2,5]);
 for(let run=0;run<20;run++){
  const questions=makeQuestions([3,8],5);
  assert.equal(questions.length,5);
  assert.equal(new Set(questions.map(q=>`${q.a}:${q.b}`)).size,5);
  questions.forEach(q=>{assert.ok([3,8].includes(q.a));assert.ok(q.b>=1&&q.b<=12);assert.equal(q.answer,q.a*q.b);});
 }
 assert.deepEqual(makeQuestions([]),[]);
});
test('spelling sessions rotate through the full weekly list without repeating within a session',()=>{
 const words=['cat','sun','dog','rain','ship'];
 assert.deepEqual(practiceWords(words,0),['cat','sun','dog']);
 assert.deepEqual(practiceWords(words,3),['rain','ship','cat']);
 assert.deepEqual(practiceWords(['cat'],4),['cat']);
 assert.deepEqual(practiceWords([],2),[]);
});
test('daily rewards cannot be farmed and the quest bonus is awarded once',()=>{
 const p={stars:0,days:{}};
 assert.deepEqual(awardActivity(p,'spelling','2026-11-09'),{earned:10,bonus:0});
 assert.deepEqual(awardActivity(p,'spelling','2026-11-09'),{earned:0,bonus:0});
 awardActivity(p,'tables','2026-11-09');
 assert.deepEqual(awardActivity(p,'creative','2026-11-09'),{earned:10,bonus:15});
 assert.equal(p.stars,45);
 awardActivity(p,'creative','2026-11-09');assert.equal(p.stars,45);
 awardActivity(p,'spelling','2026-11-10');assert.equal(p.stars,55);
 assert.throws(()=>awardActivity(p,'invalid'));
});
test('profiles earn independent rewards, and missing a day removes no stars',()=>{
 const a={stars:0,days:{}},b={stars:0,days:{}};
 awardActivity(a,'spelling','2026-11-09');awardActivity(b,'tables','2026-11-09');
 assert.equal(a.stars,10);assert.equal(b.stars,10);
 awardActivity(a,'tables','2026-11-12');assert.equal(a.stars,20);assert.equal(b.stars,10);
});
test('sentence check matches complete words, and dates use the local calendar',()=>{
 assert.ok(hasWord('An enormous, purple dragon!','enormous'));
 assert.ok(!hasWord('A scatter of stars','cat'));
 assert.equal(localDay(new Date(2026,10,9,0,5)), '2026-11-09');
});
