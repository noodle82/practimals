import test from'node:test';
import assert from'node:assert/strict';
import{createArcadeRound,arcadeAction,stepArcade}from'../arcade-state.js';
import{danceLight,flipperSegments,bounceSegment,jellyLevel,golfCourse,mineBoard,snapBoard,analysePlane,gestureShot,pinballTable}from'../arcade-upgrades.js';
const seeded=()=>{let n=918;return()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);};
const game=engine=>{const s=createArcadeRound(engine,{random:seeded(),words:['cloud','kind']});s.started=true;return s;};
const advance=(s,seconds,input={x:400,y:350})=>{for(let i=0;i<seconds*240&&!s.finished;i++)stepArcade(s,1/240,input);};
test('resting pinball flippers are solid and active flippers launch the ball upwards',()=>{
 const s=game('pinball'),[left]=flipperSegments(s,{}),b={x:300,y:415,vx:0,vy:180};assert.ok(bounceSegment(b,left.a,left.b,22));assert.ok(b.vy<0);
 const active=flipperSegments(s,{left:true})[0],hot={x:300,y:380,vx:0,vy:200};assert.ok(bounceSegment(hot,active.a,active.b,22,460));assert.ok(hot.vy<=-460);
});
test('pinball side and central drains each consume a ball and never bounce below the levers',()=>{const s=game('pinball');s.ball={x:620,y:459,vx:0,vy:200};advance(s,.05);assert.equal(s.finished,false);assert.equal(s.lives,2);assert.equal(s.ballPhase,'waiting');assert.equal(s.ball.hidden,true);advance(s,.9);assert.equal(s.ballPhase,'playing');s.ball={x:400,y:459,vx:0,vy:200};advance(s,.05);assert.equal(s.lives,1);});
test('lighting pinball bumpers unlocks a genuinely different table',()=>{const s=game('pinball'),old=s.objects.map(o=>[o.x,o.y]);s.objects.forEach(o=>o.lit=true);stepArcade(s,.01);assert.equal(s.level,2);assert.notDeepEqual(s.objects.map(o=>[o.x,o.y]),old);});
test('Moon Buggy has exactly two air jumps and landing restores both',()=>{
 const s=game('buggy');arcadeAction(s);advance(s,.2);assert.equal(s.player.jumps,1);arcadeAction(s);assert.equal(s.player.jumps,2);const vy=s.player.vy;arcadeAction(s);assert.equal(s.player.vy,vy);s.objects=[];s.spawn=100;advance(s,2);assert.equal(s.player.jumps,0);
});
test('the visible crater can be cleared by jumping before the buggy is over it',()=>{
 const s=game('buggy');s.objects=[{x:260,w:76,passed:false}];s.spawn=100;arcadeAction(s);advance(s,1.05);assert.equal(s.finished,false);assert.ok(s.score>=10);
});
test('Moon Buggy pace increases gradually but its speed and crater width remain capped',()=>{const early=game('buggy'),late=game('buggy');late.time=160;for(const s of[early,late]){s.spawn=0;s.player.y=200;s.player.vy=-100;stepArcade(s,.01);}assert.ok(late.camera>early.camera);assert.ok(late.objects[0].w<=112);});
test('a down-only Dash gesture ducks without jumping; a separate tap still jumps',()=>{
 const s=game('dash');arcadeAction(s,{direction:'down'});assert.equal(s.player.vy,0);stepArcade(s,.01,{down:true});assert.equal(s.ducking,true);arcadeAction(s);assert.ok(s.player.vy<0);
});
test('Jelly Bounce advances to new layouts and later blocks need two hits',()=>{
 const s=game('jelly'),first=s.objects.map(o=>[o.x,o.y]);s.objects.forEach(o=>o.alive=false);stepArcade(s,.01,{x:400});assert.equal(s.level,2);assert.notDeepEqual(s.objects.map(o=>[o.x,o.y]),first);s.level=4;jellyLevel(s);assert.ok(s.objects.some(o=>o.hp===2));
});
test('Jelly paddle collision cannot be skipped by a fast ball',()=>{const s=game('jelly');s.objects=[];s.ball={x:400,y:405,vx:0,vy:600};stepArcade(s,.035,{x:400});assert.ok(s.ball.vy<0);assert.equal(s.finished,false);});
test('a repeated dance direction has two separate flashes with a dark gap',()=>{
 const s=game('dance');s.sequence=[2,2];s.danceAt=0;s.danceShowing=true;s.time=.2;assert.equal(danceLight(s),2);s.time=.72;assert.equal(danceLight(s),-1);s.time=1.1;assert.equal(danceLight(s),2);s.time=1.6;assert.equal(danceLight(s),-1);
});
test('Minesweeper first tap and its neighbours are safe, numbering is truthful, and flags block digging',()=>{
 const s=game('treasure'),o=s.objects[14];arcadeAction(s,{x:o.x+10,y:o.y+10});assert.equal(s.finished,false);assert.equal(s.objects[14].mine,false);assert.equal(s.objects[14].hint,0);assert.equal(s.objects.filter(o=>o.mine).length,s.mineCount);
 const i=s.objects.findIndex(o=>!o.open),tile=s.objects[i];arcadeAction(s,{x:tile.x+10,y:tile.y+10,flag:true});assert.ok(tile.flag);arcadeAction(s,{x:tile.x+10,y:tile.y+10});assert.equal(tile.open,false);
});
test('a marked danger can be unflagged; digging a grumble uses the only life',()=>{const s=game('treasure');s.minePlanted=true;const tile=s.objects[3];tile.mine=true;for(let i=0;i<2;i++)arcadeAction(s,{x:tile.x+5,y:tile.y+5,flag:true});assert.equal(tile.flag,false);arcadeAction(s,{x:tile.x+5,y:tile.y+5});assert.equal(s.finished,true);});
test('clearing safe mine squares advances to a fresh puzzle',()=>{const s=game('treasure');s.minePlanted=true;s.objects.forEach((o,i)=>{o.mine=i<3;o.open=i>=3;o.hint=1;});s.objects[4].open=false;const o=s.objects[4];arcadeAction(s,{x:o.x+5,y:o.y+5});assert.equal(s.level,2);assert.equal(s.minePlanted,false);});
test('Spelloid Snap offers paired identities and multiple grid sizes, retaining mismatch delay',()=>{
 const s=game('snap');assert.equal(s.objects.length,6);assert.ok(s.objects.every(o=>s.objects.filter(a=>a.identity===o.identity).length===2));
 const a=s.objects[0],b=s.objects.find(o=>o.identity!==a.identity);for(const o of[a,b])arcadeAction(s,{x:o.x+5,y:o.y+5});assert.ok(a.open&&b.open);advance(s,.9);assert.equal(a.open,false);assert.equal(b.open,false);
 arcadeAction(s,{x:600,y:470});assert.equal(s.objects.length,24);
});
test('matching every Spelloid grows the grid without awarding spelling progress',()=>{const s=game('snap');for(const identity of new Set(s.objects.map(o=>o.identity))){for(const o of s.objects.filter(o=>o.identity===identity))arcadeAction(s,{x:o.x+5,y:o.y+5});advance(s,.9);}assert.equal(s.level,2);assert.equal(s.objects.length,12);assert.ok(!('week'in s));});
test('swipe duration controls power while bend controls curl independently',()=>{
 const base={x:440,y:160,start:{x:400,y:435}},fast=gestureShot({...base,duration:160}),slow=gestureShot({...base,duration:900}),curve=gestureShot({...base,duration:160,bend:50});assert.ok(fast.power>slow.power);assert.ok(curve.spin>fast.spin);assert.equal(curve.power,fast.power);
});
test('football requires both a goal and the star to advance',()=>{
 const s=game('football');s.ball={x:600,y:119,vx:0,vy:-100,flying:true,trail:[]};stepArcade(s,.02);assert.equal(s.level,1);assert.ok(s.score>0);s.ball={x:s.starTarget.x,y:119,vx:0,vy:-100,flying:true,trail:[]};stepArcade(s,.02);assert.equal(s.level,2);
});
test('football later levels add defenders and a moving goalkeeper',()=>{
 const s=game('football');for(let i=0;i<3;i++){s.ball={x:s.starTarget.x,y:119,vx:0,vy:-100,flying:true,trail:[]};stepArcade(s,.02);}assert.equal(s.level,4);assert.ok(s.objects.length>0);const keeper=s.keeper;stepArcade(s,.1);assert.notEqual(s.keeper,keeper);
});
test('an accurate pocket bowling swipe can strike and change the formation',()=>{const s=game('bowling'),first=s.objects.map(o=>[o.x,o.y]);arcadeAction(s,{type:'release',start:{x:400,y:440},x:388,y:110,duration:180});advance(s,5);assert.equal(s.level,2);assert.notDeepEqual(s.objects.map(o=>[o.x,o.y]),first);assert.ok(s.score>=200);});
test('bowling curved swipes produce lateral acceleration',()=>{
 const s=game('bowling');arcadeAction(s,{type:'release',start:{x:400,y:440},x:400,y:110,duration:250,bend:40});const vx=s.ball.vx;stepArcade(s,.1);assert.ok(s.ball.vx>vx);
});
test('six golf courses differ and par remains necessary before advancing',()=>{
 const s=game('golf'),layouts=[];for(let level=1;level<=6;level++){s.level=level;golfCourse(s);layouts.push(JSON.stringify({goal:s.goal,walls:s.objects}));}assert.equal(new Set(layouts).size,6);
 s.level=1;golfCourse(s);s.shots=s.par+1;s.ball={...s.goal,vx:0,vy:0};stepArcade(s,.01);assert.equal(s.level,1);assert.equal(s.shots,0);s.shots=s.par;s.ball={...s.goal,vx:0,vy:0};stepArcade(s,.01);assert.equal(s.level,2);
});
test('every golf course has a clear route for the ball within its par allowance',()=>{
 for(let level=1;level<=6;level++){
  const s=game('golf');s.level=level;golfCourse(s);
  const free=p=>p.x>=38&&p.x<=762&&p.y>=38&&p.y<=462&&!s.objects.some(o=>p.x>o.x-12&&p.x<o.x+o.w+12&&p.y>o.y-12&&p.y<o.y+o.h+12);
  const nodes=[{...s.ball},{...s.goal},...[{x:38,y:38},{x:762,y:38},{x:38,y:462},{x:762,y:462},...s.objects.flatMap(o=>[{x:o.x-14,y:o.y-14},{x:o.x+o.w+14,y:o.y-14},{x:o.x-14,y:o.y+o.h+14},{x:o.x+o.w+14,y:o.y+o.h+14}])].filter(free)],queue=[[0,0]],seen=new Set([0]);let route=null;
  while(queue.length){const [i,shots]=queue.shift();if(i===1){route=shots;break;}for(let j=0;j<nodes.length;j++){if(seen.has(j))continue;const a=nodes[i],b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d>520)continue;const steps=Math.ceil(d/4);if(Array.from({length:steps+1},(_,n)=>({x:a.x+(b.x-a.x)*n/steps,y:a.y+(b.y-a.y)*n/steps})).every(free)){seen.add(j);queue.push([j,shots+1]);}}}
  assert.ok(route!==null&&route<=s.par,'Hole '+level+' route '+route+' exceeds par '+s.par);
 }
});
test('paper-plane design affects flight estimate, and the actual drawing flies through scenery',()=>{
 const s=game('plane');for(let i=0;i<30;i++)arcadeAction(s,{x:150+i*12,y:180+(i%3)*30,type:i?'move':'press'});const design=analysePlane(s.strokes);assert.ok(design&&design.quality>0);arcadeAction(s,{x:600,y:465});assert.equal(s.phase,'ready');arcadeAction(s,{type:'release',start:{x:180,y:300},x:500,y:120,duration:240});assert.equal(s.phase,'flight');advance(s,2);assert.ok(s.distance>30);assert.ok(s.camera>300);assert.equal(s.strokes.length,30);
 const wide=analysePlane(Array.from({length:20},(_,i)=>({x:i*10,y:i%2*50}))),tall=analysePlane(Array.from({length:20},(_,i)=>({x:i%2*50,y:i*10})));assert.ok(wide.slender>tall.slender);
});
test('drawn Spelloid keeps its strokes, animates and requests one hello sound',()=>{
 const s=game('splat');for(let i=0;i<20;i++)arcadeAction(s,{type:i?'move':'press',x:220+i*8,y:200+(i%2)*40});arcadeAction(s,{x:600,y:465});assert.equal(s.phase,'animate');assert.equal(s.helloEvent,1);assert.equal(s.strokes.length,20);advance(s,3);assert.equal(s.helloEvent,1);arcadeAction(s,{x:400,y:465});assert.equal(s.phase,'draw');assert.equal(s.strokes.length,0);
});
test('trouble balloons end a run; escaping trouble is harmless; five missed friendly balloons lose',()=>{
 const s=game('bubbles');s.objects=[{x:200,y:200,r:30,bad:true}];arcadeAction(s,{x:200,y:200});assert.equal(s.finished,true);
 const other=game('bubbles');other.spawn=100;other.objects=[{x:200,y:-31,r:30,vy:-80,bad:true}];stepArcade(other,.01);assert.equal(other.missed,0);other.objects=Array.from({length:5},(_,i)=>({x:100+i*100,y:-31,r:30,vy:-80,bad:false}));stepArcade(other,.01);assert.equal(other.missed,5);assert.equal(other.finished,true);
});
