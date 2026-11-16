import test from'node:test';
import assert from'node:assert/strict';
import{prepareNativePronunciation}from'../native-pronunciation.js';

test('native pronunciation loads locally once and preserves text, voice and pronunciation inputs',async()=>{
 let loads=0;const stages=[],calls=[],inputIds=[0,12,45,0],style=Array(256).fill(.25);
 const load=async()=>{loads++;return{
  env:{configureLocal:url=>assert.match(url,/vendor\/speech\/models\/$/)},
  nativeSpeechInputs:async(text,voice,onStage)=>{calls.push({text,voice});onStage('Pronunciation ready');return{inputIds,style};}
 };};
 const first=await prepareNativePronunciation('Physician','bf_emma',s=>stages.push(s),load);
 const second=await prepareNativePronunciation('Interruption','af_heart',s=>stages.push(s),load);
 assert.equal(loads,1);assert.deepEqual(calls,[{text:'Physician',voice:'bf_emma'},{text:'Interruption',voice:'af_heart'}]);
 assert.equal(first.inputIds,inputIds);assert.equal(second.style,style);assert.ok(stages.includes('Pronunciation ready'));
});
