import {test,expect} from './campus-fixtures.js';

async function setup(page){
 const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text())+`\nwindow.__flyTest={snapshot:()=>({camera:camera.position.toArray(),quaternion:camera.quaternion.toArray(),actor:actor.model.position.toArray(),rotation:actor.model.rotation.toArray(),physics:worlds.position(false),yaw,aerial,far:camera.far,fog:[worlds.town.fog.near,worlds.town.fog.far],active:flyover.active}),exit:()=>flyover.exit()};`});});
 await page.goto('/playable-3d/');await expect(page.locator('#loading')).toBeHidden({timeout:90000});
 return {requests,errors};
}
const snap=page=>page.evaluate(()=>window.__flyTest.snapshot());
async function hold(page,key,ms=400){await page.keyboard.down(key);await page.waitForTimeout(ms);await page.keyboard.up(key);}

test('flyover detaches, eases, records cleanly and restores exact prior camera and player state',async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width:1440,height:900});const {requests,errors}=await setup(page);
 const entry=await page.locator('#flyover-toggle').boundingBox(),tools=await page.locator('#world-tools').boundingBox();expect(entry.y).toBeGreaterThan(tools.y+tools.height);await page.screenshot({path:'coverage/browser-evidence/flyover-entry.png'});await page.locator('#aerial').click();await page.waitForTimeout(1400);
 // Read state and click synchronously, avoiding a follow-camera frame between them.
 const before=await page.evaluate(()=>{const s=window.__flyTest.snapshot();document.querySelector('#flyover-toggle').click();return s;});
 await expect(page.locator('#flyover-panel')).toBeVisible();await hold(page,'e');const raised=await snap(page);expect(raised.camera[1]).toBeGreaterThan(before.camera[1]);
 await hold(page,'w');await hold(page,'d');await hold(page,'ArrowRight');await hold(page,'ArrowDown');
 await page.mouse.move(600,350);await page.mouse.down();await page.mouse.move(720,420,{steps:8});await page.mouse.up();
 const moved=await snap(page);expect(moved.camera).not.toEqual(before.camera);expect(moved.quaternion).not.toEqual(before.quaternion);expect(moved.actor).toEqual(before.actor);expect(moved.rotation).toEqual(before.rotation);expect(moved.physics).toEqual(before.physics);
 await page.locator('#flyover-bird').click();await page.waitForTimeout(800);await page.locator('#flyover-speed').fill('25');await expect(page.locator('#flyover-speed-value')).toHaveText('25 m/s');
 await page.locator('#scene').focus();await page.keyboard.press('h');await expect(page.locator('body')).toHaveClass(/flyover-clean/);await page.screenshot({path:'coverage/browser-evidence/flyover-clean.png'});await page.keyboard.press('h');
 await page.screenshot({path:'coverage/browser-evidence/flyover-controls.png'});
 await hold(page,'w');await page.evaluate(()=>window.dispatchEvent(new Event('blur')));const stopped=await snap(page);await page.waitForTimeout(250);expect((await snap(page)).camera).toEqual(stopped.camera);
 const restored=await page.evaluate(()=>{window.__flyTest.exit();return window.__flyTest.snapshot();});expect(restored).toEqual(before);
 await hold(page,'w');expect((await snap(page)).actor).not.toEqual(before.actor);
 expect(requests.some(u=>/\/studio.js|OrbitControls/.test(u))).toBe(false);expect(errors).toEqual([]);
});

test('focus-safe shortcuts, repeated entry and normal destinations remain available',async({page})=>{
 test.setTimeout(120000);await setup(page);await page.locator('#scene').focus();await page.keyboard.press('f');expect((await snap(page)).active).toBe(true);
 await page.locator('#flyover-speed').focus();await page.keyboard.press('e');await page.keyboard.press('Escape');expect((await snap(page)).active).toBe(false);
 await page.locator('#flyover-toggle').click();await page.locator('#flyover-exit').click();await page.locator('#home-destination').click();expect((await snap(page)).active).toBe(false);
 await page.locator('#chapel-destination').click();await expect(page.locator('#experience')).toHaveClass(/in-chapel/,{timeout:30000});await expect(page.locator('#flyover-toggle')).toBeHidden();await page.locator('#scene').focus();await page.keyboard.press('f');expect((await snap(page)).active).toBe(false);
});

test.describe('touch flyover',()=>{
 test.use({hasTouch:true,isMobile:true,viewport:{width:390,height:844}});
 test('visible controls fit phone and altitude touch releases safely',async({page})=>{
 test.setTimeout(120000);await setup(page);await page.locator('#flyover-toggle').tap();const before=await snap(page);
 const rise=page.getByRole('button',{name:'Raise camera'});await rise.dispatchEvent('pointerdown',{pointerId:1,clientX:10,clientY:10});await page.waitForTimeout(450);await rise.dispatchEvent('pointerup',{pointerId:1});expect((await snap(page)).camera[1]).toBeGreaterThan(before.camera[1]);
 const box=await page.locator('#flyover-panel').boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(390);await page.screenshot({path:'coverage/browser-evidence/flyover-phone.png'});await page.locator('#flyover-hide').tap();await expect(page.locator('body')).toHaveClass(/flyover-clean/);await page.locator('#scene').tap({position:{x:40,y:650}});await expect(page.locator('body')).not.toHaveClass(/flyover-clean/);await page.getByRole('button',{name:'Return to player',exact:true}).last().tap();expect((await snap(page)).active).toBe(false);
 });
});

 test('campus recording view from ordinary arrival camera',async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width:1440,height:900});await setup(page);await page.locator('#flyover-toggle').click();await page.locator('#flyover-speed').fill('20');await page.locator('#scene').focus();await hold(page,'e',2600);await hold(page,'ArrowDown',450);await page.waitForTimeout(700);await page.screenshot({path:'coverage/browser-evidence/flyover-campus.png'});await page.keyboard.press('h');await page.screenshot({path:'coverage/browser-evidence/flyover-campus-clean.png'});await page.keyboard.press('Escape');expect((await snap(page)).active).toBe(false);
});
