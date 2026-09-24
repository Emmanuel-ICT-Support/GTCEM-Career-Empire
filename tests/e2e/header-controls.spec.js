import {test,expect} from './campus-fixtures.js';
const state=p=>p.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}'));
for(const width of [1280,854,390])test(`banner controls are clear and destinations work at ${width}`,async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:844});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/playable-3d/?review=1&market-review=1',{waitUntil:'domcontentloaded'});await expect(page.locator('#loading')).toBeHidden({timeout:30000});
 await expect.poll(async()=>(await state(page)).campusReady,{timeout:60000}).toBe(true);
 for(const selector of ['#phase','#flyover-toggle','#places-toggle','.ce-feedback-launcher','#arrival-mission .mobile-panel-toggle']){
  await expect(page.locator(selector)).toBeInViewport();
  expect(await page.locator(selector).evaluate(e=>{const a=e.getBoundingClientRect(),b=document.querySelector('.topbar').getBoundingClientRect();return a.top>=b.top&&a.bottom<=b.bottom&&a.left>=0&&a.right<=innerWidth;})).toBe(true);
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:info.outputPath('clear-world.png')});
 await page.locator('#places-toggle').click();await expect(page.locator('#destination-bar')).toBeVisible();
 for(const id of ['oval','careers','studio','market','home','chapel','est','media','space'])await expect(page.locator(`#${id}-destination`)).toBeInViewport();
 await page.screenshot({path:info.outputPath('places.png')});await page.locator('#est-destination').click();await expect.poll(async()=>(await state(page)).mode,{timeout:20000}).toBe('interior');
 await page.locator('#places-toggle').click();await page.locator('#careers-destination').click();await expect.poll(async()=>(await state(page)).mode,{timeout:20000}).toBe('careers');
 await page.locator('#places-toggle').click();await page.locator('#oval-destination').click();await expect.poll(async()=>(await state(page)).position[2]).toBeLessThan(-49);
 if(width===854){
  for(const [id,mode]of [['home','town'],['chapel','chapel'],['media','town'],['space','town'],['market','market'],['studio','studio']]){
   await page.locator('#places-toggle').click();await page.locator(`#${id}-destination`).click();
   await expect.poll(async()=>(await state(page)).mode,{timeout:30000}).toBe(mode);
   if(id==='media')await expect(page.locator('#location-title')).toHaveText('English and Media');
   if(id==='space')await expect(page.locator('#location-title')).toHaveText('SPACE');
  }
  await expect(page.locator('#save-avatar')).toBeEnabled();await page.locator('#town-view').click();
  await page.locator('#flyover-toggle').click();await expect(page.locator('#flyover-panel')).toBeVisible();await page.locator('#flyover-exit').click();
  await page.locator('#phase').selectOption('growth');await expect.poll(async()=>(await state(page)).phase).toBe('growth');
 }
 await page.locator('.ce-feedback-launcher').click();await expect(page.locator('.ce-feedback-backdrop')).toBeVisible();
 expect(errors).toEqual([]);
});
