import {test,expect} from '@playwright/test';
import {walkThroughMarketEntrance} from './market-controls.js';

test('cold final tour action remains visible until real outside arrival and doorway entry',async({page},info)=>{
 test.setTimeout(90000);const timings=[],errors=[],started=Date.now();
 page.on('pageerror',error=>errors.push(error.message));
 try{
  // Resume the already-covered photo/course journey at its final beat, as a cold
  // same-run return does. No campus, position, ready or paid flags are assigned.
  await page.addInitScript(()=>{
   const c=document.createElement('canvas');c.width=c.height=4;
   sessionStorage.setItem('ce-game-run-handoff-v1',JSON.stringify({id:'final-market-stage',createdAt:Date.now(),data:{
    'ce-taster-intro-v1:avery':'seen','ce-companion-offered':'1','ce-guidance-v2:avery':'sprout',
    'ce-missing-frame-local-review-v1':JSON.stringify({step:4,developed:true,chapelVisited:true,shots:{mural:{label:'Completed-photo fixture',image:c.toDataURL('image/jpeg')}},souvenir:c.toDataURL()}),
    'ce-orientation-tour-v1':JSON.stringify({version:1,step:7,finished:false})
   }}));
  });
  await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.finalMarketProbe=()=>({mode,entryReady,campusReady,position:actor.model.position.toArray(),avatarFallback:Boolean(actor.model.userData.fallback),echo:echo?.snapshot(),tour:orientationTour?.snapshot()});window.observeMarketWalking=()=>({mode,position:actor.model.position.toArray(),scene:discovery?.snapshot().scene});`});});
  const probe=()=>page.evaluate(()=>window.finalMarketProbe?.());
  const stage=async name=>{const row={name,elapsedMs:Date.now()-started,...await probe()};timings.push(row);console.log('FINAL_MARKET_STAGE',JSON.stringify(row));};
  await page.goto('/playable-3d/?guestRun=final-market-stage&tour=resume');
  await expect(page.locator('#orientation-tour')).toHaveAttribute('data-step','7',{timeout:30000});
  await page.waitForFunction(()=>window.finalMarketProbe?.().entryReady,null,{timeout:30000});
  await expect.poll(probe,{timeout:30000}).toMatchObject({mode:'town',campusReady:false,avatarFallback:false,echo:{helper:'sprout',helperStatus:'ready'}});
  await stage('ready-at-start-before-request');
  await page.locator('#orientation-tour [data-action]').click();
  await expect(page.locator('#orientation-tour')).toBeVisible();await expect(page.locator('#orientation-tour [data-action]')).toBeDisabled();await expect(page.locator('#orientation-tour [data-status]')).toContainText('Preparing campus and Market entrance');
  await stage('guide-retained-during-preparation');
  await expect(page.locator('#orientation-tour')).toBeHidden({timeout:30000});
  await expect.poll(probe).toMatchObject({mode:'town',campusReady:true,tour:{active:false}});
  await expect.poll(async()=>(await probe()).position[0]).toBeCloseTo(43,3);await expect.poll(async()=>(await probe()).position[2]).toBeCloseTo(-17.8,3);expect((await probe()).position[1]).toBeLessThan(.6);await expect(page.locator('#market-hud')).toHaveCount(0);
  await stage('outside-market-arrived');await page.screenshot({path:info.outputPath('guide-finished-at-outside-market.png')});
  await walkThroughMarketEntrance(page);await expect.poll(probe).toMatchObject({mode:'market',echo:{helper:'sprout',helperStatus:'ready'}});
  await stage('walked-through-door-and-entered-market');expect(errors).toEqual([]);await page.screenshot({path:info.outputPath('real-market-entry-after-final-tour.png')});
 }finally{await info.attach('final-market-stage-timings',{body:JSON.stringify({timings,errors},null,2),contentType:'application/json'});}
});

test('final tour action retains retry and cancellation while arrival is pending',async({page})=>{
 await page.route('**/final-route-contract',route=>route.fulfill({contentType:'text/html',body:'<main>Pending destination contract</main>'}));await page.goto('/final-route-contract');
 await page.evaluate(async()=>{
  const {createOrientationTour}=await import('/playable-3d/orientation-tour.mjs');
  const data=new Map([['ce-orientation-tour-v1',JSON.stringify({version:1,step:7,finished:false})]]);
  window.finishedArrivals=0;
  window.contractTour=createOrientationTour({storage:{getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)},photo:()=>null,summary:()=>'',helper:()=>({}),chooseHelper:async()=>{},fly:()=>true,openOptions(){},optionsOpen:()=>false,openStats(){},statsOpen:()=>false,openCourse(){},
   goMarket:async current=>{const answer=await new Promise(resolve=>window.finishFinalRoute=resolve);if(answer&&current())window.finishedArrivals++;return answer;},pause(){},resume(){},stop(){}});
  contractTour.start({restore:true});
 });
 const panel=page.locator('#orientation-tour'),action=panel.locator('[data-action]');
 await action.click();await expect(panel).toBeVisible();await expect(action).toBeDisabled();await expect(panel.locator('[data-status]')).toContainText('Preparing campus');
 await page.evaluate(()=>finishFinalRoute(false));await expect(panel).toBeVisible();await expect(action).toBeEnabled();await expect(panel.locator('[data-status]')).toContainText('try again or skip');
 await action.click();await panel.locator('[data-skip]').click();await page.evaluate(()=>finishFinalRoute(true));await expect(panel).toBeHidden();expect(await page.evaluate(()=>finishedArrivals)).toBe(0);
 await page.evaluate(()=>contractTour.start({restore:true}));await action.click();await page.evaluate(()=>finishFinalRoute(true));await expect(panel).toBeHidden();expect(await page.evaluate(()=>finishedArrivals)).toBe(1);
});
