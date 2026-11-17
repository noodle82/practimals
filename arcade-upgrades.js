// Den mechanics kept independent of the browser so collisions and progression can be checked.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const UPGRADED_GAMES=new Set(['pinball','buggy','jelly','plane','dance','treasure','football','golf','bubbles','dash','bowling','splat','snap']);
const say=(s,message)=>{s.message=message;s.messageUntil=s.time+3;};
const points=(s,n)=>{s.score+=n;if(s.words.length){s.word=s.words[Math.floor(s.random()*s.words.length)];s.wordUntil=s.time+2;}};
const lose=(s,message)=>{s.finished=true;s.won=false;s.lives=0;s.reason=message;};
const overlaps=(b,o,r=12)=>b.x+r>o.x&&b.x-r<o.x+o.w&&b.y+r>o.y&&b.y-r<o.y+o.h;
function shuffled(a,random){for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

export function pinballTable(s){
 const layouts=[[[230,145,34],[570,145,34],[400,215,38],[250,290,28],[550,290,28]],[[310,125,29],[490,125,29],[210,220,30],[590,220,30],[400,290,36]],[[220,135,28],[400,115,33],[580,135,28],[310,245,29],[490,245,29]]];
 s.objects=layouts[(s.level-1)%layouts.length].map(([x,y,r],i)=>({x,y,r,lit:false,colour:(i+s.level)%5}));s.bumperHits=0;
}
export function jellyLevel(s){
 const rows=Math.min(7,3+Math.floor(s.level/2)),cols=9,pattern=(s.level-1)%5;
 s.objects=[];for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
  if(pattern===1&&(row+col)%3===0||pattern===2&&Math.abs(col-4)>row+1||pattern===3&&row%2===0&&col%2===1)continue;
  const hp=s.level>2&&(row+col)%4===0?2:1;s.objects.push({x:38+col*81,y:55+row*32,w:73,h:25,colour:(row+col+s.level)%5,alive:true,hp});
 }
 s.ball={x:s.paddle||400,y:390,vx:125*(s.level%2?1:-1),vy:-270-Math.min(130,s.level*12)};
 say(s,'Level '+s.level+' · a new jelly pattern!');
}
export function bowlingRack(s){
 const patterns=[[[400,100],[375,140],[425,140],[350,180],[400,180],[450,180],[325,220],[375,220],[425,220],[475,220]],[[295,100],[400,100],[505,100],[330,145],[470,145],[365,190],[435,190],[330,235],[400,235],[470,235]],[[300,110],[350,110],[400,110],[450,110],[500,110],[325,170],[375,170],[425,170],[475,170],[400,230]],[[400,85],[350,125],[450,125],[300,165],[400,165],[500,165],[350,205],[450,205],[375,245],[425,245]]];
 s.objects=patterns[(s.level-1)%patterns.length].map(([x,y])=>({x,y,r:15,alive:true,vx:0,vy:0}));s.rackShots=0;s.ball={x:400,y:440,vx:0,vy:0,spin:0};
}
export function golfCourse(s){
 const courses=[
  {start:[105,400],goal:[695,95],par:3,walls:[[300,190,34,285]]},
  {start:[95,95],goal:[700,405],par:7,walls:[[220,25,32,310],[440,170,32,305],[630,25,30,240]]},
  {start:[90,410],goal:[710,410],par:8,walls:[[180,200,32,275],[360,25,32,280],[540,200,32,275]],sand:[[280,320,65,95]]},
  {start:[90,95],goal:[710,95],par:8,walls:[[190,25,30,300],[370,180,30,295],[550,25,30,300]],sand:[[430,60,80,80]]},
  {start:[90,400],goal:[710,90],par:8,walls:[[170,160,240,28],[380,160,30,210],[550,280,225,30],[25,300,200,28]],sand:[[450,40,70,110]]},
  {start:[90,90],goal:[700,405],par:8,walls:[[180,25,28,290],[180,287,230,28],[382,150,28,165],[520,150,28,325],[520,150,180,28]],sand:[[260,70,95,75]]}
 ];
 const course=courses[(s.level-1)%courses.length];s.course=(s.level-1)%courses.length;s.par=Math.max(course.par-1,course.par-Math.floor((s.level-1)/courses.length));s.shots=0;s.ball={x:course.start[0],y:course.start[1],vx:0,vy:0};s.goal={x:course.goal[0],y:course.goal[1]};s.objects=course.walls.map(([x,y,w,h])=>({x,y,w,h}));s.sand=(course.sand||[]).map(([x,y,w,h])=>({x,y,w,h}));say(s,'Hole '+s.level+' · Par '+s.par);
}
export function mineBoard(s){
 s.mineCols=Math.min(10,6+Math.floor((s.level-1)/2));s.mineRows=Math.min(7,5+Math.floor((s.level-1)/3));s.mineCount=Math.min(18,4+s.level*2);s.minePlanted=false;s.flagMode=false;
 const size=Math.min(72,620/s.mineCols,365/s.mineRows),ox=(800-size*s.mineCols)/2;
 s.objects=Array.from({length:s.mineCols*s.mineRows},(_,i)=>({x:ox+i%s.mineCols*size,y:63+Math.floor(i/s.mineCols)*size,w:size-5,h:size-5,open:false,flag:false,mine:false,hint:0}));
}
function neighbours(s,i){const x=i%s.mineCols,y=Math.floor(i/s.mineCols);return s.objects.map((_,j)=>j).filter(j=>j!==i&&Math.abs(j%s.mineCols-x)<=1&&Math.abs(Math.floor(j/s.mineCols)-y)<=1);}
function plantMines(s,first){let candidates=s.objects.map((_,i)=>i).filter(i=>i!==first&&!neighbours(s,first).includes(i));for(const i of shuffled(candidates,s.random).slice(0,s.mineCount))s.objects[i].mine=true;s.objects.forEach((o,i)=>o.hint=neighbours(s,i).filter(j=>s.objects[j].mine).length);s.minePlanted=true;}
function uncover(s,index){
 if(!s.minePlanted)plantMines(s,index);const tile=s.objects[index];if(tile.flag||tile.open)return;
 if(tile.mine){tile.open=true;lose(s,'A sleepy grumble woke up! Try a fresh treasure patch.');return;}
 const queue=[index],seen=new Set();while(queue.length){const i=queue.pop(),o=s.objects[i];if(seen.has(i)||o.flag||o.mine)continue;seen.add(i);o.open=true;if(o.hint===0)queue.push(...neighbours(s,i));}
 points(s,seen.size*2);if(s.objects.every(o=>o.mine||o.open)){points(s,100);s.level++;mineBoard(s);say(s,'Treasure patch cleared! A bigger puzzle awaits.');}
}
export function snapBoard(s){
 const sizes=[[3,2],[4,3],[4,4],[5,4],[6,4]], [cols,rows]=sizes[Math.min(s.level-1,sizes.length-1)];s.snapCols=cols;s.snapRows=rows;s.snapFirst=null;s.snapSecond=null;s.snapWait=0;
 const size=Math.min(110,650/cols,360/rows),ox=(800-cols*size)/2,oy=70+(365-rows*size)/2;
 const identities=shuffled(Array.from({length:30},(_,i)=>i),s.random).slice(0,cols*rows/2);
 s.objects=shuffled(identities.flatMap(identity=>[{identity},{identity}]),s.random).map((o,i)=>({...o,x:ox+i%cols*size,y:oy+Math.floor(i/cols)*size,w:size-7,h:size-7,open:false,matched:false}));
}
function footballLevel(s){
 s.ball={x:400,y:435,vx:0,vy:0,spin:0,flying:false,trail:[]};s.starTarget={x:180+((s.level*137)%440),y:118,r:27};s.keeper=400;
 s.objects=s.level<3?[]:Array.from({length:Math.min(3,1+Math.floor((s.level-3)/2))},(_,i)=>({x:215+((s.level*83+i*155)%370),y:245+i*32,w:37,h:65}));s.starHit=false;
}
export function setupUpgrade(s){
 if(!UPGRADED_GAMES.has(s.engine))return;
 s.message='';s.player.jumps=0;s.gesture=null;s.flipperCooldown=0;
 if(s.engine==='pinball'){pinballTable(s);s.ball={x:400,y:335,vx:35,vy:-245};s.saverUntil=6;s.saverUsed=false;}
 if(s.engine==='jelly'){s.paddle=400;jellyLevel(s);}
 if(s.engine==='bowling')bowlingRack(s);
 if(s.engine==='golf')golfCourse(s);
 if(s.engine==='treasure')mineBoard(s);
 if(s.engine==='football')footballLevel(s);
 if(s.engine==='snap')snapBoard(s);
 if(['plane','splat'].includes(s.engine)){s.phase='draw';s.strokes=[];s.ink=0;s.drawBounds=null;s.animatedAt=0;s.distance=0;s.avatar={x:720,y:420};s.objects=[];}
 if(s.engine==='bubbles'){s.missed=0;s.missLimit=5;s.objects=[];}
 if(['dash','buggy'].includes(s.engine)){s.player={x:170,y:350,vy:0,jumps:0};s.objects=[];s.spawn=2;}
}
export function analysePlane(strokes){
 const pts=strokes.filter(p=>!p.end);if(pts.length<8)return null;
 const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),width=maxX-minX,height=maxY-minY;
 if(width<45||height<20)return null;
 const centreY=(minY+maxY)/2,top=pts.filter(p=>p.y<centreY).length/pts.length;
 const balance=clamp(1-Math.abs(.5-top)*1.6,0,1),slender=clamp(1-Math.abs(width/Math.max(1,height)-2.5)/4,0,1);
 // A playful design estimate, not a real aerodynamic simulation. Every usable drawing flies.
 return{minX,maxX,minY,maxY,width,height,balance,slender,quality:.35+.35*slender+.3*balance};
}
function drawMark(s,a){
 if(a.x<65||a.x>735||a.y<80||a.y>392||s.strokes.length>=5500)return;
 const previous=s.strokes.at(-1);s.strokes.push({x:a.x,y:a.y,colour:s.palette,start:a.type==='press'||!previous||previous.end});s.ink++;
}
export function gestureShot(a,origin={x:400,y:435}){
 const start=a.start||origin,dx=a.x-start.x,dy=a.y-start.y,ms=clamp(a.duration||400,80,1400),length=Math.hypot(dx,dy);
 if(length<12)return null;const speed=length/(ms/1000);
 return{dx,dy,speed,power:clamp(speed/1000,.22,1),spin:clamp(((a.bend||0)*.013+dx*.0008),-1,1)};
}
export function actionUpgrade(s,a){
 const e=s.engine;if(!UPGRADED_GAMES.has(e))return false;
 const {x=400,y=250,type='press',direction=null}=a;
 if(['plane','splat'].includes(e)){
  if(type==='press'&&y>=437){
   if(x<355){s.palette=clamp(Math.floor((x-45)/60),0,4);return true;}
   if(x<475){s.strokes=[];s.ink=0;s.phase='draw';s.distance=0;s.player={x:180,y:270,vy:0};return true;}
   if(s.phase!=='draw')return true;
   if(e==='plane'){const shape=analysePlane(s.strokes);if(!shape){say(s,'Draw a bigger plane inside the paper first.');return true;}s.design=shape;s.phase='ready';say(s,'Swipe up and across the paper to launch!');}
   else if(s.ink>8){s.phase='animate';s.animatedAt=s.time;s.helloEvent=(s.helloEvent||0)+1;s.score=50;say(s,'Eee-ooo! Your Spelloid is alive!');}
   return true;
  }
  if(s.phase==='draw'&&['press','move'].includes(type))drawMark(s,a);
  if(type==='release'){
   if(s.phase==='draw')s.strokes.push({end:true});
   if(e==='plane'&&s.phase==='ready'){const shot=gestureShot(a);if(shot){s.phase='flight';s.flightStart=s.time;s.launchPower=shot.power;s.player={x:170,y:280,vy:-90-shot.power*65};s.flightSpeed=210+shot.power*140;s.distance=0;s.maxFlight=7+s.design.quality*12+shot.power*6;say(s,'Off it goes!');}}
  }return true;
 }
 if(type==='move'||type==='cancel')return true;
 if(e==='pinball'&&type==='press'){s[x<400?'flipLeftUntil':'flipRightUntil']=s.time+.18;return true;}
 if(e==='dash'){
  // Touch jumps are dispatched on release, after the gesture is classified.
  if(direction==='down'){s.duckUntil=s.time+.85;return true;}
  if(type==='press'&&s.player.y>=349){s.player.vy=-360;s.duckUntil=0;}return true;
 }
 if(e==='buggy'){if(type==='press'&&s.player.jumps<2){s.player.vy=s.player.jumps===0?-330:-305;s.player.jumps++;say(s,s.player.jumps===2?'Moon boost!':'Tap again for a moon boost');}return true;}
 if(e==='bubbles'&&type==='press'){
  const target=s.objects.slice().reverse().find(o=>distance({x,y},o)<o.r+12);if(target){s.objects.splice(s.objects.indexOf(target),1);if(target.bad){lose(s,'That was a trouble balloon! Look for the friendly colours next time.');return true;}s.combo=s.lastColour===target.colour?s.combo+1:1;s.lastColour=target.colour;points(s,5+Math.min(s.combo,10));}return true;
 }
 if(e==='treasure'&&type==='press'){
  if(y>446){s.flagMode=!s.flagMode;return true;}
  const i=s.objects.findIndex(o=>overlaps({x,y},o,0));if(i>=0){if(s.flagMode||a.flag){if(!s.objects[i].open)s.objects[i].flag=!s.objects[i].flag;}else uncover(s,i);}return true;
 }
 if(e==='snap'&&type==='press'){
  if(y>448){s.level=x<290?1:x<510?3:5;snapBoard(s);return true;}
  if(s.snapWait)return true;const index=s.objects.findIndex(o=>overlaps({x,y},o,0)&&!o.open&&!o.matched);if(index<0)return true;s.objects[index].open=true;
  if(s.snapFirst===null)s.snapFirst=index;else{s.snapSecond=index;s.snapWait=s.time+.8;}return true;
 }
 if(e==='dance'&&type==='press'){
  if(s.danceShowing)return true;const index=direction?['left','up','down','right'].indexOf(direction):clamp(Math.floor((x-70)/165),0,3);if(index<0)return true;
  s.danceFlash=index;s.danceFlashUntil=s.time+.18;if(index!==s.sequence[s.danceInput.length]){lose(s,'Lovely dancing. Let’s watch a fresh pattern and try again.');return true;}s.danceInput.push(index);points(s,5);
  if(s.danceInput.length===s.sequence.length){s.level++;s.sequence.push(Math.floor(s.random()*4));s.danceInput=[];s.danceShowing=true;s.danceAt=s.time+.9;}return true;
 }
 if(e==='golf'&&type==='release'&&Math.hypot(s.ball.vx,s.ball.vy)<14){
  const dx=s.ball.x-x,dy=s.ball.y-y;if(Math.hypot(dx,dy)<9)return true;s.shots++;const scale=Math.min(3.4,600/Math.hypot(dx,dy));s.ball.vx=dx*scale;s.ball.vy=dy*scale;return true;
 }
 if(e==='football'&&type==='release'&&!s.ball.flying){
  let shot=gestureShot(a);if(!shot&&a.keyboard)shot={dx:x-400,dy:-280,power:.7,spin:0};if(!shot||shot.dy>=-12){say(s,'Swipe upwards from the ball. Curve your swipe to curl!');return true;}
  const seconds=.65+(1-shot.power)*.65,target=clamp(400+shot.dx*1.35,115,685);s.ball.vy=-320/seconds;s.ball.spin=shot.spin;s.ball.vx=(target-400-.5*shot.spin*170*seconds*seconds)/seconds;s.ball.flying=true;s.shotPower=shot.power;s.shots++;return true;
 }
 if(e==='bowling'&&type==='release'&&Math.abs(s.ball.vy)<1){
  let shot=gestureShot(a,{x:400,y:440});if(!shot&&a.keyboard)shot={dx:x-400,dy:-300,power:.7,spin:0};if(!shot||shot.dy>=-12){say(s,'Swipe up the lane. A curved swipe adds spin.');return true;}
  s.ball.vy=-310-shot.power*300;s.ball.vx=clamp(shot.dx/Math.max(90,-shot.dy)*Math.abs(s.ball.vy)*.65,-240,240);s.ball.spin=shot.spin;s.rackShots++;s.shots++;return true;
 }
 return true;
}
export function danceLight(s){if(!s.danceShowing)return s.time<(s.danceFlashUntil||0)?s.danceFlash:-1;const at=s.time-s.danceAt,index=Math.floor(at/.9);return at>=0&&index<s.sequence.length&&at% .9<.55?s.sequence[index]:-1;}
export function flipperSegments(s,input={}){
 const l=!!(input.left||s.flipLeftUntil>s.time||input.active&&input.x<400),r=!!(input.right||s.flipRightUntil>s.time||input.active&&input.x>=400);s.flipperLeft=l;s.flipperRight=r;
 return[{a:{x:220,y:412},b:{x:365,y:l?373:435},active:l},{a:{x:580,y:412},b:{x:435,y:r?373:435},active:r}];
}
export function bounceSegment(ball,a,b,r=20,kick=0){
 const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((ball.x-a.x)*dx+(ball.y-a.y)*dy)/(dx*dx+dy*dy),0,1),q={x:a.x+t*dx,y:a.y+t*dy},dist=distance(ball,q);if(dist>=r)return false;
 let nx=(ball.x-q.x)/(dist||1),ny=(ball.y-q.y)/(dist||1);if(!dist){nx=0;ny=-1;}const dot=ball.vx*nx+ball.vy*ny;ball.x=q.x+nx*(r+.4);ball.y=q.y+ny*(r+.4);if(dot<0){ball.vx-=1.82*dot*nx;ball.vy-=1.82*dot*ny;if(kick)ball.vy=Math.min(ball.vy,-kick);}return true;
}
function advancePinball(s,dt,input){
 const b=s.ball,flippers=flipperSegments(s,input),steps=Math.max(1,Math.ceil(dt/.007)),h=dt/steps;
 for(let k=0;k<steps;k++){
  b.vy+=270*h;b.x+=b.vx*h;b.y+=b.vy*h;
  if(b.x<125){b.x=125;b.vx=Math.abs(b.vx)*.92;}if(b.x>675){b.x=675;b.vx=-Math.abs(b.vx)*.92;}if(b.y<50){b.y=50;b.vy=Math.abs(b.vy);}
  for(const o of s.objects){const d=distance(b,o);if(d<o.r+12){const nx=(b.x-o.x)/(d||1),ny=(b.y-o.y)/(d||1);b.x=o.x+nx*(o.r+13);b.y=o.y+ny*(o.r+13);const force=320+Math.min(130,s.level*16);b.vx=nx*force;b.vy=ny*force;points(s,o.lit?5:15);o.lit=true;s.bumperHits++;}}
  bounceSegment(b,{x:125,y:340},{x:205,y:402},20);bounceSegment(b,{x:675,y:340},{x:595,y:402},20);
  for(const f of flippers)bounceSegment(b,f.a,f.b,22,f.active?460:0);
  if(b.y>450&&(b.x<355||b.x>445)){b.y=450;b.vy=-Math.max(180,Math.abs(b.vy)*.82);b.vx+=(400-b.x)*.25;}
  const speed=Math.hypot(b.vx,b.vy);if(speed>650){b.vx*=650/speed;b.vy*=650/speed;}
  if(b.y>525){if(!s.saverUsed&&s.time<s.saverUntil){s.saverUsed=true;s.ball={x:400,y:330,vx:20,vy:-260};say(s,'Ball saved!');return;}lose(s,'A sparkling run! Try another table.');return;}
 }
 if(s.objects.every(o=>o.lit)||s.bumperHits>=10){s.level++;points(s,100);pinballTable(s);say(s,'Table '+s.level+' · new bumpers and a bonus!');}s.avatar={x:66,y:405};
}
function stepRunner(s,dt,input){
 const p=s.player,buggy=s.engine==='buggy',speed=(buggy?180:190)+Math.min(buggy?135:160,s.time*1.8),gravity=buggy?610:900;
 s.level=1+Math.floor(s.time/20);s.camera+=speed*dt;p.vy+=gravity*dt;p.y+=p.vy*dt;if(p.y>=350){p.y=350;p.vy=0;p.jumps=0;}
 if(input.down&&!buggy)s.duckUntil=s.time+.18;s.ducking=!buggy&&s.duckUntil>s.time;s.avatar={x:170,y:p.y+(buggy?-8:30)};s.spawn-=dt;
 if(s.spawn<=0){s.spawn=(buggy?1.9:1.65)+s.random()*.65;s.objects.push({x:870,w:buggy?72+Math.min(40,s.level*4):55,bad:!buggy&&s.random()<.42,passed:false});}
 for(const o of s.objects){o.x-=speed*dt;
  // Only tyres over the open centre count; the generous lip is visible in the drawing.
  const horizontal=Math.abs(o.x-170)<(buggy?o.w/2-7:29),hit=buggy?p.y>323:o.bad?!s.ducking&&p.y>275:p.y>299;
  if(horizontal&&hit){lose(s,buggy?'A moon bump! Jump a little earlier, then tap for a second boost.':'A woodland wobble. Jump logs or swipe down under branches!');return;}
  if(o.x+(o.w||55)/2<125&&!o.passed){o.passed=true;points(s,10);}
 }s.objects=s.objects.filter(o=>o.x>-100);
}
function stepJelly(s,dt,input){
 const b=s.ball;s.paddle=clamp(input.x??400,72,728);s.avatar={x:s.paddle,y:445};const steps=Math.max(1,Math.ceil(dt/.006));
 for(let k=0;k<steps;k++){const h=dt/steps,old={...b};b.x+=b.vx*h;b.y+=b.vy*h;
  if(b.x<18||b.x>782){b.x=clamp(b.x,18,782);b.vx=-b.vx;}if(b.y<20){b.y=20;b.vy=Math.abs(b.vy);}
  if(b.vy>0&&old.y<=422&&b.y>=422&&Math.abs(b.x-s.paddle)<77){b.y=422;const angle=clamp((b.x-s.paddle)/78,-.95,.95),speed=340+Math.min(180,s.level*16);b.vx=angle*speed*.85;b.vy=-Math.sqrt(speed*speed-b.vx*b.vx);}
  for(const o of s.objects)if(o.alive&&overlaps(b,o,10)){o.hp--;o.alive=o.hp>0;if(old.x+10<=o.x||old.x-10>=o.x+o.w)b.vx=-b.vx;else b.vy=-b.vy;points(s,o.alive?4:10);b.x=old.x;b.y=old.y;break;}
  if(b.y>525){lose(s,'Boing! Ready to bounce through a fresh set of levels?');return;}
 }if(s.objects.every(o=>!o.alive)){s.level++;points(s,75);jellyLevel(s);}
}
function stepBowling(s,dt){
 const b=s.ball;s.avatar={x:95,y:410};if(!b.vy)return;
 b.vx+=(b.spin||0)*95*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
 const newly=[];for(const o of s.objects)if(o.alive&&distance(b,o)<32){o.alive=false;o.vx=b.vx+(o.x-b.x)*7;o.vy=b.vy*.6;newly.push(o);points(s,10);}
 // Pin-to-pin collisions propagate deterministically: a well aimed pocket shot can strike.
 for(let i=0;i<newly.length;i++){const o=newly[i];for(const n of s.objects)if(n.alive&&n.y<o.y+10&&distance(n,o)<72){n.alive=false;n.vx=o.vx+(n.x-o.x)*5;n.vy=-210;newly.push(n);points(s,10);}}
 for(const o of s.objects)if(!o.alive){o.x+=(o.vx||0)*dt;o.y+=(o.vy||0)*dt;o.vx*=Math.exp(-dt*3);o.vy*=Math.exp(-dt*3);}
 if(b.y<-45||b.x<70||b.x>730){if(s.objects.every(o=>!o.alive)){const strike=s.rackShots===1;points(s,strike?100:30);s.level++;bowlingRack(s);say(s,strike?'STRIKE! A new pin formation!':'Lane cleared! Try the next formation.');}else{s.ball={x:400,y:440,vx:0,vy:0,spin:0};say(s,'Curve your swipe to reach the remaining pins.');}}
}
function stepGolf(s,dt){
 const b=s.ball;s.avatar={x:65,y:420};const steps=Math.max(1,Math.ceil(dt/.006));
 for(let k=0;k<steps;k++){const h=dt/steps,old={x:b.x,y:b.y};b.x+=b.vx*h;b.y+=b.vy*h;const sand=s.sand.some(o=>overlaps(b,o,0));b.vx*=Math.exp(-h*(sand?3.6:1.08));b.vy*=Math.exp(-h*(sand?3.6:1.08));
  if(b.x<38||b.x>762){b.x=clamp(b.x,38,762);b.vx=-b.vx*.82;}if(b.y<38||b.y>462){b.y=clamp(b.y,38,462);b.vy=-b.vy*.82;}
  for(const o of s.objects)if(overlaps(b,o,11)){if(old.x+11<=o.x||old.x-11>=o.x+o.w){b.x=old.x;b.vx=-b.vx*.83;}else{b.y=old.y;b.vy=-b.vy*.83;}}
  if(distance(b,s.goal)<17&&Math.hypot(b.vx,b.vy)<240){if(s.shots<=s.par){points(s,100+(s.par-s.shots)*20);s.level++;golfCourse(s);say(s,'Par beaten! A new course to explore.');}else{golfCourse(s);say(s,'In the hole! Try this course again to make par.');}return;}
 }
 if(Math.hypot(b.vx,b.vy)<8){b.vx=b.vy=0;if(s.shots>=s.par){golfCourse(s);say(s,'Let’s try that hole again. Aim for par '+s.par+'.');}}
}
function stepFootball(s,dt){
 const b=s.ball;s.avatar={x:95,y:420};s.keeper=400+Math.sin(s.time*(1.05+Math.min(2,s.level*.15)))*Math.min(230,130+s.level*15);
 if(!b.flying)return;b.trail.push({x:b.x,y:b.y});if(b.trail.length>18)b.trail.shift();const steps=Math.max(1,Math.ceil(dt/.006));
 for(let i=0;i<steps;i++){const h=dt/steps,previousY=b.y;b.vx+=(b.spin||0)*170*h;b.x+=b.vx*h;b.y+=b.vy*h;
  if(s.objects.some(o=>overlaps(b,o,14))||previousY>=161&&b.y<161&&Math.abs(b.x-s.keeper)<43){footballLevel(s);say(s,'Saved! Try curling around the defender or keeper.');return;}
  if(b.y<118){const goal=b.x>130&&b.x<670;if(goal){points(s,20);if(Math.abs(b.x-s.starTarget.x)<s.starTarget.r+12){points(s,80);s.level++;footballLevel(s);say(s,'GOAL + STAR! Level '+s.level+'!');}else{footballLevel(s);say(s,'GOAL! Now aim for the star to unlock the next level.');}}else{footballLevel(s);say(s,'Just wide! Try a gentler swipe.');}return;}
 }
}
function stepCreative(s,dt){
 if(s.engine==='plane'&&s.phase==='flight'){
  s.distance+=s.flightSpeed*dt/12;s.camera+=s.flightSpeed*dt;s.flightSpeed=Math.max(100,s.flightSpeed-dt*(4+(1-s.design.quality)*5));const age=s.time-s.flightStart;
  s.player.y=280-110*Math.sin(Math.min(1,age/s.maxFlight)*Math.PI)+Math.pow(age/s.maxFlight,5)*210;s.avatar={x:720,y:420};s.score=Math.floor(s.distance);
  if(age>s.maxFlight||s.player.y>438){s.phase='landed';s.score=Math.floor(s.distance);say(s,Math.round(s.distance)+' metres! Clear the paper to try a new design.');}
 }
}
export function stepUpgrade(s,dt,input={}){
 const e=s.engine;if(!UPGRADED_GAMES.has(e))return false;
 if(e==='pinball')advancePinball(s,dt,input);
 if(e==='buggy'||e==='dash')stepRunner(s,dt,input);
 if(e==='jelly')stepJelly(s,dt,input);
 if(e==='bowling')stepBowling(s,dt);
 if(e==='golf')stepGolf(s,dt);
 if(e==='football')stepFootball(s,dt);
 if(e==='plane'||e==='splat')stepCreative(s,dt);
 if(e==='bubbles'){
  s.level=1+Math.floor(s.time/20);s.spawn-=dt;const speed=65+Math.min(90,s.time*1.15);
  if(s.spawn<=0){s.spawn=Math.max(.38,.85-s.time*.004);s.objects.push({x:48+s.random()*704,y:535,r:29,vy:-speed,colour:Math.floor(s.random()*5),bad:s.time>4&&s.random()<.17});}
  for(const o of s.objects){o.y+=o.vy*dt;o.x=clamp(o.x+Math.sin(s.time*2+o.colour)*dt*12,30,770);if(o.y<-o.r&&!o.counted){o.counted=true;if(!o.bad)s.missed++;}}
  s.objects=s.objects.filter(o=>o.y>-65);if(s.missed>=s.missLimit)lose(s,'Five friendly balloons floated away. Ready to pop again?');s.avatar={x:740,y:440};
 }
 if(e==='dance'){s.avatar={x:400,y:200};if(s.danceShowing&&s.time>=s.danceAt+s.sequence.length*.9){s.danceShowing=false;s.danceInput=[];}}
 if(e==='snap'&&s.snapWait&&s.time>=s.snapWait){const a=s.objects[s.snapFirst],b=s.objects[s.snapSecond];if(a.identity===b.identity){a.matched=b.matched=true;points(s,20);}else a.open=b.open=false;s.snapFirst=s.snapSecond=null;s.snapWait=0;if(s.objects.every(o=>o.matched)){s.level++;points(s,100);snapBoard(s);say(s,'All matched! A bigger Spelloid grid!');}}
 return true;
}
