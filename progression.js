export const SHOP=[
 {id:'explorer',name:'Woodland explorer',description:'A woodland jacket, neckerchief and hat for big little adventures.',price:{stars:30,fireflies:5,crystals:0}},
 {id:'cosy',name:'Cosy cloud companion',description:'A snug winter coat, knitted scarf and soft matching beanie.',price:{stars:20,fireflies:0,crystals:5}}
];
export const BABIES=[
 {id:'leaflet',name:'Leaflet',rarity:'Common',weight:35,cell:0,description:'A sleepy little leaf sprite who loves cosy pockets.'},
 {id:'pebble',name:'Peach Puff',rarity:'Common',weight:35,cell:1,description:'A tiny peach puff with a very big love of naps.'},
 {id:'petal',name:'Petal',rarity:'Common',weight:35,cell:2,description:'A little lilac bunny with ears bigger than its paws.'},
 {id:'ripple',name:'Ripple',rarity:'Rare',weight:12,cell:3,description:'A turquoise lagoon friend with frilly little gills.'},
 {id:'nova',name:'Nova',rarity:'Super rare',weight:3,cell:4,description:'A tiny midnight dragon with a star of its own.'},
 {id:'moonbeam',name:'Moonbeam',rarity:'Super rare',weight:3,cell:5,description:'A pearly moon kitten with rainbow-tipped fluff.'}
];
export function ensureProgress(p){
 p.wallet??={stars:Number(p.stars)||0,fireflies:0,crystals:0};
 p.ownedOutfits??=['school'];p.equippedOutfit??='school';p.babies??=[];p.testHistory??=[];p.babyOffers??=[];p.babyAwards??=[];
 p.assignment??={id:'first-list',mastered:[],babyClaimed:false,pendingBabies:[]};
 return p;
}
export function assignWords(p,words,{newWeek=false,id=globalThis.crypto?.randomUUID?.()||String(Date.now())}={}){
 ensureProgress(p);
 const changed=p.words.map(x=>x.word).join('\n')!==words.map(x=>x.word).join('\n');
 p.words=words;
 if(changed||newWeek){p.assignment={id,mastered:[],babyClaimed:false,pendingBabies:[]};p.spellingCursor=0;}
 return changed||newWeek;
}
export function recordMastery(p,word){ensureProgress(p);if(!p.words.some(x=>x.word===word))return;p.assignment.mastered=[...new Set([...p.assignment.mastered,word])];p.assignment.review=(p.assignment.review||[]).filter(x=>x!==word);}
export function isTestReady(p){ensureProgress(p);return p.words.length>0&&p.words.every(x=>p.assignment.mastered.includes(x.word));}
export function nextPracticeWords(p,count=3){ensureProgress(p);const review=p.words.filter(x=>(p.assignment.review||[]).includes(x.word));const missed=p.words.filter(x=>!p.assignment.mastered.includes(x.word)&&!review.some(r=>r.word===x.word));if(review.length||missed.length)return[...review,...missed].slice(0,count);const start=p.spellingCursor||0;return Array.from({length:Math.min(count,p.words.length)},(_,i)=>p.words[(start+i)%p.words.length]);}
export function rewardCurrencies(p,kind,earned,bonus){
 ensureProgress(p);if(!earned)return {stars:0,fireflies:0,crystals:0};
 const reward={stars:earned+bonus,fireflies:kind==='spelling'?5:0,crystals:kind==='creative'?5:0};
 for(const key of Object.keys(reward))p.wallet[key]+=reward[key];return reward;
}
export function buyOutfit(p,id){
 ensureProgress(p);const item=SHOP.find(x=>x.id===id);if(!item)return {ok:false,reason:'That outfit is not in the shop.'};
 if(p.ownedOutfits.includes(id)){p.equippedOutfit=id;return {ok:true,owned:true};}
 if(Object.entries(item.price).some(([key,cost])=>p.wallet[key]<cost))return {ok:false,reason:'Keep exploring to collect a few more treasures.'};
 for(const[key,cost]of Object.entries(item.price))p.wallet[key]-=cost;
 p.ownedOutfits.push(id);p.equippedOutfit=id;return {ok:true,owned:false};
}
export function babyChoices(p,random=Math.random){
 ensureProgress(p);const existing=p.babyOffers.find(x=>x.assignmentId===p.assignment.id);if(existing)return existing.ids;
 const pool=BABIES.filter(x=>!p.babies.some(b=>b.id===x.id)),chosen=[];
 while(pool.length&&chosen.length<3){const total=pool.reduce((sum,x)=>sum+x.weight,0);let roll=Math.min(.999999,Math.max(0,random()))*total;let index=pool.findIndex(x=>(roll-=x.weight)<0);if(index<0)index=pool.length-1;chosen.push(pool.splice(index,1)[0].id);}
 p.assignment.pendingBabies=chosen;if(chosen.length)p.babyOffers.push({assignmentId:p.assignment.id,ids:chosen});return chosen;
}
export function finishSpellingTest(p,answers,assignmentId,{random=Math.random,date=new Date().toISOString()}={}){
 ensureProgress(p);if(assignmentId!==p.assignment.id||!isTestReady(p))throw Error('The weekly list changed. Practise the current list before starting its test.');
 if(answers.length!==p.words.length||answers.some(x=>typeof x!=='string'||!x.trim()))throw Error('Answer every word before finishing the test.');
 const results=p.words.map((x,i)=>({word:x.word,answer:answers[i].trim(),correct:answers[i].trim().toLowerCase()===x.word}));
 const score=results.filter(x=>x.correct).length,perfect=score===results.length;
 const result={assignmentId,date,score,total:results.length,perfect,results};
 p.assignment.review=results.filter(x=>!x.correct).map(x=>x.word);
 p.testHistory.unshift(result);p.testHistory=p.testHistory.slice(0,20);
 if(perfect&&!p.babyAwards.includes(p.assignment.id))babyChoices(p,random);
 return result;
}
export function adoptBaby(p,id){
 ensureProgress(p);
 const offer=p.babyOffers.find(x=>x.ids.includes(id)&&!p.babyAwards.includes(x.assignmentId));
 if(!offer||p.babies.some(x=>x.id===id))return false;
 p.babies.push({id,assignmentId:offer.assignmentId,adoptedAt:new Date().toISOString()});p.babyAwards.push(offer.assignmentId);
 p.babyOffers=p.babyOffers.filter(x=>x!==offer);
 if(offer.assignmentId===p.assignment.id){p.assignment.babyClaimed=true;p.assignment.pendingBabies=[];}return true;
}
