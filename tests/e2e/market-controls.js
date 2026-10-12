// Use the visible student navigation and explicitly resume after choosing.
export async function enterMarket(page){
 if(!await page.locator('#exploration-options').evaluate(e=>e.open))await page.locator('#exploration-options > summary').click();
 if(!await page.locator('#destination-menu').evaluate(e=>e.open))await page.locator('#destination-menu > summary').click();
 await page.locator('#market-destination').click();
 if(await page.locator('#exploration-options').evaluate(e=>e.open))await page.locator('#resume-options').click();
}

export async function observeMarketWalking(page){
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.observeMarketWalking=()=>({mode,position:actor?.model.position.toArray(),scene:discovery?.snapshot().scene});`});});
}

// Release real keyboard input at a live waypoint instead of an old diagnostics
// publication. This observes position; it never sets position or progress.
export async function walkMarket(page,key,stop,timeout=90000){
 await page.locator('#scene').focus();
 // Modal close events clear old keys asynchronously; settle before a new hold.
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const stopped=page.evaluate(({key,stop,timeout})=>new Promise((resolve,reject)=>{
  const started=performance.now(),release=()=>window.dispatchEvent(new KeyboardEvent('keyup',{code:key,bubbles:true}));
  function check(){const sample=window.observeMarketWalking?.(),value=sample?.position?.[{x:0,y:1,z:2}[stop.axis]],element=stop.selector&&document.querySelector(stop.selector);
   const reached=stop.mode?sample?.mode===stop.mode:stop.scene?Boolean(sample?.scene):stop.selector?Boolean(element?.getClientRects().length)&&element.textContent===stop.text:(stop.decrease??(key==='KeyW'||key==='KeyA')?value<=stop.limit:value>=stop.limit);
   if(reached){release();resolve(sample);return;}if(performance.now()-started>timeout){release();reject(Error('Market keyboard waypoint timeout '+JSON.stringify({sample,stop})));return;}requestAnimationFrame(check);
  }requestAnimationFrame(check);
 }),{key,stop,timeout});
 try{await page.keyboard.down(key);return await stopped;}finally{await page.keyboard.up(key);}
}
