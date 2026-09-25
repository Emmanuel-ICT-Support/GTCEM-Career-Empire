import {test,expect} from '@playwright/test';
const entry='/playable-3d/';
async function boot(page,query=''){
 await page.route('**/app.js?*',async r=>{const response=await r.fetch();await r.fulfill({response,body:await response.text()+'\nwindow.__echoTest={get echo(){return echo},get actor(){return actor},get camera(){return camera},get worlds(){return worlds},get renderer(){return renderer},get teachers(){return teachers},get nightMarket(){return nightMarket},updateCamera};'});});
 await page.goto(entry+query);await page.locator('#echo-cue').waitFor({state:'visible',timeout:90000});
}
test('staged tasks, skips, persistence and revisiting do not fabricate completion',async({page})=>{
 test.setTimeout(180000);await boot(page);await page.locator('#echo-cue').click();
 await expect(page.locator('#arrival-mission')).toBeHidden();
 await page.locator('[data-next]').click();await page.locator('[data-next]').click();
 await expect(page.locator('[data-next]')).toBeHidden();await expect(page.locator('#echo-dialogue h2')).toHaveText('First · Course Documents');
 await page.locator('[data-action]').click();await expect(page.locator('[data-message]')).toContainText('not available here yet');
 await page.locator('[data-next]').click();await expect(page.locator('#echo-dialogue h2')).toHaveText('Put learning into practice');
 await page.locator('[data-next]').click();await page.locator('[data-next]').click();
 await expect(page.locator('#echo-dialogue h2')).toHaveText('Next · Your avatar');
 await page.locator('[data-skip]').click();await expect(page.locator('#echo-dialogue h2')).toHaveText('Your experience matters');
 await expect(page.locator('[data-revisit]')).toContainText('Avatar Studio');await page.keyboard.press('Escape');
 await expect(page.locator('#arrival-mission')).toBeVisible();await page.reload();await page.locator('#echo-cue').waitFor({state:'visible',timeout:90000});await page.locator('#echo-cue').click();await expect(page.locator('#echo-dialogue h2')).toHaveText('Your experience matters');
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('ce-echo-v2:')))));expect(state.skippedTasks).toEqual([5]);expect(state.avatarSaved).toBe(false);
 await page.locator('[data-revisit] button').click();await expect(page.locator('#studio-panel')).toBeVisible({timeout:90000});await expect(page.locator('#save-avatar')).toBeEnabled({timeout:90000});await page.locator('#save-avatar').click();await page.locator('#echo-cue').click();await expect(page.locator('[data-revisit] button')).toHaveCount(0);
 await page.locator('[data-next]').click();await page.locator('[data-next]').click();await page.locator('[data-next]').click();await expect(page.locator('[data-next]')).toBeHidden();await page.locator('[data-skip]').click();await expect(page.locator('#echo-dialogue h2')).toHaveText('Your Year 12 journey begins');await page.locator('[data-next]').click();
});
test('phone and reduced motion leave Echo and player visible',async({page},info)=>{
 test.setTimeout(120000);await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await boot(page,'?echo-review=1');await page.waitForFunction(()=>JSON.parse(document.querySelector('#diagnostics').value||'{}').avatarFallback===false);await page.locator('#echo-cue').click();await expect(page.locator('#echo-dialogue')).toBeVisible();await page.screenshot({path:info.outputPath('echo-phone.png')});const result=await page.evaluate(()=>{const t=window.__echoTest,p=t.echo.root.position.clone();p.y+=.4;p.project(t.camera);const panel=document.querySelector('#echo-dialogue').getBoundingClientRect();return {x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2,bottom:panel.bottom,right:panel.right,top:panel.top,header:document.querySelector('.topbar').getBoundingClientRect().bottom,bob:t.echo.snapshot().bob};});expect(result.top).toBeGreaterThan(result.header);expect(result.x).toBeGreaterThan(0);expect(result.x).toBeLessThan(390);expect(result.y).toBeGreaterThan(result.bottom);expect(result.right).toBeLessThanOrEqual(390);expect(result.bob).toBe(0);await page.keyboard.press('Escape');await expect(page.locator('#echo-dialogue')).toBeHidden();
});
test('optional Echo failure does not block arrival or preload teachers and Studio',async({page})=>{
 test.setTimeout(120000);const urls=[];page.on('request',r=>urls.push(r.url()));await page.route('**/echo-guide.js?*',r=>r.abort());await page.goto(entry);await page.waitForFunction(()=>document.querySelector('#loading').hidden,null,{timeout:90000});await expect(page.locator('#scene')).toBeVisible();await page.waitForTimeout(700);expect(urls.some(u=>/teacher-npc|mr-middleton.*glb|\/studio.js/.test(u))).toBe(false);await page.keyboard.press('KeyW');
});
