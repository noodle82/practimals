import test from 'node:test';
import assert from 'node:assert/strict';
import {femaleEnglishVoices,chooseCalmVoice,calmUtterance}from'../voice.js';
const voices=[{name:'Microsoft David',lang:'en-US',voiceURI:'male'},{name:'Samantha',lang:'en-US',voiceURI:'samantha',localService:true},{name:'Google UK English Female',lang:'en-GB',voiceURI:'uk-female'},{name:'Microsoft Hazel Desktop',lang:'en-GB',voiceURI:'hazel',localService:true},{name:'Google UK English Male',lang:'en-GB',voiceURI:'uk-male'},{name:'Anna',lang:'de-DE',voiceURI:'german'}];
test('spelling prefers a named female English voice and British English',()=>{assert.equal(chooseCalmVoice(voices).voiceURI,'uk-female');assert.equal(femaleEnglishVoices(voices).length,3);});
test('a grown-up choice is remembered if still available',()=>{assert.equal(chooseCalmVoice(voices,'samantha').voiceURI,'samantha');assert.equal(chooseCalmVoice(voices,'male').voiceURI,'uk-female');});
test('no suitable voice means no male default is spoken',()=>{assert.equal(chooseCalmVoice([voices[0],voices[4]]),null);assert.equal(calmUtterance('garden',[voices[0]],null,class{}),null);assert.equal(chooseCalmVoice([]),null);});
test('read-aloud uses an explicit female voice with a slower pace',()=>{class Utterance{constructor(text){this.text=text;}}const u=calmUtterance('garden',voices,'hazel',Utterance);assert.equal(u.text,'garden');assert.equal(u.voice.voiceURI,'hazel');assert.equal(u.rate,.78);assert.equal(u.pitch,1.02);assert.equal(u.lang,'en-GB');});
