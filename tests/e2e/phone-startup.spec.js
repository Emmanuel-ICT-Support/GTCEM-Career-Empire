import {test,expect} from './campus-fixtures.js';

test.use({hasTouch:true,isMobile:true,viewport:{width:390,height:844}});

// Expose cache state only in the intercepted test module, never in production.
async function cacheProbe(page){await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text())+'\nwindow.__startupCache=THREE.Cache;'});});}

test('phone opening uses smaller phone assets once and releases startup cache',async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width:390,height:844});await cacheProbe(page);
 const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/playable-3d/');await expect(page.locator('#loading')).toBeHidden({timeout:90000});await expect.poll(()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}').campusReady),{timeout:90000}).toBe(true);
 for(const id of ['mature-eucalypt-a','mature-eucalypt-b','small-multistem-a']){
  expect(requests.filter(u=>u.endsWith('/'+id+'-mobile.glb'))).toHaveLength(1);
  expect(requests.some(u=>u.endsWith('/'+id+'.glb')||u.endsWith('/'+id+'-packed.glb'))).toBe(false);
 }
 expect(requests.some(u=>/teacher-npc|mr-middleton.*glb|mr-psandodakis.*glb|\/studio.js|OrbitControls/.test(u))).toBe(false);
 expect(await page.evaluate(()=>({enabled:window.__startupCache.enabled,count:Object.keys(window.__startupCache.files).length}))).toEqual({enabled:false,count:0});
 const state=()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state));await expect.poll(async()=>(await state()).scenery.status).toBe('ready');expect((await state()).scenery.trees).toBe(19);
 expect(requests.some(u=>u.includes('/assets/phone/grass-ecc-campus-v1-mobile.webp'))).toBe(true);
 await page.setViewportSize({width:844,height:390});
 const before=(await state()).position[2];await page.keyboard.down('w');await page.waitForTimeout(500);await page.keyboard.up('w');await expect.poll(async()=>(await state()).position[2]).toBeLessThan(before-.1);
 expect(errors).toEqual([]);
});

test('failed phone tree load clears temporary cache and supports retry without reloading the character',async({page})=>{
 test.setTimeout(120000);await cacheProbe(page);let fail=true;
 await page.route('**/mature-eucalypt-b-mobile.glb',route=>fail?route.abort():route.continue());
 await page.goto('/playable-3d/');await expect(page.locator('#loading')).toBeHidden({timeout:90000});await expect(page.locator('#campus-retry')).toBeVisible({timeout:90000});
 expect(await page.evaluate(()=>({enabled:window.__startupCache.enabled,count:Object.keys(window.__startupCache.files).length}))).toEqual({enabled:false,count:0});
 fail=false;await page.locator('#campus-retry').click();await expect(page.locator('#loading')).toBeHidden({timeout:90000});await expect.poll(()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}').campusReady),{timeout:90000}).toBe(true);
 expect(await page.evaluate(()=>window.__startupCache.enabled)).toBe(false);
});


test.describe('desktop asset selection',()=>{
 test.use({hasTouch:false,isMobile:false,viewport:{width:1280,height:800}});
 test('desktop retains original textures and full-detail packed geometry',async({page})=>{
  test.setTimeout(120000);const requests=[];page.on('request',r=>requests.push(r.url()));
  await page.goto('/playable-3d/');await expect(page.locator('#loading')).toBeHidden({timeout:90000});await expect.poll(()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}').campusReady),{timeout:90000}).toBe(true);
  expect(requests.some(u=>u.includes('/assets/phone/'))).toBe(false);
  expect(requests.some(u=>u.endsWith('/mature-eucalypt-a-packed.glb'))).toBe(true);
  expect(requests.some(u=>u.endsWith('/grass-ecc-campus-v1-lossless.webp'))).toBe(true);
 });
});
