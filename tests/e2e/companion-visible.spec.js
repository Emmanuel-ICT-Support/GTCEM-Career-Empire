import {test,expect} from '@playwright/test';
import {enterMarket} from './market-controls.js';
import {observeCompanionRendering} from './companion-render-controls.js';
test('selected Sprout is visibly rendered in the active town and Market scenes',async({page},info)=>{
 test.setTimeout(90000);const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('COMPANION_PAGE_ERROR',e.message);});
 await page.addInitScript(()=>{const c=document.createElement('canvas');c.width=c.height=4;sessionStorage.setItem('ce-game-run-handoff-v1',JSON.stringify({id:'visible-companion',createdAt:Date.now(),data:{'ce-taster-intro-v1:avery':'seen','ce-missing-frame-local-review-v1':JSON.stringify({step:4,chapelVisited:true,shots:{mural:{label:'Fixture mural',image:c.toDataURL('image/jpeg')}},souvenir:c.toDataURL()})}}));});
 await observeCompanionRendering(page);
 const sample=()=>page.evaluate(()=>window.companionRenderProbe?.());
 const rendered=(mode,after)=>expect.poll(async()=>{const s=await sample();return {state:s?.state,parentMatches:s?.parentMatches,inView:s?.visibleMeshes>0,drawn:s?.drawnMeshes>0,frameAdvanced:s?.frame>after};},{timeout:30000}).toMatchObject({state:{mode,echo:{helper:'sprout',helperStatus:'ready',visible:true,meshes:1}},parentMatches:true,inView:true,drawn:true,frameAdvanced:true});
 await page.goto('/playable-3d/?guestRun=visible-companion');
 // The diagnostics textarea is published periodically; the live entry flag and
 // visible loading gate own readiness. Observe on animation frames without
 // slow renderer/CDP polling gaps; keep the same deadline, then prove input.
 await page.waitForFunction(()=>window.companionRenderProbe?.().state.entryReady,null,{timeout:30000});await expect(page.locator('#loading')).toBeHidden();
 const start=await sample();await page.locator('#scene').focus();await page.keyboard.down('KeyW');
 try{await expect.poll(async()=>(await sample())?.livePosition?.[2],{timeout:10000}).toBeLessThan(start.livePosition[2]-.15);}finally{await page.keyboard.up('KeyW');}
 const before=await sample();
 await page.locator('#exploration-options > summary').click();await page.locator('#choose-helper').click();await page.locator('[name=guidance][value=creature]').check();await page.locator('[name=helper][value=sprout]').check();await page.locator('[data-continue]').click();
 await rendered('town',before.frame);const town=await sample();await page.screenshot({path:info.outputPath('sprout-town.png')});expect(town.parentMatches).toBe(true);expect(town.visibleMeshes).toBeGreaterThan(0);expect(town.drawnMeshes).toBeGreaterThan(0);expect(town.frame).toBeGreaterThan(before.frame);
 await enterMarket(page);
 await rendered('market',town.frame);const market=await sample();expect(market.parentMatches).toBe(true);expect(market.visibleMeshes).toBeGreaterThan(0);expect(market.drawnMeshes).toBeGreaterThan(0);expect(market.frame).toBeGreaterThan(town.frame);await page.screenshot({path:info.outputPath('sprout-market.png')});expect(errors).toEqual([]);await info.attach('companion-scenes',{body:JSON.stringify({town,market},null,2),contentType:'application/json'});
});
