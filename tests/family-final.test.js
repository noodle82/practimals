import test from'node:test';
import assert from'node:assert/strict';
import{keyboardEdit}from'../answer-keyboard.js';
import{eraseSpelloidsData}from'../reset-data.js';
import{bindHatchTap}from'../hatch-tap.js';

test('spelling keyboard inserts at the caret, replaces selections and deletes safely',()=>{
 assert.deepEqual(keyboardEdit('cat',1,1,'o'),{value:'coat',caret:2});
 assert.deepEqual(keyboardEdit('coat',1,3,'u'),{value:'cut',caret:2});
 assert.deepEqual(keyboardEdit('cat',0,0,'Backspace'),{value:'cat',caret:0});
 assert.deepEqual(keyboardEdit('coat',1,3,'Backspace'),{value:'ct',caret:1});
 assert.deepEqual(keyboardEdit('cats',4,4,'Backspace'),{value:'cat',caret:3});
});
test('erasing Spelloids removes its profiles, recordings and keepsakes while preserving other apps',async()=>{
 const values=new Map([['practimals-spelling-v4','progress'],['spelloids-preview','test'],['multiploids-progress','keep'],['other','keep']]),removed=[];
 const storage={get length(){return values.size;},key:i=>[...values.keys()][i],removeItem:key=>values.delete(key)};
 const idb={deleteDatabase:name=>{removed.push(name);const request={};queueMicrotask(()=>request.onsuccess());return request;}};
 await eraseSpelloidsData({storage,idb});assert.deepEqual(removed,['spelloids-keepsakes','spelloids-local-speech-v1']);assert.deepEqual([...values.keys()],['multiploids-progress','other']);
});
test('a blocked erase leaves the profile intact and explains how to retry',async()=>{
 const idb={deleteDatabase:()=>{const request={};queueMicrotask(()=>request.onblocked());return request;}};
 await assert.rejects(eraseSpelloidsData({storage:{removeItem:()=>assert.fail('Do not erase profile on failure')},idb}),/Close other Spelloids/);
});
test('egg zoom guard prevents touch defaults even after the tapped egg was replaced, and leaves other page gestures alone',()=>{
 const events=new Map(),root={addEventListener:(key,fn)=>events.set(key,fn),removeEventListener:key=>events.delete(key)};
 const clean=bindHatchTap([],()=>{},root);let prevented=0;
 events.get('touchend')({target:{closest:()=>({isConnected:false})},preventDefault:()=>prevented++});
 events.get('touchend')({target:{closest:()=>null},preventDefault:()=>prevented++});
 assert.equal(prevented,1);clean();assert.equal(events.size,0);
});
