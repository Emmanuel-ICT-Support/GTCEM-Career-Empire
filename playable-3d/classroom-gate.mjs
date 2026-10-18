// A shared classroom pacing cue. This public client-side word is not identity
// verification and grants no access to school accounts or student records.
export function createClassroomGate({document=globalThis.document,onPause=()=>{},onClose=()=>{}}={}){
 let unlocked=false,pending=null,resolvePending;
 const dialog=document.createElement('dialog');dialog.id='classroom-gate';dialog.setAttribute('aria-labelledby','classroom-gate-title');
 dialog.innerHTML='<form><h2 id="classroom-gate-title">Ready for Initiative?</h2><p>Enter the classroom word from your teacher to begin the Markets activity.</p><p>This is a lesson pacing gate, not a secure login. It does not identify you or save work to a school account.</p><label>Classroom word <input name="classroom-word" autocomplete="off" required></label><p role="status" data-status></p><button type="submit">Begin Initiative</button> <button type="button" data-cancel>Keep exploring</button></form>';
 Object.assign(dialog.style,{maxWidth:'min(420px,calc(100vw - 40px))',maxHeight:'80dvh',overflow:'auto',padding:'24px',borderRadius:'16px',border:'1px solid #90aba1',color:'#183b36',background:'#fffaf0',font:'14px/1.5 system-ui'});
 for(const button of dialog.querySelectorAll('button'))button.style.cssText='min-height:44px;padding:10px 14px;margin:4px 4px 0 0;border:1px solid #8aa79b;border-radius:8px;background:#fff;color:#244b3d;font:inherit;cursor:pointer';
 const input=dialog.querySelector('input'),status=dialog.querySelector('[data-status]');input.style.cssText='display:block;box-sizing:border-box;width:100%;margin:12px 0;padding:12px;font:inherit';
 function finish(accepted){if(!pending)return;unlocked=accepted;dialog.close();const resolve=resolvePending;pending=null;resolvePending=null;input.value='';onClose();resolve(accepted);}
 dialog.querySelector('form').onsubmit=event=>{event.preventDefault();if(input.value.trim()==='Emmanuel')finish(true);else{status.textContent='That word does not match. Ask your teacher, try again, or keep exploring.';input.select();}};
 dialog.querySelector('[data-cancel]').onclick=()=>finish(false);dialog.addEventListener('cancel',event=>{event.preventDefault();finish(false);});
 document.body.append(dialog);
 return {open:()=>dialog.open,request(){if(unlocked)return Promise.resolve(true);if(pending)return pending;pending=new Promise(resolve=>{resolvePending=resolve;});status.textContent='';onPause();dialog.showModal();input.focus();return pending;}};
}
