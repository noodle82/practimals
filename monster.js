import*as T from'./vendor/three.module.js';
import{itemById,EYE_COLOURS}from'./spelling.js';
export const COLOURS={grey:'#adb2bc',mint:'#79cbbb',lilac:'#ad8ed8',peach:'#f2a18c',blue:'#7db4dc',gold:'#ecc774',moon:'#dce0f4',rose:'#ef91bb',aqua:'#58cfd6',lemon:'#edd575',coral:'#ee827e',berry:'#b96fbd',rainbow:'#b88cea'};
export function palMarkup(p,{baby=false,prompt=''}={}){return `<div class="pal-stage">${prompt?`<div class="pal-dialogue"><strong>${safe(p.palName||'Bobble')} ${prompt.trim().endsWith('?')?'asks…':'says…'}</strong><p>${safe(prompt)}</p></div>`:''}<div class="pal-creature" data-pal data-reaction="idle" role="button" tabindex="0" aria-label="${safe(p.palName||p.name||'Bobble')}. Tap for an oof, double-tap to tickle, hold to purr. Enter to greet, G to giggle, hold P to purr. D to dance."><div class="monster-canvas" data-monster='${safe(JSON.stringify({species:p.species||'bobble',colour:p.colour||'grey',wearing:baby?{}:p.wearing||{},eyeColour:p.eyeColour||'violet',antennae:p.antennae||'none',freckles:!!p.freckles,asleep:!!p.asleep,quiet:!!prompt,baby}))}'></div><span class="pal-reaction" aria-live="polite"></span><span class="pal-hearts" aria-hidden="true">♥ <i>♥</i> ♥</span></div><div class="pal-actions"><button data-pal-action="oof">Say hello</button><button data-pal-action="giggle">Tickle</button><button data-pal-action="purr">Cuddle</button><button data-pal-action="dance">Dance ♫</button><button data-pal-action="yawn" aria-label="Make a big yawn">Yawn</button><button data-pal-action="cross" aria-label="Make a silly face">Silly face</button><button data-pal-action="roll" aria-label="Roll eyes playfully">Eye roll</button></div></div>`;}
function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
let speaking=false;document.addEventListener('pal-speaking',e=>speaking=!!e.detail);
const sphere=new T.SphereGeometry(1,40,28);
function material(colour,extra={}){return new T.MeshPhysicalMaterial({color:colour,roughness:.68,metalness:0,clearcoat:.08,clearcoatRoughness:.8,...extra});}
function ball(parent,mat,x,y,z,sx,sy=sx,sz=sx){const m=new T.Mesh(sphere,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function mesh(parent,geometry,mat,x,y,z){const m=new T.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function tube(parent,points,radius,mat){return mesh(parent,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),28,radius,10,false),mat,0,0,0);}
function fallback(host,p){host.innerHTML=`<svg viewBox="0 0 300 330" aria-hidden="true"><defs><radialGradient id="skin"><stop stop-color="#dbeee9"/><stop offset="1" stop-color="${COLOURS[p.colour]||COLOURS.mint}"/></radialGradient></defs><ellipse cx="150" cy="308" rx="84" ry="12" fill="#52426b18"/>${p.antennae!=='none'?`<path d="M111 81Q85 15 70 39M190 80Q220 12 233 41" fill="none" stroke="${COLOURS[p.colour]||COLOURS.grey}" stroke-width="15" stroke-linecap="round"/>`:''}<ellipse cx="150" cy="184" rx="100" ry="116" fill="url(#skin)"/><ellipse cx="104" cy="145" rx="29" ry="33" fill="#fffaf0"/><ellipse cx="190" cy="145" rx="29" ry="33" fill="#fffaf0"/><ellipse class="fallback-pupil" cx="110" cy="150" rx="15" ry="20" fill="#39304c"/><ellipse class="fallback-pupil" cx="184" cy="150" rx="15" ry="20" fill="#39304c"/><path class="fallback-mouth" d="M128 193Q150 214 173 193" stroke="#61475e" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="291" rx="30" ry="18" fill="${COLOURS[p.colour]||COLOURS.mint}"/><ellipse cx="201" cy="291" rx="30" ry="18" fill="${COLOURS[p.colour]||COLOURS.mint}"/></svg><p class="render-note">Simple character view · 3D is unavailable on this browser.</p>`;}

function createModel(p){
 const root=new T.Group(),body=new T.Group();root.add(body);
 const colour=COLOURS[p.colour]||COLOURS.grey,skin=material(colour,{sheen:.18,sheenColor:new T.Color('#e8e5f0'),sheenRoughness:.9,iridescence:['gold','moon'].includes(p.colour)?.7:0});
 const lighter=material(new T.Color(colour).lerp(new T.Color('#eeeeef'),.16));
 const dark=material('#3c304c',{roughness:.35}),white=material('#f1f0f5',{roughness:.84,clearcoat:0}),iris=material(EYE_COLOURS[p.eyeColour]||'#7953bf',{roughness:.82,clearcoat:0}),black=material('#252635',{roughness:.88,clearcoat:0});
 const blush=material('#f294aa',{transparent:true,opacity:.63});
 const shape=p.species==='blip'?[1,1.02,.76]:p.species==='wiggle'?[.78,1.22,.68]:[.9,1.13,.73];if(p.baby){shape[0]*=1.08;shape[1]*=.78;}
 const torso=ball(body,skin,0,p.baby?1.08:1.3,0,...shape);torso.geometry=sphere.clone();const pos=torso.geometry.attributes.position;const rainbow=[];for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),bulge=1;pos.setXYZ(i,x*bulge,y,z*bulge);const c=new T.Color().setHSL(((y+1)*.43+x*.08+1)%1,.67,.65);rainbow.push(c.r,c.g,c.b);}torso.geometry.computeVertexNormals();if(p.colour==='rainbow'){torso.geometry.setAttribute('color',new T.Float32BufferAttribute(rainbow,3));torso.material=skin.clone();torso.material.color.set('#ffffff');torso.material.vertexColors=true;}
 // Tiny skin speckles and little cheek dimples add character without a texture download.
 if(p.freckles){const freckles=material('#ae7d8b',{roughness:.85});for(const sign of[-1,1])for(let i=0;i<3;i++)ball(body,freckles,sign*(.48+i*.065),1.4+(i%2)*.04,shape[2]*.92,.014,.015,.008);}
 ball(body,lighter,0,1.45,shape[2]*1.035,.075,.05,.045);
 const brows=[];if(!p.baby)for(const sign of[-1,1]){const brow=tube(body,[[sign*.19,2.03,shape[2]*.85],[sign*.31,2.08,shape[2]*.87],[sign*.43,2.04,shape[2]*.82]],.023,lighter);brows.push(brow);}
 const belly=ball(body,lighter,0,.7,.61,.38,.33,.1);
 const arms=[];
 for(const sign of[-1,1]){const arm=new T.Group();arm.position.set(sign*shape[0]*.87,.95,0);body.add(arm);arm.rotation.z=sign*.42;ball(arm,skin,sign*.12,-.18,.04,.17,p.baby?.23:.34,.17);ball(arm,skin,sign*.21,p.baby?-.32:-.43,.1,.19,.18,.19);ball(body,skin,sign*.4,.16,.15,.25,.19,.35);arms.push(arm);}
 const eyes=[],eyeY=p.baby?1.51:p.species==='blip'?1.65:1.72;
 const coords=p.species==='blip'?[-.42,0,.42]:[-.32,.32];
 for(const x of coords){const e=new T.Group();e.position.set(x,eyeY+(p.species==='blip'&&x===0?.12:0),shape[2]*.82);body.add(e);const r=p.baby?(p.species==='blip'?.245:.315):p.species==='blip'?.215:.27;ball(e,white,0,0,0,r,r*1.12,r*.7);const pupil=new T.Group();pupil.position.z=r*.64;e.add(pupil);ball(pupil,iris,0,-.01,0,r*.69,r*.78,.055);ball(pupil,black,0,-.01,.045,r*.43,r*.57,.035);eyes.push({group:e,pupil});}
 for(const sign of[-1,1])ball(body,blush,sign*.53,1.4,shape[2]*.86,.13,.065,.025);
 const smile=tube(body,[[-.23,1.3,shape[2]*.99],[-.14,1.245,shape[2]*1.025],[0,1.22,shape[2]*1.045],[.14,1.245,shape[2]*1.025],[.23,1.3,shape[2]*.99]],.027,dark);
 const mouth=ball(body,dark,0,1.27,shape[2]*1.035,.12,.13,.025);mouth.visible=false;
 const tongue=ball(body,material('#e0a2b4'),0,1.215,shape[2]*1.075,.065,.035,.015);tongue.visible=false;
 const tooth=ball(body,white,.075,1.25,shape[2]*1.07,.04,.047,.018);
 const antennae=[];
 const n=p.antennae==='none'||!p.antennae?0:p.species==='blip'?1:2;
 for(let i=0;i<n;i++){const sign=n===1?0:i===0?-1:1,pivot=new T.Group();pivot.position.set(sign*.35,p.baby?1.8:2.17,0);if(p.baby)pivot.scale.setScalar(.55);body.add(pivot);tube(pivot,p.antennae==='curly'?[[0,0,0],[sign*.26,.28,.02],[sign*.12,.51,.01],[sign*.02,.38,.03]]:p.antennae==='floppy'?[[0,0,0],[sign*.16,.25,0],[sign*.4,.25,0],[sign*.45,.1,0]]:[[0,0,0],[sign*.12,.3,.02],[sign*.19,.57,.01]],p.species==='wiggle'?.07:.045,skin);const tip=p.antennae==='curly'?[sign*.02,.38,.03]:p.antennae==='floppy'?[sign*.45,.1,0]:[sign*.19,.57,.01];ball(pivot,lighter,...tip,p.species==='wiggle'?.14:.105);antennae.push(pivot);}
 if(p.species==='wiggle'&&p.antennae!=='none')for(const sign of[-1,1]){const fin=ball(body,skin,sign*.78,1.91,-.03,.31,.12,.11);fin.rotation.z=sign*.4;}
 // Clothes share the rig and body proportions, so sleeves, hems and shoes
 // stay fitted when the creature moves rather than following a flat image.
 const coat=itemById('coat',p.wearing?.coat);
 if(coat){belly.visible=false;const fabric=material(coat.colour,{roughness:coat.style==='rain'?.34:.9,clearcoat:coat.style==='rain'?.65:.05});
  const points=[[.48,.27],[.72,.38],[.88,.7],[.91,.94],[.94,1.18]].map(([r,y])=>new T.Vector2(r*shape[0]/.9,y));const jacket=mesh(body,new T.LatheGeometry(points,48),fabric,0,0,0);jacket.scale.z=.85;
  for(const[side,arm]of arms.entries()){const sign=side===0?-1:1;ball(arm,fabric,sign*.1,-.14,.04,.205,.29,.205);}
  const zipper=material('#f8edcf',{roughness:.4});tube(body,[[0,.3,.66],[0,.7,.79],[0,1.17,.82]],.015,zipper);for(const y of[.47,.73,.99])ball(body,zipper,.07,y,.79,.028,.028,.02);for(const sign of[-1,1]){const collar=ball(body,fabric,sign*.22,1.15,.8,.15,.1,.035);collar.rotation.z=sign*.4;}
  if(coat.style==='puffer')for(const y of[.47,.7,.93]){const seam=mesh(body,new T.TorusGeometry((.72+(y-.4)*.24)*shape[0]/.9,.022,7,50),fabric,0,y,0);seam.rotation.x=Math.PI/2;seam.scale.y=.85;}
  if(coat.style==='hoodie'){const hood=mesh(body,new T.TorusGeometry(.6,.12,12,42,Math.PI),fabric,0,1.23,-.16);hood.rotation.x=.65;tube(body,[[-.2,1.17,.75],[-.18,.92,.81]],.016,zipper);tube(body,[[.2,1.17,.75],[.18,.92,.81]],.016,zipper);}
 }
 const hat=itemById('hat',p.wearing?.hat);
 if(hat){const fabric=material(hat.colour,{roughness:.85});
  if(hat.style==='party'){const cone=mesh(body,new T.ConeGeometry(.42,.85,40),fabric,0,2.6,0);ball(body,white,0,3.03,0,.075);for(const[x,y]of[[-.12,2.43],[.1,2.6],[0,2.8]])ball(body,white,x,y,.28,.035);}
  else{const crown=hat.style==='beanie'?mesh(body,new T.SphereGeometry(.61,36,24,0,Math.PI*2,0,Math.PI/2),fabric,0,2.16,0):mesh(body,new T.CylinderGeometry(.44,.6,.43,40),fabric,0,2.4,0);crown.scale.z=.8;const brim=mesh(body,new T.TorusGeometry(hat.style==='beanie'?.58:.68,hat.style==='beanie'?.09:.045,12,48),fabric,0,2.19,0);brim.rotation.x=Math.PI/2;brim.scale.y=.8;if(hat.style==='beanie')ball(body,fabric,0,2.79,0,.14);}
 }
 const shoes=itemById('shoes',p.wearing?.shoes);
 if(shoes){const leather=material(shoes.colour,{roughness:shoes.style==='boots'?.4:.85});for(const sign of[-1,1]){ball(body,leather,sign*.4,.15,.23,.28,shoes.style==='boots'?.3:.2,.41);if(shoes.style!=='slippers'){ball(body,white,sign*.4,.015,.24,.285,.045,.42);for(const y of[.22,.3])tube(body,[[sign*.4-.12,y,.55],[sign*.4+.12,y,.55]],.015,white);}}}
 const glasses=itemById('glasses',p.wearing?.glasses);if(glasses){const frame=material(glasses.colour,{metalness:.2,roughness:.45});for(const e of eyes){const ring=mesh(e.group,new T.TorusGeometry(p.species==='blip'?.22:.29,.025,10,60),frame,0,0,.23);if(glasses.style==='star'){const points=ring.geometry.attributes.position;for(let i=0;i<points.count;i++){const x=points.getX(i),y=points.getY(i),factor=1+.12*Math.cos(5*Math.atan2(y,x));points.setXY(i,x*factor,y*factor);}ring.geometry.computeVertexNormals();}}for(let i=0;i<eyes.length-1;i++){const left=eyes[i].group.position,right=eyes[i+1].group.position,r=p.species==='blip'?.20:.27,z=shape[2]*.82+.25;tube(body,[[left.x+r,left.y+.02,z],[(left.x+right.x)/2,(left.y+right.y)/2+.06,z+.01],[right.x-r,right.y+.02,z]],.018,frame);}}
 const gloves=itemById('gloves',p.wearing?.gloves);if(gloves){const fabric=material(gloves.colour,{roughness:.85});for(let i=0;i<arms.length;i++){const sign=i===0?-1:1;ball(arms[i],fabric,sign*.21,-.43,.1,.215,.22,.215);ball(arms[i],fabric,sign*.08,-.38,.23,.08,.1,.08);}}
 const earrings=itemById('earrings',p.wearing?.earrings);if(earrings){const jewel=material(earrings.colour,{metalness:.45,roughness:.2});for(const sign of[-1,1]){ball(body,jewel,sign*shape[0]*.96,1.42,.14,.045);if(earrings.style==='hoop')mesh(body,new T.TorusGeometry(.11,.027,10,32),jewel,sign*shape[0]*.98,1.3,.15);else ball(body,jewel,sign*shape[0]*.98,1.26,.15,.07,.12,.05);}}
 return{root,body,eyes,arms,antennae,smile,mouth,tongue,tooth,brows};
}

