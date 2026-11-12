export const DEFAULT_VOICE='bubbles';
export const ALIEN_VOICES={
 bubbles:{name:'Bumble',base:'bf_emma',bank:'natural',description:'A warm, gentle little chatterer',pitch:2,formant:1,speed:1,wordSpeed:1},
 mallow:{name:'Fizzlet',base:'bf_emma',bank:'natural',description:'Bright, bubbly and full of fun',pitch:4,formant:2.5,speed:1,wordSpeed:1},
 heart2:{name:'Mallow',base:'af_heart',bank:'heart',description:'A soft, cheerful little friend',pitch:4,formant:2.5,speed:1,wordSpeed:1}
};
export function selectedVoice(profile){return profile?.species!=='blob'&&profile?.week?.design?.locks?.voiceStyle&&ALIEN_VOICES[profile.voiceStyle]?profile.voiceStyle:DEFAULT_VOICE;}
export function migrateVoices(profile,version){if(!profile.week)return false;const replacements={natural:'bubbles',bella:'heart2',heart3c:'heart2',ziggle:'mallow'};let changed=false;if(replacements[profile.voiceStyle]){profile.voiceStyle=replacements[profile.voiceStyle];if(profile.week.design?.look)profile.week.design.look.voiceStyle=profile.voiceStyle;changed=true;}profile.voicePaletteVersion=12;return changed;}
export function speechRequest(text,style=DEFAULT_VOICE){const profile=ALIEN_VOICES[style]||ALIEN_VOICES[DEFAULT_VOICE],word=/^[a-z]+(?:[-'][a-z]+)*'?$/i.test(text);return{voice:profile.base,speed:1,text:word?text[0].toUpperCase()+text.slice(1):text};}
