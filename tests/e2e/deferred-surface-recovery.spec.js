import {test,expect} from '@playwright/test';
test('real grass failure stays retryable and successful retry restores the completed entry',async({page},info)=>{
 test.setTimeout(60000);let grassRequests=0;const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/grass-ecc-campus-v1-lossless.webp',route=>++grassRequests===1?route.abort('failed'):route.continue());
 await page.goto('/playable-3d/');await page.locator('#taster-skip').click();
 const state=()=>page.evaluate(()=>JSON.parse(document.querySelector('#diagnostics')?.dataset.state||'{}'));
 await expect.poll(state,{timeout:45000}).toMatchObject({entryReady:true,avatarBody:'antonio',surfaceDetailFailed:true});
 expect((await state()).surfaceDetailPending).toBeGreaterThan(0);await expect(page.locator('#campus-progress')).toBeVisible();
 await page.locator('#campus-retry').click();await expect.poll(state,{timeout:30000}).toMatchObject({surfaceDetailPending:0,surfaceDetailFailed:false,campusReady:false});
 await expect(page.locator('#campus-progress')).not.toBeVisible();await expect(page.locator('#campus-minimap')).toBeVisible();
 expect(grassRequests).toBe(2);expect(errors).toEqual([]);await page.screenshot({path:info.outputPath('grass-recovered.png')});
});
