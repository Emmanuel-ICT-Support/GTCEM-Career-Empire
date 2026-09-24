import {test,expect} from './campus-fixtures.js';

const state=page=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state));
test('courtyard review opens the playable world and survives quality, resize and destination changes',async({page})=>{
 test.setTimeout(180000);const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('/playable-3d/?view=ecc-courtyard&diagnostics=pixels');await expect(page.locator('#loading')).toBeHidden({timeout:90000});
 await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true');
 await expect.poll(async()=>(await state(page)).position[2]).toBeCloseTo(-2.8,1);
 await expect.poll(async()=>(await state(page)).pixelColours).toBeGreaterThan(150);
 await page.keyboard.down('KeyD');await page.waitForTimeout(500);await page.keyboard.up('KeyD');
 await expect.poll(async()=>(await state(page)).position[0]).toBeGreaterThan(.2);
 await page.locator('#world-tools summary').click();await page.locator('#quality').selectOption('low');await expect.poll(async()=>(await state(page)).pixelColours).toBeGreaterThan(150);
 await page.setViewportSize({width:390,height:844});await page.locator('#quality').selectOption('auto',{force:true});
 await expect.poll(async()=>(await state(page)).pixelColours).toBeGreaterThan(150);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('#places-toggle').click();await page.locator('#chapel-destination').click();await expect(page.locator('#scene')).toHaveAttribute('aria-label','Interactive ECC Chapel',{timeout:30000});
 await page.locator('#town-view').click();await expect(page.locator('#scene')).toHaveAttribute('aria-label','Interactive 3D town');
 expect(errors).toEqual([]);
});
