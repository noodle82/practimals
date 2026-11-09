import { WORDS, localDay, cleanWords, practiceWords, makeQuestions, awardActivity, hasWord } from './learning.js';

import { adventureHome, worldArrival, storyProgress, WORLDS } from './worlds.js';
import { renderCreature } from './creature-v3.js';
import { bindPalInteractions, stopPalInteraction, setSound, soundEffect } from './pal-interaction.js';
import { femaleEnglishVoices, chooseCalmVoice, calmUtterance } from './voice.js';

import{ensureProgress,assignWords,recordMastery,isTestReady,nextPracticeWords,rewardCurrencies,buyOutfit,adoptBaby,finishSpellingTest}from'./progression.js';
import{wallet,spellingGate,sanctuary,testPage,nursery,shop}from'./reward-pages.js';
import{localWord,suggestWordList}from'./meanings.js';
import{paintCreatures}from'./creature-v3.js';

const $ = (selector) => document.querySelector(selector);
const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const palette = { mint:'#7bc9ab', lilac:'#ba9ae4', peach:'#f5ad86', blue:'#86bfe4' };
const uniforms = { forest:'#28775d', royal:'#3866b2', burgundy:'#9a425d', purple:'#7962a6' };
const freshProfile = (id,name,age)=>ensureProgress({id,name,age,palName:'Bumble',species:'sprout',colour:'mint',uniform:'forest',equippedOutfit:'school',stars:0,days:{},scrapbook:[],tables:age<=6?[2]:age<=8?[2,5,10]:[3,4,8],words:(age<=7?['cat','sun','dog','rain','ship','book','fish','tree','happy','jump']:Object.keys(WORDS)).map(localWord),support:age<=6?'tiles':'type',factorMode:false});
const freshState = () => ({ version:1,active:'one',profiles:[freshProfile('one','Explorer 1',7),freshProfile('two','Explorer 2',10)] });
let state;
let storageAvailable = true;
try { state = JSON.parse(localStorage.getItem('practimals-v1')) || freshState(); if(state.version !== 1 || !Array.isArray(state.profiles) || !state.profiles.length) state=freshState(); }
catch { state=freshState(); storageAvailable=false; }
state.profiles.forEach(ensureProgress);
let fullTest=null;
let palCleanup=null;
let view='home', game=null, parentUnlocked=false, parentError='', setupTab='words', wordDraft='', photoUrl='', drawingCleanup=null;
const profile=()=>state.profiles.find(p=>p.id===state.active)||state.profiles[0];
const save=()=> { try { localStorage.setItem('practimals-v1',JSON.stringify(state)); } catch { storageAvailable=false; toast('Your browser cannot save more. This session still works, but new changes may not survive closing it.'); } };
let toastTimer;
function toast(message) { $('#toast').textContent=message; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4500); }
function speak(text) {
 if(!('speechSynthesis' in window)){toast('Read-aloud is not available in this browser. Ask a grown-up to read the word.');return;}
 speechSynthesis.cancel();
 const utterance=calmUtterance(text,speechSynthesis.getVoices(),state.voiceURI,SpeechSynthesisUtterance);
 if(!utterance){toast('A female English voice is not available yet. Check the voice options in Grown-ups, or enable a female English voice in this device’s speech settings.');return;}
 utterance.onerror=e=>{if(!['interrupted','canceled'].includes(e.error))toast('The voice could not play. Check this device’s speech settings and try again.');};
 speechSynthesis.speak(utterance);
}
function voiceOptions(){const voices='speechSynthesis'in window?femaleEnglishVoices(speechSynthesis.getVoices()):[];const selected=chooseCalmVoice(voices,state.voiceURI);return voices.length?voices.map(v=>`<option value="${escape(v.voiceURI)}" ${v.voiceURI===selected?.voiceURI?'selected':''}>${escape(v.name)} · ${escape(v.lang)}</option>`).join(''):'<option value="">No female English voice found on this device</option>';}
function voiceSettings(){return `<fieldset class="voice-settings"><legend>A gentle voice for spelling</legend><p>Uses a female English voice at a relaxed pace. Preview it here to choose the one that feels right.</p><label class="field-label" for="voice-select">Female English voice</label><select id="voice-select">${voiceOptions()}</select><button class="secondary" id="preview-voice">♫ Preview the voice</button><p class="hint">Voices come from your device, so the exact sound varies. If none appear, enable or download a female English voice in the tablet’s speech settings, then reload. We won’t substitute a male voice.</p></fieldset>`;}
if('speechSynthesis'in window)speechSynthesis.addEventListener('voiceschanged',()=>{const select=$('#voice-select');if(select)select.innerHTML=voiceOptions();});
const icon = (name) => ({home:'⌂',pal:'✦',book:'▤',star:'★',sound:'♫',arrow:'↗',leaf:'❧'}[name]||name);

function creature(p=profile(), small=false) { return renderCreature(p,small,escape); }

