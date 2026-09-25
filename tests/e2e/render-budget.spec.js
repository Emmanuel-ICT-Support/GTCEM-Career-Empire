import {test,expect} from '@playwright/test';
test('Auto keeps controls available, manual quality works, and hidden views stop rendering',async({page})=>{
 test.setTimeout(120000);
 await page.addInitScript(()=>{window.testHidden=false;Object.defineProperty(document,'hidden',{get:()=>window.testHidden,configurable:true});});
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+'\nwindow.renderProbe={get frame(){return renderer.info.render.frame},get ratio(){return renderer.getPixelRatio()},get shadows(){return renderer.shadowMap.enabled}};'});});
 await page.goto('/playable-3d/?echo-review=1&review=1');await page.locator('#echo-cue').waitFor({state:'visible',timeout:90000});
 await page.locator('#echo-cue').click();await page.locator('[data-next]').click();await expect(page.locator('#echo-dialogue h2')).toHaveText('A different kind of year');await page.keyboard.press('Escape');
 await page.locator('#world-tools summary').click();await page.locator('#quality').selectOption('low');expect(await page.evaluate(()=>window.renderProbe.shadows)).toBe(false);
 await page.locator('#quality').selectOption('high');expect(await page.evaluate(()=>window.renderProbe.shadows)).toBe(true);
 await page.locator('#quality').selectOption('auto');expect(await page.evaluate(()=>window.renderProbe.ratio)).toBeLessThanOrEqual(1);
 const start=await page.evaluate(()=>{window.testHidden=true;document.dispatchEvent(new Event('visibilitychange'));return window.renderProbe.frame;});await page.waitForTimeout(800);expect(await page.evaluate(()=>window.renderProbe.frame)).toBe(start);
 await page.evaluate(()=>{window.testHidden=false;document.dispatchEvent(new Event('visibilitychange'));});await expect.poll(()=>page.evaluate(()=>window.renderProbe.frame)).toBeGreaterThan(start);
});
