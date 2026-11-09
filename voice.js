// The browser API exposes names and languages, but no gender field. Match
// explicit female labels and familiar female English system-voice names.
const femaleName=/\bfemale\b|\b(samantha|serena|kate|moira|karen|tessa|victoria|allison|ava|susan|hazel|sonia|libby|aria|jenny|natasha|clara|michelle|emma|elizabeth|zira|catherine|cathy|heera|veena|neerja)\b/i;
export function femaleEnglishVoices(voices){
 return voices.filter(v=>/^en(?:[-_]|$)/i.test(v.lang)&&femaleName.test(v.name)&&!(/\bmale\b/i.test(v.name)))
  .sort((a,b)=>score(b)-score(a)||a.name.localeCompare(b.name));
}
function score(voice){return (/^en[-_]GB$/i.test(voice.lang)?100:0)+(/female/i.test(voice.name)?20:0)+(voice.localService?10:0);}
export function chooseCalmVoice(voices,preferredURI){
 const female=femaleEnglishVoices(voices);
 return female.find(v=>v.voiceURI===preferredURI)||female[0]||null;
}
export function calmUtterance(text,voices,preferredURI,Utterance){
 const voice=chooseCalmVoice(voices,preferredURI);
 if(!voice)return null; // Never let the system silently choose a male default.
 const utterance=new Utterance(text);
 utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=.78;utterance.pitch=1.02;utterance.volume=.9;
 return utterance;
}

export const MONSTER_VOICES={bubbles:{name:'Bubbles',description:'Bright, bouncy and squeaky',pitch:1.65,rate:.85},mallow:{name:'Mallow',description:'Soft, cosy and gentle',pitch:1.35,rate:.75},ziggle:{name:'Ziggle',description:'Tiny, cheeky and chirpy',pitch:1.9,rate:.92}};
export function monsterUtterance(text,voices,preferredURI,style='bubbles',Utterance){const u=calmUtterance(text,voices,preferredURI,Utterance);if(!u)return null;const v=MONSTER_VOICES[style]||MONSTER_VOICES.bubbles;u.pitch=v.pitch;u.rate=v.rate;return u;}
