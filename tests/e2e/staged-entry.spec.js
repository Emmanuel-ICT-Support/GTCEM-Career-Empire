import {test,expect} from '@playwright/test';

test('sharp entry prepares the next task without loading distant campus or recording completion',async({page})=>{
 test.setTimeout(120000);const requests=[];page.on('request',r=>requests.push(r.url()));
 const state=()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}'));
 await page.goto('/playable-3d/');
 await expect.poll(async()=>(await state()).entryReady,{timeout:90000}).toBe(true);
 expect((await state()).campusReady).toBe(false);
 expect((await state()).renderRatio).toBe(await page.evaluate(()=>Math.min(devicePixelRatio,1.5)));
 expect(requests.some(u=>u.includes('careers-shared-textures.glb'))).toBe(false);
 expect(requests.some(u=>u.includes('night-market.js?'))).toBe(false);
 await page.locator('#echo-cue').click();await page.locator('[data-next]').click();await page.locator('[data-next]').click();
 await page.locator('[data-action]').click();
 await expect(page.locator('#echo-dialogue h2')).toHaveText('Careers and Employability Course Documents');
 await expect.poll(()=>requests.some(u=>u.includes('/studio.js?'))).toBe(true);
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('ce-echo-v2:')))));
 expect((await saved()).resourcesVisited).toBe(true);expect((await saved()).avatarSaved).toBe(false);
 await page.reload();await expect.poll(async()=>(await state()).entryReady,{timeout:90000}).toBe(true);
 expect((await saved()).resourcesVisited).toBe(true);expect((await state()).campusReady).toBe(false);
 // Off-path exploration explicitly requests the full campus, preserving freedom.
 await page.locator('#world-tools summary').click();await page.locator('#aerial').click();
 await expect.poll(async()=>(await state()).campusReady,{timeout:90000}).toBe(true);
 expect(requests.some(u=>u.includes('careers-shared-textures.glb'))).toBe(true);
 expect((await state()).renderRatio).toBe(await page.evaluate(()=>Math.min(devicePixelRatio,1.5)));
});

test('failed entry detail leaves documents usable and can retry',async({page})=>{
 test.setTimeout(120000);let fail=true;
 await page.route('**/sandstone-diffuse.jpg',route=>fail?route.abort():route.continue());
 await page.goto('/playable-3d/');await page.locator('#echo-cue').waitFor({state:'visible',timeout:90000});
 await page.locator('#echo-cue').click();await page.locator('[data-next]').click();await page.locator('[data-next]').click();await page.locator('[data-action]').click();
 await expect(page.locator('#echo-dialogue h2')).toHaveText('Careers and Employability Course Documents');
 await page.keyboard.press('Escape');await expect(page.locator('#campus-retry')).toBeVisible({timeout:60000});
 fail=false;await page.locator('#campus-retry').click();
 await expect.poll(()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}').entryReady),{timeout:60000}).toBe(true);
});

test('skipping avatar prepares market kits without a market visit',async({page})=>{
 test.setTimeout(120000);const requests=[];page.on('request',r=>requests.push(r.url()));
 await page.goto('/playable-3d/');await page.locator('#echo-cue').waitFor({state:'visible',timeout:90000});
 await page.locator('#echo-cue').click();await page.locator('[data-skip]').click();
 await page.locator('[data-next]').click();await page.locator('[data-next]').click();await page.locator('[data-skip]').click();
 await expect.poll(()=>requests.some(u=>u.includes('/market-npcs/mara.glb')),{timeout:60000}).toBe(true);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('ce-echo-v2:')))));
 expect(saved.skippedTasks).toEqual([2,5]);expect(saved.avatarSaved).toBe(false);expect(saved.marketVisited).toBe(false);
 expect(requests.some(u=>u.includes('careers-shared-textures.glb'))).toBe(false);
});

test('a returning character past Market prepares the wider campus after entry',async({page})=>{
 test.setTimeout(120000);await page.goto('/playable-3d/');await page.locator('#echo-cue').waitFor({state:'visible',timeout:90000});await page.locator('#echo-cue').click();
 await page.evaluate(()=>{const key=Object.keys(localStorage).find(k=>k.startsWith('ce-echo-v2:'));const saved=JSON.parse(localStorage.getItem(key));localStorage.setItem(key,JSON.stringify({...saved,step:10,marketVisited:true,status:'seen'}));});
 await page.reload();
 const state=()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}'));
 await expect.poll(async()=>(await state()).entryReady,{timeout:60000}).toBe(true);
 expect((await state()).campusReady).toBe(false);
 await expect.poll(async()=>(await state()).campusReady,{timeout:60000}).toBe(true);
});
