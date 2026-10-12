// Keep a constrained GPU to one submitted scene frame. Poll without waiting on
// the CPU so downloads, input and UI can run while that frame finishes.
export function createGpuFrameGate(renderer,enabled=false){
 const gl=renderer.getContext();let fence=null;
 const supported=enabled&&typeof gl.fenceSync==='function'&&typeof gl.clientWaitSync==='function';
 function ready(){
  if(!fence)return true;
  const status=gl.clientWaitSync(fence,0,0);
  if(status===gl.TIMEOUT_EXPIRED)return false;
  gl.deleteSync(fence);fence=null;return true;
 }
 function submitted(){
  if(!supported)return;
  if(fence)throw new Error('GPU frame submitted before the preceding frame completed');
  fence=gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE,0);gl.flush();
 }
 return {ready,submitted};
}

// Decoded decorative images retain their original pixels, but become visible
// one at a time, after a frame can run. Downloads remain independently concurrent.
export function createTextureUploadQueue({waitForFrame,upload}){
 const pending=[];let running=false;
 async function drain(){
  running=true;
  while(pending.length){
   pending.sort((a,b)=>b.priority-a.priority);
   const task=pending.shift();
   try{await waitForFrame();const texture=task.hydrate();upload(texture);task.resolve();}
   catch(error){task.reject(error);}
  }
  running=false;
 }
 function schedule(hydrate,{priority=0}={}){
  const promise=new Promise((resolve,reject)=>pending.push({hydrate,priority,resolve,reject}));
  if(!running)drain();return promise;
 }
 return {schedule};
}
