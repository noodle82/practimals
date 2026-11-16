import{AlienSpeaker}from'./character-audio.js';
import{speechRequest}from'./voice-profiles.js';
import{hasSpeech}from'./speech-store.js';
const report=window.__spelloidsSpeechProbe,update=window.reportSpeechProbe;
try{
 update('modules-loaded',{nativePlugins:Object.keys(globalThis.Capacitor?.Plugins||{})});
 const plugin=globalThis.Capacitor?.Plugins?.SpelloidsSpeech;
 const registered=!!plugin&&['prepare','synthesise','release'].every(k=>typeof plugin[k]==='function');
 update('registration-checked',{registered});
 if(!registered)throw Error('Speech plugin not registered in the running app');
 const speaker=new AlienSpeaker({onStatus:text=>update(report.stage,{detail:text})});
 const entries=[
  {word:'physician',meaning:'A doctor who helps people who are ill.',sentence:'The physician helped the child feel better.'},
  {word:'interruption',meaning:'Something that stops you doing something for a short time.',sentence:'We finished our story without an interruption.'}
 ];
 for(const entry of entries){
  const start=Date.now();update('preparing-word',{word:entry.word});
  await speaker.prepareMissingWord(entry,'bubbles',part=>update('preparing-'+part.kind,{word:entry.word,partsReady:part.done,totalParts:part.total}));
  update('checking-saved-audio',{word:entry.word});
  const rows=await speaker.inspectWordList([entry],'bubbles');if(rows[0].ready!==4)throw Error('Incomplete saved audio for '+entry.word);
  const request=speechRequest(entry.word,'bubbles');if(!await hasSpeech('kokoro-1939ad2-q8:'+request.voice+':'+request.text))throw Error('Word audio not saved');
  speaker.cachedOnly=true;const audio=await speaker.raw(entry.word,'bubbles',true,speaker.epoch);if(!audio.samples?.some(v=>Math.abs(v)>.0001))throw Error('Saved word audio is silent');speaker.cachedOnly=false;
  report.clips.push({word:entry.word,parts:rows[0].ready,ms:Date.now()-start,samples:audio.samples.length});update('word-complete',{word:entry.word});
 }
 speaker.resetWorker();update('passed',{finished:true,pass:true});
}catch(error){window.failSpeechProbe(error);}
