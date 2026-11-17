import{UPGRADED_GAMES,danceLight,flipperSegments,runnerObstacle,bowlingProjection,gestureShot}from'./arcade-upgrades.js';
const colours=['#a990d2','#6bbca7','#e6b26e','#d68eaf','#80a9da'];
function path(c,pts,fill,stroke,width=3){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));if(fill)c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function bodyPath(c){c.moveTo(-13,-31);c.arcTo(36,-31,36,35,23);c.arcTo(36,35,-36,35,23);c.arcTo(-36,35,-36,-31,23);c.arcTo(-36,-31,36,-31,23);c.closePath();}
function creature(c,x,y,size,identity=0,animation=0){
 c.save();c.translate(x,y);c.scale(size/80,size/80);c.rotate(Math.sin(animation*5)*.08);const col=colours[identity%5],shape=Math.floor(identity/5)%3;
 c.fillStyle='#38244920';c.beginPath();c.ellipse(0,37,35,8,0,0,7);c.fill();
 const g=c.createRadialGradient(-14,-22,3,0,0,49);g.addColorStop(0,col);g.addColorStop(1,['#7c62a4','#438f7d','#bf874b','#b4688d','#537eaf'][identity%5]);c.fillStyle=g;c.beginPath();
 shape===0?c.ellipse(0,0,32,36,0,0,7):shape===1?c.ellipse(0,0,26,40,0,0,7):bodyPath(c);c.fill();
 c.strokeStyle=col;c.lineWidth=6;c.lineCap='round';for(const side of[-1,1]){c.beginPath();c.moveTo(side*29,8);c.lineTo(side*41,18+Math.sin(animation*6+side)*10);c.moveTo(side*15,29);c.lineTo(side*20,41+Math.sin(animation*6+side)*5);c.stroke();}
 const eyes=identity%4===0?[-15,0,15]:[-12,12];for(const ex of eyes){c.fillStyle='#f6efff';c.beginPath();c.ellipse(ex,-8,eyes.length===3?8:10,13,0,0,7);c.fill();c.fillStyle='#3c2a57';c.beginPath();c.ellipse(ex+Math.sin(animation*2)*3,-6,4,7,0,0,7);c.fill();}
 c.strokeStyle='#40294e';c.lineWidth=3;c.beginPath();c.arc(0,10,10,.15,Math.PI-.15);c.stroke();
 if(Math.floor(identity/3)%2){c.strokeStyle=col;c.lineWidth=4;c.beginPath();c.moveTo(-14,-29);c.lineTo(-20,-48);c.moveTo(14,-29);c.lineTo(20,-48);c.stroke();}
 c.restore();
}
function drawing(c,s,{minX=0,minY=0,scale=1,x=0,y=0,rotate=0}={}){
 c.save();c.translate(x,y);c.rotate(rotate);c.scale(scale,scale);c.translate(-minX,-minY);c.lineCap='round';c.lineJoin='round';c.lineWidth=4/Math.max(.7,scale);
 let last=null;for(const p of s.strokes){if(p.end){last=null;continue;}c.strokeStyle=colours[p.colour];c.fillStyle=colours[p.colour];if(last&&!p.start){c.beginPath();c.moveTo(last.x,last.y);c.lineTo(p.x,p.y);c.stroke();}else{c.beginPath();c.arc(p.x,p.y,2,0,7);c.fill();}last=p;}c.restore();
}
function message(c,s,text,round){if(s.message&&s.time<s.messageUntil){round(c,90,8,620,36,17,'#f3eaf9ee');text(c,s.message,400,26,18);}}
function swipeOverlay(c,s,text,round){
 const live=s.liveSwipe?.length>1,trace=live?s.liveSwipe:s.time<s.swipeUntil?s.swipeTrace:null;if(trace?.length>1){c.save();c.lineCap='round';c.lineJoin='round';c.strokeStyle='#fff0bd';c.shadowColor='#73568d';c.shadowBlur=5;c.globalAlpha=live?.95:Math.max(0,(s.swipeUntil-s.time)/1.8)*.85;c.lineWidth=4;c.beginPath();trace.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke();const last=trace.at(-1);c.fillStyle='#f9e5ac';c.beginPath();c.arc(last.x,last.y,6,0,7);c.fill();c.restore();}
 let power=s.shotPower,spin=s.shotSpin;if(live){const first=trace[0],last=trace.at(-1),shot=gestureShot({...last,start:first,path:trace,duration:(last.t||0)-(first.t||0)});if(shot){power=shot.power;spin=shot.spin;}}
 if(power!==undefined&&(live||s.time<s.feedbackUntil)){round(c,200,450,400,39,16,'#f4eafaeb');text(c,'Power '+Math.round(power*100)+'%  ·  Curl '+(Math.abs(spin)<.12?'straight':(spin<0?'← ':'→ ')+Math.round(Math.abs(spin)*100)+'%'),400,470,19);}
}
export function drawUpgrade(c,s,input,{round,orb,star,text,cloud}){
 if(!UPGRADED_GAMES.has(s.engine))return false;const e=s.engine,b=s.ball,p=s.player,t=s.time;
 if(e==='pinball'){
  round(c,108,35,584,460,40,'#282c50','#c6afd9');round(c,355,472,90,24,6,'#141e36');
  c.strokeStyle='#a49ad2';c.lineWidth=11;c.lineCap='round';for(const side of[-1,1]){c.beginPath();c.moveTo(400+side*275,340);c.lineTo(400+side*195,402);c.stroke();}
  for(const o of s.objects){orb(c,o.x,o.y,o.r,o.lit?'#e6be78':colours[o.colour]);orb(c,o.x,o.y,o.r*.69,o.lit?'#f4dc9a':'#b3d9dd');star(c,o.x,o.y,o.r*.42,o.lit?'#fff6ca':'#e9c78c');}
  for(const f of flipperSegments(s,input)){c.strokeStyle='#796393';c.lineWidth=26;c.beginPath();c.moveTo(f.a.x,f.a.y+4);c.lineTo(f.b.x,f.b.y+4);c.stroke();c.strokeStyle=f.active?'#eab1d1':'#c2a2d9';c.lineWidth=19;c.beginPath();c.moveTo(f.a.x,f.a.y);c.lineTo(f.b.x,f.b.y);c.stroke();orb(c,f.a.x,f.a.y,7,'#e9ddf3');}
  if(!b.hidden&&s.ballPhase!=='waiting')orb(c,b.x,b.y,12,'#f7ead2');text(c,'TABLE '+s.level+'  ·  '+s.objects.filter(o=>o.lit).length+'/'+s.objects.length+' targets',400,67,17,'#eadff5');text(c,'BALL '+s.ballNumber+' OF 3',400,475,16,'#d9c6ec');if(s.ballPhase==='waiting')text(c,s.lives?'Next ball…':'Three balls played',400,370,25,'#f3d49e');
  round(c,700,35,48,460,20,'#343553','#c4aedb');round(c,708,315,32,150,12,'#1e2741');
  const pull=s.plungerPull||0;for(let i=0;i<6;i++)path(c,[[712,403+i*8+pull*4],[736,407+i*8+pull*4]],null,'#b6a4cf',3);
  round(c,704,380+pull*65,40,15,6,'#deb984');
  if(s.ballPhase==='ready'){orb(c,724,355+pull*65,12,'#f7ead2');text(c,'Pull down →',560,350,20,'#f5dda9');text(c,Math.round(pull*100)+'%',724,300,14,'#f5dda9');}
  if(s.ballPhase==='launching')orb(c,b.x,b.y,12,'#f7ead2');
 }
 if(e==='buggy'||e==='dash'){
  // A level running surface matches the collision plane; distant hills scroll behind it.
  for(let layer=0;layer<2;layer++){const y=layer?260:205;c.fillStyle=layer?'#9cb9b0':'#bacac6';c.beginPath();c.moveTo(0,410);for(let x=0;x<=820;x+=20)c.lineTo(x,y+Math.sin((x+s.camera*(layer?.35:.15))/125)*28);c.lineTo(800,500);c.lineTo(0,500);c.fill();}
  c.fillStyle=e==='buggy'?'#9d91af':'#84a58c';c.fillRect(0,412,800,88);c.fillStyle=e==='buggy'?'#b9accd':'#b3c99d';c.fillRect(0,409,800,9);
  for(let i=0;i<20;i++){const x=((i*57-s.camera)%900+900)%900;c.fillStyle='#ffffff23';c.beginPath();c.ellipse(x,440+i%3*18,7,3,0,0,7);c.fill();}
  for(const o of s.objects){const box=runnerObstacle(s,o);if(e==='buggy'&&(o.kind==='crater'||!o.kind)){c.fillStyle='#695e7c';c.beginPath();c.ellipse(o.x,418,o.w/2,10,0,0,7);c.fill();c.strokeStyle='#cec0dc';c.lineWidth=3;c.beginPath();c.ellipse(o.x,415,o.w/2,8,0,Math.PI,0);c.stroke();}
   else if(e==='buggy'){const g=c.createLinearGradient(box.x,0,box.x+box.w,0);g.addColorStop(0,'#b1a7c5');g.addColorStop(1,'#776d91');path(c,[[box.x,412],[box.x+3,box.y+20],[box.x+box.w*.4,box.y],[box.x+box.w-4,box.y+12],[box.x+box.w,412]],g,'#8b7f9e',2);path(c,[[box.x+10,box.y+30],[box.x+box.w*.45,box.y+22],[box.x+box.w*.65,box.y+55]],null,'#cdc1dc',3);if(o.kind==='tower'){round(c,o.x-39,box.y-35,78,27,12,'#f2dfaa');text(c,'2 taps',o.x,box.y-21,17,'#786548');}}
   else if(o.bad){path(c,[[o.x-34,25],[o.x-34,box.y],[o.x+32,box.y],[o.x+32,20]],null,'#8a9d88',5);round(c,box.x,box.y,box.w,box.h,8,'#967eb9','#6e5b92');text(c,o.variant==='cone'?'↓ DUCK':'↓',o.x,box.y+28,20,'#f4ecfb');}
   else if(o.variant==='cone'){path(c,[[box.x,412],[o.x,box.y],[box.x+box.w,412]],'#e6a179','#ba7b67',2);round(c,box.x-4,406,box.w+8,7,3,'#dc916e');path(c,[[o.x-10,box.y+23],[o.x+10,box.y+23]],null,'#fff1d3',6);}
   else{round(c,box.x,box.y,box.w,box.h,6,o.variant==='barrier'?'#d8b477':'#a994bd','#807163');path(c,[[box.x+5,box.y+5],[box.x+box.w-5,box.y+box.h-5],[box.x+box.w-5,box.y+5],[box.x+5,box.y+box.h-5]],null,'#f1dfc3',3);}
  }

  if(e==='buggy'){round(c,120,p.y+12,100,30,12,'#c3ace0','#8977a7');for(const x of[139,201]){orb(c,x,p.y+45,17,'#6a637e');orb(c,x,p.y+45,7,'#c9c6dc');}path(c,[[127,p.y+12],[133,p.y-30],[197,p.y-30],[212,p.y+12]],null,'#d8caea',5);if(p.jumps===2){star(c,142,p.y+72,9,'#ebc88a');star(c,196,p.y+70,9,'#ebc88a');}}
  if(e==='dash'){const deckY=406-(350-p.y);round(c,135,deckY-6,70,8,5,'#e5b079','#7b658d');for(const x of[147,193]){orb(c,x,deckY+5,6,'#5c5274');orb(c,x,deckY+5,2,'#d7c6e7');}}
  text(c,e==='buggy'?'Two taps · two moon hops':'Tap to jump  ·  swipe down to duck',400,467,19,'#f4edf7');
 }
 if(e==='jelly'){
  for(const o of s.objects)if(o.alive){round(c,o.x,o.y,o.w,o.h,8,colours[o.colour],'#ffffff77');round(c,o.x+5,o.y+3,o.w-10,5,2,'#ffffff55');if(o.hp>1)star(c,o.x+o.w/2,o.y+13,6,'#faf0ce');}round(c,(s.paddle||400)-72,434,144,19,10,'#9c83c2','#e3d7ee');orb(c,b.x,b.y,11,'#fff2ce');
 }
 if(e==='bubbles'){
  for(const o of s.objects){orb(c,o.x,o.y,o.r,o.bad?'#66517d':colours[o.colour]);path(c,[[o.x-4,o.y+o.r],[o.x+3,o.y+o.r+14],[o.x-2,o.y+o.r+25]],null,o.bad?'#66517d':'#9b8fac',1.5);if(o.bad){text(c,'×',o.x,o.y,40,'#fae5f0');}else{c.strokeStyle='#ffffffaa';c.lineWidth=3;c.beginPath();c.arc(o.x-5,o.y-5,o.r*.65,3.4,4.7);c.stroke();}}
  round(c,240,14,320,39,18,'#f0e9f4dd');text(c,'Floated away: '+s.missed+' / '+s.missLimit,400,34,21);text(c,'Leave the dark × balloons alone!',400,477,20);
 }
 if(e==='dance'){
  round(c,170,50,460,220,30,'#bba3d177','#e9daf0');const light=danceLight(s);for(let i=0;i<4;i++){const lit=light===i;round(c,70+i*165,325,145,110,22,lit?'#fff1b8':colours[i],lit?'#fff9df':'#e6d7ee');text(c,['←','↑','↓','→'][i],142+i*165,379,49,lit?'#8d7141':'#f8f1fc');}text(c,s.danceShowing?'Watch the steps…':'Your turn! '+s.danceInput.length+' / '+s.sequence.length,400,298,25);
  if(s.danceShowing){const beat=Math.floor((t-s.danceAt)/.9);text(c,beat>=0&&beat<s.sequence.length?'Step '+(beat+1)+' / '+s.sequence.length:'Get ready…',400,465,20);}
 }
 if(e==='treasure'){
  for(const o of s.objects){round(c,o.x,o.y,o.w,o.h,8,o.open?o.mine?'#bc89a3':'#d7e5d7':'#b79b82',o.open?'#b7c9b8':'#ead0b1');const x=o.x+o.w/2,y=o.y+o.h/2;if(o.open){if(o.mine)creature(c,x,y,34,4);else if(o.hint)text(c,String(o.hint),x,y,25,['','#5d91bc','#599e7c','#ac6b99','#8d6db4','#b78b55'][Math.min(5,o.hint)]);else star(c,x,y,5,'#a6c3a6');}else if(o.flag){path(c,[[x-7,y+14],[x-7,y-16],[x+15,y-7],[x-7,y]],'#e5bf77','#846b53',2);}else{round(c,o.x+5,o.y+4,o.w-10,4,2,'#d8bda1');}}
  round(c,205,451,390,37,16,s.flagMode?'#e3c78d':'#e5d6e9');text(c,(s.flagMode?'⚑ Flag mode':'Dig mode')+' · tap here to switch',400,470,19);text(c,s.mineCount+' sleepy grumbles · numbers count neighbours',400,32,19);
 }
 if(e==='snap'){
  for(const o of s.objects){round(c,o.x,o.y,o.w,o.h,12,o.matched?'#bad9c6':o.open?'#eee5f6':'#aa92c5',o.matched?'#85b49b':'#d6c1e9');if(o.open||o.matched)creature(c,o.x+o.w/2,o.y+o.h*.51,o.h*.65,o.identity);else{text(c,'?',o.x+o.w/2,o.y+o.h/2,Math.min(42,o.h*.5),'#f5eafa');}}
  text(c,'Find the matching Spelloids',400,30,24);for(const [x,label]of[[190,'Small · 6'],[400,'Medium · 16'],[610,'Big · 24']]){round(c,x-93,450,186,37,14,'#e9dcef');text(c,label,x,469,18);}
 }
 if(e==='bowling'){
  const left=bowlingProjection({x:210,y:0}),right=bowlingProjection({x:590,y:0}),nearL=bowlingProjection({x:210,y:1200}),nearR=bowlingProjection({x:590,y:1200});
  path(c,[[left.x-22,left.y],[right.x+22,right.y],[nearR.x+28,480],[nearL.x-28,480]],'#6a6176');const wood=c.createLinearGradient(0,65,0,470);wood.addColorStop(0,'#b69b81');wood.addColorStop(.5,'#d2b48e');wood.addColorStop(1,'#e4c89e');path(c,[[left.x,left.y],[right.x,right.y],[nearR.x,460],[nearL.x,460]],wood);
  for(let i=0;i<=12;i++){const x=210+i*380/12,a=bowlingProjection({x,y:0}),b=bowlingProjection({x,y:1200});path(c,[[a.x,a.y],[b.x,b.y]],null,i%2?'#ab8b6b44':'#fff0ce55',1.5);}
  for(const x of[270,335,400,465,530]){const a=bowlingProjection({x,y:760});path(c,[[a.x-5,a.y],[a.x,a.y-10],[a.x+5,a.y]],'#9b7c64');}
  for(const o of [...s.objects].sort((a,b)=>a.y-b.y)){const q=bowlingProjection(o);c.save();c.translate(q.x,q.y);c.scale(q.scale*1.3,q.scale*1.3);c.fillStyle='#6a566c22';c.beginPath();c.ellipse(4,16,17,6,0,0,7);c.fill();if(!o.alive){c.rotate(Math.max(-1.4,Math.min(1.4,o.angle+Math.sign(o.vx||1)*.9)));c.globalAlpha=.7;}const pin=c.createLinearGradient(-12,0,12,0);pin.addColorStop(0,'#d6c9e6');pin.addColorStop(.45,'#f9f2fb');pin.addColorStop(1,'#bfaed3');round(c,-12,-8,24,39,11,pin);orb(c,0,-20,11,'#eee3f6');round(c,-10,-5,20,5,2,'#ad7fc5');c.restore();}
  for(let i=0;i<(b.trail||[]).length;i++){const q=bowlingProjection(b.trail[i]);c.fillStyle='#f7e6c333';c.beginPath();c.arc(q.x,q.y,2+i*.15,0,7);c.fill();}
  const q=bowlingProjection(b);if(b.y>20){orb(c,q.x,q.y,20*q.scale,'#8e6ab8');for(const [dx,dy]of[[-5,-5],[4,-6],[0,3]]){c.fillStyle='#513a70';c.beginPath();c.arc(q.x+dx*q.scale,q.y+dy*q.scale,2.8*q.scale,0,7);c.fill();}}
  text(c,'LANE '+s.level+'  ·  '+s.objects.filter(o=>o.alive).length+' PINS LEFT',400,31,20,'#eee3f5');if(!s.liveSwipe?.length&&s.time>=s.feedbackUntil||s.feedbackUntil===undefined)text(c,'Swipe up · fast = power · bend = curl',400,480,18,'#f2e6f6');swipeOverlay(c,s,text,round);
 }

 if(e==='football'){
  for(let row=0;row<8;row++){c.fillStyle=row%2?'#8bbd91':'#82b48b';c.fillRect(0,row*63,800,63);}c.strokeStyle='#cce2c5';c.lineWidth=3;c.strokeRect(83,215,634,260);c.beginPath();c.arc(400,431,105,Math.PI,0);c.stroke();
  round(c,110,65,580,146,8,'#edf1e9','#fff5ee');round(c,122,77,556,130,3,'#5d927d');for(let x=123;x<679;x+=28)path(c,[[x,77],[x,207]],null,'#d4e6d477',1);for(let y=78;y<210;y+=22)path(c,[[122,y],[678,y]],null,'#d4e6d477',1);
  star(c,s.starTarget.x,s.starTarget.y,26,'#f7d679');for(const o of s.objects){creature(c,o.x+o.w/2,o.y+o.h/2,63,2);}
  const k=s.keeper||400;creature(c,k,154,63,6);path(c,[[k-28,150],[k-52,142]],null,'#b4d8a8',12);path(c,[[k+28,150],[k+52,142]],null,'#b4d8a8',12);
  for(let i=0;i<(b.trail||[]).length;i++){c.fillStyle='#fff2cc55';c.beginPath();c.arc(b.trail[i].x,b.trail[i].y,3+i*.4,0,7);c.fill();}
  orb(c,b.x,b.y,16,'#faf2df');path(c,[[b.x,b.y-7],[b.x+7,b.y-2],[b.x+4,b.y+7],[b.x-4,b.y+7],[b.x-7,b.y-2]],'#666279');text(c,'Score AND hit the star to reach level '+(s.level+1),400,35,21,'#f6f2db');swipeOverlay(c,s,text,round);
 }
 if(e==='golf'){
  round(c,25,25,750,450,26,'#b4d1a4','#7aa887');for(const o of s.sand){round(c,o.x,o.y,o.w,o.h,20,'#dbc28c','#bba776');}for(const o of s.objects){round(c,o.x+3,o.y+5,o.w,o.h,6,'#70876c66');round(c,o.x,o.y,o.w,o.h,6,'#ad8d75','#8f7263');round(c,o.x+3,o.y+2,o.w-6,5,2,'#d1b397');}
  c.fillStyle='#385c50';c.beginPath();c.ellipse(s.goal.x,s.goal.y,16,11,0,0,7);c.fill();path(c,[[s.goal.x,s.goal.y],[s.goal.x,s.goal.y-58]],null,'#eee8ed',3);path(c,[[s.goal.x,s.goal.y-58],[s.goal.x+31,s.goal.y-45],[s.goal.x,s.goal.y-33]],'#ad8ac6');
  orb(c,b.x,b.y,10,'#fff3d7');if(input.active&&Math.hypot(b.vx,b.vy)<14){c.setLineDash([5,7]);path(c,[[b.x,b.y],[input.x,input.y]],null,'#7d648f',3);c.setLineDash([]);}round(c,265,451,270,30,12,'#e9e4cfee');text(c,'Hole '+s.level+'  ·  Par '+s.par+'  ·  Putts '+s.shots,400,467,18,'#52715b');
 }
 if(e==='plane'||e==='splat'){
  if(e==='plane'&&['flight','landed'].includes(s.phase)){
   const g=c.createLinearGradient(0,0,0,500);g.addColorStop(0,'#8fbfdd');g.addColorStop(1,'#e1e2d2');c.fillStyle=g;c.fillRect(0,0,800,500);
   for(let layer=0;layer<3;layer++){c.fillStyle=['#bdd3c1','#96bea9','#6fa38b'][layer];c.beginPath();c.moveTo(0,500);for(let x=0;x<=820;x+=20)c.lineTo(x,300+layer*55+Math.sin((x+s.camera*(.12+layer*.21))/125)*28);c.lineTo(800,500);c.fill();}
   for(let i=0;i<5;i++){cloud(c,((i*239-s.camera*.15)%1100+1100)%1100,75+i%3*43,45,'#f0f2ec');const x=((i*291-s.camera*.7)%1300+1300)%1300;round(c,x,355,38,65,7,'#a18979');cloud(c,x+19,352,48,'#719980');}
   const d=s.design,scale=150/d.width;drawing(c,s,{minX:d.minX+d.width/2,minY:d.minY+d.height/2,scale,x:200,y:s.player.y,rotate:s.phase==='landed'?.12:s.flightAngle||0});
   text(c,Math.floor(s.distance)+' metres',400,38,30,'#3f697b');text(c,s.design.nose+' · '+(s.design.quality>.65?'A lovely glide!':'A wobbly little flight!'),400,410,20,'#497461');
  }else if(e==='plane'&&s.phase==='ready'){
   round(c,45,52,710,372,23,'#e7e4f0','#c5b0d4');const d=s.design;drawing(c,s,{minX:d.minX+d.width/2,minY:d.minY+d.height/2,scale:150/d.width,x:190,y:290,rotate:-.2});c.setLineDash([9,8]);path(c,[[220,300],[350,245],[490,170]],null,'#ae91c9',6);c.setLineDash([]);path(c,[[460,170],[498,164],[480,197]],null,'#ae91c9',5);text(c,'Swipe up and right to throw!',400,88,25);text(c,d.nose+' · '+Math.round(d.quality*100)+'% glide rating',400,125,18,'#8d719f');swipeOverlay(c,s,text,round);
  }else if(e==='splat'&&s.phase==='animate'){

   round(c,45,40,710,390,25,'#d6d1e6');c.fillStyle='#a6c8b8';c.fillRect(45,350,710,80);const pts=s.strokes.filter(p=>!p.end),minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x)),minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y)),cx=(minX+maxX)/2,cy=(minY+maxY)/2,age=t-s.animatedAt;
   const scale=Math.min(1,220/Math.max(30,maxX-minX),235/Math.max(30,maxY-minY)),dancing=Math.floor(age/5)%2===1,x=dancing?400:400+Math.sin(age*.7)*170,y=dancing?235+Math.abs(Math.sin(age*8))*14:245+Math.sin(age*7)*7,feet=(maxY-minY)*scale*.46;
   drawing(c,s,{minX:cx,minY:cy,scale,x,y,rotate:Math.sin(age*(dancing?8:5))*(dancing?.16:.07)});for(const side of[-1,1]){orb(c,x+side*19,y-18,16,'#f5eff9');c.fillStyle='#3e2c56';c.beginPath();c.ellipse(x+side*19+Math.sin(age*2)*5,y-17,6,9,0,0,7);c.fill();path(c,[[x+side*30,y+feet-4],[x+side*38,y+feet+24+Math.sin(age*7+side)*10]],null,'#9a7bbf',11);path(c,[[x+side*70,y+20],[x+side*100,y+(dancing?-20:42)+Math.sin(age*8+side)*17]],null,'#9a7bbf',9);}c.strokeStyle='#674b82';c.lineWidth=4;c.beginPath();c.arc(x,y+14,18,.15,Math.PI-.15);c.stroke();
   round(c,x+43,y-100,135,45,20,'#efe4f5');text(c,age<4?'Eee-ooo!':dancing?'Let’s dance!':'Off we go!',x+110,y-77,20);
  }else{
   round(c,45,52,710,372,23,'#f1ebf5','#c5b0d4');c.setLineDash([7,8]);c.strokeStyle='#d1bfdf';c.lineWidth=2;c.strokeRect(65,80,670,312);c.setLineDash([]);drawing(c,s);
   text(c,e==='plane'?(s.phase==='ready'?'Swipe upwards to throw!':'Draw a plane · nose pointing right →'):'Draw your very own Spelloid',400,29,23);if(s.ink<2)text(c,e==='plane'?'Try a pointed nose and balanced wings!':'Make a body, arms, legs… anything you like!',400,247,20,'#a18cb5');if(e==='plane')text(c,'Pointy noses glide further. Flat fronts wobble!',400,410,17,'#9d86ad');
  }
  for(let i=0;i<5;i++){orb(c,72+i*60,465,17,colours[i]);if(s.palette===i){c.strokeStyle='#725787';c.lineWidth=3;c.beginPath();c.arc(72+i*60,465,23,0,7);c.stroke();}}round(c,360,443,108,44,14,'#e7dceb');text(c,'Clear',414,465,20);round(c,485,443,258,44,14,'#8c73b0');text(c,e==='plane'?(s.phase==='landed'?'Fly again →':s.phase==='flight'?'Flying…':s.phase==='ready'?'Swipe to throw ↗':'Ready to fly →'):'Animate! →',614,465,22,'#f7edf9');
 }
 if(!(e==='plane'&&['flight','ready','landed'].includes(s.phase)))message(c,s,text,round);
 return true;
}
