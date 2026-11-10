import {localContent,sanitiseWord} from './word-content.js';
export const localWord=localContent;
export function meaningSummary(words){const missingMeanings=words.filter(w=>!String(w.meaning||'').trim()).map(w=>w.word),missingSentences=words.filter(w=>!String(w.sentence||'').trim()).map(w=>w.word);return{total:words.length,meanings:words.length-missingMeanings.length,sentences:words.length-missingSentences.length,missingMeanings,missingSentences};}
export function lookupMessage(){return 'Not in the offline glossary yet. A grown-up can add a simple meaning and an example using this word.';}
export function simpleMeaning(text){return String(text||'').replace(/\bcease remembering\b/gi,'not remember').trim();}
export async function suggestMeaning(word){return sanitiseWord({word});}
export async function suggestWordList(words,previous=[]){const old=new Map();for(const w of previous){const key=w.word.toLowerCase();if(!old.has(key))old.set(key,w);}return words.map(word=>sanitiseWord({...old.get(word.toLowerCase()),word}));}