export function mountMonsters(){
 const disposers=[];
 document.querySelectorAll('[data-monster]').forEach(host=>{
  let p;try{p=JSON.parse(host.dataset.monster);}catch{return;}
  const wrapper=host.closest('[data-pal]');let renderer;
  try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{fallback(host,p);return;}
  host.appendChild(renderer.domElement);host.dataset.engine='3d';renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.1,50);camera.position.set(.25,1.9,6.3);camera.lookAt(0,1.45,0);
  scene.add(new T.HemisphereLight('#f4f3ff','#a7a4b7',2.1));const key=new T.DirectionalLight('#ffffff',2.6);key.position.set(-3,5,5);scene.add(key);const rim=new T.DirectionalLight('#d9d1ff',1.7);rim.position.set(3,3,-3);scene.add(rim);
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const shadowContext=shadowCanvas.getContext('2d'),gradient=shadowContext.createRadialGradient(64,64,10,64,64,62);gradient.addColorStop(0,'rgba(77,58,98,.22)');gradient.addColorStop(1,'rgba(77,58,98,0)');shadowContext.fillStyle=gradient;shadowContext.fillRect(0,0,128,128);const shadowTexture=new T.CanvasTexture(shadowCanvas),plane=new T.Mesh(new T.PlaneGeometry(2.8,1.8),new T.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}));plane.rotation.x=-Math.PI/2;plane.position.y=-.045;scene.add(plane);
  const model=createModel(p);scene.add(model.root);if(p.baby){model.root.scale.setScalar(.78);model.root.position.y=.2;}
  const pointer={x:0,y:0};const move=e=>{const r=host.getBoundingClientRect();pointer.x=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));pointer.y=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));};wrapper.addEventListener('pointermove',move);
  const resize=()=>{const r=host.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let frame,lastReaction='idle',reactionStart=0,disposed=false;const start=performance.now();
  function animate(now){if(disposed)return;frame=requestAnimationFrame(animate);if(document.hidden)return;const t=(now-start)/1000;let reaction=wrapper.dataset.reaction||'idle';if(reaction==='idle'&&p.asleep)reaction='purr';if(reaction==='idle'&&!p.quiet&&!speaking&&!reduced){const idle=t%39;if(idle>15&&idle<17.4)reaction='cross';else if(idle>27&&idle<30)reaction='yawn';else if(idle>35&&idle<37)reaction='roll';}if(reaction!==lastReaction){lastReaction=reaction;reactionStart=t;}const rt=t-reactionStart;
   model.root.rotation.y=T.MathUtils.lerp(model.root.rotation.y,pointer.x*.16,.08);model.body.position.y=reduced?0:Math.sin(t*1.8)*.018;model.body.rotation.z=0;model.body.rotation.x=0;model.body.position.z=0;model.body.scale.set(1,1,1);model.tooth.visible=!p.baby;
   const blink=!reduced&&(t%5.3<.12||t%5.3>5.16);for(const eye of model.eyes){eye.group.scale.y=blink?.08:1;eye.pupil.position.x=pointer.x*.035;eye.pupil.position.y=-pointer.y*.025;}
   model.smile.visible=true;model.mouth.visible=false;model.tongue.visible=false;
   for(let i=0;i<model.arms.length;i++)model.arms[i].rotation.z=(i===0?-1:1)*(.42+(reduced?0:Math.sin(t*1.4+i)*.025));for(let i=0;i<model.antennae.length;i++)model.antennae[i].rotation.z=reduced?0:Math.sin(t*1.9+i)*.07;
   if(speaking&&reaction==='idle'){model.smile.visible=false;model.mouth.visible=true;model.mouth.scale.set(.13,.04+Math.abs(Math.sin(t*10))*.065,.03);model.tongue.visible=true;}
   if(reaction==='oof'){model.smile.visible=false;model.mouth.visible=true;model.mouth.scale.set(.085,.11,.028);if(!reduced){model.body.rotation.z=Math.sin(Math.min(rt/.7,1)*Math.PI)*-.045;model.body.position.z=Math.sin(Math.min(rt/.7,1)*Math.PI)*-.06;}for(const e of model.eyes)e.group.scale.y=1.06;}
   if(reaction==='giggle'){model.smile.visible=false;model.mouth.visible=true;model.mouth.scale.set(.19,.09,.03);model.tongue.visible=true;for(const e of model.eyes)e.group.scale.y=.65;if(!reduced){model.body.rotation.z=Math.sin(rt*22)*.035;model.body.position.y=Math.abs(Math.sin(rt*15))*.035;for(let i=0;i<model.arms.length;i++)model.arms[i].rotation.z=(i===0?-1:1)*(.8+Math.sin(rt*18)*.12);}}
   if(reaction==='purr'){for(const e of model.eyes)e.group.scale.y=.3;if(!reduced){model.body.rotation.z=Math.sin(rt*2)*.025;model.body.scale.y=1+Math.sin(rt*3)*.007;}}
   if(reaction==='dance'){if(!reduced){model.root.rotation.y=Math.sin(rt*4)*.45;model.body.position.y=Math.abs(Math.sin(rt*6))*.16;model.body.rotation.z=Math.sin(rt*6)*.14;model.body.rotation.x=Math.sin(rt*3)*.08;for(let i=0;i<model.arms.length;i++)model.arms[i].rotation.z=(i===0?-1:1)*(1.5+Math.sin(rt*6+i)*.55);}model.smile.visible=false;model.mouth.visible=true;model.mouth.scale.set(.17,.09,.03);model.tongue.visible=true;}
   if(reaction==='cross'){for(let i=0;i<model.eyes.length;i++){const e=model.eyes[i];e.pupil.position.x=(i===0?.09:-.09);e.pupil.position.y=-.015;}model.tongue.visible=true;model.smile.visible=false;model.mouth.visible=true;model.mouth.scale.set(.12,.07,.03);}
   if(reaction==='roll'){for(const e of model.eyes){e.pupil.position.x=reduced?0:Math.sin(rt*3)*.06;e.pupil.position.y=.09;}if(!reduced)model.body.rotation.z=Math.sin(rt*2)*.04;}
   if(reaction==='feed'){model.smile.visible=false;model.mouth.visible=true;model.mouth.scale.set(.18,.19,.035);model.tongue.visible=true;for(const e of model.eyes)e.group.scale.y=.9;}
   if(reaction==='rock'){for(const e of model.eyes)e.group.scale.y=.4;if(!reduced){model.body.rotation.z=Math.sin(rt*7)*.13;model.body.position.y=Math.sin(rt*7)*.025;}}
   if(reaction==='yawn'){for(const e of model.eyes)e.group.scale.y=.35;model.smile.visible=false;model.tooth.visible=false;model.mouth.visible=true;model.mouth.scale.set(.14,.22,.03);if(!reduced)for(let i=0;i<model.arms.length;i++)model.arms[i].rotation.z=(i===0?-1:1)*1.9;}
   renderer.render(scene,camera);
  }
  frame=requestAnimationFrame(animate);
  disposers.push(()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();wrapper.removeEventListener('pointermove',move);shadowTexture.dispose();scene.traverse(o=>{if(o.isMesh){if(o.geometry!==sphere)o.geometry.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose();}});renderer.dispose();renderer.forceContextLoss();});
 });
 return()=>disposers.forEach(fn=>fn());
}
