import {openDiscoveryClue,openClueHelp} from './discovery-controls.js';
import {enterClassroomWhenAsked} from './market-controls.js';
import {test,expect} from '@playwright/test';
import {walkThroughMarketEntrance} from './market-controls.js';
async function state(page){const started=performance.now();const sample=await page.evaluate(()=>{const data=JSON.parse(document.querySelector('#diagnostics')?.dataset.state||'{}'),qa=window.__teacherQA?.(),trail=qa?.discovery?.snapshot();if(trail)data.discovery={...trail,souvenir:Boolean(trail.souvenir),shots:Object.fromEntries(Object.entries(trail.shots||{}).map(([id,shot])=>[id,{label:shot.label,image:Boolean(shot.image)}]))};if(qa)data.teachers=qa.teachers.map(n=>n.snapshot());return {data,pageMs:performance.now(),url:location.href};});if(performance.now()-started>1000)console.log('TEACHER_SAMPLE_NODE',JSON.stringify({startMs:Math.round(started),endMs:Math.round(performance.now()),pageMs:Math.round(sample.pageMs),url:sample.url,runId:sample.data.runId,scene:sample.data.discovery?.scene}));return sample.data;}
async function options(page){const start=performance.now();try{if(!await page.locator('#exploration-options').evaluate(e=>e.open))await page.locator('#exploration-options > summary').click({timeout:5000});}finally{console.log('TEACHER_OPTIONS_NODE',JSON.stringify({startMs:Math.round(start),endMs:Math.round(performance.now())}));}}
async function closeOptions(page){if(await page.locator('#exploration-options').evaluate(e=>e.open))await page.locator('#exploration-options > summary').click({timeout:5000});}
async function trail(page){await options(page);if(!await page.locator('#exploration-trail-options').evaluate(e=>e.open))await page.locator('#exploration-trail-options > summary').click({timeout:5000});}
async function oval(page){await options(page);if(!await page.locator('#destination-menu').evaluate(e=>e.open))await page.locator('#places-toggle').click({timeout:5000});await page.locator('#oval-destination').click({timeout:5000});await closeOptions(page);await expect.poll(()=>state(page),{timeout:60000}).toMatchObject({campusReady:true,mode:'town'});}
async function assistedPhotoSpot(page){await trail(page);await page.locator('#discovery-open').click({timeout:5000});await openClueHelp(page);await page.locator('#discovery-assist').click({timeout:5000});await closeOptions(page);await expect.poll(()=>state(page),{timeout:60000}).toMatchObject({discovery:{scene:'invite'},teachers:[{visible:true},{visible:true}]});}
async function wallet(page){return page.evaluate(()=>JSON.parse(window.CareerEmpireGameRun.storage.getItem('career-empire-economy-lab-v1')||'{}'));}
async function greetBoth(page){
 await closeOptions(page);await expect.poll(()=>state(page)).toMatchObject({entryReady:true,mode:'town'});
 // A route can update controller state before the software canvas presents it.
 const previous=await page.locator('#scene').getAttribute('data-presented-frame');
 if(previous)await page.waitForFunction(old=>Number(document.querySelector('#scene').dataset.presentedFrame)>Number(old)+1,previous,{timeout:10000});
 for(const id of ['middleton','psandodakis']){
  const before=(await state(page)).teachers.find(n=>n.id===id).reactions;
  const point=await page.evaluate(id=>{
   const {teachers,camera,THREE,worlds,actor}=window.__teacherQA(),n=teachers.find(n=>n.id===id),r=document.querySelector('#scene').getBoundingClientRect();
   const visible=o=>{for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;},attempts=[];
   // Select a real, unoccluded visible surface, just as a student would. No
   // position, animation, reaction, readiness or raycast behavior is changed.
   for(const height of [1.65,1.5,1.35,1.1])for(const offset of [0,-.12,.12,-.24,.24]){
    const projected=n.root.position.clone().add(new THREE.Vector3(offset,height,0)).project(camera),ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(projected.x,projected.y),camera);
    const hit=ray.intersectObject(n.root,true)[0];let blocker;
    if(hit)blocker=ray.intersectObjects(worlds.town.children.filter(o=>o!==actor.model&&o!==n.root),true).find(h=>h.object.isMesh&&visible(h.object)&&h.distance<hit.distance-.05);
    attempts.push({height,offset,hit:hit?.object.name||null,blocker:blocker?.object.name||null});
    if(hit&&!blocker&&Math.abs(projected.x)<1&&Math.abs(projected.y)<1)return {x:r.x+(projected.x+1)*r.width/2,y:r.y+(1-projected.y)*r.height/2,near:n.near(actor.model.position,7),attempts};
   }
   return {near:n.near(actor.model.position,7),attempts};
  },id);
  console.log('TEACHER_VISIBLE_TAP',JSON.stringify({id,before,point}));expect(point.near).toBe(true);expect(point.x).toBeDefined();
  await page.mouse.click(point.x,point.y);await expect.poll(async()=>((await state(page)).teachers.find(n=>n.id===id)?.reactions),{timeout:5000}).toBeGreaterThan(before);
 }
}
test('same-run photo teachers stay visible after cancellation, market/module returns and repeat greetings',async({page},info)=>{
 test.setTimeout(240000);const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('TEACHER_PAGE_ERROR',e.message);});
 // Explicit same-run pre-photo fixture; actual reveal, photo, greetings and handoffs use normal UI.
 await page.addInitScript(()=>{if(location.pathname.includes('/playable-3d/')&&location.search.includes('guestRun=teacher-fixture')&&!sessionStorage.getItem('teacher-fixture-seeded')){sessionStorage.setItem('teacher-fixture-seeded','1');const c=document.createElement('canvas');c.width=c.height=10;sessionStorage.setItem('ce-game-run-handoff-v1',JSON.stringify({id:'teacher-fixture',createdAt:Date.now(),data:{'ce-taster-intro-v1:avery':'seen','ce-missing-frame-local-review-v1':JSON.stringify({step:3,developed:true,chapelVisited:true,shots:{mural:{label:'Fixture mural',image:c.toDataURL('image/jpeg')}},souvenir:null})}}));}});
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text())+`\nwindow.__teacherQA=()=>({teachers,camera,THREE,worlds,discovery,actor});window.__teacherInteractionLog=[];let teacherRAFLast=performance.now();function teacherRAFProbe(){const now=performance.now();if(now-teacherRAFLast>100){window.__teacherInteractionLog.push({pageMs:now,gapMs:now-teacherRAFLast,frame:renderedFrames,renderMs:lastRenderMs,mode,options:document.querySelector('#exploration-options')?.open,scene:discovery?.snapshot().scene});if(window.__teacherInteractionLog.length>80)window.__teacherInteractionLog.shift();}teacherRAFLast=now;requestAnimationFrame(teacherRAFProbe);}requestAnimationFrame(teacherRAFProbe);` });});
 await page.goto('/playable-3d/?guestRun=teacher-fixture');await expect.poll(()=>state(page),{timeout:45000}).toMatchObject({entryReady:true,discovery:{step:3},teachers:[]});
 await assistedPhotoSpot(page);await page.screenshot({path:info.outputPath('first-teacher-reveal.png')});await page.keyboard.press('Escape');await expect.poll(()=>state(page)).toMatchObject({discovery:{step:3,scene:null},teachers:[{visible:true},{visible:true}]});await page.screenshot({path:info.outputPath('cancelled-visible-teachers.png')});await greetBoth(page);await expect.poll(()=>state(page),{timeout:15000}).toMatchObject({teachers:[{state:'idle'},{state:'idle'}]});await greetBoth(page);
 await oval(page);await assistedPhotoSpot(page);await page.locator('#discovery-pose').click({timeout:5000});await expect.poll(()=>state(page),{timeout:30000}).toMatchObject({discovery:{souvenir:true}});await expect(page.locator('#discovery-dialog')).toBeVisible();await expect(page.locator('#helper-picker')).not.toBeVisible();await page.screenshot({path:info.outputPath('held-photo-review.png')});await page.locator('#discovery-continue').click();await expect(page.locator('#discovery-handover')).toBeVisible();await page.getByRole('button',{name:'Keep exploring',exact:true}).click();await page.locator('#exploration-options > summary').click();await page.locator('#exploration-trail-options > summary').click();await page.locator('#discovery-open').click();await expect.poll(()=>state(page)).toMatchObject({discovery:{step:4,souvenir:true,scene:null},teachers:[{visible:true},{visible:true}]});const beforeMarket=await wallet(page);await page.locator('#discovery-market-handover').click();await walkThroughMarketEntrance(page);await expect.poll(()=>state(page),{timeout:60000}).toMatchObject({mode:'market'});const completed=await wallet(page);expect(completed).toEqual(beforeMarket);expect((completed.events||[]).some(e=>e.id==='initiative:destination-market')).toBe(false);
 await page.locator('#market-card > summary').click();await page.locator('#market-exit').click();await expect.poll(()=>state(page),{timeout:30000}).toMatchObject({mode:'town',discovery:{step:4,souvenir:true}});await oval(page);await expect.poll(()=>state(page)).toMatchObject({teachers:[{visible:true},{visible:true}],discovery:{scene:null}});await page.screenshot({path:info.outputPath('market-return-teachers.png')});await greetBoth(page);expect(await wallet(page)).toEqual(completed);
 // Keep the module app pending to reproduce the real early-return race deterministically.
 let releaseModule;const moduleGate=new Promise(resolve=>{releaseModule=resolve;});let markModuleHeld;const moduleHeld=new Promise(resolve=>{markModuleHeld=resolve;});
 await page.route('**/economy-lab/app.mjs?*',async route=>{markModuleHeld();await moduleGate;await route.continue().catch(()=>{});});
 const returnRun=(await state(page)).runId;
 try{await options(page);await page.locator('#my-life-link').click();await expect(page).toHaveURL(/economy-lab/);await moduleHeld;await expect(page.locator('#tracker-loading')).toBeVisible();await page.locator('#back-to-game').click();await expect.poll(async()=>(await state(page)).runId,{timeout:45000}).toBe(returnRun);}finally{releaseModule();}
