import {test,expect} from '@playwright/test';

for(const width of [1280,390])test(`video to complete exterior, walking and automatic parcel at ${width}`,async({page},info)=>{
 test.setTimeout(60000);await page.setViewportSize({width,height:844});
 const errors=[],requests=[];page.on('pageerror',error=>{errors.push(error.message);console.log('STARTUP_PAGE_ERROR',error.message);});page.on('request',r=>requests.push(r.url()));
 let release;const held=new Promise(resolve=>release=resolve);
 await page.route('**/mature-eucalypt-*-packed.glb',async route=>{await held;await route.continue();});
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.entryInspection=()=>{
  const roots=worlds.town.getObjectByName('Campus teaching building exteriors'),frustum=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
  return {pageMs:Math.round(performance.now()),entryVisibleMs:Number(canvas.dataset.entryVisibleMs)||null,url:location.href,runId:gameSession.id,frame:renderedFrames,colliders:worlds.townPhysics.world.colliders.len(),roots:roots?.children.map(root=>{let meshes=0,inView=0;root.traverse(o=>{if(o.isMesh&&o.visible){meshes++;if(frustum.intersectsObject(o))inView++;}});return {name:root.name,visible:root.visible,meshes,inView,position:root.position.toArray()};}),garden:Boolean(worlds.town.getObjectByName('Arrival authored garden detail')),rooms:Boolean(worlds.town.getObjectByName('Media learning rooms')),state:JSON.parse(document.querySelector('#diagnostics').dataset.state||'{}')};
 };`});});
 const sample=async()=>{const started=performance.now();const result=await page.evaluate(()=>window.entryInspection?.());console.log('STARTUP_POLL',JSON.stringify({nodeStartMs:Math.round(started),nodeEndMs:Math.round(performance.now()),pageMs:result?.pageMs,url:result?.url,runId:result?.runId,entryReady:result?.state.entryReady,position:result?.state.position}));return result;};
 try{
  await page.goto('/playable-3d/',{waitUntil:'domcontentloaded'});await page.locator('#taster-play').click();await page.waitForFunction(()=>document.querySelector('#taster-video')?.currentTime>.1,{},{timeout:5000});
  const exploringAt=await page.evaluate(()=>performance.now());await page.locator('#taster-skip').click();
  await expect.poll(async()=>(await sample())?.state,{timeout:30000}).toMatchObject({entryReady:true,avatarBody:'antonio',campusReady:false});
  const entry=await sample();expect(entry.entryVisibleMs).toBeGreaterThan(0);expect(entry.entryVisibleMs-exploringAt).toBeLessThan(8000);expect(entry.roots).toHaveLength(2);expect(entry.roots.every(o=>o.visible&&o.meshes>0&&o.inView>0)).toBe(true);expect(entry.garden).toBe(false);expect(entry.rooms).toBe(false);expect(requests.some(url=>/mature-eucalypt|learning-interiors\.js|\/studio\.js/.test(url))).toBe(false);
  await page.screenshot({path:info.outputPath('entry.png')});const before=entry.state.position;
  await page.locator('#scene').focus();await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await page.keyboard.down('KeyW');
  try{await expect.poll(async()=>(await sample())?.state.discovery?.step,{timeout:10000}).toBe(1);}finally{await page.keyboard.up('KeyW');}
  const parcel=await sample();expect(parcel.state.position[2]).toBeLessThan(before[2]-3);expect(parcel.frame).toBeGreaterThan(entry.frame);await expect(page.locator('#discovery-dialog')).toBeVisible();await expect(page.locator('#discovery-copy')).toHaveText('Slide to discover a place to pause.');await page.locator('#develop').focus();await page.keyboard.press('End');await expect(page.locator('#develop-response')).toHaveText('Your picture is ready. Follow it to the Chapel.');expect(errors).toEqual([]);
  await page.screenshot({path:info.outputPath('automatic-parcel.png')});await info.attach('entry-and-parcel',{body:JSON.stringify({exploringAt,handoverMs:Math.max(0,entry.entryVisibleMs-exploringAt),observationMs:entry.pageMs-exploringAt,entry,parcel},null,2),contentType:'application/json'});
 }finally{release();}
});
