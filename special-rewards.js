// One ten-keepsake reward per spelling set; earned finishes stay in the collection.
export const SPECIAL_SUITS=[
 {id:'rainbow',name:'Rainbow',description:'A bright sweep of every colour.',colour:'#b79ae5'},
 {id:'sparkly',name:'Stardust',description:'A lilac suit sprinkled with little sparkles.',colour:'#b49de0'},
 {id:'galaxy',name:'Galaxy',description:'Midnight blue, violet swirls and distant stars.',colour:'#6265b5'},
 {id:'aurora',name:'Aurora',description:'Glowing ribbons of mint, blue and pink.',colour:'#79c9c5'},
 {id:'sunset',name:'Sunset shimmer',description:'Warm peach, golden light and a soft shimmer.',colour:'#edaa8d'}
];
export function migrateSpecialRewards(p){if(p.specialRewardVersion===13)return;p.specialSuits??=[];if(p.unlockedBadgeLevel>=8||p.colour==='rainbow'||p.week?.design?.look?.colour==='rainbow'||p.portraits?.some(f=>f.adult?.colour==='rainbow')){if(!p.specialSuits.includes('rainbow'))p.specialSuits.push('rainbow');}p.specialRewardVersion=13;awardSpecialSuit(p);}
export function specialProgress(p){const target=SPECIAL_SUITS.find(s=>!(p.specialSuits||[]).includes(s.id)),entries=(p.scrapbook||[]).filter(e=>(!e.weekId||e.weekId===p.week?.id)&&['draw','sentence'].includes(e.method)),count=new Set(entries.map(e=>e.id)).size;return{target,count,required:10,earned:p.week?.specialSuitAward||null,complete:!!p.week?.specialSuitAward,allCollected:!target};}
export function awardSpecialSuit(p){if(!p.week||p.week.specialSuitAward)return null;const progress=specialProgress(p);if(!progress.target||progress.count<10)return null;p.specialSuits??=[];p.specialSuits.push(progress.target.id);p.week.specialSuitAward=progress.target.id;return progress.target;}
export function specialUnlocked(p,id){return(p.specialSuits||[]).includes(id);}
export function wearSpecialSuit(p,id){if(!specialUnlocked(p,id)||p.species==='blob')return false;if(p.week?.design&&!p.week.design.baseColour)p.week.design.baseColour=p.colour;p.colour=id;if(p.week?.design)p.week.design.look={...p.week.design.look,colour:id};return true;}
