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
