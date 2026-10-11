import {test,expect} from '@playwright/test';
// This case includes two cold world boots on the hosted software renderer.
test.setTimeout(240000);
const entry='/playable-3d/?discovery=1';
test('intro playback, skip and replay preserve the trail and production avatar',async({page})=>{
 await page.goto(entry);await expect(page.locator('#taster-intro')).toBeVisible({timeout:90000});
 const original=await page.evaluate(()=>({trail:localStorage.getItem('ce-missing-frame-local-review-v1'),profiles:Object.fromEntries(Object.entries(localStorage).filter(([k])=>/profile/i.test(k)))}));
 await expect(page.locator('#taster-video')).not.toHaveAttribute('src',/.+/);await page.locator('#taster-play').click();await expect.poll(()=>page.locator('#taster-video').evaluate(v=>v.currentTime),{timeout:30000}).toBeGreaterThan(.1);
 await page.locator('#taster-skip').click();await expect(page.locator('#taster-intro')).not.toBeVisible();await page.reload();await expect(page.locator('#discovery-open')).toBeVisible({timeout:90000});await expect(page.locator('#taster-intro')).not.toBeVisible();await page.locator('#world-tools summary').click();await page.locator('#replay-taster-intro').click();await expect(page.locator('#taster-intro')).toBeVisible();await page.keyboard.press('Escape');
 expect(await page.evaluate(()=>({trail:localStorage.getItem('ce-missing-frame-local-review-v1'),profiles:Object.fromEntries(Object.entries(localStorage).filter(([k])=>/profile/i.test(k)))}))).toEqual(original);
});
test('phone reduced-motion opening offers readable script and immediate skip',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(entry);await expect(page.locator('#taster-still')).toBeVisible({timeout:90000});await expect(page.locator('.taster-transcript')).toContainText('Your first clue is waiting along the path.');await expect(page.locator('#taster-video')).not.toHaveAttribute('src',/.+/);const box=await page.locator('#taster-skip').boundingBox();expect(box.y+box.height).toBeLessThanOrEqual(844);await page.locator('#taster-skip').click();await expect(page.locator('#taster-intro')).not.toBeVisible();
});
