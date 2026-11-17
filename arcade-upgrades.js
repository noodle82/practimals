// Den mechanics kept independent of the browser so collisions and progression can be checked.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const UPGRADED_GAMES=new Set(['pinball','buggy','jelly','plane','dance','treasure','football','golf','bubbles','dash','bowling','splat','snap']);
const say=(s,message)=>{s.message=message;s.messageUntil=s.time+3;};
const points=(s,n)=>{s.score+=n;};
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
export function bowlingProjection(p){const depth=clamp(p.y/1200,0,1),scale=.35+.65*depth;return{x:400+(p.x-400)*scale*1.6,y:65+depth*395,scale};}
export function bowlingRack(s){
 const layouts=[[[400,285],[380,245],[420,245],[360,205],[400,205],[440,205],[340,165],[380,165],[420,165],[460,165]],[[315,180],[400,180],[485,180],[345,225],[455,225],[375,270],[425,270],[345,315],[400,315],[455,315]],[[320,180],[360,180],[400,180],[440,180],[480,180],[340,235],[380,235],[420,235],[460,235],[400,290]],[[400,155],[355,195],[445,195],[310,235],[400,235],[490,235],[355,275],[445,275],[375,315],[425,315]]];
 s.objects=layouts[(s.level-1)%layouts.length].map(([x,y])=>({x,y,r:13,alive:true,vx:0,vy:0,angle:0}));s.rackShots=0;s.rollPhase='ready';s.ball={x:400,y:1120,vx:0,vy:0,spin:0,trail:[]};
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
 if(s.engine==='pinball'){pinballTable(s);s.lives=3;s.ballNumber=1;readyPinball(s);}
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
 const raw=strokes.filter(p=>!p.end);if(raw.length<8)return null;const pts=[];let previous=null,totalLength=0;for(const p of strokes){if(p.end){previous=null;continue;}if(previous&&!p.start)totalLength+=distance(p,previous);previous=p;}const spacing=Math.max(4,totalLength/12000);previous=null;
 for(const p of strokes){if(p.end){previous=null;continue;}if(previous&&!p.start){const n=Math.max(1,Math.ceil(distance(p,previous)/spacing));for(let i=1;i<=n;i++)pts.push({x:previous.x+(p.x-previous.x)*i/n,y:previous.y+(p.y-previous.y)*i/n});}else pts.push(p);previous=p;}
 const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),width=maxX-minX,height=maxY-minY;if(width<45||height<20)return null;
 const front=pts.filter(p=>p.x>=maxX-width*.08),frontSpan=Math.max(...front.map(p=>p.y))-Math.min(...front.map(p=>p.y)),sharpness=clamp(1-frontSpan/height,0,1),centreY=(minY+maxY)/2,top=pts.filter(p=>p.y<centreY).length/pts.length,balance=clamp(1-Math.abs(.5-top)*1.5,0,1),slender=clamp(1-Math.abs(width/height-2.7)/3.5,0,1),quality=clamp(.08+sharpness*.66+balance*.14+slender*.12,.1,1);
 return{minX,maxX,minY,maxY,width,height,balance,slender,sharpness,quality,nose:sharpness>.65?'Pointed nose':sharpness<.3?'Flat nose':'Rounded nose'};
}
function drawMark(s,a){
 if(a.x<65||a.x>735||a.y<80||a.y>392||s.strokes.length>=5500)return;
 const previous=s.strokes.at(-1);s.strokes.push({x:a.x,y:a.y,colour:s.palette,start:a.type==='press'||!previous||previous.end});s.ink++;
}
export function gestureShot(a,origin={x:400,y:435}){
 const start=a.start||origin,dx=a.x-start.x,dy=a.y-start.y,length=Math.hypot(dx,dy),ms=clamp(a.duration||400,90,1500);if(length<20)return null;
 let bend=a.bend||0;const trace=(a.path||[]).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));
 if(trace.length>2&&Math.abs(dy)>20){bend=0;for(const p of trace){const f=(p.y-start.y)/dy;if(f>.08&&f<.92){const n=p.x-(start.x+dx*f);if(Math.abs(n)>Math.abs(bend))bend=n;}}}
 const speed=length/(ms/1000),spin=Math.abs(bend)<.5?0:clamp(-bend/Math.max(20,length*.12),-1,1);return{dx,dy,speed,power:clamp((speed-100)/1100,.15,1),spin,bend,trace:[{...start},...trace,{x:a.x,y:a.y}]};
}
function showSwipe(s,a,shot){s.soundEvent=s.engine==='plane'?'launch':'thud';s.soundSerial=(s.soundSerial||0)+1;s.swipeTrace=shot.trace;s.swipeUntil=s.time+1.8;s.shotPower=shot.power;s.shotSpin=shot.spin;s.feedbackUntil=s.time+4;}
export function runnerObstacle(s,o){
 if(s.engine==='buggy'){if(o.kind==='rock'||o.kind==='tower')return{x:o.x-o.w/2,y:412-o.h,w:o.w,h:o.h};return{x:o.x-o.w/2,y:412,w:o.w,h:20};}
 return o.bad?{x:o.x-(o.w||88)/2,y:310,w:o.w||88,h:56}:{x:o.x-(o.w||50)/2,y:412-(o.h||36),w:o.w||50,h:o.h||36};
}
export function runnerBounds(s){const lift=350-s.player.y,bottom=412-lift,height=s.ducking?38:74;return{x:151,y:bottom-height,w:38,h:height,bottom,lift};}

