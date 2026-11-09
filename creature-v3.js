import{recolourSprite}from'./sprite-colour.js';
const cache=new Map();
export function renderCreature(p,small,escape){
 const species=['sprout','bunny','dragon'].includes(p.species)?p.species:'sprout';
 const outfit=['school','explorer','cosy'].includes(p.equippedOutfit)?p.equippedOutfit:'school';
 const key=[species,outfit,p.colour,p.uniform].join(':');
 return `<button type="button" class="creature pal-creature ${small?'small':''} species-${species}" data-pal data-reaction="idle" aria-label="${escape(p.palName)}, your ${species} Practimal. Tap to greet, double-tap to tickle, or hold to cuddle. Keyboard: Enter, G, or hold P."><span class="pal-ground-shadow" aria-hidden="true"></span><span class="pal-body"><img class="fitted-sprite" src="assets/${species}-${outfit}.png" alt="" draggable="false" data-sprite-key="${key}" data-species="${species}" data-outfit="${outfit}" data-colour="${p.colour}" data-uniform="${p.uniform}"></span><span class="pal-hearts" aria-hidden="true"><i>♥</i><i>♥</i><i>♥</i></span><span class="pal-tickles" aria-hidden="true">✧ ✦ ✧</span><span class="pal-reaction" aria-live="polite"></span></button>`;
}
async function tintedSprite(image){
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=768;const ctx=canvas.getContext('2d',{willReadFrequently:true});
 ctx.drawImage(image,0,0,768,768);const frame=ctx.getImageData(0,0,768,768);recolourSprite(frame.data,768,768,image.dataset);ctx.putImageData(frame,0,0);
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));return blob?URL.createObjectURL(blob):image.src;
}
export function paintCreatures(){
 document.querySelectorAll('[data-sprite-key]').forEach(image=>{
  const key=image.dataset.spriteKey;
  const paint=async()=>{if(!image.isConnected)return;try{if(!cache.has(key))cache.set(key,tintedSprite(image));const url=await cache.get(key);if(image.isConnected)image.src=url;}catch{cache.delete(key);}};
  if(image.complete&&image.naturalWidth)paint();else image.addEventListener('load',paint,{once:true});
 });
}
