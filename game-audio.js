// Quiet, offline game sounds. One shared context; each game owns and stops its notes.
let sharedContext;
export function createGameAudio(enabled=()=>true,contextFactory=()=>{const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;return Audio?new Audio():null;}){
 let context=null,disposed=false,last=-Infinity;const notes=new Set();
 const unlock=()=>{if(disposed||!enabled())return;try{context=sharedContext||contextFactory();if(context)sharedContext=context;if(context?.state==='suspended')context.resume()?.catch(()=>{});}catch{context=null;}};
 const stop=()=>{for(const note of notes){try{note.osc.stop();note.osc.disconnect();note.gain.disconnect();}catch{}}notes.clear();};
 const play=kind=>{if(disposed||!enabled())return;unlock();if(!context||context.state!=='running'||context.currentTime-last<.085)return;last=context.currentTime;
  const patterns={ping:[680,1100,.11],pop:[420,130,.09],boing:[180,510,.18],bounce:[260,150,.1],thud:[105,48,.13],launch:[180,750,.25],win:[530,1050,.28]};
  const [from,to,seconds]=patterns[kind]||patterns.ping,osc=context.createOscillator(),gain=context.createGain(),at=context.currentTime;
  osc.type='sine';osc.frequency.setValueAtTime(from,at);osc.frequency.exponentialRampToValueAtTime(to,at+seconds);
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.035,at+.008);gain.gain.exponentialRampToValueAtTime(.0001,at+seconds);
  osc.connect(gain);gain.connect(context.destination);const note={osc,gain};notes.add(note);osc.onended=()=>{notes.delete(note);osc.disconnect();gain.disconnect();};osc.start(at);osc.stop(at+seconds+.02);
 };
 return{unlock,play,stop,dispose(){stop();disposed=true;}};
}