function header() {
 return `<header class="topbar"><a class="brand" href="#" data-view="home" aria-label="Practimals home"><span class="brand-mark">p<span>✦</span></span>practimals<span class="prototype">PLAYABLE PROTOTYPE</span></a><nav aria-label="Main navigation">${[['home','My adventure','home'],['pal','My Practimal','pal'],['book','Scrapbook','scrapbook'],['◇','Nursery','nursery'],['✦','Shop','shop']].map(([i,label,target])=>`<button class="nav-item ${view===target?'active':''}" data-view="${target}"><span aria-hidden="true">${icon(i)}</span>${label}</button>`).join('')}</nav><div class="header-right"><button class="sound-toggle" id="sound-toggle" aria-label="${state.sound===false?'Enable':'Mute'} creature sounds" aria-pressed="${state.sound!==false}">${state.sound===false?'♫ Off':'♫ On'}</button>${wallet(profile())}<button class="parent-link" data-view="parents">Grown-ups <span aria-hidden="true">↗</span></button></div></header>`;
}
function render() {
 if(palCleanup){palCleanup();palCleanup=null;}
 stopPalInteraction();
 document.body.dataset.screen=view;
 document.body.dataset.world=game?.kind||'';
 if(drawingCleanup){drawingCleanup();drawingCleanup=null;}
 const page = view==='sanctuary'?sanctuary(profile(),creature,escape):view==='test'?testPage(fullTest,profile(),creature,escape):view==='nursery'?nursery(profile()):view==='shop'?shop(profile(),creature):view==='home'?home():view==='pal'?palPage():view==='parents'?parents():view==='scrapbook'?scrapbook():view==='world'?worldArrival(game.kind,creature):gamePage();
 const isScene=['spelling','tables','creative'].includes(view);
 $('#app').innerHTML=header()+`<main id="main">${isScene?`<div class="world-scene scene-${game.kind} ${game.finished?'scene-finished':''}"><div class="scene-art" aria-hidden="true"></div><div class="scene-content">${!game.finished?storyProgress(game):''}${page}</div></div>`:page}</main><footer><span>Little practice. Big adventures.</span><span>Made for curious minds, ages 5–10 <span aria-hidden="true">✦</span></span></footer>`;
 bindCommon();
 setSound(state.sound!==false);
 palCleanup=bindPalInteractions();
 paintCreatures();
 bindProgression();
 if(view==='creative') bindCreative();
 if(view==='parents'&&parentUnlocked) bindParents();
 if(view==='spelling'||view==='tables')bindGame();
}
function home() { return adventureHome(profile(),state.profiles,localDay(),creature,escape)+spellingGate(profile())+'<section class="home-reward-links"><button class="secondary" data-view="nursery">Visit my baby nursery →</button><button class="primary" data-view="shop">Spend my treasures in the outfitters →</button></section>'; }

function activityCard(key,symbol,title,description,sub,colour,done) {
 return `<button class="activity-card ${colour}" data-start="${key}"><div class="activity-art ${key}" aria-hidden="true"><span class="art-cloud"></span><span class="art-symbol">${symbol}</span><span class="art-dot">${key==='spelling'?'a':key==='tables'?'12':'✦'}</span><span class="art-leaf">${key==='creative'?'〰':'❧'}</span></div><div class="activity-body"><div class="activity-title"><h3>${title}</h3><span class="round-arrow">${done?'✓':'↗'}</span></div><p>${description}</p><span class="activity-meta">${done?'Today’s stars collected · Play again':sub}</span></div></button>`;
}
function palPage() {
 const p=profile();
 return `<div class="page-heading"><p class="eyebrow">A LITTLE YOU. A LITTLE MAGIC.</p><h1>Make your Practimal yours.</h1><p class="muted">Your creature. Your colours. Your very own adventure.</p></div><div class="customiser"><section class="pal-stage"><div class="speech-bubble">Hello! I’m ${escape(p.palName)}.</div>${creature()}<span class="pal-platform"></span><div class="pal-caption">${escape(p.palName)} & ${escape(p.name)}<small>THE BEST KIND OF TEAM</small></div><div class="pal-play-buttons"><button data-pal-action="oof">Say hello</button><button data-pal-action="giggle">Tickle</button><button data-pal-action="purr">Cuddle</button></div><p class="pal-touch-guide">Tap · Double-tap · Hold for a purr</p></section><section class="custom-controls"><label class="field-label" for="pal-name">What’s your pal’s name?</label><div class="inline-field"><input id="pal-name" maxlength="24" value="${escape(p.palName)}"><button class="secondary" id="save-name">Save name</button></div><p class="hint">Need an idea? Try Bimble, Ziggy, Moss or Waffle.</p><fieldset><legend>Choose your creature</legend><div class="choice-row">${[['sprout','Sprout','❧'],['bunny','Bunny','♧'],['dragon','Dragon','✧']].map(([value,label,symbol])=>`<button class="choice ${p.species===value?'selected':''}" data-custom="species" data-value="${value}" aria-pressed="${p.species===value}"><span>${symbol}</span>${label}</button>`).join('')}</div></fieldset>${colourPicker('A splash of colour','colour',palette,p.colour)}${colourPicker('Wear your school colours','uniform',uniforms,p.uniform)}<fieldset><legend>Your wardrobe</legend><div class="choice-row">${p.ownedOutfits.map(id=>`<button class="choice ${p.equippedOutfit===id?'selected':''}" data-equip="${id}">${{school:'School uniform',explorer:'Explorer outfit',cosy:'Cosy scarf & coat'}[id]}</button>`).join('')}</div></fieldset><button class="primary" data-view="shop">Visit the outfitters →</button><p class="notice">Your school uniform is always free. Wear your school colours or choose an adventure outfit from the shop.</p></section></div>`;
}
function colourPicker(title,key,values,current) { return `<fieldset><legend>${title}</legend><div class="swatches">${Object.entries(values).map(([name,hex])=>`<button class="swatch ${current===name?'selected':''}" style="--swatch:${hex}" data-custom="${key}" data-value="${name}" aria-label="${name}" aria-pressed="${current===name}">${current===name?'✓':''}</button>`).join('')}</div></fieldset>`; }

