import{SCHOOL_WORDS}from'./school-lexicon.js';
let loading;
async function library(){if(globalThis.Tesseract)return globalThis.Tesseract;if(!loading)loading=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL('./vendor/ocr/tesseract.min.js',import.meta.url).href;script.onload=()=>resolve(globalThis.Tesseract);script.onerror=()=>{loading=null;reject(Error('Photo reading is not available yet. Connect once to load it, or type the words.'));};document.head.append(script);});return loading;}
export function photoWordCandidates(text){const words=[],ignored=[];for(const raw of String(text||'').split(/\r?\n/)){const line=raw.replace(/[‘’]/g,"'").replace(/[–—]/g,'-').trim();if(!line)continue;const clean=line.replace(/^\s*(?:[0-9Il|JSOo]{1,2}[.)\]:,-]\s*|\d+\s+)/,'').replace(/[✓✔○•*]/g,' ').trim().replace(/^[^a-zA-Z]+|[^a-zA-Z']+$/g,'').toLowerCase();if(/^(?:spellings?|homework|name|date|test|week|year)$/.test(clean)||!(/^[a-z]+(?:[-'][a-z]+)*'?$/.test(clean))||clean.length<2&&!['a','i'].includes(clean)){ignored.push(raw);continue;}if(!words.includes(clean))words.push(clean);}return{words,ignored,tooMany:words.length>20};}
export function numberedPhotoCount(text){const numbers=[...String(text).matchAll(/^\s*[| ]*(\d{1,2})[.)]\s+/gm)].map(m=>Number(m[1])).filter(n=>n>=1&&n<=20);return numbers.includes(1)?Math.max(...numbers):0;}
export function photoReadingScore(result){const c=photoWordCandidates(result.data.text),known=c.words.filter(w=>SCHOOL_WORDS[w]).length,expected=numberedPhotoCount(result.data.text);return c.tooMany||!c.words.length?-1000:c.words.length*3+(Number(result.data.confidence)||0)*.5+known*4-(expected?Math.abs(c.words.length-expected)*10:0);}
export function betterPhotoReading(first,second){return photoReadingScore(second)>photoReadingScore(first)?second:first;}
export async function readSpellingPhoto(image,{onProgress=()=>{},signal,fallbackImage,fallbackImages=[]}={}){
 const Tesseract=await library();let worker,timer,cancelled=false,rejectStop;
 const stopped=new Promise((_,reject)=>rejectStop=reject),stop=()=>{cancelled=true;void worker?.terminate().catch(()=>{});rejectStop(Error('Photo reading cancelled.'));};
 signal?.addEventListener('abort',stop,{once:true});if(signal?.aborted)stop();timer=setTimeout(()=>{cancelled=true;void worker?.terminate().catch(()=>{});rejectStop(Error('The photo took too long to read. Please try again or type the words.'));},60000);
 const work=(async()=>{
  if(cancelled)throw Error('Photo reading cancelled.');onProgress('Getting the photo reader ready…');
  worker=await Tesseract.createWorker('eng',1,{workerPath:new URL('./vendor/ocr/worker.min.js',import.meta.url).href,corePath:new URL('./vendor/ocr/core/',import.meta.url).href,langPath:new URL('./vendor/ocr/lang/',import.meta.url).href,workerBlobURL:false,gzip:true,logger:m=>{if(!cancelled)onProgress(m.status==='recognizing text'?'Reading your list… '+Math.round((m.progress||0)*100)+'%':'Getting the photo reader ready…');}});
  if(cancelled){await worker.terminate();throw Error('Photo reading cancelled.');}
  await worker.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1'});
  let result=await worker.recognize(image),attempts=1;
  const alternatives=fallbackImages.length?fallbackImages:fallbackImage?[fallbackImage]:[];
  for(let i=0;i<alternatives.length&&!cancelled;i++){
   const candidates=photoWordCandidates(result.data.text);
   if(result.data.confidence>=75&&candidates.words.length&&!candidates.tooMany&&candidates.words.every(w=>SCHOOL_WORDS[w])&&(!numberedPhotoCount(result.data.text)||numberedPhotoCount(result.data.text)===candidates.words.length))break;
   onProgress(i?'Checking faint letters and shadows…':'Checking the original photo for clearer letters…');
   await worker.setParameters({tessedit_pageseg_mode:i?'4':'6'});
   const retry=await worker.recognize(await alternatives[i]());attempts++;result=betterPhotoReading(result,retry);
  }
  const candidates=photoWordCandidates(result.data.text),reviewHints=candidates.words.filter(w=>!SCHOOL_WORDS[w]).map(word=>({word,suggestion:word.includes('rn')&&SCHOOL_WORDS[word.replaceAll('rn','m')]?word.replaceAll('rn','m'):null}));
  return{expectedCount:numberedPhotoCount(result.data.text),text:result.data.text,confidence:result.data.confidence,attempts,...candidates,reviewHints,needsReview:result.data.confidence<60||reviewHints.length>0};
 })();
 try{return await Promise.race([work,stopped]);}finally{clearTimeout(timer);signal?.removeEventListener('abort',stop);await worker?.terminate().catch(()=>{});}
}

export async function photoCanvas(file,quarterTurns=0){if(file.size>20*1024*1024)throw Error('Choose a photo smaller than 20 MB.');const url=URL.createObjectURL(file);try{const image=new Image();image.src=url;await image.decode();const scale=Math.min(1,2000/Math.max(image.naturalWidth,image.naturalHeight)),w=Math.round(image.naturalWidth*scale),h=Math.round(image.naturalHeight*scale),canvas=document.createElement('canvas'),turns=((quarterTurns%4)+4)%4;canvas.width=turns%2?h:w;canvas.height=turns%2?w:h;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.translate(canvas.width/2,canvas.height/2);ctx.rotate(turns*Math.PI/2);ctx.drawImage(image,-w/2,-h/2,w,h);return canvas;}finally{URL.revokeObjectURL(url);}}
