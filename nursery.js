import{rockBaby}from'./journey.js';
export function bindBabyPlay({baby,onSave,onStatus}){
 const display=document.querySelector('[data-baby-play]');if(!display)return()=>{};
 const creature=display.querySelector('[data-pal]'),spoon=display.querySelector('[data-spoon]'),target=display.querySelector('[data-mouth-target]');
 let origin=null,dragging=false,rockStart=null,feedbackTimer=null;const cleanups=[];
 const on=(el,event,fn)=>{el?.addEventListener(event,fn);cleanups.push(()=>el?.removeEventListener(event,fn));};
 function react(kind,ms=1100){clearTimeout(feedbackTimer);creature.dataset.reaction=kind;feedbackTimer=setTimeout(()=>{creature.dataset.reaction=baby.care?.asleep?'purr':'idle';},ms);}
 function feed(){if(baby.care?.asleep){onStatus('Our little one is sleeping. Wake them before feeding.');return;}baby.care??={feeds:0,cuddles:0,asleep:false};baby.care.feeds++;onSave();onStatus('Nom nom! You fed '+baby.name+' a little berry.');react('feed',1600);display.classList.add('just-fed');setTimeout(()=>display.isConnected&&display.classList.remove('just-fed'),1400);}
 const hit=(x,y)=>{const r=target.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;};
 const reset=()=>{creature.dataset.reaction=baby.care?.asleep?'purr':'idle';origin=null;dragging=false;spoon.classList.remove('dragging');spoon.style.removeProperty('left');spoon.style.removeProperty('top');display.classList.remove('feeding-ready');};
 on(spoon,'pointerdown',e=>{if(e.button!==0||e.isPrimary===false)return;e.preventDefault();if(baby.care?.asleep){onStatus('Wake your baby before feeding.');return;}origin={x:e.clientX,y:e.clientY};spoon.setPointerCapture(e.pointerId);});
 on(spoon,'pointermove',e=>{if(!origin)return;if(Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>8)dragging=true;if(!dragging)return;spoon.classList.add('dragging');spoon.style.left=e.clientX+'px';spoon.style.top=e.clientY+'px';const ready=hit(e.clientX,e.clientY);display.classList.toggle('feeding-ready',ready);creature.dataset.reaction=ready?'feed':'idle';});
 on(spoon,'pointerup',e=>{const success=dragging&&hit(e.clientX,e.clientY);reset();if(success)feed();else{creature.dataset.reaction='idle';onStatus('Scoop up a berry and slide the spoon to the little mouth.');}});
 on(spoon,'pointercancel',()=>{reset();creature.dataset.reaction='idle';});
 on(spoon,'click',e=>{e.preventDefault();if(e.detail===0)feed();});
 on(creature,'pointerdown',e=>{if(e.button!==0||e.isPrimary===false)return;rockStart={x:e.clientX,y:e.clientY};creature.setPointerCapture(e.pointerId);});
 function rock(){const result=rockBaby(baby);onSave();react('rock',850);display.classList.toggle('sleeping',result.asleep);onStatus(result.asleep?'All cosy and asleep. Zzz…':result.rocks+' of 5 gentle rocks. Tap again to help '+baby.name+' drift off.');const cot=display.querySelector('[data-cot]');if(cot)cot.hidden=!result.asleep;const cotButton=display.querySelector('[data-care=cot]');if(cotButton)cotButton.textContent=result.asleep?'☀ Wake up':'☾ Into the cot';display.querySelectorAll('[data-care=feed],[data-spoon]').forEach(b=>b.disabled=result.asleep);}
 on(creature,'pointerup',e=>{if(rockStart&&Math.hypot(e.clientX-rockStart.x,e.clientY-rockStart.y)<20)rock();rockStart=null;});on(creature,'pointercancel',()=>rockStart=null);
 on(creature,'keydown',e=>{if(['Enter',' '].includes(e.key)&&!e.repeat){e.preventDefault();rock();}});
 on(window,'blur',()=>{reset();rockStart=null;});
 return()=>{clearTimeout(feedbackTimer);cleanups.forEach(f=>f());reset();};
}
