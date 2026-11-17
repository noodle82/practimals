import test from'node:test';
import assert from'node:assert/strict';
import{betterPhotoReading}from'../photo-words.js';
import{normalisePhotoPaper,removePhotoRules}from'../photo-crop.js';
import{optimalLandingTop}from'../navigation.js';

test('a clearer OCR retry wins even when both passes find exactly the same number of words',()=>{
 const first={data:{text:'1. here\n2. hear\n3. heel',confidence:35}},retry={data:{text:'1. here\n2. hear\n3. heel',confidence:88}};
 assert.equal(betterPhotoReading(first,retry),retry);
 assert.equal(betterPhotoReading(retry,first),retry);
});
test('an OCR retry with background text cannot replace a valid spelling list with over twenty words',()=>{
 const first={data:{text:'1. cat\n2. dog',confidence:75}},background={data:{text:Array.from({length:25},(_,i)=>'word'+String.fromCharCode(97+i)).join('\n'),confidence:95}};
 assert.equal(betterPhotoReading(first,background),first);
});
test('a high confidence heading cannot beat readable words, and numbered lists favour complete readings',()=>{
 const heading={data:{text:'Week',confidence:99}},word={data:{text:'1. cat',confidence:45}};
 assert.equal(betterPhotoReading(heading,word),word);
 const extra={data:{text:'1. cat\n2. dog\nan',confidence:90}},complete={data:{text:'1. cat\n2. dog',confidence:88}};
 assert.equal(betterPhotoReading(extra,complete),complete);
});
test('shadow correction flattens shaded paper and retains ink and narrow apostrophe strokes',()=>{
 const w=80,h=80,data=new Uint8ClampedArray(w*h*4);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const v=Math.round(65+155*x/(w-1)),j=(y*w+x)*4;data.set([v,v,v,255],j);}
 for(const x of[15,60])for(let y=20;y<50;y++){const j=(y*w+x)*4;data[j]=data[j+1]=data[j+2]=10;}
 const mark=(13*w+30)*4;data[mark]=data[mark+1]=data[mark+2]=10;
 normalisePhotoPaper(data,w,h);
 for(const x of[10,45,70])assert.ok(data[(60*w+x)*4]>225,'Paper should be light on both sides of the shadow');
 for(const x of[15,60])assert.ok(data[(30*w+x)*4]<30,'Letters must stay dark');assert.ok(data[mark]<30,'Keep the apostrophe');
});
test('landing keeps a fitting card near the top and scrolls past the banner when the keyboard needs room',()=>{
 assert.equal(optimalLandingTop({start:300,end:900,priorityStart:500,viewportHeight:790}),282);
 const top=optimalLandingTop({start:300,end:1150,priorityStart:650,viewportHeight:790});assert.equal(top,378);assert.ok(1150-top<=790-18);
});
test('slanted table borders are removed while separate letter strokes and apostrophes stay',()=>{
 const width=200,height=1200,pixels=new Uint8ClampedArray(width*height*4).fill(255),ink=(x,y)=>{const j=(y*width+x)*4;pixels[j]=pixels[j+1]=pixels[j+2]=0;};
 for(let x=0;x<width;x++)for(let dy=0;dy<2;dy++)ink(x,40+Math.floor(x/25)+dy);
 for(let x=50;x<120;x++)ink(x,300);ink(70,280);
 removePhotoRules(pixels,width,height);
 for(let x=0;x<width;x++)assert.equal(pixels[((40+Math.floor(x/25))*width+x)*4],255);
 assert.equal(pixels[(300*width+80)*4],0);assert.equal(pixels[(280*width+70)*4],0);
});
test('when a whole question cannot fit, landing still makes the bottom of the keyboard visible',()=>{
 const top=optimalLandingTop({start:300,end:1600,priorityStart:600,viewportHeight:740});assert.equal(top,878);assert.ok(1600-top<=740-18);
});
