// Exact spelling checks also handle contractions and plural possessives.
export const normaliseWord=value=>String(value??'').trim().replace(/[‘’]/g,"'").toLowerCase();
export const escapeWord=value=>String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function wordPattern(word,flags='i'){return new RegExp("(^|[^a-z'-])"+escapeWord(normaliseWord(word))+"(?=$|[^a-z'-])",flags);}
export function containsTarget(sentence,word){return wordPattern(word).test(normaliseWord(sentence));}
// Additional checks, not a substitute for authored content or parent review.
export function textProblem(text){const value=String(text||'');if(/\b(abortion|intercourse|genital|pornography|obscene|excrement|debian|linux operating system)\b/i.test(value))return 'Please use a simple, child-appropriate explanation.';if(/\b(color|colors|colorful|favorite|favorites|flavor|flavors|neighbor|neighbors)\b/i.test(value))return 'Please use UK spellings in this text.';return '';}
export function sentenceProblem(sentence,word){return textProblem(sentence)||(!String(sentence||'').trim()?'Add an example sentence.':!containsTarget(sentence,word)?'The example must include the exact spelling “'+word+'”.':'');}
