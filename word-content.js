import {SCHOOL_WORDS} from './school-lexicon.js';
import {normaliseWord,textProblem,sentenceProblem} from './content-rules.js';
export const CONTENT_REVISION=1;
export function localContent(raw){const word=normaliseWord(raw),entry=SCHOOL_WORDS[word];return {word,meaning:entry?.meaning||'',sentence:entry?.sentence||'',meaningSource:entry?'Spelloids offline glossary':'Needs a parent meaning',lookupStatus:entry?'local':'needsParent'};}
export function sanitiseWord(entry){
 const word=normaliseWord(entry.word),local=localContent(word),meta=entry.contentApproval||{},trusted=meta.revision===CONTENT_REVISION;
 const parentMeaning=trusted&&meta.meaning===true&&!!entry.meaning?.trim()&&!textProblem(entry.meaning);
 const parentSentence=trusted&&meta.sentence===true&&!!entry.sentence?.trim()&&!sentenceProblem(entry.sentence,word);
 const meaning=parentMeaning?entry.meaning.trim():local.meaning,sentence=parentSentence?entry.sentence.trim():local.sentence;
 const out={...entry,...local,word,meaning,sentence,contentApproval:{revision:CONTENT_REVISION,meaning:!!parentMeaning,sentence:!!parentSentence}};
 if(!trusted&&(entry.meaning||entry.sentence)&&(entry.meaning!==meaning||entry.sentence!==sentence))out.contentDraft={meaning:entry.meaning||'',sentence:entry.sentence||'',source:entry.meaningSource||'Earlier saved text'};
 if(parentMeaning||parentSentence){out.meaningSource='Parent-approved text · offline';out.lookupStatus=meaning&&sentence?'parent':'needsParent';}
 for(const key of ['meaningLicense','meaningLicenseUrl','meaningAttribution'])delete out[key];
 return out;
}
export function approveWordEdit(entry,field,value){
 const text=String(value||'').trim(),problem=field==='sentence'?sentenceProblem(text,entry.word):textProblem(text);
 if(problem&&text)return {ok:false,problem};
 entry[field]=text;entry.contentApproval??={revision:CONTENT_REVISION,meaning:false,sentence:false};entry.contentApproval.revision=CONTENT_REVISION;entry.contentApproval[field]=!!text;
 entry.meaningSource='Parent-approved text · offline';entry.lookupStatus=entry.meaning&&entry.sentence?'parent':'needsParent';return {ok:true};
}
// Only teaching-word arrays are upgraded. Children's own scrapbook writing is untouched.
export function sanitiseProfile(profile){
 const seen=new WeakSet();function visit(value){if(!value||typeof value!=='object'||seen.has(value))return;seen.add(value);for(const [key,item]of Object.entries(value)){if(['scrapbook','contentDraft'].includes(key))continue;if(key==='words'&&Array.isArray(item)){for(let i=0;i<item.length;i++)if(item[i]&&typeof item[i]==='object'&&typeof item[i].word==='string')item[i]=sanitiseWord(item[i]);}else visit(item);}}visit(profile);return profile;
}
