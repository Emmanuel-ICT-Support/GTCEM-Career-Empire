import {enterClassroomWhenAsked} from './market-controls.js';
import {test,expect} from '@playwright/test';

// Collision targets use a camera fixture. Authentic keyboard travel is covered
// independently by pre-market-flight.spec.js; the full photo case retains the
// ordered guide and real Market doorway entry without repeating these targets.
test('safe roof landing and ordinary map/menu shortcuts keep arrivals outdoors',async({page},info)=>{
 test.setTimeout(90000);const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{
  const c=document.createElement('canvas');c.width=c.height=4;
  sessionStorage.setItem('ce-game-run-handoff-v1',JSON.stringify({id:'landing-shortcuts',createdAt:Date.now(),data:{
   'ce-taster-intro-v1:avery':'seen',
   'ce-missing-frame-local-review-v1':JSON.stringify({step:4,developed:true,chapelVisited:true,shots:{mural:{label:'Completed-photo fixture',image:c.toDataURL('image/jpeg')}},souvenir:c.toDataURL()})
  }}));
 });
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.landingProbe=()=>({mode,campusReady,position:actor.model.position.toArray(),yaw,fly:flyover?.active});window.targetLandingCamera=(x,y,z)=>camera.position.set(x,y,z);`});});
 const probe=()=>page.evaluate(()=>window.landingProbe?.());
 await page.goto('/playable-3d/?guestRun=landing-shortcuts');
 await page.locator('#exploration-options > summary').click();await page.locator('#destination-menu > summary').click();await page.locator('#market-destination').click();
 await expect.poll(probe,{timeout:45000}).toMatchObject({mode:'town',campusReady:true});await expect(page.locator('#loading')).toBeHidden();await expect.poll(async()=>(await probe()).position[0],{timeout:30000}).toBeCloseTo(43,3);if(await page.locator('#exploration-options').evaluate(element=>element.open))await page.locator('#resume-options').click();await expect(page.locator('#campus-minimap')).toHaveAttribute('data-target','market');
 await page.locator('#scene').focus();await page.keyboard.press('KeyF');await expect(page.locator('#flyover-land')).toBeVisible();await page.evaluate(()=>targetLandingCamera(43,40,-26));await page.locator('#scene').focus();await page.keyboard.press('KeyL');await page.keyboard.press('KeyL');await expect.poll(probe).toMatchObject({mode:'town',fly:false,yaw:0});
 const roof=await probe();expect(roof.position[2]).toBeGreaterThan(-20);expect(roof.position[1]).toBeLessThan(.6);await page.screenshot({path:info.outputPath('safe-market-roof-landing.png')});
 async function returnToStart(){await page.locator('#scene').focus();await page.keyboard.press('KeyF');await expect(page.locator('#flyover-land')).toBeVisible();await page.evaluate(()=>targetLandingCamera(-7,20,23.3));await page.keyboard.press('KeyL');await expect.poll(probe).toMatchObject({mode:'town',fly:false});await expect.poll(async()=>(await probe()).position[0]).toBeCloseTo(-7,3);}
 async function outside(){await expect.poll(probe).toMatchObject({mode:'town'});await expect.poll(async()=>(await probe()).position[0]).toBeCloseTo(43,3);await expect.poll(async()=>(await probe()).position[2]).toBeCloseTo(-17.8,3);expect((await probe()).position[1]).toBeLessThan(.6);await expect(page.locator('#market-hud')).toHaveCount(0);}
 await returnToStart();await page.locator('#campus-minimap [data-market-shortcut]').click();await outside();const map=await probe();
 await returnToStart();await page.locator('#exploration-options > summary').click();await expect(page.locator('#flyover-slot #flyover-toggle')).toBeVisible();await page.locator('#destination-menu > summary').click();await page.locator('#market-destination').click();await outside();if(await page.locator('#exploration-options').evaluate(element=>element.open))await page.locator('#resume-options').click();
 const menu=await probe();expect(errors).toEqual([]);await page.screenshot({path:info.outputPath('outside-market-shortcuts.png')});await info.attach('landing-and-shortcuts',{body:JSON.stringify({roof,map,menu,errors},null,2),contentType:'application/json'});
});

test.beforeEach(({page})=>{enterClassroomWhenAsked(page);});
