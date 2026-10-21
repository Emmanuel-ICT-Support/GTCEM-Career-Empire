import {enterClassroomWhenAsked} from './market-controls.js';
import {test,expect} from '@playwright/test';

test('actual photo and companion permit keyboard Flyover back to the start before Market',async({page},info)=>{
 test.setTimeout(120000);const errors=[],marketLoads=[],legs=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{if(/\/night-market\.js(?:\?|$)/.test(request.url()))marketLoads.push(request.url());});
 await page.addInitScript(()=>{
  const c=document.createElement('canvas');c.width=c.height=4;
  sessionStorage.setItem('ce-game-run-handoff-v1',JSON.stringify({id:'pre-market-flight',createdAt:Date.now(),data:{
   'ce-taster-intro-v1:avery':'seen',
   'ce-missing-frame-local-review-v1':JSON.stringify({step:4,developed:true,chapelVisited:true,shots:{mural:{label:'Post-mural fixture',image:c.toDataURL('image/jpeg')}},souvenir:null})
  }}));
 });
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`
window.preMarketFlightProbe=()=>({mode,campusReady,position:actor.model.position.toArray(),
 camera:camera.position.toArray(),flightYaw:new THREE.Euler().setFromQuaternion(camera.quaternion,'YXZ').y,
 photo:discovery?.snapshot().souvenir,echo:echo?.snapshot(),fly:flyover?.active,tour:orientationTour?.snapshot()});`});});
 const sample=()=>page.evaluate(()=>window.preMarketFlightProbe?.());
 await page.goto('/playable-3d/?guestRun=pre-market-flight');
 await page.locator('#exploration-options > summary').click();await page.locator('#exploration-trail-options > summary').click();await page.locator('#discovery-pose').click();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(document.querySelector('#diagnostics').dataset.state||'{}')),{timeout:60000}).toMatchObject({campusReady:true,teachers:[{id:'middleton'},{id:'psandodakis'}]});
 if(!(await sample()).photo&&!await page.locator('#discovery-dialog').isVisible())await page.locator('#discovery-pose').click();
 await expect.poll(sample,{timeout:30000}).toMatchObject({photo:true});
 await page.locator('#discovery-continue').click();await expect(page.locator('#discovery-handover')).toBeVisible();await expect(page.locator('#orientation-tour')).not.toBeVisible();await page.getByRole('button',{name:'Keep exploring',exact:true}).click();await page.locator('#exploration-options > summary').click();await page.locator('#replay-campus-tour').click();await expect(page.locator('#orientation-tour')).toHaveAttribute('data-step','0');
 await page.locator('#orientation-tour [data-action]').click();await page.locator('#helper-picker [name=guidance][value=creature]').check();await page.locator('#helper-picker [name=helper][value=sprout]').check();await page.locator('#helper-picker [data-continue]').click();
 await expect(page.locator('#orientation-tour')).toHaveAttribute('data-step','1',{timeout:30000});
 const before=await sample();expect(before).toMatchObject({mode:'town',campusReady:true,photo:true,echo:{helper:'sprout',helperStatus:'ready'}});await expect(page.locator('#market-hud')).toHaveCount(0);
 await page.screenshot({path:info.outputPath('photo-companion-before-market.png')});
 await page.locator('#orientation-tour [data-action]').click();await expect(page.locator('#flyover-land')).toBeVisible();await expect(page.locator('#campus-minimap')).toHaveAttribute('data-target','start');
 // All travel uses normal keyboard controls and the visible speed slider.
 // The probe reads positions; no camera/player coordinates or gates are set.
 async function speed(value){await page.locator('#flyover-speed').focus();await page.keyboard.press(value===40?'End':'Home');if(value===4)for(let i=0;i<3;i++)await page.keyboard.press('ArrowRight');await expect(page.locator('#flyover-speed')).toHaveValue(String(value));await page.locator('#scene').focus();}
 await speed(40);await page.keyboard.down('KeyE');
 try{await page.waitForFunction(()=>window.preMarketFlightProbe?.().camera[1]>=18,null,{timeout:10000});}finally{await page.keyboard.up('KeyE');}
 for(let leg=0;leg<12;leg++){
  let s=await sample(),dx=-7-s.camera[0],dz=23.3-s.camera[2];if(Math.hypot(dx,dz)<1.8)break;
  await speed(Math.hypot(dx,dz)>18?40:4);s=await sample();dx=-7-s.camera[0];dz=23.3-s.camera[2];
  const c=Math.cos(s.flightYaw),n=Math.sin(s.flightYaw),x=dx*c-dz*n,z=dx*n+dz*c;
  const useX=Math.abs(x)>Math.abs(z),value=useX?x:z,sign=Math.sign(value);
  const key=useX?(sign>0?'KeyD':'KeyA'):(sign>0?'KeyS':'KeyW');
  const direction=useX?[c*sign,-n*sign]:[n*sign,c*sign],progress=Math.min(20,Math.abs(value)*.7);
  await page.keyboard.down(key);
  try{await page.waitForFunction(({from,direction,progress})=>{const p=window.preMarketFlightProbe?.().camera;return p&&((p[0]-from[0])*direction[0]+(p[2]-from[2])*direction[1]>=progress||Math.hypot(p[0]+7,p[2]-23.3)<1.2);},{from:s.camera,direction,progress},{timeout:10000});}
  finally{await page.keyboard.up(key);}
  legs.push({key,speed:Math.hypot(dx,dz)>18?40:4,from:s.camera,to:(await sample()).camera});
 }
 const airborne=await sample();expect(legs.length).toBeGreaterThan(0);expect(Math.hypot(airborne.camera[0]+7,airborne.camera[2]-23.3)).toBeLessThan(3);
 await page.screenshot({path:info.outputPath('keyboard-flight-at-start.png')});await page.locator('#scene').focus();await page.keyboard.press('KeyL');
 await expect(page.locator('#orientation-tour')).toHaveAttribute('data-step','3');const landed=await sample();expect(landed.fly).toBe(false);expect(Math.hypot(landed.position[0]+7,landed.position[2]-23.3)).toBeLessThan(3);expect(landed.position[1]).toBeLessThan(.6);
 await expect(page.locator('#market-hud')).toHaveCount(0);expect(marketLoads).toEqual([]);expect(errors).toEqual([]);
 await page.screenshot({path:info.outputPath('landed-before-menu-and-market.png')});await info.attach('authentic-pre-market-flight',{body:JSON.stringify({before,legs,airborne,landed,marketLoads,errors},null,2),contentType:'application/json'});
});

test.beforeEach(({page})=>{enterClassroomWhenAsked(page);});
