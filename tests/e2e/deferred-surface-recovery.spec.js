import {test,expect} from '@playwright/test';
import {sampleStartupDiagnostics} from './startup-diagnostics.js';
test('real grass failure stays retryable and successful retry restores the completed entry',async({page},info)=>{
 test.setTimeout(60000);let grassRequests=0;const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('STARTUP_PAGE_ERROR',e.message);});
 await page.route('**/grass-ecc-campus-v1-lossless.webp',route=>{grassRequests++;console.log('STARTUP_GRASS_REQUEST',grassRequests);return grassRequests===1?route.abort('failed'):route.continue();});
 // Production diagnostics already include rendered frames and entry readiness.
 // Observe those values directly; no app response rewriting or scheduling hooks.
 await page.goto('/playable-3d/');await page.locator('#taster-skip').click();
 const state=async()=>{const nodeStartMs=Math.round(performance.now());console.log('STARTUP_POLL_START',nodeStartMs);const sample=await page.evaluate(sampleStartupDiagnostics);console.log('STARTUP_POLL_END',JSON.stringify({nodeStartMs,nodeEndMs:Math.round(performance.now()),pageMs:sample.pageMs,timeOrigin:sample.timeOrigin,url:sample.url,diagnosticsCount:sample.diagnosticsCount,firstFrameMs:sample.firstFrameMs,entryVisibleMs:sample.entryVisibleMs,renderedFrames:sample.state.renderedFrames,renderFrameMs:sample.state.renderFrameMs,runId:sample.state.runId,entryReady:sample.state.entryReady,detailFailed:sample.state.surfaceDetailFailed,pending:sample.state.surfaceDetailPending}));return sample.state;};
 await expect.poll(state,{timeout:45000}).toMatchObject({entryReady:true,avatarBody:'antonio',surfaceDetailFailed:true});
 expect((await state()).surfaceDetailPending).toBeGreaterThan(0);await expect(page.locator('#campus-progress')).toBeVisible();
 await page.locator('#campus-retry').click();await expect.poll(state,{timeout:30000}).toMatchObject({surfaceDetailPending:0,surfaceDetailFailed:false,campusReady:false});
 await expect(page.locator('#campus-progress')).not.toBeVisible();await expect(page.locator('#campus-minimap')).toBeVisible();
 expect(grassRequests).toBe(2);expect(errors).toEqual([]);await page.screenshot({path:info.outputPath('grass-recovered.png')});
});
