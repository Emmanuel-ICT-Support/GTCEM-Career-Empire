import {enterClassroomWhenAsked} from './market-controls.js';
import {test,expect} from '@playwright/test';
import {reportRuntimeObservation} from './runtime-lanes.js';
for(const width of [1280,390])for(const entry of ['', '&mode=full'])test(`Market money and collection stay available ${width} ${entry||'default'}`,async({page},info)=>{
 // This is a functional journey budget, never a startup performance allowance.
 test.setTimeout(60000);
 const started=Date.now(),stages={readiness:{status:'running',pollBudgetMs:30000},content:{status:'notReached',budgetMs:5000},functional:{status:'notReached',wholeJourneyBudgetMs:60000}};
 let stage='readiness',stageStarted=started,runtime=null;
 const enter=name=>{stage=name;stageStarted=Date.now();stages[name].status='running';};
 const complete=detail=>Object.assign(stages[stage],{status:'passed',elapsedMs:Date.now()-stageStarted},detail);
 try{
  await page.setViewportSize({width,height:844});const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  await page.addInitScript(()=>{sessionStorage.setItem('ce-game-run-handoff-v1',JSON.stringify({id:'stats-fixture',createdAt:Date.now(),data:{'ce-taster-intro-v1:avery':'seen','ce-night-market-practice-v1':JSON.stringify({version:3,events:['accept','share-plan','run-trial','inspect-trial','consolidate','pay',{type:'purchase',item:'plant'},'encore']})}}));});
  await page.goto('/playable-3d/?guestRun=stats-fixture'+entry);await expect(page.locator('#exploration-stats-toggle')).toBeVisible({timeout:60000});
  const waitStarted=Date.now();await expect.poll(()=>page.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state||'{}').entryReady),{timeout:30000}).toBe(true);
  const measurement=await page.evaluate(()=>({renderer:JSON.parse(document.querySelector('#diagnostics').dataset.state||'{}').renderBackend,navigationToReadyMs:Number(document.querySelector('#scene').dataset.entryVisibleMs)||null,handoverMs:null,performanceRequired:false}));
  complete({pollElapsedMs:Date.now()-waitStarted,navigationToReadyMs:measurement.navigationToReadyMs});
  runtime=await reportRuntimeObservation(info,measurement);
  expect(requests.some(u=>u.includes('market-collection.mjs'))).toBe(false);
  enter('content');
  // Measure from the actual click, so a long click/IPC wait cannot hide a slow
  // first content response behind the longer functional journey budget.
  await page.locator('#exploration-stats-toggle').evaluate(button=>{
   const times=window.__statsContentTimes={requestAt:null,contentAt:null};
   const observer=new MutationObserver(()=>{const heading=[...document.querySelectorAll('.tools-content h3')].find(n=>n.textContent==='Market money');if(times.requestAt!==null&&heading?.getClientRects().length){times.contentAt=performance.now();observer.disconnect();}});
   observer.observe(document.body,{subtree:true,childList:true});button.addEventListener('click',()=>times.requestAt=performance.now(),{once:true,capture:true});
  });
  await page.locator('#exploration-stats-toggle').click();const panel=page.getByRole('region',{name:'Exploration tools'});await expect(panel.getByRole('heading',{name:'Market money',exact:true})).toBeVisible();
  const contentMs=await page.evaluate(()=>{const t=window.__statsContentTimes;return t.contentAt===null?null:t.contentAt-t.requestAt;});
  expect(contentMs,'Market content must be available within five seconds of the actual request').not.toBeNull();expect(contentMs).toBeLessThan(5000);complete({requestToDOMContentMs:contentMs});
  enter('functional');await expect(panel.locator('[data-market-item=plant]')).toBeVisible();await expect(panel.locator('[data-market-item=ticket]')).toBeVisible();await expect(panel).toContainText('Wallet $14.00');
  await expect(panel.locator('.stats-market-money')).toContainText('Community contributions $2.00');await panel.getByText('Market money history',{exact:true}).click();await expect(panel).toContainText('First gig: $18 net; $2 fictional community tax.');
  await panel.getByRole('button',{name:'Save $5',exact:true}).click();await expect(panel).toContainText('Wallet $9.00 · Savings $5.00');await panel.getByRole('button',{name:'Withdraw $5',exact:true}).click();await expect(panel).toContainText('Wallet $14.00 · Savings $0.00');await panel.getByRole('button',{name:'Give $2 to the community lantern',exact:true}).click();await expect(panel).toContainText('Wallet $12.00');await expect(panel.locator('.stats-market-money')).toContainText('Community contributions $4.00');await expect(panel.getByRole('button',{name:'Give $2 to the community lantern',exact:true})).toBeDisabled();
  expect(await panel.evaluate(n=>n.scrollWidth<=n.clientWidth)).toBe(true);await page.screenshot({path:info.outputPath(`market-stats-${width}-${entry?'full':'default'}.png`)});await panel.getByRole('button',{name:'Close panel'}).click();await page.locator('#exploration-stats-toggle').click();await expect(panel).toContainText('Wallet $12.00');await expect(panel.locator('[data-market-item=plant]')).toBeVisible();expect(errors).toEqual([]);complete();
 }catch(error){Object.assign(stages[stage],{status:'failed',elapsedMs:Date.now()-stageStarted,error:String(error.message).slice(0,500)});throw error;}
 finally{await info.attach('ui-readiness-observation',{body:JSON.stringify({stages,runtime,totalElapsedMs:Date.now()-started,startupPerformanceQualified:false,softwareStartupFixed:false,softwareWaitingAcceptanceMs:null}),contentType:'application/json'});}
});

test.beforeEach(({page})=>{enterClassroomWhenAsked(page);});
