export const DEN_GAMES=[
 ['rocket','Word Rocket','Fly through space, dodge asteroids and catch stars.','🚀','#344b78','Drag up and down or use ↑ ↓. Words are bonus cargo.'],
 ['bounce','Cloud Hopper','Bounce up through a sky full of fluffy platforms.','☁','#99cbd4','Drag left and right or use ← →. Bouncing starts for you.'],
 ['wordsearch','Word Nest','Settle into a cosy wordsearch with this week’s words.','⌕','#b8abd6','Join the first and last letter of a hidden word.'],
 ['pairs','Memory Mates','Turn over cards and discover matching word pairs.','▧','#a4cbbd','Turn over two cards. Remember their hiding places.'],
 ['snack','Snack Catcher','Catch falling treats and dodge the silly socks.','🍓','#a9cfc1','Drag your basket left and right. Avoid the socks!'],
 ['bubbles','Bubble Trouble','Pop bright bubbles and build a sparkling combo.','◌','#a6c7e2','Tap the bubbles before they float away.'],
 ['dash','Spelloid Dash','Jump logs and duck under branches on a woodland run.','🌿','#9ec3ae','Tap to jump. Swipe down or press ↓ to duck.'],
 ['bowling','Cosmic Bowling','Aim a glowing ball at wobbly alien skittles.','🎳','#aaa0ce','Drag to aim, then release to bowl. Clear the skittles.'],
 ['pinball','Den Pinball','Keep a star ball bouncing around a glowing pinball den.','✦','#8f96c4','Tap left or right to flip. One ball—how far can you go?'],
 ['buggy','Moon Buggy','Drive over rolling moon hills and jump the craters.','🛞','#b8adcc','Tap to hop over craters. The buggy drives itself.'],
 ['jelly','Jelly Bounce','Bounce a ball off a jelly trampoline to break colourful blocks.','▦','#b9b3dd','Drag the jelly paddle. Keep your one ball bouncing.'],
 ['fishing','Star Fishing','Cast a little line and catch peculiar space fish.','🐟','#8dbbc9','Tap to drop the hook. Catch a fish as it swims past.'],
 ['maze','Marble Maze','Roll your Spelloid’s bubble through a twisting maze.','◎','#b5cfbd','Drag to steer through the passages and find the star.'],
 ['plane','Paper Plane Parade','Swoop through hoops and catch gentle breezes.','✈','#a6c9d5','Drag up and down. Fly through the hoops and avoid clouds.'],
 ['dance','Disco Den','Watch the steps, then help your Spelloid copy the dance.','♫','#c5a6d4','Watch the glowing directions, then tap them in order.'],
 ['slide','Splash Slide','Steer down a winding slide and make enormous splashes.','💧','#83c6cf','Drag left and right. Stay in the water and dodge the ducks.'],
 ['treasure','Treasure Tunnels','Dig up gems, fossils and funny buried surprises.','💎','#d1b49d','Tap a square to dig. Follow the little hints to buried treasure.'],
 ['football','Goal Getter','Place your shots past a playful alien goalkeeper.','⚽','#9fc7a4','Drag to aim at the goal, then release to shoot.'],
 ['golf','Mini Monster Golf','Putt around tiny courses full of ramps and obstacles.','⛳','#9bcab5','Pull back from the ball and release to putt.'],
 ['splat','Splat Studio','Make playful splat pictures with your Spelloid.','🎨','#d3b0c7','Pick a colour. Splat the glowing targets, then paint freely.'],
 ['gravity','Gravity Glider','Tap to keep your spaceship aloft through a changing space maze.','🛸','#46577f','Tap for a boost. Gravity pulls you down. One life—mind the walls!']
].map(([id,name,description,icon,colour,instructions],index)=>({id,engine:id,name,description,icon,colour,instructions,order:index,edition:1}));
export const DEN_LIMIT=DEN_GAMES.length;
export function completedDenModules(p){return ['study','listen','build','letters','gap','meaning'].filter(m=>p.words?.length&&p.words.every(w=>p.week?.progress[w.word]?.passed?.includes(m)));}
export function migrateDenCollection(p){
 if(p.denCollectionVersion===2)return false;
 const old=p.denLibrary||[],owned=[];
 for(const item of old){const match=DEN_GAMES.find(g=>g.id===item.id)||DEN_GAMES.find(g=>g.engine===item.engine);if(match&&!owned.some(g=>g.id===match.id))owned.push({...match,unlockedWeek:item.unlockedWeek||null});}
 // Preserve the size of older collections, replacing retired Bingo/remixes with distinct games.
 const target=Math.min(DEN_LIMIT,Math.max(1,old.length));
 for(const game of DEN_GAMES)if(owned.length<target&&!owned.some(g=>g.id===game.id))owned.push({...game});
 p.denLibrary=owned.sort((a,b)=>a.order-b.order);p.denRewardWeeks??=[];p.denCollectionVersion=2;return true;
}
export function awardDenGame(p){
 let changed=migrateDenCollection(p);if(!p.week||completedDenModules(p).length<3||p.denRewardWeeks.includes(p.week.id))return changed;
 p.denRewardWeeks.push(p.week.id);p.week.denGameAwarded=true;
 const next=DEN_GAMES.find(g=>!p.denLibrary.some(owned=>owned.id===g.id));
 if(next){p.denLibrary.push({...next,unlockedWeek:p.week.id});p.week.denNewGame=next.id;}
 return true;
}
export function denCollectionCards(p){
 const ids=new Set((p.denLibrary||[]).map(g=>g.id)),open=completedDenModules(p).length>0;
 return DEN_GAMES.map(game=>({...game,earned:ids.has(game.id),playable:open&&ids.has(game.id),starter:game.id==='rocket'}));
}
export function nextDenGame(p){const owned=new Set((p.denLibrary||[]).map(g=>g.id));return DEN_GAMES.find(g=>!owned.has(g.id))||null;}
