// Use the visible student navigation and explicitly resume after choosing.
export async function enterMarket(page){
 if(!await page.locator('#exploration-options').evaluate(e=>e.open))await page.locator('#exploration-options > summary').click();
 if(!await page.locator('#destination-menu').evaluate(e=>e.open))await page.locator('#destination-menu > summary').click();
 await page.locator('#market-destination').click();
 await walkThroughMarketEntrance(page);
}

// Ordinary shortcuts stop outdoors. Enter using real walking and the door button.
export async function walkThroughMarketEntrance(page,{waitForEntry=true}={}){
 if(await page.locator('#exploration-options').count()&&await page.locator('#exploration-options').evaluate(e=>e.open))await page.locator('#resume-options').click();
 // The shortcut resolves asynchronously and clears old input on arrival.
 await page.waitForFunction(()=>{const s=JSON.parse(document.querySelector('#diagnostics').dataset.state||'{}'),p=s.position;return s.mode==='town'&&p&&Math.abs(p[0]-43)<.3&&p[2]>-20&&p[2]<-17;},null,{timeout:30000});
 await walkMarket(page,'KeyW',{selector:'#interact',text:'Enter Live Music & Sunday Markets'},15000);
 await page.getByRole('button',{name:'Enter Live Music & Sunday Markets',exact:true}).click();
 if(waitForEntry){
  await page.locator('#market-hud').waitFor({state:'visible',timeout:30000});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 }
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
   const reached=stop.mode?sample?.mode===stop.mode:stop.scene?Boolean(sample?.scene):stop.selector?Boolean(element?.getClientRects().length)&&element.textContent.trim()===stop.text:(stop.decrease??(key==='KeyW'||key==='KeyA')?value<=stop.limit:value>=stop.limit);
   if(reached){release();resolve(sample);return;}if(performance.now()-started>timeout){release();reject(Error('Market keyboard waypoint timeout '+JSON.stringify({sample,stop})));return;}requestAnimationFrame(check);
  }requestAnimationFrame(check);
 }),{key,stop,timeout});
 try{await page.keyboard.down(key);return await stopped;}finally{await page.keyboard.up(key);}
}
