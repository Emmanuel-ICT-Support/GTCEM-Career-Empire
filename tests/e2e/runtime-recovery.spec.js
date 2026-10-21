import {enterClassroomWhenAsked} from './market-controls.js';
import {test,expect} from '@playwright/test';
import {enterMarket} from './market-controls.js';
import {reportRuntimeObservation,assertRuntimeObservation} from './runtime-lanes.js';
const softwareTest=test.extend({launchOptions:async({launchOptions},use)=>use({...launchOptions,args:[...(launchOptions.args||[]).filter(a=>!a.startsWith('--use-angle=')&&a!=='--enable-unsafe-swiftshader'),'--use-angle=swiftshader','--enable-unsafe-swiftshader']})});
test.afterEach(async({page},info)=>{
 if(process.env.CE_RECOVERY_DRAWS!=='1')return;
 const observations=[];
 try{
  // A failed entry deadline stays failed. Continue only to collect the separate
  // Stats/draw trace, without changing any canonical assertion or its budget.
  if(info.status!==info.expectedStatus&&process.env.CE_RECOVERY_TRACE_AFTER_FAILURE==='1'&&info.title.startsWith('Stats changes')){
   await expect.poll(()=>state(page),{timeout:10000}).toMatchObject({entryReady:true});
   const options=page.locator('#exploration-options');if(!await options.evaluate(e=>e.open))await options.locator(':scope > summary').click();
   await expect.poll(()=>state(page),{timeout:10000}).toMatchObject({avatarFallback:false,surfaceDetailPending:0});
   const panel=page.getByRole('region',{name:'Exploration tools'});if(!await panel.isVisible())await page.locator('#exploration-stats-toggle').click();
   const moneyDetails=panel.locator('details[data-stats-disclosure="game-money"]');if(!await moneyDetails.evaluate(e=>e.open))await moneyDetails.locator(':scope > summary').click();await expect(panel.getByRole('heading',{name:'Market money',exact:true})).toBeVisible();
   observations.push({phase:'before-save',probe:await page.evaluate(()=>window.recoveryProbe()),state:await state(page)});
   if(!(await panel.innerText()).includes('Wallet $13.00 · Savings $5.00'))await panel.getByRole('button',{name:'Save $5',exact:true}).click();
   await expect(panel).toContainText('Wallet $13.00 · Savings $5.00');await expect(panel.getByRole('heading',{name:'Market money',exact:true})).toBeVisible();
   for(let i=0;i<4;i++){await page.waitForTimeout(1000);observations.push({phase:'after-save-'+i,probe:await page.evaluate(()=>window.recoveryProbe()),state:await state(page)});}
  }
 }catch(error){observations.push({diagnosticError:String(error)});}
 try{await info.attach('actual-world-draws',{body:JSON.stringify({diagnosticOnly:true,observations,final:await page.evaluate(()=>window.recoveryProbe?.())},null,2),contentType:'application/json'});}catch{}
});
async function state(page){const start=Date.now();const sampled=await page.evaluate(()=>({pageMs:performance.now(),state:JSON.parse(document.querySelector('#diagnostics')?.dataset.state||'{}')}));console.log('RECOVERY_SAMPLE',JSON.stringify({nodeStart:start,nodeEnd:Date.now(),pageMs:sampled.pageMs,runId:sampled.state.runId,mode:sampled.state.mode,opening:sampled.state.marketOpening,statsOpen:sampled.state.exploration?.statsOpen,wallet:sampled.state.exploration?.market?.wallet,frames:sampled.state.renderedFrames}));return sampled.state;}
async function start(page,id='recovery',info){
 await page.addInitScript(id=>sessionStorage.setItem('ce-game-run-handoff-v1',JSON.stringify({id,createdAt:Date.now(),data:{'ce-taster-intro-v1:avery':'seen','ce-night-market-practice-v1':JSON.stringify({version:3,events:['accept','share-plan','run-trial','inspect-trial','consolidate','pay']})}})),id);
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();let source=await response.text();if(process.env.CE_RECOVERY_DRAWS==='1'){const needle="frames++;renderedFrames++;canvas.dataset.rendered='true';";if(!source.includes(needle))throw Error('Missing actual-world-draw hook');source=source.replace(needle,needle+"(window.__recoveryDraws||=[]).push({pageMs:performance.now(),frame:renderedFrames,stamp:lastPausedSceneStamp,helper:echo?.snapshot(),children:scene.children.length,avatar:actor.model.uuid,teachers:teachers.length});");}await route.fulfill({response,body:source+`\nwindow.recoveryProbe=()=>({mode,marketOpening,renderedFrames,renderBackend,draws:window.__recoveryDraws,teachers:teachers.length,teacherModuleFailure,actual:{mode,entryReady,campusReady,marketOpening,renderedFrames,renderBackend,position:actor.model.position.toArray(),market:nightMarket?.snapshot(),exploration:explorationTools?.snapshot()}});`});});
 // Software entry uses the existing 60-second whole-case execution watchdog.
 // That watchdog is not an approved student waiting-time deadline.
 await page.goto('/playable-3d/?guestRun='+id);await expect.poll(()=>state(page),{timeout:info?info.timeout:30000}).toMatchObject({entryReady:true});
 if(info){const measurement=await page.evaluate(()=>({renderer:JSON.parse(document.querySelector('#diagnostics').dataset.state).renderBackend,navigationToReadyMs:Number(document.querySelector('#scene').dataset.entryVisibleMs)}));assertRuntimeObservation(await reportRuntimeObservation(info,{...measurement,performanceRequired:false}));}
}
async function holdFirstMarket(page){let release,held=false,first=true;const gate=new Promise(r=>release=r);await page.route('**/night-market.js?*',async route=>{if(!first)return route.continue();first=false;held=true;await gate;const response=await route.fetch();await route.fulfill({response});});return {release,held:()=>held};}
test('pending Market travel yields to visible Character Studio and late completion stays cancelled',async({page},info)=>{
 test.setTimeout(60000);const errors=[];page.on('pageerror',e=>errors.push(e.message));const held=await holdFirstMarket(page);await start(page);await enterMarket(page,{waitForEntry:false});await expect.poll(held.held).toBe(true);
 await page.locator('#exploration-options > summary').click();await page.getByRole('button',{name:'Character',exact:true}).click();await expect.poll(()=>state(page),{timeout:30000}).toMatchObject({mode:'studio',marketOpening:false});await expect(page.locator('#studio-heading')).toBeVisible();const before=await page.evaluate(()=>window.recoveryProbe());held.release();
 await page.evaluate(async()=>{await import('./night-market.js?v=ecc-ba60122');await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);});await expect.poll(()=>state(page)).toMatchObject({mode:'studio',marketOpening:false});await expect.poll(()=>page.evaluate(()=>window.recoveryProbe().renderedFrames)).toBeGreaterThan(before.renderedFrames);await page.screenshot({path:info.outputPath('cancelled-market-studio.png')});expect(errors).toEqual([]);
});
test('stalled Market travel releases the campus and normal retry remains visible and walkable',async({page},info)=>{
 test.setTimeout(60000);const held=await holdFirstMarket(page);await start(page,'market-deadline');await enterMarket(page,{waitForEntry:false});await expect.poll(held.held).toBe(true);await expect(page.locator('#toast')).toContainText('The market could not open',{timeout:20000});await expect.poll(()=>state(page)).toMatchObject({mode:'town',marketOpening:false});held.release();await enterMarket(page);await expect.poll(()=>state(page),{timeout:20000}).toMatchObject({mode:'market'});
 await page.locator('#scene').focus();await page.keyboard.down('KeyW');try{await expect.poll(async()=>(await state(page)).position[2],{timeout:10000}).toBeLessThan(11);}finally{await page.keyboard.up('KeyW');}await page.screenshot({path:info.outputPath('market-deadline-retry.png')});
});
softwareTest('Stats changes publish while the cached world keeps its honest frame count',async({page},info)=>{
 test.setTimeout(60000);info.annotations.push({type:'runtime-lane',description:'software-compatibility'});await start(page,'paused-stats',info);await page.locator('#exploration-options > summary').click();await expect.poll(()=>state(page),{timeout:30000}).toMatchObject({avatarFallback:false,surfaceDetailPending:0});await page.locator('#exploration-stats-toggle').click();const panel=page.getByRole('region',{name:'Exploration tools'});await panel.getByText('Game money details',{exact:true}).click();await expect(panel.getByRole('heading',{name:'Market money',exact:true})).toBeVisible();
 await expect.poll(()=>state(page)).toMatchObject({exploration:{statsOpen:true,market:{wallet:1800}}});let frame=-1,stable=0;await expect.poll(async()=>{const n=await page.evaluate(()=>window.recoveryProbe().renderedFrames);stable=n===frame?stable+1:0;frame=n;return stable;},{timeout:15000,intervals:[1000]}).toBeGreaterThanOrEqual(2);
 await panel.getByRole('button',{name:'Save $5',exact:true}).click();await expect(panel).toContainText('Wallet $13.00 · Savings $5.00');await expect(panel.getByRole('heading',{name:'Market money',exact:true})).toBeVisible();await expect.poll(()=>state(page)).toMatchObject({exploration:{market:{wallet:1300,savings:500}},renderedFrames:frame});
});

test.beforeEach(({page})=>{enterClassroomWhenAsked(page);});
