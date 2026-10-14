import {test,expect} from './campus-fixtures.js';
const state=page=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}'));

test('Arrival retains complete geometry and usable walking while optional surfaces wait',async({page},info)=>{
 test.setTimeout(120000);let release;const gate=new Promise(resolve=>release=resolve),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
 await page.route('**/plaza/limestone-ecc-campus-v1.png',async route=>{await gate;await route.continue();});
 try{
  await page.goto('/playable-3d/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#loading')).toBeHidden({timeout:45000});
  await expect.poll(async()=>(await state(page)),{timeout:30000}).toMatchObject({mode:'town',entryReady:true,campusReady:false,arrivalRestricted:false});
  expect((await state(page)).scenery.trees).toBe(19);expect((await state(page)).scenery.buildings).toBe(2);
  const start=(await state(page)).position[2];await page.locator('#scene').focus();
  await page.keyboard.down('w');await page.waitForTimeout(700);await page.keyboard.up('w');
  await expect.poll(async()=>(await state(page)).position[2]).toBeLessThan(start-.5);
  await page.keyboard.down('Shift');await page.keyboard.down('w');await page.waitForTimeout(1200);await page.keyboard.up('w');await page.keyboard.up('Shift');
  await expect.poll(async()=>(await state(page)).position[2]).toBeLessThan(start-3);
  await page.locator('#places-toggle').click();await page.locator('#studio-view').click();await expect(page.locator('#save-avatar')).toBeEnabled();
  await expect(page.locator('#campus-progress')).toBeHidden();await page.locator('#save-avatar').click();await expect.poll(async()=>(await state(page)).mode).toBe('town');
  await page.screenshot({path:info.outputPath('playable-arrival.png')});await page.setViewportSize({width:390,height:844});
  await expect(page.locator('#campus-retry')).toBeVisible({timeout:30000});
  const notice=await page.locator('#campus-progress').boundingBox();expect(notice.x).toBeGreaterThanOrEqual(0);expect(notice.x+notice.width).toBeLessThanOrEqual(390);
  await expect.poll(async()=>{const n=await page.locator('#campus-progress').boundingBox(),c=await page.locator('#world-tools').boundingBox();return n.y-(c.y+c.height);}).toBeGreaterThanOrEqual(0);
  await expect(page.locator('#places-toggle')).toBeInViewport();await page.screenshot({path:info.outputPath('playable-arrival-phone.png')});
  await page.setViewportSize({width:1280,height:720});release();await expect.poll(async()=>(await state(page)).surfaceDetailPending,{timeout:30000}).toBe(0);
  await page.locator('#world-tools summary').click();await page.locator('#aerial').click();await page.locator('#world-tools summary').click();await expect.poll(async()=>(await state(page)).campusReady,{timeout:60000}).toBe(true);
  const timing=await page.evaluate(()=>({first:Number(document.querySelector('#scene').dataset.firstFrameMs),optional:performance.getEntriesByType('resource').filter(r=>r.name.includes('/plaza/limestone-ecc-campus-v1.png')).map(r=>r.startTime)}));
  expect(timing.optional.length).toBeGreaterThan(0);expect(timing.optional.every(t=>t>=timing.first)).toBe(true);
  expect((await state(page)).arrivalRestricted).toBe(false);expect((await state(page)).scenery.trees).toBe(19);
  await page.locator('#places-toggle').click();await page.locator('#home-destination').click();await expect.poll(async()=>(await state(page)).position[0]).toBeCloseTo(1.385,1);
  await page.screenshot({path:info.outputPath('complete-campus.png')});expect(requests.some(u=>/mr-middleton|occupational-top-chef/.test(u))).toBe(false);expect(errors).toEqual([]);
 }finally{release();}
});

test('background failure keeps Arrival and Studio usable; retry does not duplicate scenery or replace the avatar',async({page})=>{
 test.setTimeout(120000);let fail=true,avatars=0;
 await page.route('**/mature-eucalypt-b-packed.glb',route=>fail?route.abort():route.continue());
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text())+'\nwindow.inspectCampus=()=>({groups:worlds.town.children.filter(o=>o.name==="Campus landscape").length,colliders:worlds.townPhysics.world.colliders.len()});'});});
 page.on('request',r=>{if(r.url().includes('/whole-characters/antonio.glb'))avatars++;});
 await page.goto('/playable-3d/',{waitUntil:'domcontentloaded'});await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 await page.locator('#world-tools summary').click();await page.locator('#aerial').click();await page.locator('#world-tools summary').click();
 await expect(page.locator('#campus-retry')).toBeVisible({timeout:60000});
 await expect.poll(async()=>(await state(page)).arrivalRestricted).toBe(true);
 const before=await page.evaluate(()=>window.inspectCampus());expect(before.groups).toBe(0);
 await page.locator('#places-toggle').click();await page.locator('#studio-view').click();await expect(page.locator('#save-avatar')).toBeEnabled();await page.locator('#save-avatar').click();
 fail=false;await page.locator('#campus-retry').click();await expect.poll(async()=>(await state(page)).entryReady,{timeout:60000}).toBe(true);
 await page.locator('#world-tools summary').click();await page.locator('#aerial').click();await page.locator('#world-tools summary').click();await expect.poll(async()=>(await state(page)).campusReady,{timeout:60000}).toBe(true);
 const after=await page.evaluate(()=>window.inspectCampus());expect(after.groups).toBe(1);expect(after.colliders).toBeGreaterThan(before.colliders);expect(avatars).toBe(1);
 await expect(page.locator('#campus-progress')).toBeHidden();
});


test('a failed optional surface retries without replacing complete entry landscape',async({page})=>{
 test.setTimeout(120000);let fail=true;
 await page.route('**/grass-ecc-campus-v1-lossless.webp',route=>fail?route.abort():route.continue());
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text())+'\nwindow.finishedMaterials=()=>({groups:worlds.town.children.filter(o=>o.name==="Campus landscape").length,materials:(()=>{const rows=[];worlds.town.traverse(o=>{if(o.isMesh&&o.material?.name==="Approved campus sandstone")rows.push([o.material.map?.image?.width,o.material.normalMap?.image?.width,o.material.envMap?.image?.width]);});return rows;})()});'});});
 await page.goto('/playable-3d/',{waitUntil:'domcontentloaded'});await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 await page.locator('#world-tools summary').click();await page.locator('#aerial').click();await page.locator('#world-tools summary').click();
 await expect(page.locator('#campus-retry')).toBeVisible({timeout:60000});await expect.poll(async()=>(await state(page)).entryReady).toBe(true);await expect.poll(async()=>(await state(page)).arrivalRestricted).toBe(false);
 expect((await page.evaluate(()=>window.finishedMaterials())).groups).toBe(1);const position=(await state(page)).position;await page.locator('#scene').focus();await page.keyboard.down('KeyD');await page.waitForTimeout(600);await page.keyboard.up('KeyD');await expect.poll(async()=>(await state(page)).position[0]).toBeGreaterThan(position[0]+.2);
 fail=false;await page.locator('#campus-retry').click();await expect.poll(async()=>(await state(page)).entryReady,{timeout:60000}).toBe(true);
 await page.locator('#world-tools summary').click();await page.locator('#aerial').click();await page.locator('#world-tools summary').click();await expect.poll(async()=>(await state(page)).campusReady,{timeout:60000}).toBe(true);
 const final=await page.evaluate(()=>window.finishedMaterials());expect(final.groups).toBe(1);expect(final.materials.length).toBeGreaterThan(0);
 expect(final.materials.every(row=>row.every(size=>size>1))).toBe(true);
});
