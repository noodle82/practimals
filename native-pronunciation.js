let toolkit;
export async function prepareNativePronunciation(text,voice,onStage=()=>{},load=()=>import('./vendor/speech/kokoro.web.js')){
 onStage('Loading pronunciation tools in the app…');
 toolkit??=load().then(module=>{module.env.configureLocal(new URL('./vendor/speech/models/',import.meta.url).href);return module;}).catch(error=>{toolkit=null;throw error;});
 const module=await toolkit;
 return module.nativeSpeechInputs(text,voice,onStage);
}
