import {test,expect} from '@playwright/test';
test('real entry upgrades to a visibly rendered full campus without duplicate roots or errors',async({page},info)=>{
 test.setTimeout(90000);const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('FULL_CAMPUS_PAGE_ERROR',e.message);});
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.fullCampusObservation=()=>({state:JSON.parse(document.querySelector('#diagnostics').dataset.state||'{}'),frame:renderer?.info.render.frame,roots:worlds?.town.children.filter(o=>o.name==='Campus teaching building exteriors').length,surroundings:Boolean(worlds?.town.getObjectByName('Approved campus surroundings and connections')),rooms:Boolean(worlds?.town.getObjectByName('Media learning rooms')),colliders:worlds?.townPhysics.world.colliders.len()});`});});
 const sample=()=>page.evaluate(()=>window.fullCampusObservation?.());
 await page.goto('/playable-3d/');await page.locator('#taster-skip').click();await expect.poll(async()=>(await sample())?.state,{timeout:30000}).toMatchObject({entryReady:true,campusReady:false});const entry=await sample();
 await page.locator('#exploration-options > summary').click();await page.locator('#world-tools > summary').click();await page.locator('#aerial').click();await page.locator('#resume-options').click();
 await expect.poll(async()=>(await sample())?.state,{timeout:45000}).toMatchObject({campusReady:true,mode:'town',scenery:{status:'ready'}});const full=await sample();expect(full.roots).toBe(1);expect(full.surroundings).toBe(true);expect(full.rooms).toBe(true);expect(full.colliders).toBeGreaterThan(entry.colliders);expect(full.frame).toBeGreaterThan(entry.frame);await page.screenshot({path:info.outputPath('full-campus-aerial.png')});expect(errors).toEqual([]);
 await info.attach('entry-to-full',{body:JSON.stringify({entry,full},null,2),contentType:'application/json'});
});
