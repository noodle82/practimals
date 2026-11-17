export function keyboardEdit(value,start,end,key){
 if(key==='Backspace'){if(start===end&&start>0)start--;return{value:value.slice(0,start)+value.slice(end),caret:start};}
 return{value:value.slice(0,start)+key+value.slice(end),caret:start+key.length};
}
export function bindAnswerKeyboard(input,mode){
 if(!input||mode!=='app')return;
 input.readOnly=true;input.inputMode='none';input.setAttribute('aria-description','Use the Spelloids letter keyboard below.');
 const board=document.createElement('div');board.className='answer-keyboard';board.setAttribute('role','group');board.setAttribute('aria-label','Spelloids spelling keyboard');
 for(const row of['qwertyuiop','asdfghjkl',"zxcvbnm'-"]){const line=document.createElement('div');line.className='answer-keyboard-row';for(const letter of row){const b=document.createElement('button');b.type='button';b.textContent=letter;b.dataset.answerKey=letter;line.append(b);}board.append(line);}
 const remove=document.createElement('button');remove.type='button';remove.textContent='⌫';remove.dataset.answerKey='Backspace';remove.setAttribute('aria-label','Delete a letter');board.lastChild.append(remove);
 const actions=input.closest('.game-card,.test-card')?.querySelector('#check,#test-next')?.closest('.game-buttons');(actions||input).insertAdjacentElement('afterend',board);
 board.onpointerdown=e=>{if(e.target.closest('button'))e.preventDefault();};
 board.onclick=e=>{const button=e.target.closest('[data-answer-key]');if(!button||input.disabled)return;const result=keyboardEdit(input.value,input.selectionStart??input.value.length,input.selectionEnd??input.value.length,button.dataset.answerKey);input.value=result.value;input.setSelectionRange(result.caret,result.caret);input.dispatchEvent(new Event('input',{bubbles:true}));};
}

export const answerKeyboardFor=profile=>profile?.answerKeyboard==='device'?'device':'app';
export function answerKeyboardSettings(profile){const mode=answerKeyboardFor(profile);return `<div class="parent-keyboard-settings"><h3>Answer keyboard</h3><label class="field-label" for="answer-keyboard">Keyboard for ${String(profile.name||'your child').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c))}<select id="answer-keyboard"><option value="app" ${mode==='app'?'selected':''}>Spelloids keyboard (default)</option><option value="device" ${mode==='device'?'selected':''}>iPad / device keyboard</option></select></label><p class="hint">The Spelloids keyboard keeps the device keyboard and its dictation button closed for spelling answers. Your choice saves straight away.</p></div>`;}
