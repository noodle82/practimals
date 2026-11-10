import createProcessor from'./vendor/voice-tone/signalsmith-core.js';
let modulePromise;
// Offline pitch and resonance processing. Input/output counts are equal: tempo never changes.
export async function characterTone(input,profile,sampleRate=24000){if(!profile?.pitch&&!profile?.formant)return input;const m=await(modulePromise??=createProcessor()),chunk=1024;
 m._presetDefault(1,sampleRate);m._reset();m._setTransposeSemitones(profile.pitch||0,8000/sampleRate);m._setFormantSemitones(profile.formant||0,true);m._setFormantBase(220/sampleRate);
 const latency=m._inputLatency()+m._outputLatency(),ptr=m._setBuffers(1,chunk),total=input.length+latency,output=new Float32Array(total),inView=()=>new Float32Array(m.HEAP8.buffer,ptr,chunk),outView=()=>new Float32Array(m.HEAP8.buffer,ptr+chunk*4,chunk);
 for(let at=0;at<total;at+=chunk){const n=Math.min(chunk,total-at),buffer=inView();buffer.fill(0);if(at<input.length)buffer.set(input.subarray(at,Math.min(input.length,at+n)));m._process(n,n);output.set(outView().subarray(0,n),at);}
 const result=output.slice(latency,latency+input.length);let peak=0,energy=0;for(const s of result){if(!Number.isFinite(s))throw Error('Our voice could not be prepared. Please try again.');peak=Math.max(peak,Math.abs(s));energy+=s*s;}const rms=Math.sqrt(energy/result.length);if(rms<.001)throw Error('Our voice was too quiet. Please try again.');const gain=Math.min(2,.88/peak,.115/rms);for(let i=0;i<result.length;i++)result[i]*=gain;return result;
}
