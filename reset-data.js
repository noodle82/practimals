const DATABASES=['spelloids-keepsakes','spelloids-local-speech-v1'];
export async function eraseSpelloidsData({storage=localStorage,idb=indexedDB}={}){
 for(const name of DATABASES)await new Promise((resolve,reject)=>{
  const request=idb.deleteDatabase(name);
  request.onsuccess=resolve;request.onerror=()=>reject(request.error);
  request.onblocked=()=>reject(Error('Close other Spelloids tabs or windows, then try again.'));
 });
 const keys=Array.from({length:storage.length},(_,i)=>storage.key(i));
 for(const key of keys)if(/^(practimals-|spelloids-)/.test(key))storage.removeItem(key);
}
export function confirmEraseData(onErase){
 const dialog=document.createElement('dialog');dialog.className='erase-data-dialog';dialog.setAttribute('aria-labelledby','erase-title');dialog.setAttribute('aria-describedby','erase-warning');
 dialog.innerHTML='<h2 id="erase-title">Erase all Spelloids data?</h2><p id="erase-warning">This permanently removes every child’s progress, spelling lists, badges, babies, family pictures, scrapbook and test results saved on this device. Prepared word audio will also be removed.</p><p>There is no undo. Data on other devices is not erased.</p><div class="erase-confirm-group"><label class="erase-confirm-label" for="erase-confirmation">Type ERASE to confirm</label><input id="erase-confirmation" type="text" maxlength="5" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" aria-describedby="erase-warning"></div><p role="status" id="erase-status"></p><div class="game-buttons"><button class="secondary" data-cancel-erase>Keep my data</button><button class="erase-data-action" data-confirm-erase disabled>Erase everything permanently</button></div>';
 document.body.append(dialog);const input=dialog.querySelector('input'),confirm=dialog.querySelector('[data-confirm-erase]');
 input.oninput=()=>confirm.disabled=input.value.trim()!=='ERASE';
 dialog.querySelector('[data-cancel-erase]').onclick=()=>dialog.remove();dialog.oncancel=()=>dialog.remove();
 confirm.onclick=async()=>{if(input.value.trim()!=='ERASE')return;confirm.disabled=true;input.disabled=true;try{await onErase();}catch(error){dialog.querySelector('#erase-status').textContent=error.message;input.disabled=false;confirm.disabled=false;}};
 dialog.showModal();
}