await expect.poll(()=>state(page),{timeout:45000}).toMatchObject({discovery:{step:4,souvenir:true},guestRun:true});await oval(page);await expect.poll(()=>state(page),{timeout:45000}).toMatchObject({teachers:[{visible:true},{visible:true}],discovery:{scene:null}});await page.screenshot({path:info.outputPath('module-return-teachers.png')});await greetBoth(page);expect(await wallet(page)).toEqual(completed);
 await trail(page);await page.locator('#discovery-review-controls > summary').click();await page.locator('#discovery-restart').click();await closeOptions(page);await expect.poll(()=>state(page)).toMatchObject({discovery:{step:0,souvenir:true},teachers:[{visible:false},{visible:false}]});expect(errors).toEqual([]);console.log('TEACHER_FRAME_GAPS',JSON.stringify(await page.evaluate(()=>window.__teacherInteractionLog)));console.log('TEACHER ACCEPTED',JSON.stringify(await state(page)));
 await page.goto('/playable-3d/');await expect(page.locator('#taster-intro')).toBeVisible();await page.locator('#taster-skip').click();await expect.poll(()=>state(page),{timeout:45000}).toMatchObject({entryReady:true,discovery:{step:0},teachers:[]});
});

test.afterEach(async({page},info)=>{if(!page.isClosed()){const log=await page.evaluate(()=>window.__teacherInteractionLog||[]);await info.attach('teacher-frame-gaps',{body:JSON.stringify(log,null,2),contentType:'application/json'});}});

test.beforeEach(({page})=>{enterClassroomWhenAsked(page);});
