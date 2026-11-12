import{shapeSound}from'./species-sounds.js';
import{scheduleBabyHello}from'./baby-sounds.js';
let characterVoice='bubbles';export function setCharacterVoice(style){characterVoice=style||'bubbles';}
import { createPalGesture } from './pal-gestures.js';
let audioContext,master,purrNodes=[],timers=[],enabled=true;
let currentReaction=null,reactingElement=null;
const activeGestures=new Set();
const audioReady=()=>{
 if(!enabled)return null;
 const Audio=window.AudioContext||window.webkitAudioContext;
 if(!Audio)return null;
 try{if(!audioContext){audioContext=new Audio();master=audioContext.createGain();master.gain.value=.2;master.connect(audioContext.destination);}if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});return audioContext;}catch{return null;}
};
function tone(frequency,duration,start=0,type='sine',end=frequency,volume=.2){
 const ctx=audioReady();if(!ctx)return;
 const at=ctx.currentTime+start,osc=ctx.createOscillator(),gain=ctx.createGain();
 osc.type=type;osc.frequency.setValueAtTime(frequency,at);osc.frequency.exponentialRampToValueAtTime(Math.max(20,end),at+duration);
 gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.015);gain.gain.exponentialRampToValueAtTime(.001,at+duration);
 osc.connect(gain);gain.connect(master);osc.start(at);osc.stop(at+duration+.03);
}
function vowel(pitch,start,duration,formant=650){
 const ctx=audioReady();if(!ctx)return;
 const at=ctx.currentTime+start,voice=ctx.createOscillator(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
 voice.type='sawtooth';voice.frequency.setValueAtTime(pitch,at);voice.frequency.exponentialRampToValueAtTime(pitch*.7,at+duration);
 filter.type='bandpass';filter.frequency.setValueAtTime(formant,at);filter.frequency.exponentialRampToValueAtTime(formant*.6,at+duration);filter.Q.value=2;
 gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.38,at+.025);gain.gain.exponentialRampToValueAtTime(.001,at+duration);
 voice.connect(filter);filter.connect(gain);gain.connect(master);voice.start(at);voice.stop(at+duration+.02);
}
function playSound(kind,species='blob'){const profile=shapeSound(species);
 if(!enabled)return;
 stopPurr();
 if(kind==='burp'){vowel(190,0,.28,520);tone(95,.24,.04,'triangle',55,.09);return;}
 if(kind==='munch'){[0,.18,.36].forEach(t=>tone(160,.08,t,'triangle',95,.055));return;}
 if(kind==='babyhello'){const ctx=audioReady();if(ctx){const helloGain=ctx.createGain();helloGain.gain.value=4;helloGain.connect(master);scheduleBabyHello(ctx,helloGain);}return;}
 if(kind==='oof'){const f=profile.hello;vowel(f,0,.18,profile.resonance);tone(f*.51,.14,.04,'sine',f*.43,.05);}
 if(kind==='giggle'){[0,.13,.27,.42,.58].forEach((t,i)=>{vowel(profile.giggle+(i%2)*85,t,.095,profile.resonance+(i%2)*180);tone(650+i*45,.1,t,'sine',840,.1);});}
 if(kind==='dance'){profile.dance.forEach((f,i)=>tone(f,.22,i*profile.beat,profile.instrument,f,.16));}
 if(kind==='celebrate'){[523,659,784,1046].forEach((f,i)=>tone(f,.35,i*.11,'sine',f,.25));}
 if(kind==='travel'){[220,330,440,660].forEach((f,i)=>tone(f,.5,i*.09,'sine',f*1.5,.15));}
 if(kind==='purr'){
  const ctx=audioReady();if(!ctx)return;
  const source=ctx.createOscillator(),harmonic=ctx.createOscillator(),lfo=ctx.createOscillator(),mod=ctx.createGain(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
  source.type='triangle';source.frequency.value=96;harmonic.frequency.value=144;lfo.frequency.value=26;mod.gain.value=.055;gain.gain.value=.085;filter.type='lowpass';filter.frequency.value=430;
  lfo.connect(mod);mod.connect(gain.gain);source.connect(filter);harmonic.connect(filter);filter.connect(gain);gain.connect(master);source.start();harmonic.start();lfo.start();purrNodes=[source,harmonic,lfo,mod,gain,filter];
 }
}
function stopPurr(){for(const node of purrNodes){try{if(node.stop)node.stop();node.disconnect();}catch{}}purrNodes=[];}
export function setSound(value){enabled=value;if(!enabled){stopPurr();if(master)master.gain.value=0;}else if(master)master.gain.value=.2;}
export function soundEffect(kind){playSound(kind);}
export function stopPalInteraction(){
 for(const timer of timers)clearTimeout(timer);timers=[];stopPurr();
 if(reactingElement){reactingElement.dataset.reaction='idle';const label=reactingElement.querySelector('.pal-reaction');if(label)label.textContent='';}
 currentReaction=null;reactingElement=null;
}
function react(element,kind){
 stopPalInteraction();reactingElement=element;currentReaction=kind;
 element.dataset.reaction=kind;
 element.querySelector('.pal-reaction').textContent={oof:'Oof! Hello, you!',giggle:'Hee-hee! That tickles!',purr:'Prrrr… happy here.',celebrate:'We did it together!',dance:'Wiggle, wobble, woo!',yawn:'Aaaah… big stretch!',cross:'Can your eyes do this?',roll:'Where did my eyebrows go?'}[kind]||'';
 let species='blob';try{species=JSON.parse(element.querySelector('[data-monster]').dataset.monster).species;}catch{}playSound(kind,species);
 if(kind!=='purr')timers.push(setTimeout(()=>stopPalInteraction(),kind==='dance'?4000:['yawn','cross','roll'].includes(kind)?2600:kind==='giggle'?1300:950));
}
export function bindPalInteractions(){
 const cleanups=[];
 document.querySelectorAll('[data-pal]').forEach(element=>{if(element.closest('[data-baby-play]'))return;
  const gesture=createPalGesture({react:kind=>react(element,kind),stop:()=>{if(reactingElement===element)stopPalInteraction();}});
  activeGestures.add(gesture);
  const handlers={
   pointerdown:e=>{if(e.button!==0||e.isPrimary===false)return;audioReady();element.setPointerCapture(e.pointerId);gesture.down(e.clientX,e.clientY);},
   pointermove:e=>{gesture.move(e.clientX,e.clientY);const r=element.getBoundingClientRect();element.style.setProperty('--look-x',`${Math.max(-5,Math.min(5,(e.clientX-r.x-r.width/2)/r.width*10))}deg`);},
   pointerup:()=>gesture.up(),pointercancel:()=>gesture.cancel(),lostpointercapture:()=>gesture.cancel(),
   contextmenu:e=>e.preventDefault(),click:e=>e.preventDefault(),
   keydown:e=>{if(e.repeat)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();audioReady();react(element,'oof');}if(e.key.toLowerCase()==='d')react(element,'dance');if(e.key.toLowerCase()==='g')react(element,'giggle');if(e.key.toLowerCase()==='p')react(element,'purr');},
   keyup:e=>{if(e.key.toLowerCase()==='p'&&currentReaction==='purr')stopPalInteraction();},
   blur:()=>gesture.cancel()
  };
  // Pointer capture normally ends after pointerup. Do not cancel the pending
  // single-tap timer on that automatic lostpointercapture event.
  handlers.lostpointercapture=()=>{};
  for(const [event,fn]of Object.entries(handlers))element.addEventListener(event,fn);
  cleanups.push(()=>{gesture.dispose();activeGestures.delete(gesture);for(const[event,fn]of Object.entries(handlers))element.removeEventListener(event,fn);});
 });
 document.querySelectorAll('[data-pal-action]').forEach(button=>{
  const click=()=>{const element=button.closest('.pal-stage')?.querySelector('[data-pal]');if(!element)return;audioReady();react(element,button.dataset.palAction);if(button.dataset.palAction==='purr')timers.push(setTimeout(stopPalInteraction,2200));};
  button.addEventListener('click',click);cleanups.push(()=>button.removeEventListener('click',click));
 });
 const cancel=()=>{cleanups.forEach(fn=>fn());stopPalInteraction();};
 return cancel;
}
const cancelAll=()=>{activeGestures.forEach(gesture=>gesture.cancel());stopPalInteraction();};
window.addEventListener('blur',cancelAll);
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAll();});
