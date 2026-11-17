export const DEN_GAMES=[
 ['rocket','Word Rocket','Fly through space, dodge asteroids and catch stars.','🚀','#344b78','Drag up and down or use ↑ ↓. Words are bonus cargo.'],
 ['bounce','Cloud Hopper','Bounce up through a sky full of fluffy platforms.','☁','#99cbd4','Drag left and right or use ← →. Bouncing starts for you.'],
 ['wordsearch','Word Nest','Settle into a cosy wordsearch with this week’s words.','⌕','#b8abd6','Join the first and last letter of a hidden word.'],
 ['pairs','Memory Mates','Turn over cards and discover matching word pairs.','▧','#a4cbbd','Turn over two cards. Remember their hiding places.'],
 ['snack','Snack Catcher','Catch falling treats and dodge the silly socks.','🍓','#a9cfc1','Drag your basket left and right. Avoid the socks!'],
 ['bubbles','Bubble Trouble','Pop friendly balloons, avoid trouble and stop them escaping.','◌','#a6c7e2','Pop the colourful balloons. Avoid dark × balloons. Five escapes end the game.'],
 ['dash','Spelloid Dash','Jump logs and duck under branches on a woodland run.','🌿','#9ec3ae','Tap to jump. Swipe down or press ↓ to duck.'],
 ['bowling','Cosmic Bowling','Aim a glowing ball at wobbly alien skittles.','🎳','#aaa0ce','Swipe up the lane. Speed sets power, direction sets aim, and bending your swipe adds curl. Follow the fading swipe trail.'],
 ['pinball','Den Pinball','Keep a star ball bouncing around a glowing pinball den.','✦','#8f96c4','Hold left or right to flip. Three balls per game. Light every target to reach the next table.'],
 ['buggy','Moon Buggy','Drive over rolling moon hills and jump the craters.','🛞','#b8adcc','Tap for a hop. Tap again in the air to clear the tall rocks marked 2 taps.'],
 ['jelly','Jelly Bounce','Bounce a ball off a jelly trampoline to break colourful blocks.','▦','#b9b3dd','Drag the paddle. Clear the blocks to discover new patterns and tougher jelly levels.'],
 ['fishing','Star Fishing','Cast a little line and catch peculiar space fish.','🐟','#8dbbc9','Tap to drop the hook. Catch a fish as it swims past.'],
 ['maze','Marble Maze','Roll your Spelloid’s bubble through a twisting maze.','◎','#b5cfbd','Drag to steer through the passages and find the star.'],
 ['plane','Paper Plane Parade','Draw a paper plane and send your design on a long scenic flight.','✈','#a6c9d5','Draw a plane with its nose pointing right. Press Ready to fly, then swipe up and right. Pointed noses glide further!'],
 ['dance','Disco Den','Watch the steps, then help your Spelloid copy the dance.','♫','#c5a6d4','Watch the glowing directions, then tap them in order.'],
 ['slide','Splash Slide','Steer down a winding slide and make enormous splashes.','💧','#83c6cf','Drag left and right. Stay in the water and dodge the ducks.'],
 ['treasure','Treasure Tunnels','Uncover safe treasure patches without waking the sleepy grumbles.','💎','#d1b49d','Dig safe squares. Numbers count nearby grumbles. Switch to Flag mode to mark them. Your first dig is safe.'],
 ['football','Goal Getter','Place your shots past a playful alien goalkeeper.','⚽','#9fc7a4','Swipe up from the ball. Speed adds power; a curved swipe adds curl. Score through the star to level up.'],
 ['golf','Mini Monster Golf','Putt around tiny courses full of ramps and obstacles.','⛳','#9bcab5','Pull back from the ball and release. Finish in par or better to reach a new course.'],
 ['splat','Spelloid Sketchbook','Draw a new alien friend, then bring it to life.','🎨','#d3b0c7','Draw your own Spelloid. Press Animate to see it walk, dance and say a cheeky hello.'],
 ['snap','Spelloid Snap','Find matching alien friends, from little grids to big challenges.','▧','#b7a1d1','Turn over two cards and find identical Spelloids. Choose a small, medium or big grid.'],
 ['gravity','Gravity Rider','Tap to keep your spaceship aloft through a changing space maze.','🛸','#46577f','Tap for a boost. Gravity pulls you down. One life—mind the walls!']
].map(([id,name,description,icon,colour,instructions],index)=>({id,engine:id,name,description,icon,colour,instructions,order:index,edition:1}));
export const DEN_LIMIT=DEN_GAMES.length;
export const DEN_STARTERS=['gravity','jelly'];
export function completedDenModules(p){return ['study','listen','build','letters','gap','meaning'].filter(m=>p.words?.length&&p.words.every(w=>p.week?.progress[w.word]?.passed?.includes(m)));}
export function childDenOrder(p){
 const ids=new Set(DEN_GAMES.map(g=>g.id));let seed=2166136261;for(const c of String(p.id||p.name||'Spelloid'))seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
 const random=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296),rest=DEN_GAMES.map(g=>g.id).filter(id=>!DEN_STARTERS.includes(id)&&id!=='golf');
 for(let i=rest.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[rest[i],rest[j]]=[rest[j],rest[i]];}
 const order=[...DEN_STARTERS,'golf'];for(const id of p.denGameOrder||[])if(ids.has(id)&&!order.includes(id))order.push(id);for(const id of rest)if(!order.includes(id))order.push(id);return order;
}
export function migrateDenCollection(p){
 if(p.denCollectionVersion===3&&p.denGameOrder?.length===DEN_LIMIT&&DEN_STARTERS.every(id=>p.denLibrary?.some(g=>g.id===id)))return false;
 const old=p.denLibrary||[],owned=[],order=childDenOrder(p);
 for(const item of old){const match=DEN_GAMES.find(g=>g.id===item.id)||DEN_GAMES.find(g=>g.engine===item.engine);if(match&&!owned.some(g=>g.id===match.id))owned.push({...match,unlockedWeek:item.unlockedWeek||null});}
 // No earned game is taken away; every child receives both new starter games.
 for(const id of DEN_STARTERS)if(!owned.some(g=>g.id===id))owned.push({...DEN_GAMES.find(g=>g.id===id)});
 const target=Math.min(DEN_LIMIT,Math.max(2,old.length));for(const id of order)if(owned.length<target&&!owned.some(g=>g.id===id))owned.push({...DEN_GAMES.find(g=>g.id===id)});
 p.denGameOrder=order;p.denLibrary=owned.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));p.denRewardWeeks??=[];p.denCollectionVersion=3;return true;
}
export function awardDenGame(p){
 const changed=migrateDenCollection(p);if(!p.week||completedDenModules(p).length<3||p.denRewardWeeks.includes(p.week.id))return changed;
 p.denRewardWeeks.push(p.week.id);p.week.denGameAwarded=true;const next=nextDenGame(p);
 if(next){p.denLibrary.push({...next,unlockedWeek:p.week.id});p.week.denNewGame=next.id;}return true;
}
export function denCollectionCards(p){
 const ids=new Set((p.denLibrary||[]).map(g=>g.id)),open=completedDenModules(p).length>0;
 return childDenOrder(p).map((id,order)=>{const game=DEN_GAMES.find(g=>g.id===id);return{...game,order,earned:ids.has(id),playable:open&&ids.has(id),starter:DEN_STARTERS.includes(id)};});
}
export function nextDenGame(p){const owned=new Set((p.denLibrary||[]).map(g=>g.id));const id=childDenOrder(p).find(id=>!owned.has(id));return DEN_GAMES.find(g=>g.id===id)||null;}
