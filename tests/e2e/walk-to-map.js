// Release normal keyboard input from the live map's animation frame. A slow
// Node/CDP round trip must not carry the player several metres past a waypoint.
// This changes input only: no teleport, physics mutation or progression writes.
export async function walkToMap(page,key,axis,limit,timeout=20000){
 await page.locator('#scene').focus();
 // A dialog close event can clear navigation after the DOM open flag changes.
 // Let that event settle before sending the real keyboard hold.
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const stopped=page.evaluate(({key,axis,limit,timeout})=>new Promise((resolve,reject)=>{
  const started=performance.now();
  function release(){window.dispatchEvent(new KeyboardEvent('keyup',{code:key,bubbles:true}));}
  function check(){
   const marker=document.querySelector('#campus-minimap [data-position]');
   const value=marker?(Number(marker.getAttribute(axis==='x'?'cx':'cy'))-12)/1.8-(axis==='x'?38:76):NaN;
   const reached=key==='KeyW'||key==='KeyA'?value<=limit:value>=limit;
   if(reached){release();resolve({pageMs:performance.now(),axis,value,limit});return;}
   if(performance.now()-started>timeout){release();reject(Error('Live map waypoint timeout '+JSON.stringify({axis,value,limit})));return;}
   requestAnimationFrame(check);
  }
  requestAnimationFrame(check);
 }),{key,axis,limit,timeout});
 try{await page.keyboard.down(key);return await stopped;}finally{await page.keyboard.up(key);}
}
