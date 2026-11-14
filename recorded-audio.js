// Decode a short AAC sprite, then copy only the requested original sample range.
// The cache holds at most two decoded segments, not the whole speech library.
export class RecordedAudioDecoder{
 constructor(){this.decoded=new Map();this.context=null;}
 async decode(data,clip,file=''){if(clip.codec!=='aac-sprite-v1')throw Error('Unknown recorded audio format.');if(!Number.isInteger(clip.offset)||!Number.isInteger(clip.length)||clip.offset<0||clip.length<1||clip.offset+clip.length>data.byteLength)throw Error('A recorded audio file is incomplete.');const id=file+':'+clip.offset+':'+clip.length;
  if(!this.decoded.has(id)){const Audio=globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext;if(!Audio)throw Error('Recorded audio decoding is unavailable.');this.context??=new Audio(1,1,24000);const bytes=data.slice(clip.offset,clip.offset+clip.length);const pending=this.context.decodeAudioData(bytes).catch(error=>{this.decoded.delete(id);throw error;});this.decoded.set(id,pending);while(this.decoded.size>2)this.decoded.delete(this.decoded.keys().next().value);}
  const buffer=await this.decoded.get(id);if(buffer.sampleRate!==24000)throw Error('Recorded audio has an unexpected sample rate.');const start=clip.start,samples=clip.samples;if(!Number.isInteger(start)||!Number.isInteger(samples)||start<0||samples<1||start+samples>buffer.length)throw Error('A recorded phrase is incomplete.');const gain=clip.gain??1;if(!Number.isFinite(gain)||gain<=0||gain>2)throw Error('Invalid recording gain.');const result=buffer.getChannelData(0).slice(start,start+samples);if(gain!==1)for(let i=0;i<result.length;i++)result[i]*=gain;return{samples:result,sampleRate:24000};
 }
}
