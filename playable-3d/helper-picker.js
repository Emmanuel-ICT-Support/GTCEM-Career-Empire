import {HELPERS,helperFor,createHelperStore} from './helper-state.js?v=helpers-20260927';
export function createHelperPicker({profile,onOpen=()=>{},onChange=()=>{}}){
 let storage;try{storage=localStorage;}catch{}
 const store=createHelperStore(storage),dialog=document.createElement('dialog');dialog.id='helper-picker';dialog.setAttribute('aria-labelledby','helper-heading');
 dialog.innerHTML='<form method="dialog"><small>YOUR CAREER EMPIRE JOURNEY</small><h1 id="helper-heading">Choose your guide</h1><p>Who will join you? You can change your guide any time.</p><div class="helper-grid"></div><p id="helper-save-note">Your choice stays with this character in this browser.</p><footer><button type="button" data-cancel>Cancel</button><button type="submit" data-continue>Continue with Echo</button></footer></form>';
 document.body.append(dialog);let selected='echo',target=null,resolve=null,required=false;
 const grid=dialog.querySelector('.helper-grid'),go=dialog.querySelector('[data-continue]'),cancel=dialog.querySelector('[data-cancel]');
 for(const h of HELPERS){const label=document.createElement('label');label.className='helper-card';const input=document.createElement('input');input.type='radio';input.name='helper';input.value=h.id;const img=document.createElement('img');img.src=h.portrait;img.alt='';img.width=192;img.height=192;img.decoding='async';const name=document.createElement('span');name.textContent=h.name;label.append(input,img,name);grid.append(label);input.onchange=()=>{selected=h.id;go.textContent='Continue with '+h.name;};}
 function finish(value){dialog.close();const done=resolve;resolve=null;done?.(value);}
 dialog.querySelector('form').onsubmit=e=>{e.preventDefault();store.write(target,selected);onChange(helperFor(selected),store.persistent);finish(selected);};
 cancel.onclick=()=>finish(null);dialog.oncancel=e=>{if(required)e.preventDefault();else finish(null);};
 return {store,selected:()=>helperFor(store.read(profile())),open:()=>dialog.open,
 choose(force=false){if(dialog.open)return Promise.resolve(null);const saved=store.read(profile());if(saved&&!force)return Promise.resolve(saved);target=profile();selected=saved||'echo';required=!saved;cancel.hidden=required;dialog.querySelector(`input[value="${selected}"]`).checked=true;go.textContent='Continue with '+helperFor(selected).name;onOpen();dialog.showModal();return new Promise(r=>resolve=r);}};
}
