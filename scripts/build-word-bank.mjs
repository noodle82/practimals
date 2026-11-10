import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {sentenceProblem,textProblem} from '../content-rules.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dir=path.join(root,'lexicon');
const official=JSON.parse(fs.readFileSync(path.join(dir,'official-wordlists.json'))),base=JSON.parse(fs.readFileSync(path.join(dir,'base-reviewed.json'))),bank=structuredClone(base),seen=new Set();
for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.tsv')).sort())for(const line of fs.readFileSync(path.join(dir,file),'utf8').split(/\r?\n/).filter(Boolean)){
 const [word,meaning,sentence,...extra]=line.split('|');if(extra.length||!word||!meaning||!sentence||seen.has(word))throw Error('Invalid or repeated entry in '+file+': '+word);seen.add(word);bank[word]={meaning:meaning==='='?base[word]?.meaning:meaning,sentence};
}
const missing=official.words.filter(w=>!bank[w]?.meaning||!bank[w]?.sentence);if(missing.length)throw Error('Missing teaching content: '+missing.join(', '));
for(const [word,entry]of Object.entries(bank)){if(!entry.meaning||textProblem(entry.meaning)||sentenceProblem(entry.sentence,word))throw Error('Check meaning/example: '+word);}
const ordered=Object.fromEntries(Object.entries(bank).sort(([a],[b])=>a.localeCompare(b,'en-GB')));
fs.writeFileSync(path.join(root,'school-lexicon.js'),'// Original Spelloids teaching text. DfE word-list reference (England): Crown copyright, OGL v3. See lexicon/README.md.\nexport const SCHOOL_WORDS='+JSON.stringify(ordered,null,2)+';\nexport const OFFICIAL_GROUPS='+JSON.stringify(official.groups)+';\n');
const sourceWords=new Set(Object.entries(official.groups).filter(([key])=>key!=='reportedExtra').flatMap(([,words])=>words));
fs.writeFileSync(path.join(dir,'coverage.json'),JSON.stringify({source:official.source,appendixWordForms:sourceWords.size,additionalTrackedWords:official.words.filter(w=>!sourceWords.has(w)),trackedWordForms:official.words.length,covered:official.words.length,totalBankWords:Object.keys(bank).length,missing},null,2));
console.log(Object.keys(bank).length+' complete offline entries; '+sourceWords.size+' distinct appendix forms covered.');
