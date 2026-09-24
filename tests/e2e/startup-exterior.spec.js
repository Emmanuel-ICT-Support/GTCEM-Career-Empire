import {test,expect} from './campus-fixtures.js';
test('delayed courtyard must not hold game entry',async({page},info)=>{
 test.setTimeout(60000);
 await page.route('**/ecc-exterior-annotations.glb?*',async route=>{await new Promise(r=>setTimeout(r,8000));await route.continue();});
 await page.goto('/playable-3d/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#loading')).toBeHidden({timeout:25000});
 const ms=await page.locator('#scene').evaluate(e=>Number(e.dataset.firstFrameMs));
 console.log('Courtyard delayed first frame:',ms);
 await info.attach('timing',{body:JSON.stringify({firstFrameMs:ms,delayMs:8000}),contentType:'application/json'});
 await page.locator('#places-toggle').click();await page.locator('#est-destination').click();
 await expect.poll(()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}').mode)).toBe('interior');
 expect(ms).toBeLessThan(8000);
});

test('failed courtyard keeps curriculum usable and retry opens campus once',async({page})=>{
 test.setTimeout(90000);let fail=true;
 await page.route('**/ecc-exterior-annotations.glb?*',r=>fail?r.abort():r.continue());
 await page.route('**/app.js?*',async r=>{const response=await r.fetch();await r.fulfill({response,body:(await response.text())+'\nwindow.exteriorCheck=()=>({children:worlds.est.children.length,colliders:worlds.townPhysics.world.colliders.len()});'});});
 const state=()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}'));
 await page.goto('/playable-3d/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#loading')).toBeHidden({timeout:15000});
 await expect(page.locator('#campus-retry')).toBeVisible({timeout:30000});
 await expect.poll(async()=>(await state()).arrivalRestricted).toBe(true);
 await page.locator('#places-toggle').click();await page.locator('#careers-destination').click();await expect.poll(async()=>(await state()).mode).toBe('careers');
 fail=false;await page.locator('#places-toggle').click();await page.locator('#town-view').click();await page.locator('#campus-retry').click();
 await expect.poll(async()=>(await state()).campusReady,{timeout:45000}).toBe(true);
 expect((await state()).arrivalRestricted).toBe(false);
 const finished=await page.evaluate(()=>window.exteriorCheck());expect(finished.children).toBe(1);expect(finished.colliders).toBeGreaterThan(20);
 await page.locator('#places-toggle').click();await page.locator('#home-destination').click();await expect.poll(async()=>(await state()).position[0]).toBeCloseTo(1.385,1);
 expect(await page.evaluate(()=>window.exteriorCheck())).toEqual(finished);
});
