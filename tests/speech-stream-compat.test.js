import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';
import{gunzipSync}from'node:zlib';

test('the bundled pronunciation data decompresses exactly without stream async iteration',async()=>{
 const sdk=fs.readFileSync(new URL('../vendor/speech/kokoro.web.js',import.meta.url),'utf8');
 const data=sdk.match(/\}\}\("([A-Za-z0-9+/=]+)"\),A=new Blob\(\[e\]\)\.stream\(\)\.pipeThrough\(new DecompressionStream\("gzip"\)\)/);
 assert.ok(data,'Locate the actual bundled compressed pronunciation dictionary');
 const compressed=Buffer.from(data[1],'base64'),expected=gunzipSync(compressed);
 const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
 Object.defineProperty(stream,Symbol.asyncIterator,{value:undefined});
 assert.equal(typeof stream[Symbol.asyncIterator],'undefined');
 const expression=sdk.slice(data.index+data[0].length).match(/^;const r=([^;]+);/);
 assert.ok(expression,'Locate the dictionary reader actually used by the SDK');
 const read=Object.getPrototypeOf(async function(){}).constructor('A','Response','return '+expression[1]);
 const result=await read(stream,Response);
 assert.deepEqual(Buffer.from(result),expected);
 assert.ok(expected.length>500000,'Check the complete dictionary, not an empty fixture');
});
