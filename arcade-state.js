const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const length=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const ARCADE_ENGINES=['snack','bubbles','dash','bowling','pinball','buggy','jelly','fishing','maze','plane','dance','slide','treasure','football','golf','splat','gravity'];
export const GAME_COLOURS=['#ae95d3','#77bbaa','#e7b77e','#da9cb9','#8cadd9'];
export function makeMaze(cols,rows,random=Math.random){
 const cells=Array.from({length:cols*rows},()=>({visited:false,walls:[true,true,true,true]})),stack=[0];cells[0].visited=true;
 while(stack.length){const current=stack.at(-1),x=current%cols,y=Math.floor(current/cols),choices=[[0,-1,0,2],[1,0,1,3],[0,1,2,0],[-1,0,3,1]].filter(([dx,dy])=>x+dx>=0&&x+dx<cols&&y+dy>=0&&y+dy<rows&&!cells[(y+dy)*cols+x+dx].visited);if(!choices.length){stack.pop();continue;}const[dx,dy,side,other]=choices[Math.floor(random()*choices.length)],next=(y+dy)*cols+x+dx;cells[current].walls[side]=false;cells[next].walls[other]=false;cells[next].visited=true;stack.push(next);}
 const size=Math.min(700/cols,380/rows),ox=(800-cols*size)/2,oy=(500-rows*size)/2,walls=[];
 cells.forEach((c,i)=>{const x=ox+i%cols*size,y=oy+Math.floor(i/cols)*size;if(c.walls[0])walls.push({x,y,w:size,h:7});if(c.walls[3])walls.push({x,y,w:7,h:size});if(i%cols===cols-1&&c.walls[1])walls.push({x:x+size,y,w:7,h:size});if(i>=cols*(rows-1)&&c.walls[2])walls.push({x,y:y+size,w:size,h:7});});
 return{cells,cols,rows,size,ox,oy,walls,start:{x:ox+size/2,y:oy+size/2},goal:{x:ox+(cols-.5)*size,y:oy+(rows-.5)*size}};
}
function bricks(s){s.objects=Array.from({length:32},(_,i)=>({x:45+i%8*90,y:55+Math.floor(i/8)*31,w:81,h:24,colour:i%5,alive:true}));}
function pins(s){s.objects=Array.from({length:10},(_,i)=>{let row=0,n=i;while(n>row){n-=row+1;row++;}return{x:400+(n-row/2)*49,y:90+row*34,r:16,alive:true};});s.ball={x:400,y:430,vx:0,vy:0};}
function golf(s){s.ball={x:100,y:400,vx:0,vy:0};s.goal={x:640+s.random()*70,y:75+s.random()*100};s.objects=[{x:250+s.random()*70,y:180,w:45,h:180},{x:470,y:180+s.random()*90,w:130,h:35}];}
function treasure(s){s.objects=Array.from({length:30},(_,i)=>({x:100+i%6*100,y:55+Math.floor(i/6)*78,w:90,h:68,open:false,gem:false}));const picks=[...s.objects];for(let i=0;i<Math.min(12,5+s.level);i++)picks.splice(Math.floor(s.random()*picks.length),1)[0].gem=true;}
export function createArcadeRound(engine,{random=Math.random,words=[]}={}){
 if(!ARCADE_ENGINES.includes(engine))throw Error('Unknown arcade game');
 const s={engine,random,words:words.map(w=>typeof w==='string'?w:w.word),time:0,score:0,level:1,lives:1,started:false,finished:false,won:false,reason:'',objects:[],particles:[],spawn:0,camera:0,combo:0,player:{x:180,y:350,vy:0},ball:{x:400,y:340,vx:130,vy:-300},avatar:{x:100,y:410},palette:0,strokes:[],sequence:[],danceInput:[],danceShowing:false,danceAt:0,goal:{x:690,y:100},shots:0};
 if(engine==='jelly'){bricks(s);s.ball={x:400,y:350,vx:170,vy:-260};}
 if(engine==='bowling')pins(s);
 if(engine==='pinball')s.objects=[{x:220,y:150,r:38},{x:580,y:150,r:38},{x:400,y:240,r:44},{x:180,y:300,r:30},{x:620,y:300,r:30}];
 if(engine==='fishing'){s.objects=Array.from({length:7},(_,i)=>({x:60+random()*680,y:205+i*32,vx:(i%2?1:-1)*(35+random()*30),r:20,colour:i%5}));s.hook={x:400,y:100,vy:0,caught:null};}
 if(engine==='maze'){s.maze=makeMaze(8,5,random);s.player={...s.maze.start};}
 if(engine==='golf')golf(s);
 if(engine==='treasure')treasure(s);
 if(engine==='football')s.ball={x:400,y:425,vx:0,vy:0};
 if(engine==='splat')s.objects=Array.from({length:6},(_,i)=>({x:120+i%3*240,y:125+Math.floor(i/3)*200,r:47,colour:i%5,alive:true}));
 if(engine==='gravity'){s.player={x:180,y:250,vy:0};s.spawn=1.5;}
 if(engine==='dance'){s.sequence=[Math.floor(random()*4),Math.floor(random()*4)];s.danceShowing=true;}
 return s;
}
function finish(s,reason,won=false){if(s.finished)return;s.finished=true;s.reason=reason;s.won=won;if(!won)s.lives=0;}
function spark(s,x,y,colour=0){for(let i=0;i<9;i++)s.particles.push({x,y,vx:(s.random()-.5)*190,vy:-40-s.random()*120,life:.65,colour});}
function reward(s,n,x=400,y=240){s.score+=n;s.combo++;spark(s,x,y,s.combo%5);if(s.words.length&&s.score%20<n){s.word=s.words[Math.floor(s.random()*s.words.length)];s.wordUntil=s.time+2.4;}}
function contact(p,o,r=16){return p.x+r>o.x&&p.x-r<o.x+o.w&&p.y+r>o.y&&p.y-r<o.y+o.h;}
function dancePress(s,index){if(s.danceShowing)return;const expected=s.sequence[s.danceInput.length];if(index!==expected){finish(s,'A lovely dance! Ready to try that pattern again?');return;}s.danceInput.push(index);reward(s,5,160+index*160,365);if(s.danceInput.length===s.sequence.length){s.level++;s.sequence.push(Math.floor(s.random()*4));s.danceInput=[];s.danceShowing=true;s.danceAt=s.time+.7;}}
export function arcadeAction(s,{x=400,y=250,type='press',direction=null,dy=0}={}){
 if(s.finished)return;if(!s.started){s.started=true;s.danceAt=s.time+.5;if(s.engine==='dance')return;}
 const e=s.engine;
 if(type==='release'){
  if(e==='bowling'&&Math.abs(s.ball.vy)<1){s.shots++;s.ball.vx=clamp((x-s.ball.x)*2,-240,240);s.ball.vy=-420-s.level*12;}
  if(e==='football'&&!s.ball.vy){s.aim=clamp(x,100,700);s.ball.vx=(s.aim-s.ball.x)*1.2;s.ball.vy=-390;}
  if(e==='golf'&&Math.hypot(s.ball.vx,s.ball.vy)<14){s.shots++;s.ball.vx=clamp((s.ball.x-x)*3,-480,480);s.ball.vy=clamp((s.ball.y-y)*3,-480,480);}
  return;
 }
 if(type==='move'){if(e==='splat'&&s.freePaint&&s.strokes.length<650)s.strokes.push({x,y,colour:s.palette,r:8+s.random()*15});return;}
 if(e==='gravity')s.player.vy=-245;
 if(['dash','buggy'].includes(e)){if((direction==='down'||dy>25)&&e==='dash')s.duckUntil=s.time+.9;else if(s.player.y>=348)s.player.vy=-355;}
 if(e==='bubbles'){const item=s.objects.slice().reverse().find(o=>length({x,y},o)<o.r+22);if(item){s.objects.splice(s.objects.indexOf(item),1);s.combo=s.lastColour===item.colour?s.combo:0;s.lastColour=item.colour;reward(s,5+Math.min(10,s.combo),item.x,item.y);}}
 if(e==='fishing'&&s.hook.vy===0){s.hook.x=clamp(x,45,755);s.hook.vy=220+s.level*8;}
 if(e==='dance'){const index=direction!==null?['left','up','down','right'].indexOf(direction):clamp(Math.floor((x-70)/165),0,3);if(index>=0)dancePress(s,index);}
 if(e==='treasure'){const tile=s.objects.find(o=>!o.open&&contact({x,y},o,0));if(tile){tile.open=true;if(tile.gem)reward(s,20,tile.x+45,tile.y+34);tile.hint=s.objects.filter(o=>o.gem&&Math.abs(o.x-tile.x)<=100&&Math.abs(o.y-tile.y)<=78).length;if(s.objects.filter(o=>o.gem).every(o=>o.open)){s.level++;reward(s,50);treasure(s);}}}
 if(e==='splat'){if(y>448){s.palette=clamp(Math.floor((x-150)/100),0,4);return;}s.strokes.push({x,y,colour:s.palette,r:15+s.random()*18});const target=s.objects.find(o=>o.alive&&o.colour===s.palette&&length({x,y},o)<o.r+14);if(target){target.alive=false;reward(s,15,x,y);}if(s.objects.every(o=>!o.alive))s.freePaint=true;}
}
export function stepArcade(s,dt,input={x:400,y:350,active:false}){
 if(s.finished||!s.started)return;s.time+=dt;if(!['maze','dance','golf','treasure','splat','bowling'].includes(s.engine))s.level=Math.max(s.level,1+Math.floor(s.time/18));const d=1+Math.min(1.6,s.time/45+s.score/700),e=s.engine,p=s.player;const ix=clamp(input.x??400,10,790),iy=clamp(input.y??350,10,490);
 for(const a of s.particles){a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=220*dt;a.life-=dt;}s.particles=s.particles.filter(a=>a.life>0);
 if(s.time>=60&&!['maze','golf','treasure','dance','splat'].includes(e)){finish(s,'A brilliant little adventure. Play again for a fresh course!',true);return;}
 if(e==='snack'||e==='bubbles'){
  s.spawn-=dt;if(s.spawn<=0){s.spawn=(e==='snack'?.85:.65)/d;s.objects.push({x:45+s.random()*710,y:e==='snack'?-30:540,r:e==='snack'?22:34,vy:(e==='snack'?120:-60)*d,colour:Math.floor(s.random()*5),bad:e==='snack'&&s.time>4&&s.random()<.22});}
  if(e==='snack'){p.x+=(ix-p.x)*Math.min(1,dt*12);p.y=415;s.avatar={x:p.x,y:p.y-35};}
  for(const o of s.objects){o.y+=o.vy*dt;if(e==='bubbles')o.x+=Math.sin(s.time*2+o.colour)*dt*15;if(e==='snack'&&Math.abs(o.x-p.x)<48&&Math.abs(o.y-p.y)<24){o.caught=true;if(o.bad){finish(s,'Oops, a sock in the snack basket! Try another catch.');return;}reward(s,10,o.x,o.y);}}
  s.objects=s.objects.filter(o=>!o.caught&&o.y<550&&o.y>-70);
 }
 if(e==='dash'||e==='buggy'){
  s.camera+=(145+70*(d-1))*dt;p.vy+=850*dt;p.y+=p.vy*dt;if(p.y>350){p.y=350;p.vy=0;}s.avatar={x:170,y:p.y-12};s.ducking=e==='dash'&&s.duckUntil>s.time;s.spawn-=dt;
  if(s.spawn<=0){s.spawn=1.7+s.random()*.9;s.objects.push({x:870,y:350,bad:s.random()<.42,passed:false});}
  for(const o of s.objects){o.x-=(145+70*(d-1))*dt;if(o.x<130&&!o.passed){o.passed=true;reward(s,10,o.x,350);}if(Math.abs(o.x-170)<(e==='buggy'?36:26)){const hit=e==='buggy'?p.y>308:o.bad?!s.ducking&&p.y>285:p.y>300;if(hit){finish(s,e==='buggy'?'A moon-sized bump! Hop over the next crater.':'A woodland wobble! Ready for another dash?');return;}}}s.objects=s.objects.filter(o=>o.x>-70);
 }
 if(e==='gravity'||e==='plane'){
  if(e==='gravity'){p.vy+=500*dt;p.y+=p.vy*dt;}else p.y+=(iy-p.y)*Math.min(1,dt*5)+Math.sin(s.time*2)*dt*12;
  s.avatar={x:180,y:p.y};if(p.y<28||p.y>472){finish(s,'A little space bump. Tap to launch another flight!');return;}
  s.spawn-=dt;if(s.spawn<=0){s.spawn=2.1/d+.55;const gap=clamp(245-(d-1)*55,145,245),mid=145+s.random()*200;s.objects.push({x:870,y:mid,gap,passed:false,cloud:e==='plane'&&s.random()<.35});}
  for(const o of s.objects){o.x-=(135+(d-1)*60)*dt;if(e==='gravity'&&Math.abs(o.x-180)<47&&(p.y<o.y-o.gap/2+18||p.y>o.y+o.gap/2-18)){finish(s,'A little space bump. Have another go through the maze!');return;}if(e==='plane'&&o.cloud&&length({x:180,y:p.y},o)<55){finish(s,'A fluffy landing! Ready for another flight?');return;}if(o.x<150&&!o.passed){o.passed=true;if(e==='gravity'||!o.cloud&&Math.abs(p.y-o.y)<56)reward(s,10,180,p.y);}}s.objects=s.objects.filter(o=>o.x>-80);
 }
 if(e==='slide'){
  s.camera+=dt*(120+35*d);p.x+=(ix-p.x)*Math.min(1,dt*8);p.y=400;s.avatar={x:p.x,y:392};const centre=400+Math.sin(s.camera/210+400/170)*130,width=clamp(280-(d-1)*45,180,280);s.trackWidth=width;
  if(s.time>2&&Math.abs(p.x-centre)>width/2-16){finish(s,'Splash! That was a lovely slide. Shall we go again?');return;}s.spawn-=dt;if(s.spawn<=0){s.spawn=1.8/d;s.objects.push({x:400+Math.sin(s.camera/210)*130+(s.random()-.5)*100,y:-40,passed:false});}
  for(const o of s.objects){o.y+=(130+40*d)*dt;if(length(p,o)<34){finish(s,'Quack! A duck got in the way. Try another slide.');return;}if(o.y>440&&!o.passed){o.passed=true;reward(s,10,p.x,p.y);}}s.objects=s.objects.filter(o=>o.y<550);
 }
 if(e==='jelly'||e==='pinball'){
  const b=s.ball,left=e==='pinball'?112:16,right=e==='pinball'?688:784;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<left){b.x=left;b.vx=Math.abs(b.vx);}if(b.x>right){b.x=right;b.vx=-Math.abs(b.vx);}if(b.y<20){b.y=20;b.vy=Math.abs(b.vy);}if(b.y>530){finish(s,e==='jelly'?'Boing! Your ball had a brilliant bounce. Try again?':'What a star ball! Ready for another pinball run?');return;}
  if(e==='jelly'){
   s.paddle=clamp(ix,60,740);s.avatar={x:s.paddle,y:435};if(b.vy>0&&b.y>414&&b.y<437&&Math.abs(b.x-s.paddle)<65){b.y=414;b.vy=-280*d;b.vx=(b.x-s.paddle)*5;}
   for(const o of s.objects)if(o.alive&&contact(b,o,10)){o.alive=false;b.vy=-b.vy;reward(s,10,o.x+40,o.y);break;}if(s.objects.every(o=>!o.alive)){s.level++;bricks(s);}
  }else{
   b.vy+=235*dt;for(const o of s.objects){const dist=length(b,o);if(dist<o.r+12){const nx=(b.x-o.x)/(dist||1),ny=(b.y-o.y)/(dist||1);b.x=o.x+nx*(o.r+13);b.y=o.y+ny*(o.r+13);b.vx=nx*270*d;b.vy=ny*270*d;reward(s,10,o.x,o.y);}}
   const left=input.active&&ix<400||input.left,right=input.active&&ix>=400||input.right;s.flipperLeft=left;s.flipperRight=right;
   if(b.vy>0&&b.y>397&&b.y<436&&(left&&b.x>120&&b.x<400||right&&b.x>=400&&b.x<680)){b.vy=-440*d;b.vx=(400-b.x)*.8;reward(s,2,b.x,b.y);}s.avatar={x:65,y:425};
  }
 }
 if(e==='bowling'){
  const b=s.ball;b.x+=b.vx*dt;b.y+=b.vy*dt;for(const o of s.objects)if(o.alive&&length(b,o)<29){o.alive=false;reward(s,10,o.x,o.y);for(const near of s.objects)if(near.alive&&length(near,o)<63&&s.random()<.7){near.alive=false;reward(s,10,near.x,near.y);}}
  if(b.y<-30||b.x<-40||b.x>840){if(s.objects.every(o=>!o.alive)){s.level++;pins(s);}else s.ball={x:400,y:430,vx:0,vy:0};}s.avatar={x:105,y:420};
 }
 if(e==='fishing'){
  const h=s.hook;s.avatar={x:100,y:120};for(const o of s.objects){o.x+=o.vx*d*dt;if(o.x<25||o.x>775)o.vx=-o.vx;}
  if(h.vy){h.y+=h.vy*dt;if(h.y>465)h.vy=-280;if(!h.caught&&h.vy>0){const fish=s.objects.find(o=>length(h,o)<32);if(fish){h.caught=fish;h.vy=-240;}}
   if(h.caught){h.caught.x=h.x;h.caught.y=h.y+18;}if(h.y<100){if(h.caught){reward(s,15,h.x,100);h.caught.x=40+s.random()*720;h.caught.y=220+s.random()*230;h.caught=null;}h.y=100;h.vy=0;}}
 }
 if(e==='maze'){
  const old={...p},tx=input.active?ix:p.x+(input.left?-70:input.right?70:0),ty=input.active?iy:p.y+(input.up?-70:input.down?70:0),dist=Math.hypot(tx-p.x,ty-p.y),step=Math.min(dist,135*dt);
  if(dist>1){p.x+=(tx-p.x)/dist*step;if(s.maze.walls.some(w=>contact(p,w,10)))p.x=old.x;p.y+=(ty-p.y)/dist*step;if(s.maze.walls.some(w=>contact(p,w,10)))p.y=old.y;}
  s.avatar={x:p.x,y:p.y};if(length(p,s.maze.goal)<19){reward(s,100,p.x,p.y);s.level++;s.maze=makeMaze(Math.min(12,7+s.level),Math.min(7,4+s.level),s.random);s.player={...s.maze.start};}
 }
 if(e==='dance'){s.avatar={x:400,y:200};if(s.danceShowing&&s.time>s.danceAt+s.sequence.length*.8+.3){s.danceShowing=false;s.danceInput=[];}}
 if(e==='football'){
  const b=s.ball;s.keeper=400+Math.sin(s.time*(1.2+(d-1)*.8))*210;b.x+=b.vx*dt;b.y+=b.vy*dt;s.avatar={x:120,y:415};
  if(b.vy&&b.y<130){if(b.x<125||b.x>675||Math.abs(b.x-s.keeper)<56){finish(s,'A lovely shot! The keeper got that one. Try again?');return;}reward(s,50,b.x,125);s.ball={x:400,y:425,vx:0,vy:0};s.level++;}
 }
 if(e==='golf'){
  const b=s.ball,old={x:b.x,y:b.y};b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.exp(-dt*1.1);b.vy*=Math.exp(-dt*1.1);if(b.x<17||b.x>783){b.x=clamp(b.x,17,783);b.vx=-b.vx*.8;}if(b.y<17||b.y>483){b.y=clamp(b.y,17,483);b.vy=-b.vy*.8;}
  for(const o of s.objects)if(contact(b,o,11)){if(old.x+11<=o.x||old.x-11>=o.x+o.w){b.x=old.x;b.vx=-b.vx*.8;}else{b.y=old.y;b.vy=-b.vy*.8;}}
  if(length(b,s.goal)<20&&Math.hypot(b.vx,b.vy)<180){reward(s,100,b.x,b.y);s.level++;golf(s);}s.avatar={x:65,y:420};
 }
 if(['treasure','splat'].includes(e))s.avatar={x:745,y:430};
}
