import{prepareNativePronunciation}from'./native-pronunciation.js';
import{speechChunks}from'./speech-chunks.js';
export function nativeSpeechRequired(){return globalThis.Capacitor?.getPlatform?.()==='ios'||globalThis.location?.protocol==='capacitor:';}
export function decodeNativePCM(base64){const binary=atob(base64);if(!binary.length||binary.length%4||binary.length>3*1024*1024)throw Error('The on-device voice returned invalid audio.');const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0)),view=new DataView(bytes.buffer),samples=new Float32Array(binary.length/4);let peak=0;for(let i=0;i<samples.length;i++){const value=view.getFloat32(i*4,true);if(!Number.isFinite(value))throw Error('The on-device voice returned invalid samples.');samples[i]=value;peak=Math.max(peak,Math.abs(value));}if(peak<.0001)throw Error('The on-device voice returned silence.');return samples;}
export class NativeSpeechEngine{
 constructor(onStatus=()=>{}){this.onStatus=onStatus;this.jobs=new Map();this.id=0;this.generation=0;}
 plugin(){
  if(this.bridge)return this.bridge;
  const cap=globalThis.Capacitor,methods=['prepare','synthesise','release'];
  // The installed app injects native plugin methods directly. registerPlugin is
  // supplied by the optional @capacitor/core JS package, which this app doesn't load.
  const direct=cap?.Plugins?.SpelloidsSpeech;
  if(direct&&methods.every(method=>typeof direct[method]==='function'))return this.bridge=direct;
  if(typeof cap?.registerPlugin==='function'&&cap.isPluginAvailable?.('SpelloidsSpeech')){
   const registered=cap.registerPlugin('SpelloidsSpeech');
   if(registered&&methods.every(method=>typeof registered[method]==='function'))return this.bridge=registered;
  }
  throw Error('The native speech connection is unavailable in this build. Please report this message; retrying cannot repair the connection.');
 }
 async call(method,payload={}){if(this.inFlight)throw Error('The previous on-device voice request is still stopping. Please wait before retrying.');const pending=this.plugin()[method](payload);this.inFlight=pending;const settled=pending.finally(()=>{if(this.inFlight===pending)this.inFlight=null;});let timer;try{return await Promise.race([settled,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('The native voice did not finish within one minute. Saved audio is kept.')),60000);})]);}finally{clearTimeout(timer);}}
 async prepare(){return this.ready??=this.call('prepare').catch(error=>{this.ready=null;throw error;});}
 inputs(text,voice){
  const generation=this.generation;
  return new Promise((resolve,reject)=>{
   const id=++this.id,timer=setTimeout(()=>{this.jobs.delete(id);reject(Error('Pronunciation preparation did not finish in the app. Saved audio is kept.'));},30000);
   this.jobs.set(id,{resolve,reject,timer});
   prepareNativePronunciation(text,voice,message=>this.onStatus(message)).then(result=>{
    const job=this.jobs.get(id);if(!job)return;this.jobs.delete(id);clearTimeout(timer);
    if(generation!==this.generation)job.reject(Error('Audio preparation paused.'));else job.resolve(result);
   },error=>{const job=this.jobs.get(id);if(!job)return;this.jobs.delete(id);clearTimeout(timer);job.reject(error);});
  });
 }
 stopInputs(message='Audio preparation paused. Saved sounds are kept.'){this.worker?.terminate();this.worker=null;for(const job of this.jobs.values()){clearTimeout(job.timer);job.reject(Error(message));}this.jobs.clear();}
 cancel(){this.generation++;this.stopInputs();this.ready=null;if(this.bridge)this.bridge.release().catch(()=>{});}
 async generate(text,voice){await this.prepare();const generation=this.generation,buffers=[];let length=0;const chunks=speechChunks(text);for(let i=0;i<chunks.length;i++){if(generation!==this.generation)throw Error('Audio preparation paused.');this.onStatus('Preparing phrase '+(i+1)+' of '+chunks.length+' on this iPad…');const inputs=await this.inputs(chunks[i],voice);if(generation!==this.generation)throw Error('Audio preparation paused.');const result=await this.call('synthesise',{inputIds:inputs.inputIds,style:inputs.style});if(generation!==this.generation)throw Error('Audio preparation paused.');if(result.sampleRate!==24000)throw Error('Unexpected on-device voice sample rate.');const samples=decodeNativePCM(result.pcm);buffers.push(samples);length+=samples.length;if(i<chunks.length-1){const pause=new Float32Array(2880);buffers.push(pause);length+=pause.length;}}const samples=new Float32Array(length);let at=0;for(const buffer of buffers){samples.set(buffer,at);at+=buffer.length;}return{samples,sampleRate:24000,engine:'Kokoro native ONNX'};}
}
