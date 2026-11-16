import test from'node:test';
import assert from'node:assert/strict';
import{AlienSpeaker}from'../character-audio.js';
import{SpeechPreparation,speechRows}from'../speech-preparation.js';
import{activitySpeech}from'../speech-library.js';
import{speechChunks}from'../speech-chunks.js';

test('bundled words and their exact clues are green without decoding or loading inference',async()=>{
 const entry={word:'colour',meaning:'How something looks, such as red or blue.',sentence:'My favourite colour is blue.'},s=new AlienSpeaker();
 const clips=Object.fromEntries(activitySpeech(entry).map(p=>[p.text.toLowerCase(),{file:'library.bin'}]));
 s.manifest=Promise.resolve({voices:{natural:{clips}}});s.render=()=>assert.fail('Library inspection must not decode');s.request=()=>assert.fail('Library inspection must not generate');
 const controller=new SpeechPreparation(s,()=>{},{dashboard:true});
 const result=await controller.run([entry],'bubbles','week');assert.equal(result.ready,1);assert.equal(controller.state.rows[0].source,'library');assert.equal(controller.state.phase,'complete');
});
test('a new word prepares only the selected voice; saved parts are reused on a retry',async()=>{
 const saved=new Set(),calls=[];let fail=true;
 const speaker={cancel(){},resetWorker(){},async inspectWordList(){return[{word:'newword',ready:saved.size,total:4,status:saved.size===4?'ready':'waiting'}];},async prepareMissingWord(entry,voice,onPart){for(let i=0;i<4;i++){if(!saved.has(i)){calls.push({voice,i});if(i===2&&fail)throw Error('Timed out');saved.add(i);}onPart({done:i+1,total:4,kind:'clue'});}}};
 const c=new SpeechPreparation(speaker,()=>{},{dashboard:true});await c.run(['newword'],'heart2','week');assert.equal(c.state.phase,'partial');assert.equal(c.state.rows[0].ready,2);assert.equal(c.state.ready,0);fail=false;await c.run(['newword'],'heart2','week');
 assert.equal(c.state.phase,'complete');assert.equal(c.state.ready,1);assert.deepEqual(calls.map(x=>x.i),[0,1,2,2,3]);assert.ok(calls.every(x=>x.voice==='heart2'));
});
test('changing list during preparation cannot let an old completion mark the replacement list ready',async()=>{
 let release,started;const waitStarted=new Promise(r=>started=r);
 const speaker={cancel(){},resetWorker(){},async inspectWordList(entries){return entries.map(word=>({word,ready:0,total:1,status:'waiting'}));},async prepareMissingWord(word){if(word==='old'){started();await new Promise(r=>release=r);}}};
 const c=new SpeechPreparation(speaker,()=>{},{dashboard:true}),old=c.run(['old'],'bubbles','old');await waitStarted;await c.run(['new'],'bubbles','new');release();await old;assert.equal(c.state.key,'new');assert.equal(c.state.rows[0].word,'new');assert.equal(c.state.ready,1);
});
test('cancelling speech playback does not cancel the independent background controller',async()=>{
 let release;const preparation={cancel(){},resetWorker(){},async inspectWordList(){return[{word:'new',ready:0,total:1,status:'waiting'}];},async prepareMissingWord(){await new Promise(r=>release=r);}};
 const c=new SpeechPreparation(preparation,()=>{},{dashboard:true}),running=c.run(['new'],'bubbles','week');await c.checkPromise;await Promise.resolve();const playback=new AlienSpeaker();playback.resetWorker();assert.equal(c.busy,true);release();await running;assert.equal(c.state.phase,'complete');
});
test('a timed-out worker is terminated and every queued caller is rejected before retry',async t=>{
 const previous=globalThis.Worker;let terminated=0,created=0;
 globalThis.Worker=class{constructor(){created++;}postMessage(){}terminate(){terminated++;}};
 t.mock.timers.enable({apis:['setTimeout']});
 try{const s=new AlienSpeaker(),one=assert.rejects(s.request({type:'generate',text:'one'}),/too long/),two=assert.rejects(s.request({type:'generate',text:'two'}),/too long/);t.mock.timers.tick(180001);await Promise.all([one,two]);assert.equal(terminated,1);assert.equal(s.worker,null);assert.equal(s.jobs.size,0);assert.equal(s.engineReady,null);s.getWorker();assert.equal(created,2);s.resetWorker();}finally{globalThis.Worker=previous;t.mock.timers.reset();}
});
test('cold model loading is completed separately before generation starts',async()=>{
 const s=new AlienSpeaker(),order=[];s.manifest=Promise.resolve({voices:{natural:{clips:{}}}});s.request=async payload=>{order.push(payload.type);return payload.type==='init'?{type:'ready'}:{samples:new Float32Array([.2]),sampleRate:24000};};
 await s.raw('newword','bubbles',true,0);assert.deepEqual(order,['init','generate']);
});
test('the question player never starts a second inference engine for a pending word',async()=>{
 const s=new AlienSpeaker();s.cachedOnly=true;s.manifest=Promise.resolve({voices:{natural:{clips:{}}}});s.request=()=>assert.fail('A pending word must not start a second engine');await assert.rejects(s.raw('pending','bubbles',true,0),/still preparing/);
});
test('word dashboard exposes saved part progress and escapes parent text and errors',()=>{
 const html=speechRows({rows:[{word:'ready',status:'ready',source:'library',ready:4,total:4},{word:'<new>',status:'preparing',ready:2,total:4,part:'meaning'},{word:'failed',status:'error',ready:1,total:4,error:'<script>'}]});
 assert.match(html,/Ready · in the library/);assert.match(html,/2 \/ 4 audio parts ready/);assert.match(html,/&lt;new&gt;/);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/);
});
test('clues are divided into bounded phrases without dropping words or splitting spelling words',()=>{
 const text='This is a simple example sentence. '.repeat(9).trim(),chunks=speechChunks(text);assert.equal(chunks.join(' '),text);assert.ok(chunks.every(c=>c.length<=100));assert.deepEqual(speechChunks('interruption'),['interruption']);
});
