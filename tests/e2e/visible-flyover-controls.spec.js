import {test,expect} from './campus-fixtures.js';
import {waitForEntry} from './entry-readiness.js';

for(const width of [1280,390])test.describe(`visible Flyover controls ${width}`,()=>{
 test.use({viewport:{width,height:844},hasTouch:width===390,isMobile:width===390});
 test('reminder, clue guard, pointer return, keyboard landing and safe rejection',async({page},info)=>{
  test.setTimeout(120000);const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.flyoverControlsProbe={snapshot:()=>({active:flyover.active,actor:actor.model.position.toArray(),physical:worlds.position(false).toArray(),camera:camera.position.toArray(),campusReady,backend:renderBackend}),blockLanding:()=>{window.__realFlyoverLanding=worlds.findLanding;worlds.findLanding=()=>null;},restoreLanding:()=>{worlds.findLanding=window.__realFlyoverLanding;}};document.addEventListener('click',event=>{if(['flyover-reminder','flyover-toggle'].includes(event.target.closest('button')?.id))window.__flyoverClickSnapshot=window.flyoverControlsProbe.snapshot();},false);`});});
  const snapshot=()=>page.evaluate(()=>window.flyoverControlsProbe.snapshot());
  const activate=locator=>width===390?locator.tap():locator.click();
  const hold=async(key,ms)=>{await page.keyboard.down(key);await page.waitForTimeout(ms);await page.keyboard.up(key);};
  await page.goto('/playable-3d/?discovery=1');await page.locator('#taster-skip').click();
  await waitForEntry(page);
  await expect(page.locator('#flyover-reminder')).toBeVisible();
  await page.locator('#exploration-options > summary').click();await page.locator('#world-tools > summary').click();await page.locator('#aerial').click();
  await expect.poll(async()=>(await snapshot()).campusReady,{timeout:90000}).toBe(true);await page.locator('#recenter').click();await page.locator('#resume-options').click();
  const reminder=page.locator('#flyover-reminder');await expect(reminder).toBeEnabled();await expect(reminder).toHaveText('Flyover · F');
  const hud=await page.locator('#flyover-quick-controls').boundingBox(),movement=await page.locator('#movement').boundingBox();expect(Math.abs(hud.x-movement.x)).toBeLessThanOrEqual(2);expect(hud.y+hud.height).toBeLessThanOrEqual(movement.y-8);
  await page.screenshot({path:info.outputPath(`flyover-ready-${width}.png`)});
  await page.locator('#exploration-help').click();await expect(page.locator('#discovery-dialog')).toBeVisible();await expect(reminder).toBeDisabled();await expect(page.locator('#discovery-dialog .flyover-modal-hint')).toContainText('Close the picture clue to use Flyover · F.');await expect(page.locator('#discovery-dialog .flyover-modal-hint')).toBeInViewport();
  await page.keyboard.press('KeyF');expect((await snapshot()).active).toBe(false);await page.screenshot({path:info.outputPath(`flyover-clue-blocked-${width}.png`)});await page.locator('#discovery-close').click();await expect(reminder).toBeEnabled();
  const before=await snapshot();await activate(reminder);await expect(page.locator('#flyover-land')).toBeVisible();await expect(page.locator('#flyover-toggle')).toHaveText('Return to player');await expect(reminder).toBeHidden();const entered=await page.evaluate(()=>window.__flyoverClickSnapshot);
  await hold('KeyE',350);await hold('KeyW',500);const flying=await snapshot();for(const control of await page.locator('#flyover-panel button').all())await expect(control).toBeInViewport();expect(flying.active).toBe(true);expect(flying.camera).not.toEqual(entered.camera);expect(flying.actor).toEqual(entered.actor);expect(flying.physical).toEqual(entered.physical);
  await page.screenshot({path:info.outputPath(`flyover-flying-${width}.png`)});await activate(page.locator('#flyover-toggle'));await expect(reminder).toBeVisible();const returned=await page.evaluate(()=>window.__flyoverClickSnapshot);expect(returned.active).toBe(false);expect(returned.actor).toEqual(entered.actor);expect(returned.physical).toEqual(entered.physical);expect(returned.camera).toEqual(entered.camera);
  await page.locator('#scene').focus();await page.keyboard.press('KeyF');await expect(page.locator('#flyover-land')).toBeVisible();await hold('KeyW',650);await page.keyboard.press('KeyL');await expect(reminder).toBeVisible();const landed=await snapshot();expect(landed.active).toBe(false);expect(landed.actor[1]).toBeLessThan(.6);expect(Math.abs(landed.actor[0]-landed.physical[0])).toBeLessThan(.03);expect(Math.abs(landed.actor[2]-landed.physical[2])).toBeLessThan(.03);
  await hold('KeyW',350);const walking=await snapshot();expect(Math.hypot(walking.actor[0]-landed.actor[0],walking.actor[2]-landed.actor[2])).toBeGreaterThan(.3);await page.screenshot({path:info.outputPath(`flyover-landed-${width}.png`)});
  // Withhold the landing dependency only for this rejection branch; successful landings use real physics.
  await page.locator('#scene').focus();await page.keyboard.press('KeyF');const beforeRejected=await snapshot();await page.evaluate(()=>window.flyoverControlsProbe.blockLanding());await activate(page.locator('#flyover-land'));await expect(page.locator('#flyover-landing-status')).toContainText('No safe ground found');expect((await snapshot()).active).toBe(true);expect((await snapshot()).actor).toEqual(beforeRejected.actor);
  await page.locator('#scene').focus();await page.keyboard.press('KeyH');await expect(page.locator('#flyover-land')).toBeVisible();await page.keyboard.press('Escape');await page.evaluate(()=>window.flyoverControlsProbe.restoreLanding());await expect(reminder).toBeVisible();
  if(width===390){await page.setViewportSize({width:844,height:390});await expect(page.locator('#flyover-quick-controls')).toBeInViewport();const a=await page.locator('#flyover-quick-controls').boundingBox(),b=await page.locator('#movement').boundingBox();expect(a.y+a.height).toBeLessThanOrEqual(b.y-8);}
  expect(errors).toEqual([]);await info.attach('visible-flyover-observation',{body:JSON.stringify({width,before,entered,returned,flying,landed,walking,errors}),contentType:'application/json'});
 });
});