function travel(kind) {
 if(!WORLDS[kind])return;
 soundEffect('travel');
 view='world';game={kind};render();scrollTo({top:0,behavior:'smooth'});
}
function begin(kind) {
 if('speechSynthesis' in window)speechSynthesis.cancel();
 if(kind==='creative') { game={kind,word:profile().words[0]}; }
 else if(kind==='spelling') {game={kind,items:nextPracticeWords(profile()),index:0,attempts:0,answered:false,feedback:'',letters:[],built:[]};}
 else {game={kind,items:makeQuestions(profile().tables,5),index:0,attempts:0,answered:false,feedback:''};}
 if(kind!=='creative'&&!game.items.length){toast(kind==='tables'?'Ask a grown-up to choose at least one table.':'Ask a grown-up to add some words.');return;}
 if(kind==='creative'&&!game.word){toast('Add a word in Grown-ups first.');return;}
 view=kind;render();scrollTo({top:0,behavior:'smooth'});
}
function gamePage() {
 if(!game)return '';
 if(game.finished)return finishPage();
 if(game.kind==='creative')return creativePage();
 const item=game.items[game.index], spelling=game.kind==='spelling', title=WORLDS[game.kind].name;
 if(spelling&&!game.letters.length) {game.letters=item.word.split('').map((letter,id)=>({letter,id}));game.letters.sort(()=>Math.random()-.5);}
 const tiles=spelling&&(profile().support==='tiles'||game.useTiles);
 return `<div class="game-top"><button class="text-button" data-view="home">← My adventure</button><span>${title} · ${game.index+1} of ${game.items.length}</span><span class="star-pill">★ A try is worth celebrating</span></div><div class="game-progress"><span style="width:${game.index/game.items.length*100}%"></span></div><section class="game-shell"><aside class="game-pal">${creature()}<div class="speech-bubble">${game.answered?'Look what you figured out!':'Take your time. We’re a team.'}</div></aside><div class="game-content"><span class="tag">${spelling?'LISTEN · THINK · SPELL':'LOOK · GROUP · MULTIPLY'}</span><h1>${spelling?'What’s the word?':'Let’s work it out.'}</h1>${spelling?`<p class="word-definition">${escape(item.meaning||'Ask a grown-up to read the word, then have a go at spelling it.')}</p><button class="listen-button" id="hear-word">♫ Hear the word</button>${game.showExample?`<p class="example">${escape(item.sentence||'No example has been added yet.')}</p>`:''}<div class="answer-area">${game.answered?`<div class="revealed-word">${escape(item.word)}</div>`:tiles?`<div class="letter-slots" aria-label="Your spelling">${game.built.map(id=>`<button data-remove-letter="${id}" aria-label="Remove ${escape(game.letters.find(x=>x.id===id).letter)}">${escape(game.letters.find(x=>x.id===id).letter)}</button>`).join('')}${Array.from({length:Math.max(0,item.word.length-game.built.length)},()=>'<span>·</span>').join('')}</div><div class="letter-bank">${game.letters.map(x=>`<button data-letter="${x.id}" ${game.built.includes(x.id)?'disabled':''}>${escape(x.letter)}</button>`).join('')}</div>`:`<label class="field-label" for="answer">Spell the word here</label><input id="answer" class="big-answer" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Have a go…" aria-describedby="game-feedback">`}</div>`:`${mathVisual(item)}<div class="math-question">${game.missing?`${item.a} × ? = ${item.answer}`:`${item.a} × ${item.b} = ?`}</div><p class="muted">${game.missing?`How many in each of the ${item.a} equal groups?`:`${item.a} equal groups of ${item.b}. How many altogether?`}</p>${game.answered?`<div class="revealed-word">${item.a} × ${item.b} = ${item.answer}</div>`:`<label class="sr-only" for="answer">Your answer</label><input class="big-answer number-answer" id="answer" inputmode="numeric" autocomplete="off" placeholder="?" aria-describedby="game-feedback">`}`}
 <p id="game-feedback" role="status" class="feedback ${game.answered?'success':''}">${escape(game.feedback||'Mistakes are welcome here. That’s how we learn.')}</p><div class="game-buttons">${game.answered?`<button class="primary" id="next-question">${game.index===game.items.length-1?'Finish adventure':'Next little challenge'} →</button>`:`<button class="primary" id="check-answer">Let’s check →</button><button class="text-button" id="get-hint">${spelling?'A little help, please':'Show me the groups'}</button>${game.attempts>=2?'<button class="text-button" id="show-answer">Show me, then we’ll try together</button>':''}`}</div></div></section>`;
}
function mathVisual(item) {
 if(!(game.showGroups||profile().age<=6))return `<div class="math-illustration" aria-hidden="true"><span>×</span><span>✦</span><span>+</span></div>`;
 return `<div class="groups" aria-label="${item.a} groups with ${item.b} dots in each">${Array.from({length:item.a},()=>`<div class="dot-group">${Array.from({length:item.b},()=>'<i></i>').join('')}</div>`).join('')}</div>`;
}
function bindGame() {
 if(game.finished)return;
 const item=game.items[game.index];
 if(game.kind==='tables'&&game.missing===undefined) {game.missing=profile().factorMode;render();return;}
 $('#hear-word')?.addEventListener('click',()=>speak(item.word));
 document.querySelectorAll('[data-letter]').forEach(b=>b.onclick=()=>{game.built.push(Number(b.dataset.letter));render();});
 document.querySelectorAll('[data-remove-letter]').forEach(b=>b.onclick=()=>{game.built=game.built.filter(x=>x!==Number(b.dataset.removeLetter));render();});
 $('#check-answer')?.addEventListener('click',checkAnswer);
 $('#answer')?.addEventListener('keydown',e=>{if(e.key==='Enter')checkAnswer();});
 $('#get-hint')?.addEventListener('click',()=>{ if(game.kind==='spelling'){game.useTiles=true;game.showExample=true;game.feedback=`It begins with “${item.word[0]}” and has ${item.word.length} letters. Let’s build it together.`;}else{game.showGroups=true;game.feedback=`Count each group of ${item.b}, or add ${item.b} a total of ${item.a} times.`;}render();});
 $('#show-answer')?.addEventListener('click',()=>{game.answered=true;game.feedback=game.kind==='spelling'?`Say the letters, then say the word: ${item.word.split('').join(' · ')}. We’ll meet this word again.`:`${item.a} groups of ${item.b} make ${item.answer}. Point to each group and count together.`;render();});
 $('#next-question')?.addEventListener('click',()=>{if(++game.index>=game.items.length)finish(game.kind);else{Object.assign(game,{attempts:0,answered:false,feedback:'',built:[],letters:[],useTiles:false,showExample:false,missing:undefined});render();}});
}
function checkAnswer() {
 if(game.answered)return;
 const item=game.items[game.index], spelling=game.kind==='spelling';
 const value=spelling&&(profile().support==='tiles'||game.useTiles)?game.built.map(id=>game.letters.find(x=>x.id===id).letter).join(''):($('#answer')?.value||'').trim().toLowerCase();
 if(!value){game.feedback='Have a go first, or ask for a little help.';$('#game-feedback').textContent=game.feedback;return;}
 game.attempts++;
 const correct=spelling?value===item.word:/^\d+$/.test(value)&&Number(value)===(game.missing?item.b:item.answer);
 game.answered=correct;
 if(correct){soundEffect('celebrate');if(spelling){recordMastery(profile(),item.word);save();}}
 game.feedback=correct?(spelling?`You’ve got it! ${item.sentence||'Say your word aloud. Can you think of a sentence?'}`:`Yes! ${item.a} groups of ${item.b} make ${item.answer}.`):(spelling?'A good try. Listen again and check each sound. You can ask for letter tiles.':'A good try. Let’s look at the equal groups and count together.');
 if(!spelling&&!correct)game.showGroups=true;
 render();
}
function finish(kind) {profile().discoveries=[...new Set([...(profile().discoveries||[]),kind])];soundEffect('celebrate');if(kind==='spelling')profile().spellingCursor=((profile().spellingCursor||0)+game.items.length)%profile().words.length;const result=awardActivity(profile(),kind);result.currencies=rewardCurrencies(profile(),kind,result.earned,result.bonus);save();game={...game,finished:true,result};render();}
function finishPage() {
 const {earned,bonus}=game.result, completed=profile().days[localDay()]||[], world=WORLDS[game.kind];
 const next=['spelling','tables','creative'].find(x=>!completed.includes(x));
 return `<section class="finish-card"><div class="confetti" aria-hidden="true">✦ <span>✧</span> ★ <span>✧</span> ✦</div><div class="finish-pal">${creature()}</div><div class="treasure-discovery"><span>${world.badge}</span><small>YOU DISCOVERED THE</small><strong>${world.item}</strong></div><p class="eyebrow">LOOK WHAT A LITTLE TRY CAN DO</p><h1>You brought a little magic.</h1><p>${world.completion}<br>${escape(profile().palName)} loved exploring with you.<br>${earned?'Every little effort adds up.':'You’ve already collected today’s stars for this adventure. You can still keep exploring!'}</p><div class="earned">${earned?`★ +${earned} stars${bonus?` <span>+${bonus} daily quest bonus!</span>`:''}`:'Another brilliant bit of practice ✓'}</div><div class="game-buttons">${next?`<button class="primary" data-travel="${next}">Next adventure →</button>`:'<button class="primary" data-view="pal">Visit my Practimal →</button>'}<button class="secondary" data-view="home">Back to my adventure</button></div>${game.kind==='spelling'?spellingGate(profile()):''}${game.result.currencies?.fireflies?'<p class="earned">✺ +5 fireflies for your shop wallet</p>':''}${game.result.currencies?.crystals?'<p class="earned">◇ +5 crystals for your shop wallet</p>':''}</section>`;
}
function creativePage() {
 const word=game.word;
 return `<div class="game-top"><button class="text-button" data-view="home">← My adventure</button><span>Imagine & Make</span><span class="star-pill">★ Your ideas matter</span></div><div class="page-heading"><p class="eyebrow">MAKE A WORD YOUR OWN</p><h1>What does “${escape(word.word)}” look like?</h1><p class="muted">${escape(word.meaning||'Ask a grown-up what this word means, then make something together.')}</p></div><section class="creative-layout"><div class="drawing-card"><div class="canvas-toolbar"><strong>Your imagination goes here</strong><div>${['#28775d','#7956ad','#ed8660','#377dc0','#303d37'].map((c,i)=>`<button class="pen ${i===0?'selected':''}" style="background:${c}" data-pen="${c}" aria-label="${['Green','Purple','Orange','Blue','Dark grey'][i]} pen"></button>`).join('')}<button class="text-button" id="clear-drawing">Clear</button></div></div><canvas id="drawing" width="900" height="560" aria-label="Draw your word here with a finger or mouse">Use the sentence box instead if drawing is unavailable.</canvas><span class="hint">Draw with your finger or a mouse. A sentence works too!</span></div><div class="sentence-card"><span class="creative-symbol">Aa + ✎</span><h2>Tell us about it.</h2><p>Can you use <strong>${escape(word.word)}</strong> in your own sentence?</p><label class="sr-only" for="sentence">Your sentence</label><textarea id="sentence" maxlength="300" rows="4" placeholder="My sentence…"></textarea><button class="text-button" id="sentence-starter">Help me get started</button><p class="feedback" id="creative-feedback" role="status">Draw a picture, write a sentence, or do both.</p><button class="primary" id="save-creation">Save to my scrapbook →</button><p class="hint">Your ideas stay on this device. A grown-up can help you talk about your sentence.</p></div></section>`;
}
function bindCreative() {
 if(game.finished)return;
 const canvas=$('#drawing'),ctx=canvas.getContext('2d');let pen='#28775d', drawing=false,hasDrawing=false;
 ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=7;
 const point=e=>{const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)/r.width*canvas.width,y:(e.clientY-r.top)/r.height*canvas.height};};
 canvas.onpointerdown=e=>{canvas.setPointerCapture(e.pointerId);drawing=true;hasDrawing=true;const p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+.1,p.y+.1);ctx.strokeStyle=pen;ctx.stroke();};
 canvas.onpointermove=e=>{if(!drawing)return;const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke();};
 canvas.onpointerup=canvas.onpointercancel=()=>{drawing=false;};
 document.querySelectorAll('[data-pen]').forEach(b=>b.onclick=()=>{pen=b.dataset.pen;document.querySelectorAll('[data-pen]').forEach(x=>x.classList.toggle('selected',x===b));});
 $('#clear-drawing').onclick=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);hasDrawing=false;};
 $('#sentence-starter').onclick=()=>{$('#sentence').value='I noticed ';$('#sentence').focus();toast(`Try describing something using “${game.word.word}”.`);};
 $('#save-creation').onclick=()=>{
  const sentence=$('#sentence').value.trim();
  if(!hasDrawing&&!sentence){$('#creative-feedback').textContent='Add a drawing or a sentence first. Your ideas are worth keeping!';return;}
  if(sentence&&!hasWord(sentence,game.word.word)){$('#creative-feedback').textContent=`Can you include “${game.word.word}” in your sentence? You can also leave the sentence empty and save your drawing.`;return;}
  profile().scrapbook.unshift({word:game.word.word,sentence,image:hasDrawing?canvas.toDataURL('image/webp',.7):null,date:localDay()});
  profile().scrapbook=profile().scrapbook.slice(0,12);finish('creative');
 };
 drawingCleanup=()=>{canvas.onpointerdown=canvas.onpointermove=canvas.onpointerup=canvas.onpointercancel=null;};
}
function scrapbook() {
 const entries=profile().scrapbook;
 return `<div class="page-heading"><p class="eyebrow">WORDS, PICTURES & LITTLE DISCOVERIES</p><h1>My growing scrapbook.</h1><p class="muted">A collection of things you’ve imagined and made. Keeps your latest 12 creations.</p></div>${entries.length?`<section class="scrapbook-grid">${entries.map(e=>`<article class="scrapbook-card">${e.image?`<img src="${e.image}" alt="Your drawing for ${escape(e.word)}">`:'<div class="scrapbook-letters" aria-hidden="true">Aa ✧</div>'}<span class="eyebrow">${escape(e.date)}</span><h2>${escape(e.word)}</h2><p>${escape(e.sentence||'A picture worth a thousand words.')}</p></article>`).join('')}</section>`:`<section class="empty-state"><span>✎</span><h2>Your ideas belong here.</h2><p>Draw a word or use it in a sentence to start your scrapbook.</p><button class="primary" data-start="creative">Let’s make something →</button></section>`}`;
}
function parents() {
 if(!parentUnlocked)return `<section class="parent-gate"><span class="eyebrow">A MOMENT FOR THE GROWN-UPS</span><h1>Set up this week’s adventures.</h1><p>This simple check keeps little fingers out of settings.<br>It isn’t a password or a secure parent lock.</p><label class="field-label" for="parent-answer">What is twelve plus seventeen?</label><input id="parent-answer" inputmode="numeric" placeholder="Your answer"><p class="feedback" role="status">${parentError}</p><button class="primary" id="unlock-parents">Open grown-up settings →</button></section>`;
 const p=profile();
 return `<div class="page-heading"><p class="eyebrow">A LITTLE PREPARATION. A WEEK OF ADVENTURES.</p><h1>Ready for this week?</h1><p class="muted">Set the homework. Let their Practimal bring the practice to life.</p></div><section class="parent-summary"><label class="field-label">Child profile<select id="parent-profile">${state.profiles.map(x=>`<option value="${x.id}" ${x.id===state.active?'selected':''}>${escape(x.name)}</option>`).join('')}</select></label><label class="field-label">Display name<input id="child-name" maxlength="24" value="${escape(p.name)}"></label><label class="field-label">Age<select id="child-age">${[5,6,7,8,9,10].map(n=>`<option ${p.age===n?'selected':''}>${n}</option>`).join('')}</select></label><button class="secondary" id="save-child">Save profile</button></section><div class="parent-tabs" role="tablist"><button role="tab" aria-selected="${setupTab==='words'}" class="${setupTab==='words'?'active':''}" data-setup="words">Weekly spellings</button><button role="tab" aria-selected="${setupTab==='tables'}" class="${setupTab==='tables'?'active':''}" data-setup="tables">Times tables</button><button role="tab" aria-selected="${setupTab==='progress'}" class="${setupTab==='progress'?'active':''}" data-setup="progress">Progress & notes</button></div><section class="parent-content">${setupTab==='words'?wordSetup():setupTab==='tables'?tableSetup():progressPage()}</section>`;
}
function wordSetup() {
 return `<div class="setup-columns"><div><h2>This week’s words</h2><p class="muted">Add 10 words for younger learners, or 15–20 for older children. Meanings are suggested automatically and can be edited.</p><label class="field-label" for="word-list">Spelling list</label><textarea id="word-list" rows="7" spellcheck="false">${escape(wordDraft||profile().words.map(x=>x.word).join('\n'))}</textarea><div class="game-buttons"><button class="primary" id="save-words">Save words & suggest meanings →</button><button class="secondary" id="new-week">Start a new week with this list</button></div><p class="hint">Common-word meanings work offline. Other words use a dictionary lookup; only the word is sent. Review suggestions for your child’s age and the intended meaning.</p><p class="feedback" role="status" id="word-feedback"></p><label class="field-label" for="support-mode">Spelling support</label><select id="support-mode"><option value="tiles" ${profile().support==='tiles'?'selected':''}>Build with letter tiles · helpful for younger children</option><option value="type" ${profile().support==='type'?'selected':''}>Type the word · letter hints always available</option></select>${voiceSettings()}<div class="photo-box"><h3>Have a homework sheet?</h3><p>Attach a photo to view it alongside the list. <strong>Automatic word recognition is not connected in this prototype.</strong> Type the words above.</p><label class="secondary file-label">Choose a homework photo<input type="file" id="photo-input" accept="image/*" capture="environment"></label>${photoUrl?`<img class="homework-photo" src="${photoUrl}" alt="Homework sheet preview">`:''}</div></div><div><h2>Give each word meaning</h2><p class="muted">The app suggests short meanings. Edit any explanation or example to match what your child is learning. Suggestions that need a parent meaning are marked below.</p><div class="word-edit-list">${profile().words.map((x,i)=>`<div class="word-edit"><strong>${escape(x.word)}</strong><small class="meaning-source">${escape(x.meaningSource||'Parent meaning')}${x.meaningAttribution?` · <a href="${escape(x.meaningAttribution)}" target="_blank" rel="noopener noreferrer">Dictionary source</a>`:''}${x.meaningLicense?` · ${escape(x.meaningLicense)}`:''}</small><label class="field-label">Simple meaning<input data-meaning="${i}" value="${escape(x.meaning||'')}" placeholder="Explain it in everyday language…" maxlength="240"></label><label class="field-label">Example sentence<input data-example="${i}" value="${escape(x.sentence||'')}" placeholder="A sentence that uses the word…" maxlength="240"></label></div>`).join('')}</div><button class="secondary" id="save-meanings">Save meanings & examples</button></div></div>`;
}
function tableSetup() {
 const p=profile();return `<h2>Which tables shall we explore?</h2><p class="muted">Choose one or more. Each adventure mixes five facts from the selected tables, using multipliers 1–12.</p><div class="table-picker">${Array.from({length:12},(_,i)=>i+1).map(n=>`<button class="table-choice ${p.tables.includes(n)?'selected':''}" data-table="${n}" aria-pressed="${p.tables.includes(n)}">${n}<small>times table</small></button>`).join('')}</div><label class="checkbox-row"><input type="checkbox" id="factor-mode" ${p.factorMode?'checked':''}>Include missing-factor questions, such as 4 × ? = 20</label><p class="notice">Visual equal groups are available in every question and shown automatically for ages 5–6. No time limit. No speed scores.</p>`;
}
function progressPage() {
 const p=profile(),days=Object.entries(p.days).sort(([a],[b])=>b.localeCompare(a));
 return `<h2>Effort worth celebrating</h2><div class="stats-row"><div><strong>${p.stars} ★</strong><span>Stars earned</span></div><div><strong>${days.length}</strong><span>Days with a little practice</span></div><div><strong>${p.scrapbook.length}</strong><span>Scrapbook creations</span></div></div>${days.length?`<ul class="practice-history">${days.slice(0,7).map(([day,items])=>`<li><strong>${escape(day)}</strong><span>${items.map(x=>({spelling:'Word Woods',tables:'Number Nook',creative:'Imagine & Make'}[x])).join(' · ')}</span></li>`).join('')}</ul>`:'<p class="muted">Their adventures will appear here after their first session.</p>'}<div class="notice"><strong>About this prototype</strong><p>Runs on this device and saves in this browser only. No accounts, cloud sync, analytics or uploads. Read-aloud depends on browser voices. Sentence feedback checks whether the target word appears; it does not assess grammar or meaning.</p><p>Photo-to-text, adaptive review, school assignments and teacher dashboards are planned features. Current activities use short fixed sessions and parent-chosen support.</p></div><button class="secondary" id="lock-parents">Close grown-up settings</button>`;
}
function bindParents() {
 $('#voice-select')?.addEventListener('change',e=>{state.voiceURI=e.target.value;save();});
 $('#preview-voice')?.addEventListener('click',()=>speak('Hello. Take your time. Let’s practise one little word together.'));
 $('#parent-profile').onchange=e=>{state.active=e.target.value;wordDraft='';save();render();};
 $('#save-child').onclick=()=>{profile().name=$('#child-name').value.trim().slice(0,24)||'Explorer';profile().age=Number($('#child-age').value);save();toast('Profile saved. Choose the spelling support that suits them below.');render();};
 document.querySelectorAll('[data-setup]').forEach(b=>b.onclick=()=>{setupTab=b.dataset.setup;wordDraft='';render();});
 const saveWeekly=async(newWeek=false)=>{const words=cleanWords($('#word-list').value);if(!words.length){$('#word-feedback').textContent='Add at least one word first.';return;}const activeProfile=profile();const inputs=[...document.querySelectorAll('[data-meaning]')];inputs.forEach(input=>{activeProfile.words[Number(input.dataset.meaning)].meaning=input.value.trim();});document.querySelectorAll('[data-example]').forEach(input=>{activeProfile.words[Number(input.dataset.example)].sentence=input.value.trim();});const button=$('#save-words');button.disabled=true;$('#new-week').disabled=true;$('#word-feedback').textContent='Finding short meanings for your words…';const suggestions=await suggestWordList(words,activeProfile.words);assignWords(activeProfile,suggestions,{newWeek});wordDraft='';save();if(view==='parents'&&profile()===activeProfile){render();toast('Weekly words saved. Review the suggested meanings before practice.');}};
 $('#save-words')?.addEventListener('click',()=>saveWeekly());
 $('#new-week')?.addEventListener('click',()=>saveWeekly(true));
 $('#save-meanings')?.addEventListener('click',()=>{document.querySelectorAll('[data-meaning]').forEach(input=>profile().words[Number(input.dataset.meaning)].meaning=input.value.trim());document.querySelectorAll('[data-example]').forEach(input=>profile().words[Number(input.dataset.example)].sentence=input.value.trim());save();toast('Meanings and examples saved.');});
 $('#support-mode')?.addEventListener('change',e=>{profile().support=e.target.value;save();toast('Spelling support saved.');});
 $('#photo-input')?.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;if(!f.type.startsWith('image/')||f.size>10*1024*1024){toast('Please choose an image smaller than 10 MB.');return;}wordDraft=$('#word-list').value;if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=URL.createObjectURL(f);render();toast('Photo preview ready. Type and check the words in the list.');});
 document.querySelectorAll('[data-table]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.table),p=profile();if(p.tables.includes(n)){if(p.tables.length===1){toast('Keep at least one table selected.');return;}p.tables=p.tables.filter(x=>x!==n);}else p.tables.push(n);p.tables.sort((a,b)=>a-b);save();render();});
 $('#factor-mode')?.addEventListener('change',e=>{profile().factorMode=e.target.checked;save();});
 $('#lock-parents')?.addEventListener('click',()=>{parentUnlocked=false;view='home';render();});
}
function bindProgression(){
 document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const result=buyOutfit(profile(),b.dataset.buy);if(result.ok){save();render();toast(result.owned?'Outfit on!':'Your new outfit is ready!');}else toast(result.reason);});
 document.querySelectorAll('[data-equip]').forEach(b=>b.onclick=()=>{if(profile().ownedOutfits.includes(b.dataset.equip)){profile().equippedOutfit=b.dataset.equip;save();render();}});
 document.querySelectorAll('[data-adopt]').forEach(b=>b.onclick=()=>{if(adoptBaby(profile(),b.dataset.adopt)){save();soundEffect('celebrate');render();toast('A new little friend has joined your nursery!');}});
 $('#start-full-test')?.addEventListener('click',()=>{if(!isTestReady(profile()))return;fullTest={assignmentId:profile().assignment.id,items:profile().words.map(x=>({...x})),answers:[],index:0};view='test';render();});
 if(view==='test'&&fullTest&&!fullTest.result){$('#hear-test-word')?.addEventListener('click',()=>speak(fullTest.items[fullTest.index].word));const submit=()=>{const answer=$('#test-answer').value.trim();if(!answer){$('#test-feedback').textContent='Have a go before moving on.';return;}fullTest.answers.push(answer);fullTest.index++;if(fullTest.index===fullTest.items.length){try{fullTest.result=finishSpellingTest(profile(),fullTest.answers,fullTest.assignmentId);save();soundEffect('celebrate');}catch(error){toast(error.message);view='sanctuary';fullTest=null;}}render();};$('#submit-test-word').onclick=submit;$('#test-answer').onkeydown=e=>{if(e.key==='Enter')submit();};}
}
function bindCommon() {
 document.querySelectorAll('[data-travel]').forEach(b=>b.onclick=()=>travel(b.dataset.travel));
 $('#sound-toggle')?.addEventListener('click',()=>{state.sound=state.sound===false;save();render();});
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=e=>{e.preventDefault();if('speechSynthesis'in window)speechSynthesis.cancel();if(b.dataset.view==='home'&&view==='parents')parentUnlocked=false;view=b.dataset.view;game=null;render();scrollTo({top:0,behavior:'smooth'});});
 document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>begin(b.dataset.start));
 $('#start-adventure')?.addEventListener('click',()=>{const done=profile().days[localDay()]||[];travel(['spelling','tables','creative'].find(x=>!done.includes(x))||'spelling');});
 $('#profile-select')?.addEventListener('change',e=>{state.active=e.target.value;save();render();});
 document.querySelectorAll('[data-custom]').forEach(b=>b.onclick=()=>{profile()[b.dataset.custom]=b.dataset.value;save();render();});
 $('#save-name')?.addEventListener('click',()=>{profile().palName=$('#pal-name').value.trim().slice(0,24)||'Bumble';save();render();toast('Hello, '+profile().palName+'!');});
 const unlock=()=>{if($('#parent-answer').value.trim()==='29'){parentUnlocked=true;parentError='';render();}else{parentError='Try that sum again, please.';render();}};
 $('#unlock-parents')?.addEventListener('click',unlock);
 $('#parent-answer')?.addEventListener('keydown',e=>{if(e.key==='Enter')unlock();});
}
render();
