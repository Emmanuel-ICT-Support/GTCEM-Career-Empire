import {test,expect} from './campus-fixtures.js';
for(const width of [1280,768,390])test(`My Life stays separate from phase and account at ${width}`,async({page},info)=>{
 test.setTimeout(60000);await page.setViewportSize({width,height:844});
 await page.goto('/playable-3d/?review=1',{waitUntil:'domcontentloaded'});await expect(page.locator('#loading')).toBeHidden({timeout:30000});
 const link=page.getByRole('link',{name:'My Life',exact:true});await expect(link).toBeVisible();await expect(link).toBeInViewport();
 const bounds=await link.boundingBox();for(const selector of ['#world-tools','.account','#places-toggle']){const other=await page.locator(selector).boundingBox();expect(bounds.x+ bounds.width<=other.x||other.x+other.width<=bounds.x||bounds.y+bounds.height<=other.y||other.y+other.height<=bounds.y).toBe(true);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:info.outputPath(`hud-${width}.png`)});
 await link.click();await expect(page).toHaveURL(/economy-lab/);
});
test('Juniper food and staff clear the shallow counter in packing and collection roles',async({page},info)=>{
 test.setTimeout(90000);await page.setViewportSize({width:1280,height:844});
 await page.route('**/app.js?*',async r=>{const response=await r.fetch();await r.fulfill({response,body:(await response.text())+'\nwindow.stallReview=()=>({market:nightMarket,camera,renderer,THREE});'});});
 await page.goto('/playable-3d/?experience=sunday-markets&market-review=1',{waitUntil:'domcontentloaded'});await expect(page.locator('#loading')).toBeHidden({timeout:30000});
 await expect.poll(()=>page.evaluate(()=>window.stallReview().market?.snapshot().visuals.ready),{timeout:30000}).toBe(14);
 const geometry=await page.evaluate(()=>{const {market,THREE:T}=window.stallReview();market.scene.updateMatrixWorld(true);return {bowls:market.scene.children.filter(o=>o.name.includes('rice bowl')).length,staff:['mara','sam'].map(id=>{const actor=market.scene.getObjectByName('Market actor / '+id),model=actor.children.at(-1);model.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.update()});const box=new T.Box3().setFromObject(model,true);return {id,min:box.min.toArray(),max:box.max.toArray()};})};});
 console.log('STALL_CLEARANCE',JSON.stringify(geometry));expect(geometry.bowls).toBe(6);
 expect(await page.evaluate(()=>window.stallReview().market.move({x:1.92,y:0,z:-3.6},{x:0,z:-.6}).z)).toBe(-3.6);
 for(const actor of geometry.staff){expect(actor.max[2]).toBeLessThan(-5.41);expect(actor.min[2]).toBeGreaterThan(-6.38);}
 await page.evaluate(()=>{const {camera}=window.stallReview();camera.position.set(2.8,2.25,-1.4);camera.lookAt(0,1.1,-5.4);});
 // Capture a deterministic inspection camera without changing user saves.
 await page.evaluate(()=>{const {market,camera,renderer}=window.stallReview();renderer.render(market.scene,camera);});
 await page.screenshot({path:info.outputPath('juniper-approach.png')});
 await page.evaluate(()=>window.stallReview().market.interaction({x:0,z:-3.6}).action());await page.getByRole('button',{name:'Take the shift',exact:true}).click();
 await page.evaluate(()=>window.stallReview().market.interaction({x:4.2,z:-1.8}).action());await page.getByLabel('Collection location',{exact:true}).selectOption('front');await page.getByLabel('Sam’s role',{exact:true}).selectOption('collect');await page.getByRole('button',{name:'Set this arrangement',exact:true}).click();
 const staff=await page.evaluate(()=>{const {market,THREE:T}=window.stallReview();market.scene.updateMatrixWorld(true);const actor=market.scene.getObjectByName('Market actor / sam');const box=new T.Box3().setFromObject(actor.children.at(-1),true);return {min:box.min.z,max:box.max.z};});
 expect(staff.min).toBeGreaterThan(-4.59);expect(staff.max).toBeLessThan(-3.625);
});
