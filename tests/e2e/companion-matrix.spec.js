import {enterClassroomWhenAsked} from './market-controls.js';
import {test,expect} from '@playwright/test';
import {writeFileSync} from 'node:fs';
import {HELPERS,GUIDANCE_MODES} from '../../playable-3d/helper-state.js';
import {observeCompanionRendering} from './companion-render-controls.js';
import {enterMarket} from './market-controls.js';

test('every selectable companion renders, follows and retains its choice from campus to Market',async({page},info)=>{
 test.setTimeout(300000);
 const rows=[],errors=[],requests=[];let intended=null;
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{const match=request.url().match(/\/assets\/helpers\/([^/]+)\.glb(?:\?|$)/);if(match)requests.push({requested:match[1],intended});});
 await page.addInitScript(()=>{
  const c=document.createElement('canvas');c.width=c.height=4;
  sessionStorage.setItem('ce-game-run-handoff-v1',JSON.stringify({id:'companion-matrix',createdAt:Date.now(),data:{
   'ce-taster-intro-v1:avery':'seen',
   'ce-missing-frame-local-review-v1':JSON.stringify({step:4,chapelVisited:true,shots:{mural:{label:'Completed-photo fixture',image:c.toDataURL('image/jpeg')}},souvenir:c.toDataURL()})
  }}));
 });
 await observeCompanionRendering(page);
 const sample=()=>page.evaluate(()=>window.companionRenderProbe?.());
 await page.goto('/playable-3d/?guestRun=companion-matrix');
 await page.waitForFunction(()=>window.companionRenderProbe?.().state.entryReady,null,{timeout:30000});
 await expect(page.locator('#loading')).toBeHidden();

 async function choose(helper){
  intended=helper.id;
  if(!await page.locator('#exploration-options').evaluate(element=>element.open))await page.locator('#exploration-options > summary').click();
  await page.locator('#choose-helper').click();
  await page.locator('[name=guidance][value="'+(helper.model?'creature':helper.id)+'"]').check();
  if(helper.model){
   expect(await page.locator('#helper-picker [name=helper]').evaluateAll(elements=>elements.map(element=>element.value))).toEqual(HELPERS.map(option=>option.id));
   await page.locator('[name=helper][value="'+helper.id+'"]').check();
  }
  await page.locator('#helper-picker [data-continue]').click();
  await expect(page.locator('#helper-picker')).not.toBeVisible();
  if(await page.locator('#exploration-options').evaluate(element=>element.open))await page.locator('#resume-options').click();
 }
 async function verify(helper,mode){
  const row={id:helper.id,name:helper.name,mode,kind:helper.model?'creature':'independent guidance',status:'failed'};
  try{
   const beforeFrame=(await sample()).frame;
   await expect.poll(async()=>{
    const s=await sample();return {selected:s?.selected,saved:s?.saved,mode:s?.state.mode,
     ready:s?.state.echo?.helperStatus,visible:s?.state.echo?.visible,
     inView:s?.visibleMeshes>0,drawn:s?.drawnMeshes>0,
     activeScene:helper.model?s?.parentMatches:true,frameAdvanced:s?.frame>beforeFrame};
   },{timeout:30000}).toMatchObject({selected:helper.id,saved:helper.id,mode,
    ready:helper.model?'ready':'disabled',visible:Boolean(helper.model),
    inView:Boolean(helper.model),drawn:Boolean(helper.model),activeScene:true,frameAdvanced:true});
   const before=await sample();
   await page.locator('#scene').focus();await page.keyboard.down('KeyW');
   try{await page.waitForFunction(start=>{const p=window.companionRenderProbe?.().livePosition;return p&&Math.hypot(p[0]-start[0],p[2]-start[2])>.2;},before.livePosition,{timeout:10000});}
   finally{await page.keyboard.up('KeyW');}
   if(helper.model)await expect.poll(async()=>{
    const s=await sample(),old=before.state.echo.position,p=s.state.echo.position;
    return {helperMoved:Math.hypot(p[0]-old[0],p[2]-old[2])>.1,
     closeToPlayer:Math.hypot(p[0]-s.livePosition[0],p[2]-s.livePosition[2])<2.5,
     drawn:s.drawnMeshes>0,activeScene:s.parentMatches};
   },{timeout:10000}).toEqual({helperMoved:true,closeToPlayer:true,drawn:true,activeScene:true});
   const after=await sample();expect(after.selected).toBe(helper.id);expect(after.saved).toBe(helper.id);
   if(after.presentationEnabled)await expect.poll(()=>page.locator('#scene').evaluate(canvas=>Number(canvas.dataset.presentedFrame)),{timeout:10000}).toBeGreaterThanOrEqual(after.submittedFrames);
   row.status='passed';row.playerMoved=Math.hypot(after.livePosition[0]-before.livePosition[0],after.livePosition[2]-before.livePosition[2]);
   row.follows=helper.model?true:'not applicable';row.evidence=after;
   if(helper.model)await page.screenshot({path:info.outputPath(helper.id+'-'+mode+'.png')});
  }catch(error){row.error=error.message;row.evidence=await sample().catch(()=>null);}
  rows.push(row);console.log('COMPANION_MATRIX_ROW',JSON.stringify(row));
 }
 try{
  for(const helper of [...HELPERS,...GUIDANCE_MODES]){
   await choose(helper);await verify(helper,'town');
   // No selection changes at the scene boundary: prove the chosen guide persists.
   await enterMarket(page);await verify(helper,'market');
   if(!await page.locator('#market-card').evaluate(element=>element.open))await page.locator('#market-card > summary').click();await page.locator('#market-exit').click();
   await page.waitForFunction(()=>window.companionRenderProbe?.().state.mode==='town',null,{timeout:30000});
   expect((await sample()).selected).toBe(helper.id);expect((await sample()).saved).toBe(helper.id);
  }
 }finally{
  const receipt={roster:HELPERS.map(helper=>helper.id),guidance:GUIDANCE_MODES.map(helper=>helper.id),expectedRows:18,reportedRows:rows.length,rows,requests,errors};
  writeFileSync(info.outputPath('companion-matrix.json'),JSON.stringify(receipt,null,2));
  await info.attach('companion-matrix',{body:JSON.stringify(receipt,null,2),contentType:'application/json'});
 }
 expect(rows).toHaveLength(18);expect(rows.filter(row=>row.status!=='passed')).toEqual([]);
 expect(requests.filter(request=>request.requested!==request.intended)).toEqual([]);
 expect(errors).toEqual([]);
});

test.beforeEach(({page})=>{enterClassroomWhenAsked(page);});
