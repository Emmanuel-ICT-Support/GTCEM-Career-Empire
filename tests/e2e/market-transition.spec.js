import {test,expect} from '@playwright/test';
import {installMarketTimingProbe} from './market-timing-probe.js';

test('completed photo hands over from full campus to visible Market and real walking interaction',async({page},info)=>{
 test.setTimeout(90000);const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('MARKET_PAGE_ERROR',e.message);});await installMarketTimingProbe(page);
 // Explicit completed-photo return fixture; campus loading, handover, walking
 // and Mara interaction all use the normal student controls.
 await page.addInitScript(()=>{const c=document.createElement('canvas');c.width=c.height=4;sessionStorage.setItem('ce-game-run-handoff-v1',JSON.stringify({id:'market-transition',createdAt:Date.now(),data:{'ce-taster-intro-v1:avery':'seen','ce-companion-offered':'1','ce-missing-frame-local-review-v1':JSON.stringify({step:4,chapelVisited:true,shots:{mural:{label:'Fixture mural',image:c.toDataURL('image/jpeg')}},souvenir:c.toDataURL()})}}));});
 const state=()=>page.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state||'{}'));
 await page.goto('/playable-3d/?guestRun=market-transition');await expect.poll(state,{timeout:30000}).toMatchObject({entryReady:true});
 await page.locator('#exploration-options > summary').click();await page.locator('#destination-menu > summary').click();await page.locator('#oval-destination').click();await expect.poll(state,{timeout:30000}).toMatchObject({campusReady:true,mode:'town'});await page.locator('#resume-options').click();
 await page.locator('#exploration-help').click();await expect(page.locator('#discovery-dialog')).toBeVisible();await page.locator('#discovery-market-handover').click();
 await expect.poll(state,{timeout:30000}).toMatchObject({mode:'market',market:{guidance:['Mara']}});await expect(page.locator('#market-hud')).toBeVisible();await page.screenshot({path:info.outputPath('market-visible.png')});await page.evaluate(()=>window.recordMarketPhase('market-screenshot-visible'));
 await page.locator('#scene').focus();await page.keyboard.down('KeyW');try{await expect(page.locator('#interact')).toHaveText('Talk to Mara',{timeout:20000});}finally{await page.keyboard.up('KeyW');}
 const moved=await state();expect(moved.position[2]).toBeLessThan(0);await page.locator('#interact').click();await expect(page.locator('#market-dialog-title')).toHaveText('Meet the Juniper crew');await page.evaluate(()=>window.recordMarketPhase('mara-interaction-visible'));expect(errors).toEqual([]);
 const evidence=await page.evaluate(()=>window.marketTransitionProbe());await info.attach('market-transition',{body:JSON.stringify(evidence,null,2),contentType:'application/json'});
});
