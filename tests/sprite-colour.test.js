import test from'node:test';
import assert from'node:assert/strict';
import{recolourSprite}from'../sprite-colour.js';
test('colour changes follow actual blue garment pixels and preserve alpha and the white collar',()=>{const data=new Uint8ClampedArray(40);for(let y=0;y<10;y++)data.set([245,245,245,255],y*4);data.set([20,50,190,255],24);data.set([0,0,255,0],28);const output=recolourSprite(data,1,10,{species:'sprout',colour:'mint',uniform:'forest',outfit:'school'});assert.ok(output[25]>output[26]);assert.equal(output[27],255);assert.deepEqual([...output.slice(20,24)],[245,245,245,255]);assert.equal(output[31],0);});
