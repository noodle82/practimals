import{env,nativeSpeechInputs}from'./vendor/speech/kokoro.web.js';
env.configureLocal(new URL('./vendor/speech/models/',import.meta.url).href);
const originalFetch=self.fetch.bind(self);
self.fetch=(input,options)=>{const url=new URL(typeof input==='string'?input:input.url,self.location.href);if(url.origin!==self.location.origin)throw Error('Speech inputs use bundled files only.');return originalFetch(input,options);};
self.onmessage=async({data})=>{try{const result=await nativeSpeechInputs(data.text,data.voice);self.postMessage({id:data.id,...result});}catch(error){self.postMessage({id:data.id,error:error.message});}};
