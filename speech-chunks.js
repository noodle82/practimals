// Bound inference memory for parent-authored clues; never split a spelling word.
export function speechChunks(text,limit=80){
 const words=String(text).trim().split(/\s+/),chunks=[];let chunk='';
 for(const word of words){if(chunk&&chunk.length+word.length+1>limit){chunks.push(chunk);chunk='';}chunk+=(chunk?' ':'')+word;}if(chunk)chunks.push(chunk);return chunks;
}
