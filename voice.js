// Clear question payloads. All playback uses local character-audio.js, never device TTS.
export function wordSpeech(word){return{parts:[{text:word,clear:true}]};}
export function spellingSpeech(entry,{repeat=false}={}){if(repeat)return wordSpeech(entry.word);return{parts:[...(entry.sentence?[{text:entry.sentence,clear:true,pause:550}]:[]),{text:'Spell.',clear:true,pause:400},{text:entry.word,clear:true}]};}
