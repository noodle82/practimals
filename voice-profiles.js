export const DEFAULT_VOICE='natural';
export const ALIEN_VOICES={
 natural:{name:'Natural',base:'bf_emma',bank:'natural',description:'The clear, untouched voice · British English',pitch:0,formant:0,speed:1,wordSpeed:1},
 bubbles:{name:'Soft sprite',base:'bf_emma',bank:'natural',description:'Your first higher voice · British English',pitch:2,formant:1,speed:1,wordSpeed:1},
 mallow:{name:'Little monster',base:'bf_emma',bank:'natural',description:'Your second higher voice · British English',pitch:4,formant:2.5,speed:1,wordSpeed:1},
 bella:{name:'Bella',base:'af_bella',bank:'bella',description:'Bella’s natural voice · American English',pitch:0,formant:0,speed:1,wordSpeed:1},
 heart2:{name:'Heart 2',base:'af_heart',bank:'heart',description:'Your higher Heart voice · American English',pitch:4,formant:2.5,speed:1,wordSpeed:1},
 heart3c:{name:'Heart 3 C',base:'af_heart',bank:'heart',description:'Lower pitch, brighter tone · American English',pitch:-3,formant:4,speed:1,wordSpeed:1}
};
export function selectedVoice(profile){return profile?.species!=='blob'&&profile?.week?.design?.locks?.voiceStyle&&ALIEN_VOICES[profile.voiceStyle]?profile.voiceStyle:DEFAULT_VOICE;}
export function migrateVoices(profile,version){if(version>=10||!profile.week)return false;if(['bubbles','mallow','ziggle'].includes(profile.voiceStyle)){profile.voiceStyle=null;profile.week.design??={locks:{},look:{}};profile.week.design.locks??={};delete profile.week.design.locks.voiceStyle;if(profile.week.design.look)profile.week.design.look.voiceStyle=null;profile.week.newVoices=true;return true;}return false;}
export function speechRequest(text,style=DEFAULT_VOICE){const profile=ALIEN_VOICES[style]||ALIEN_VOICES[DEFAULT_VOICE],word=/^[a-z]+(?:[-'][a-z]+)*$/i.test(text);return{voice:profile.base,speed:1,text:word?text[0].toUpperCase()+text.slice(1):text};}