export function actionUpgrade(s,a){
 const e=s.engine;if(!UPGRADED_GAMES.has(e))return false;
 const {x=400,y=250,type='press',direction=null}=a;
 if(['plane','splat'].includes(e)){
  if(type==='press'&&y>=437){
   if(x<355){s.palette=clamp(Math.floor((x-45)/60),0,4);return true;}
   if(x<475){s.strokes=[];s.ink=0;s.phase='draw';s.distance=0;s.player={x:180,y:270,vy:0};return true;}
   if(e==='plane'&&s.phase==='landed'){s.phase='ready';say(s,'Swipe up and right to throw again!');return true;}if(s.phase!=='draw')return true;
   if(e==='plane'){const shape=analysePlane(s.strokes);if(!shape){say(s,'Draw a bigger plane inside the paper first.');return true;}s.design=shape;s.phase='ready';say(s,shape.nose+' · swipe up and right to throw!');}
   else if(s.ink>8){s.phase='animate';s.animatedAt=s.time;s.helloEvent=(s.helloEvent||0)+1;s.score=50;say(s,'Eee-ooo! Your Spelloid is alive!');}
   return true;
  }
  if(s.phase==='draw'&&['press','move'].includes(type))drawMark(s,a);
  if(type==='release'){
   if(s.phase==='draw')s.strokes.push({end:true});
   if(e==='plane'&&s.phase==='ready'){const shot=gestureShot(a);if(shot&&shot.dx>35&&shot.dy<-15){showSwipe(s,a,shot);s.phase='flight';s.flightStart=s.time;s.launchPower=shot.power;s.flightWind=s.random()*2-1;s.flutterSeed=s.random()*7;s.maxFlight=clamp(1.9+s.design.quality*3.3+shot.power*.9+(s.random()-.5)*.5,2.2,6.5);s.player={x:190,y:270,vy:0};s.flightSpeed=(150+shot.power*210)*(.42+.85*s.design.quality);s.flightAngle=-.2;s.distance=0;say(s,'Whoosh!');}else if(a.type==='release'&&Math.hypot((a.x||0)-(a.start?.x||a.x||0),(a.y||0)-(a.start?.y||a.y||0))>20)say(s,'Swipe towards the arrow: up and right!');}
  }return true;
 }
 if(e==='pinball'){
  if(type==='cancel'){s.plungerPull=0;s.plungerHeld=false;return true;}
  if(s.ballPhase==='ready'){
   if(type==='press'&&(x>680||a.keyboard)){s.plungerHeld=true;s.plungerStart=y;s.plungerPull=a.keyboard?.55:0;}
   if(type==='move'&&s.plungerHeld)s.plungerPull=clamp((y-s.plungerStart)/85,0,1);
   if(type==='release'&&s.plungerHeld){s.plungerPull=clamp((y-s.plungerStart)/85,0,1);launchPinball(s);}
   if(a.keyboard&&type==='press')launchPinball(s);
  }else if(type==='press'&&x<680)s[x<400?'flipLeftUntil':'flipRightUntil']=s.time+.18;
  return true;
 }
 if(type==='move'||type==='cancel')return true;
 if(e==='dash'){
  // Touch jumps are dispatched on release, after the gesture is classified.
  if(direction==='down'){s.duckUntil=s.time+.85;return true;}
  if(type==='press'){if(s.player.y>=349){s.player.vy=-360;s.duckUntil=0;}else s.jumpQueuedUntil=s.time+.13;}return true;
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
  showSwipe(s,a,shot);const seconds=1.35-shot.power*.3;s.ball.vy=-320/seconds;s.ball.spin=shot.spin;const bow=clamp((shot.bend||0)*320/Math.max(80,-shot.dy),-95,95);s.ball.vx=clamp(shot.dx/Math.max(60,-shot.dy)*Math.abs(s.ball.vy)*.85+4*bow/seconds,-420,420);s.ball.curveAccel=-8*bow/(seconds*seconds);s.ball.flying=true;s.shotPower=shot.power;s.shots++;return true;
 }
 if(e==='bowling'&&type==='release'&&s.rollPhase==='ready'){
  let shot=gestureShot(a,{x:400,y:440});if(!shot&&a.keyboard)shot={dx:x-400,dy:-300,power:.7,spin:0};if(!shot||shot.dy>=-12){say(s,'Swipe up the lane. A curved swipe adds spin.');return true;}
  showSwipe(s,a,shot);s.ball.vy=-390-shot.power*500;s.ball.vx=clamp(shot.dx/Math.max(90,-shot.dy)*Math.abs(s.ball.vy)*.52,-320,320);s.ball.spin=shot.spin;const seconds=950/Math.abs(s.ball.vy),bow=clamp((shot.bend||0)*.65,-70,70);s.ball.vx+=4*bow/seconds;s.ball.curveAccel=-8*bow/(seconds*seconds);s.ball.trail=[];s.rollPhase='rolling';s.rollAt=s.time;s.rackShots++;s.shots++;return true;
 }
 return true;
}
export function danceLight(s){if(!s.danceShowing)return s.time<(s.danceFlashUntil||0)?s.danceFlash:-1;const at=s.time-s.danceAt,index=Math.floor(at/.9);return at>=0&&index<s.sequence.length&&at% .9<.55?s.sequence[index]:-1;}
export function flipperSegments(s,input={}){
 const l=!!(input.left||s.flipLeftUntil>s.time||input.active&&input.x<400),r=!!(input.right||s.flipRightUntil>s.time||input.active&&input.x>=400&&input.x<680);s.flipperLeft=l;s.flipperRight=r;
 return[{a:{x:220,y:412},b:{x:365,y:l?373:435},active:l},{a:{x:580,y:412},b:{x:435,y:r?373:435},active:r}];
}
export function bounceSegment(ball,a,b,r=20,kick=0){
 const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((ball.x-a.x)*dx+(ball.y-a.y)*dy)/(dx*dx+dy*dy),0,1),q={x:a.x+t*dx,y:a.y+t*dy},dist=distance(ball,q);if(dist>=r)return false;
 let nx=(ball.x-q.x)/(dist||1),ny=(ball.y-q.y)/(dist||1);if(!dist){nx=0;ny=-1;}const dot=ball.vx*nx+ball.vy*ny;ball.x=q.x+nx*(r+.4);ball.y=q.y+ny*(r+.4);if(dot<0){ball.vx-=1.82*dot*nx;ball.vy-=1.82*dot*ny;if(kick)ball.vy=Math.min(ball.vy,-kick);}return true;
}
export function readyPinball(s){s.ballPhase='ready';s.plungerHeld=false;s.plungerPull=0;s.ball={x:724,y:355,vx:0,vy:0};}
export function launchPinball(s){s.launchPower=s.plungerPull||0;s.plungerHeld=false;s.ballPhase='launching';s.launchProgress=0;s.ball={x:724,y:355,vx:0,vy:0};s.soundEvent='launch';s.soundSerial=(s.soundSerial||0)+1;}
function drainPinball(s){
 s.lives--;s.ballPhase='waiting';s.ball={x:620,y:385,vx:0,vy:0,hidden:true};if(s.lives<=0){lose(s,'Three balls played! Ready for another sparkling pinball game?');return;}s.ballNumber++;s.launchAt=s.time+.65;say(s,'Ball '+s.ballNumber+' of 3 · pull down the side launcher!');
}
function advancePinball(s,dt,input){
 if(s.ballPhase==='waiting'){if(s.time>=s.launchAt)readyPinball(s);return;}
 if(s.ballPhase==='ready'){s.ball.y=355+s.plungerPull*65;s.avatar={x:60,y:405};return;}
 if(s.ballPhase==='launching'){
  // A one-way launch lane carries every pull safely into the top of the table.
  s.launchProgress+=dt*(1.25+s.launchPower*.9);const u=Math.min(1,s.launchProgress);
  s.ball.x=u<.68?724:724-224*((u-.68)/.32)**2;
  s.ball.y=u<.68?355-300*u/.68:55+35*((u-.68)/.32);
  if(u===1){s.ballPhase='playing';s.ball={x:500,y:90,vx:-140-s.launchPower*150,vy:95+s.launchPower*85};}
  return;
 }
 const b=s.ball,flippers=flipperSegments(s,input),steps=Math.max(1,Math.ceil(dt/.006)),h=dt/steps;
 for(let k=0;k<steps;k++){
  b.vy+=270*h;b.x+=b.vx*h;b.y+=b.vy*h;
  // Once below the levers, the ball drains from any x; there is no hidden bouncing floor.
  if(b.y>460){drainPinball(s);return;}
  if(b.x<125){b.x=125;b.vx=Math.abs(b.vx)*.92;}if(b.x>675){b.x=675;b.vx=-Math.abs(b.vx)*.92;}if(b.y<50){b.y=50;b.vy=Math.abs(b.vy);}
  for(const o of s.objects){const d=distance(b,o);if(d<o.r+12){const nx=(b.x-o.x)/(d||1),ny=(b.y-o.y)/(d||1);b.x=o.x+nx*(o.r+13);b.y=o.y+ny*(o.r+13);const force=320+Math.min(130,s.level*16);b.vx=nx*force;b.vy=ny*force;points(s,o.lit?5:15);o.lit=true;s.bumperHits++;}}
  bounceSegment(b,{x:125,y:340},{x:205,y:402},20);bounceSegment(b,{x:675,y:340},{x:595,y:402},20);for(const f of flippers)bounceSegment(b,f.a,f.b,22,f.active?460:0);
  const speed=Math.hypot(b.vx,b.vy);if(speed>650){b.vx*=650/speed;b.vy*=650/speed;}
 }
 if(s.objects.every(o=>o.lit)){s.level++;points(s,100);pinballTable(s);say(s,'All targets lit! Table '+s.level+'!');}s.avatar={x:66,y:405};
}
function stepRunner(s,dt,input){
 const p=s.player,buggy=s.engine==='buggy',speed=(buggy?180:185)+Math.min(buggy?135:140,s.time*1.65),gravity=buggy?610:900;
 s.level=1+Math.floor(s.time/20);s.camera+=speed*dt;p.vy+=gravity*dt;p.y+=p.vy*dt;if(p.y>=350){p.y=350;p.vy=0;p.jumps=0;if(!buggy&&s.jumpQueuedUntil>s.time){p.vy=-360;s.jumpQueuedUntil=0;}}
 if(input.down&&!buggy)s.duckUntil=s.time+.18;s.ducking=!buggy&&s.duckUntil>s.time;s.avatar={x:170,y:p.y+(buggy?-8:30)};s.spawn-=dt;
 if(s.spawn<=0){s.spawn=buggy?2.35+s.random()*.65:Math.max(.96,1.95-s.time*.009)+s.random()*.28;const n=s.runnerSpawn=(s.runnerSpawn||0)+1,kind=buggy?(n%4===3?'tower':n%2===0?'rock':'crater'):'obstacle';s.objects.push({x:870,kind,w:buggy?(kind==='tower'?46:kind==='rock'?54:76+Math.min(36,s.level*4)):50,h:kind==='tower'?130+Math.min(8,s.level):48,bad:!buggy&&s.random()<.42,variant:!buggy?['cone','crate','barrier'][n%3]:null,passed:false});if(kind==='tower')say(s,'Tall moon rocks need two taps!');}
 const body=runnerBounds(s);s.runnerBox=body;
 for(const o of s.objects){o.x-=speed*dt;const box=runnerObstacle(s,o);let hit=false;
  if(buggy){const near=Math.abs(o.x-170)<(o.kind==='crater'||!o.kind?o.w/2-8:o.w/2+25);hit=near&&(o.kind==='rock'||o.kind==='tower'?body.lift<o.h-8:body.lift<23);}
  else{const near=body.x+body.w-8>box.x&&body.x+8<box.x+box.w;hit=near&&body.bottom>box.y+8&&body.y<box.y+box.h-8;}
  if(hit){lose(s,buggy?'Moon bump! One tap for a hop, two taps for tall rocks.':'A skating wobble! Hop over objects, or duck under the hanging signs.');return;}
  if(o.x+(o.w||50)/2<125&&!o.passed){o.passed=true;points(s,10);}
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
 const b=s.ball;s.avatar={x:90,y:423};if(s.rollPhase==='ready')return;
 const steps=Math.max(1,Math.ceil(dt/.004)),h=dt/steps;
 for(let n=0;n<steps;n++){
  if(s.rollPhase==='rolling'){
   const progress=clamp((1120-b.y)/1000,0,1);b.vx+=(b.curveAccel??(b.spin||0)*290*(.15+.85*progress*progress))*h;b.x+=b.vx*h;b.y+=b.vy*h;b.vx*=Math.exp(-h*.07);b.vy*=Math.exp(-h*.1);
   if(b.x<216||b.x>584){s.rollPhase='gutter';s.rollEnd=s.time+1.3;say(s,'Into the gutter. Try a straighter or gentler curl.');}
   if(b.y<70){s.rollPhase='settling';s.rollEnd=s.time+1.3;}
  }
  if(s.rollPhase==='gutter')b.y-=330*h;
  for(const pin of s.objects){pin.x+=pin.vx*h;pin.y+=pin.vy*h;pin.angle+=(pin.vx*.006+pin.vy*.001)*h;pin.vx*=Math.exp(-h*1.65);pin.vy*=Math.exp(-h*1.65);
   if(s.rollPhase==='rolling'){
    const d=distance(b,pin),reach=27;if(d<reach&&d>0){const nx=(pin.x-b.x)/d,ny=(pin.y-b.y)/d,relative=(pin.vx-b.vx)*nx+(pin.vy-b.vy)*ny;
     if(relative<0){const impulse=-(1+.55)*relative/(1/5+1);pin.vx+=impulse*nx;pin.vy+=impulse*ny;b.vx-=impulse*nx/5;b.vy-=impulse*ny/5;pin.x=b.x+nx*(reach+.2);pin.y=b.y+ny*(reach+.2);}
    }
   }
  }
  for(let i=0;i<s.objects.length;i++)for(let j=i+1;j<s.objects.length;j++){
   const a=s.objects[i],z=s.objects[j],d=distance(a,z);if(d>0&&d<26){const nx=(z.x-a.x)/d,ny=(z.y-a.y)/d,closing=(z.vx-a.vx)*nx+(z.vy-a.vy)*ny;if(closing<0){const impulse=-closing*.74;a.vx-=impulse*nx;a.vy-=impulse*ny;z.vx+=impulse*nx;z.vy+=impulse*ny;}const overlap=(26-d)/2+.01;a.x-=nx*overlap;a.y-=ny*overlap;z.x+=nx*overlap;z.y+=ny*overlap;}
  }
  for(const pin of s.objects)if(pin.alive&&Math.hypot(pin.vx,pin.vy)>125){pin.alive=false;points(s,10);}
 }
 b.trail??=[];if(s.rollPhase!=='ready'){b.trail.push({x:b.x,y:b.y});if(b.trail.length>32)b.trail.shift();}
 if(s.time-s.rollAt>5&&s.rollPhase==='rolling'){s.rollPhase='settling';s.rollEnd=s.time+.7;}
 if(s.rollPhase!=='rolling'&&s.time>=s.rollEnd){if(s.objects.every(o=>!o.alive)){const strike=s.rackShots===1;points(s,strike?100:30);s.level++;bowlingRack(s);say(s,strike?'STRIKE! Try a new pin formation!':'Lane cleared! A fresh formation.');}else{s.rollPhase='ready';s.ball={x:400,y:1120,vx:0,vy:0,spin:0,trail:[]};say(s,'Aim for the remaining pins. Curve your swipe to hook.');}}
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
 for(let i=0;i<steps;i++){const h=dt/steps,previousY=b.y;b.vx+=(b.curveAccel??(b.spin||0)*420)*h;b.x+=b.vx*h;b.y+=b.vy*h;
  if(s.objects.some(o=>overlaps(b,o,14))||previousY>=161&&b.y<161&&Math.abs(b.x-s.keeper)<43){footballLevel(s);say(s,'Saved! Try curling around the defender or keeper.');return;}
  if(b.y<118){const goal=b.x>130&&b.x<670;if(goal){points(s,20);if(Math.abs(b.x-s.starTarget.x)<s.starTarget.r+12){points(s,80);s.level++;footballLevel(s);say(s,'GOAL + STAR! Level '+s.level+'!');}else{footballLevel(s);say(s,'GOAL! Now aim for the star to unlock the next level.');}}else{footballLevel(s);say(s,'Just wide! Try a gentler swipe.');}return;}
 }
}
function stepCreative(s,dt){
 if(s.engine==='plane'&&s.phase==='flight'){
  const quality=s.design.quality,age=s.time-s.flightStart,u=clamp(age/s.maxFlight,0,1),lastY=s.player.y,flutter=(1-quality)*27+5;
  s.flightSpeed*=Math.exp(-dt*(.04+(1-quality)*.3));s.distance+=s.flightSpeed*dt/10;s.camera+=s.flightSpeed*dt;
  s.player.y=270-(70+quality*38)*Math.sin(u*Math.PI)+Math.pow(u,3)*185+Math.sin(age*(4+s.flutterSeed*.12)+s.flutterSeed)*flutter*Math.sin(u*Math.PI)+Math.sin(age*1.6)*s.flightWind*18;
  s.flightAngle=clamp(Math.atan2((s.player.y-lastY)/Math.max(dt,.001),s.flightSpeed)*.65,-.55,.9);s.score=Math.max(Math.floor(s.distance),s.bestFlight||0);
  if(age>=s.maxFlight||s.player.y>435){s.phase='landed';s.bestFlight=Math.max(Math.floor(s.distance),s.bestFlight||0);s.score=s.bestFlight;say(s,Math.round(s.distance)+' metres · '+s.design.nose.toLowerCase()+'! Try a new design or fly again.');}
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
  if(s.spawn<=0){s.spawn=Math.max(.38,.85-s.time*.004);s.objects.push({x:48+s.random()*704,y:535,r:29,vy:-speed*(.65+s.random()*.8),colour:Math.floor(s.random()*5),bad:s.time>4&&s.random()<.17});}
  for(const o of s.objects){o.y+=o.vy*dt;o.x=clamp(o.x+Math.sin(s.time*2+o.colour)*dt*12,30,770);if(o.y<-o.r&&!o.counted){o.counted=true;if(!o.bad)s.missed++;}}
  s.objects=s.objects.filter(o=>o.y>-65);if(s.missed>=s.missLimit)lose(s,'Five friendly balloons floated away. Ready to pop again?');s.avatar={x:740,y:440};
 }
 if(e==='dance'){s.avatar={x:400,y:200};if(s.danceShowing&&s.time>=s.danceAt+s.sequence.length*.9){s.danceShowing=false;s.danceInput=[];}}
 if(e==='snap'&&s.snapWait&&s.time>=s.snapWait){const a=s.objects[s.snapFirst],b=s.objects[s.snapSecond];if(a.identity===b.identity){a.matched=b.matched=true;points(s,20);}else a.open=b.open=false;s.snapFirst=s.snapSecond=null;s.snapWait=0;if(s.objects.every(o=>o.matched)){s.level++;points(s,100);snapBoard(s);say(s,'All matched! A bigger Spelloid grid!');}}
 return true;
}
