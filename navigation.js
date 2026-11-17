let landingSequence=0;
export function resetLanding(){landingSequence++;globalThis.document?.getElementById('action-landing-spacer')?.remove();}
function allowLandingScroll(top,win,doc){
 let spacer=doc.getElementById('action-landing-spacer');const previous=spacer?parseFloat(spacer.style.height)||0:0,base=doc.documentElement.scrollHeight-previous,needed=Math.max(0,Math.ceil(top+win.innerHeight-base));
 if(needed&&!spacer){spacer=doc.createElement('div');spacer.id='action-landing-spacer';spacer.setAttribute('aria-hidden','true');spacer.style.cssText='display:block;flex-shrink:0;pointer-events:none;width:1px';doc.body.append(spacer);}
 if(spacer)spacer.style.height=needed+'px';
}
export function optimalLandingTop({start,end,viewportHeight,offset=18}){
 const available=Math.max(1,viewportHeight-offset*2);let top=Math.max(0,start-offset);
 if(end-start>available)top=Math.max(top,end-viewportHeight+offset);
 return top;
}
function settleLanding(position){
 const token=++landingSequence,win=globalThis.window,doc=globalThis.document;if(!win||!doc)return;
 let stopped=false;const stop=()=>{stopped=true;cleanup();},keys=e=>{if(['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(e.key))stop();};
 const cleanup=()=>{win.removeEventListener('wheel',stop,true);win.removeEventListener('touchstart',stop,true);win.removeEventListener('pointerdown',stop,true);win.removeEventListener('keydown',keys,true);win.visualViewport?.removeEventListener('resize',apply);};
 const apply=()=>{if(stopped||token!==landingSequence)return;const top=position();if(top===null)return;allowLandingScroll(top,win,doc);const root=doc.documentElement,body=doc.body,previousRoot=root.style.scrollBehavior,previousBody=body?.style.scrollBehavior;root.style.scrollBehavior='auto';if(body)body.style.scrollBehavior='auto';win.scrollTo({top,behavior:'auto'});root.style.scrollBehavior=previousRoot;if(body)body.style.scrollBehavior=previousBody;};
 win.addEventListener('wheel',stop,{capture:true,passive:true});win.addEventListener('touchstart',stop,{capture:true,passive:true});win.addEventListener('pointerdown',stop,{capture:true,passive:true});win.addEventListener('keydown',keys,true);win.visualViewport?.addEventListener('resize',apply);
 requestAnimationFrame(()=>requestAnimationFrame(apply));for(const delay of[80,220,500])setTimeout(apply,delay);
 doc.fonts?.ready.then(apply);setTimeout(()=>{apply();cleanup();stopped=true;},800);
}
export function landAt(element,{offset=18}={}){if(!element)return;settleLanding(()=>element.isConnected?Math.max(0,element.getBoundingClientRect().top+scrollY-offset-(window.visualViewport?.offsetTop||0)):null);}
export function landOnPractice(){
 const card=document.querySelector('.game-card,.test-card,.creative-card');if(!card)return;
 settleLanding(()=>{if(!card.isConnected||document.querySelector('dialog[open]'))return null;
  const keyboard=card.querySelector('.answer-keyboard'),check=card.querySelector('#check,#test-next');
  const bottom=keyboard||check||card.querySelector('.answer-choices,.letter-bank,#drawing,#sentence')||card;
  const pageY=scrollY,viewport=window.visualViewport;
  return optimalLandingTop({start:card.getBoundingClientRect().top+pageY,end:bottom.getBoundingClientRect().bottom+pageY,viewportHeight:viewport?.height||innerHeight,offset:18+(viewport?.offsetTop||0)});
 });
}
export function landOnSpelloid(){landAt(document.querySelector('.pledge-card')||document.querySelector('.pal-layout'));}
export function launchIntro(){
 const overlay=document.getElementById('launch-intro');if(!overlay)return;
 if(new URLSearchParams(location.search).get('skipIntro')==='1'){overlay.remove();return;}
 const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches,app=document.querySelector('#app');
 if(app)app.inert=true;let closed=false,timer;const close=()=>{if(closed)return;closed=true;clearTimeout(timer);overlay.classList.add('leaving');if(app)app.inert=false;setTimeout(()=>overlay.remove(),reduced?0:900);};
 overlay.querySelector('button').onclick=close;
 const image=overlay.querySelector('img'),imageReady=image.decode?image.decode().catch(()=>{}):Promise.resolve();
 Promise.race([Promise.all([document.fonts?.ready,imageReady]),new Promise(r=>setTimeout(r,1500))]).then(()=>{if(closed)return;overlay.classList.add('intro-ready');timer=setTimeout(close,reduced?500:2700);});
}


let watchingDenViewport=false;
export function landOnDenGame(){
 const stage=document.querySelector('.arcade-stage,.den-play-area,#wordsearch-board,#table-game');if(!stage)return;
 const viewport=()=>{document.documentElement.style.setProperty('--den-viewport-height',(window.visualViewport?.height||innerHeight)+'px');};viewport();
 if(!watchingDenViewport){watchingDenViewport=true;const resize=()=>{if(document.body.dataset.view==='play')landOnDenGame();};window.addEventListener('resize',resize,{passive:true});window.visualViewport?.addEventListener('resize',resize,{passive:true});}
 settleLanding(()=>{if(!stage.isConnected)return null;viewport();const header=document.querySelector('.activity-header'),surface=stage.closest('.table-game-surface'),start=surface||header||stage,v=window.visualViewport,pageY=scrollY;
  return optimalLandingTop({start:start.getBoundingClientRect().top+pageY,end:stage.getBoundingClientRect().bottom+pageY,viewportHeight:v?.height||innerHeight,offset:16+(v?.offsetTop||0)});
 });
}
