import{newId}from'./platform-compat.js';
// Large keepsakes use IndexedDB; the developer playground uses memory only.
const temporary=new Map();let database;
function open(){if(!database)database=new Promise((resolve,reject)=>{const r=indexedDB.open('spelloids-keepsakes',1);r.onupgradeneeded=()=>r.result.createObjectStore('media');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);}).catch(error=>{database=null;throw error;});return database;}
export async function keepMedia(dataURL,{testMode=false}={}){const id=(testMode?'preview:':'art:')+newId();if(testMode){temporary.set(id,dataURL);return id;}const db=await open();await new Promise((resolve,reject)=>{const tx=db.transaction('media','readwrite');tx.objectStore('media').put(dataURL,id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});return id;}
export async function readMedia(id){if(id?.startsWith('preview:'))return temporary.get(id)||null;const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction('media').objectStore('media').get(id);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);});}
export function fillMediaImages(root=document){for(const img of root.querySelectorAll('[data-art-id]'))readMedia(img.dataset.artId).then(src=>{if(src&&img.isConnected)img.src=src;else if(img.isConnected)img.alt='This picture is not available on this device.';}).catch(()=>{if(img.isConnected)img.alt='Your picture could not load. Try opening this scrapbook again.';});}
export function clearTemporaryMedia(){temporary.clear();}
