import {test,expect} from './campus-fixtures.js';

test('Home Base returns to ECC welcome; Studio remains separate',async({page})=>{
 test.setTimeout(180000);
 await page.goto('/playable-3d/');
 await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true',{timeout:120000});
 await page.locator('#places-toggle').click();await page.locator('#home-destination').click();
 // Home travel owns campus readiness; the initial rendered fallback is not arrival.
 await expect.poll(()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}').campusReady),{timeout:90000}).toBe(true);
 await expect.poll(async()=>JSON.parse(await page.locator('#diagnostics').getAttribute('data-state')).position[0]).toBeCloseTo(1.385,1);
 await expect.poll(async()=>JSON.parse(await page.locator('#diagnostics').getAttribute('data-state')).position[2]).toBeCloseTo(-.877,1);
 await expect(page.locator('#studio-panel')).toBeHidden();
 await expect(page.locator('#location-title')).toHaveText('Home Base');
 await page.locator('#places-toggle').click();await page.locator('#studio-view').click();
 await expect(page.locator('#save-avatar')).toBeEnabled();
 await page.locator('#save-avatar').click();
 await expect(page.locator('#studio-panel')).toBeHidden();
});
