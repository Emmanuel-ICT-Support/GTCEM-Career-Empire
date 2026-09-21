import {test,expect} from '@playwright/test';

test('normal play avoids GPU pixel probes and uses shared building textures',async({page})=>{
 test.setTimeout(90000);const requests=[],errors=[];
 page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.pixelReadbacks=0;const read=WebGL2RenderingContext.prototype.readPixels;WebGL2RenderingContext.prototype.readPixels=function(...args){window.pixelReadbacks++;return read.apply(this,args);};});
 await page.goto('/playable-3d/');await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true',{timeout:60000});
 await page.waitForTimeout(2200);expect(await page.evaluate(()=>window.pixelReadbacks)).toBe(0);
 const state=()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state));const start=await state();expect(start.pixelColours).toBeNull();
 await page.keyboard.down('w');await page.waitForTimeout(1000);await page.keyboard.up('w');await expect.poll(async()=>start.position[2]-(await state()).position[2]).toBeGreaterThan(.5);
 // The obsolete standalone garden model was removed with the courtyard cleanup.
 for(const name of ['careers','workplace'])expect(requests.some(u=>u.includes('/'+name+'-shared-textures.glb'))).toBe(true);
 expect(requests.some(u=>u.includes('/garden-shared-textures.glb'))).toBe(false);
 expect(requests.some(u=>/\/(garden|careers|workplace)\.glb(?:\?|$)/.test(u))).toBe(false);
 expect(new Set(requests.filter(u=>u.includes('/shared-textures/'))).size).toBe(6);
 expect(errors).toEqual([]);
});

test('pixel diagnostics remain available explicitly for visual checks',async({page})=>{
 test.setTimeout(90000);await page.goto('/playable-3d/?diagnostics=pixels');
 await expect.poll(()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}').pixelColours),{timeout:60000}).toBeGreaterThan(150);
});
