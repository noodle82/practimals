export const EGG_SHELLS=[
 {id:'peach',light:'#fff1cf',mid:'#efb379',shade:'#cf865f',edge:'#975b50'},
 {id:'lagoon',light:'#e6fff0',mid:'#8cd7c1',shade:'#53a99e',edge:'#377e7b'},
 {id:'lilac',light:'#f3e7ff',mid:'#bd9de4',shade:'#9371bf',edge:'#6b518e'},
 {id:'sky',light:'#e7f6ff',mid:'#8fc4ea',shade:'#5b96c5',edge:'#456a95'},
 {id:'rose',light:'#ffe9f1',mid:'#e9a2bf',shade:'#c6779c',edge:'#965670'},
 {id:'sunshine',light:'#fff8d0',mid:'#ecd27f',shade:'#c5a754',edge:'#8e773f'}
];
export function eggPalette(egg={}){return EGG_SHELLS.find(s=>s.id===egg.shellColour)||EGG_SHELLS[0];}
export function nextEggColour(previous){const index=EGG_SHELLS.findIndex(s=>s.id===previous);return EGG_SHELLS[(index+1)%EGG_SHELLS.length].id;}
export function migrateEggLooks(p){let previous;for(const egg of p.eggs||[]){if(!EGG_SHELLS.some(s=>s.id===egg.shellColour))egg.shellColour=nextEggColour(previous);previous=egg.shellColour;}}
