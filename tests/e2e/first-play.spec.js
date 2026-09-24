import {test,expect} from './campus-fixtures.js';
const state=page=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}'));

test('Arrival is playable while distant models and textures wait, then opens the whole campus',async({page},info)=>{
 test.setTimeout(120000);let release;const gate=new Promise(resolve=>release=resolve),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
 await page.route('**/mature-eucalypt-a-packed.glb',async route=>{await gate;await route.continue();});
 await page.route('**/grass-ecc-campus-v1-lossless.webp',async route=>{await gate;await route.continue();});
 try{
  await page.goto('/playable-3d/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#loading')).toBeHidden({timeout:45000});
  await expect.poll(async()=>(await state(page)).mode).toBe('town');
  expect((await state(page)).campusReady).toBe(false);await expect.poll(async()=>(await state(page)).arrivalRestricted).toBe(true);
  const start=(await state(page)).position[2];
  await page.keyboard.down('w');await page.waitForTimeout(700);await page.keyboard.up('w');
  await expect.poll(async()=>(await state(page)).position[2]).toBeLessThan(start-.5);
  await page.keyboard.down('Shift');await page.keyboard.down('w');await page.waitForTimeout(5000);await page.keyboard.up('w');await page.keyboard.up('Shift');
  expect((await state(page)).position[2]).toBeGreaterThanOrEqual(7.29);
  await page.locator('#places-toggle').click();await page.locator('#home-destination').click();
  await page.locator('#places-toggle').click();await page.locator('#studio-view').click();await expect(page.locator('#save-avatar')).toBeEnabled();
  await expect(page.locator('#campus-progress')).toBeHidden();
  await page.locator('#save-avatar').click();await expect.poll(async()=>(await state(page)).mode).toBe('town');
  expect((await state(page)).campusReady).toBe(false);
  await page.screenshot({path:info.outputPath('playable-arrival.png')});
  await page.setViewportSize({width:390,height:844});
  const notice=await page.locator('#campus-progress').boundingBox();
  expect(notice.x).toBeGreaterThanOrEqual(0);expect(notice.x+notice.width).toBeLessThanOrEqual(390);
  const controls=await page.locator('#world-tools').boundingBox();expect(notice.y).toBeGreaterThanOrEqual(controls.y+controls.height);
  await expect(page.locator('#places-toggle')).toBeInViewport();
  await page.screenshot({path:info.outputPath('playable-arrival-phone.png')});
  await page.setViewportSize({width:1280,height:720});
  release();await expect.poll(async()=>(await state(page)).campusReady,{timeout:60000}).toBe(true);
  const timing=await page.evaluate(()=>({first:Number(document.querySelector('#scene').dataset.firstFrameMs),optional:performance.getEntriesByType('resource').filter(r=>/mature-eucalypt-a-packed|grass-ecc-campus-v1-lossless/.test(r.name)).map(r=>r.startTime)}));
  expect(timing.optional.length).toBeGreaterThan(0);expect(timing.optional.every(t=>t>=timing.first)).toBe(true);
  expect((await state(page)).arrivalRestricted).toBe(false);expect((await state(page)).scenery.trees).toBe(19);
  await page.locator('#places-toggle').click();await page.locator('#home-destination').click();await expect.poll(async()=>(await state(page)).position[0]).toBeCloseTo(1.385,1);
  await page.screenshot({path:info.outputPath('complete-campus.png')});
  expect(requests.some(u=>/mr-middleton|occupational-top-chef/.test(u))).toBe(false);expect(errors).toEqual([]);
 }finally{release();}
});

test('background failure keeps Arrival and Studio usable; retry does not duplicate scenery or replace the avatar',async({page})=>{
 test.setTimeout(120000);let fail=true,avatars=0;
 await page.route('**/mature-eucalypt-b-packed.glb',route=>fail?route.abort():route.continue());
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text())+'\nwindow.inspectCampus=()=>({groups:worlds.town.children.filter(o=>o.name==="Campus landscape").length,colliders:worlds.townPhysics.world.colliders.len()});'});});
 page.on('request',r=>{if(r.url().includes('/player-schoolboy'))avatars++;});
 await page.goto('/playable-3d/',{waitUntil:'domcontentloaded'});await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 await expect(page.locator('#campus-retry')).toBeVisible({timeout:60000});
 await expect.poll(async()=>(await state(page)).arrivalRestricted).toBe(true);
 const before=await page.evaluate(()=>window.inspectCampus());expect(before.groups).toBe(0);
 await page.locator('#places-toggle').click();await page.locator('#studio-view').click();await expect(page.locator('#save-avatar')).toBeEnabled();await page.locator('#save-avatar').click();
 fail=false;await page.locator('#campus-retry').click();await expect.poll(async()=>(await state(page)).campusReady,{timeout:60000}).toBe(true);
 const after=await page.evaluate(()=>window.inspectCampus());expect(after.groups).toBe(1);expect(after.colliders).toBeGreaterThan(before.colliders);expect(avatars).toBe(1);
 await expect(page.locator('#campus-progress')).toBeHidden();
});


test('a failed detail texture retries in place after the landscape has already loaded',async({page})=>{
 test.setTimeout(120000);let fail=true;
 await page.route('**/grass-ecc-campus-v1-lossless.webp',route=>fail?route.abort():route.continue());
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text())+'\nwindow.finishedMaterials=()=>({groups:worlds.town.children.filter(o=>o.name==="Campus landscape").length,materials:(()=>{const rows=[];worlds.town.traverse(o=>{if(o.isMesh&&o.material?.name==="Approved campus sandstone")rows.push([o.material.map?.image?.width,o.material.normalMap?.image?.width,o.material.envMap?.image?.width]);});return rows;})()});'});});
 await page.goto('/playable-3d/',{waitUntil:'domcontentloaded'});await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 await expect(page.locator('#campus-retry')).toBeVisible({timeout:60000});await expect.poll(async()=>(await state(page)).arrivalRestricted).toBe(true);
 expect((await page.evaluate(()=>window.finishedMaterials())).groups).toBe(1);
 fail=false;await page.locator('#campus-retry').click();await expect.poll(async()=>(await state(page)).campusReady,{timeout:60000}).toBe(true);
 const final=await page.evaluate(()=>window.finishedMaterials());expect(final.groups).toBe(1);expect(final.materials.length).toBeGreaterThan(0);
 expect(final.materials.every(row=>row.every(size=>size>1))).toBe(true);
});
