import {test,expect} from './campus-fixtures.js';
for(const width of [1280,390])test(`My Life navigation survives delayed and failed tracker modules at ${width}`,async({page},info)=>{
 await page.setViewportSize({width,height:844});let release;const gate=new Promise(r=>release=r);
 await page.route('**/economy-lab/app.mjs?*',async r=>{await Promise.race([gate,new Promise(resolve=>setTimeout(resolve,10000))]);await r.continue();});
 await page.goto('/economy-lab/?review=1',{waitUntil:'commit'});
 for(const name of ['money','shop','progress','work','impact']){await page.locator(`[data-panel="${name}"]`).click();await expect(page.locator('#panel-'+name)).toBeVisible();}
 const back=page.getByRole('link',{name:'Back to game'});await expect(back).toBeVisible();await expect(back).toBeInViewport();expect(await back.getAttribute('href')).toContain('/playable-3d/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 release();await expect(page.locator('#tracker-loading')).toBeHidden();await expect(page.locator('#panel-impact')).toBeVisible();await page.screenshot({path:info.outputPath('tracker-navigation.png')});
 await page.locator('[data-panel="money"]').click();await expect(page.locator('#metrics')).toContainText('$1,000');
 await page.unroute('**/economy-lab/app.mjs?*');await page.route('**/economy-lab/app.mjs?*',r=>r.abort());await page.reload({waitUntil:'domcontentloaded'});await expect(page.locator('#tracker-loading')).toContainText('could not load');await page.locator('[data-panel="work"]').click();await expect(page.locator('#panel-work')).toBeVisible();
 await back.click();await expect(page).toHaveURL(/playable-3d\/\?review=1&market-review=1/);
});
