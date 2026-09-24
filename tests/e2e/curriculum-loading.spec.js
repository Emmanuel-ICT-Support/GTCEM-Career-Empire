import {writeFile} from 'node:fs/promises';
import {test,expect} from './campus-fixtures.js';
const state=page=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}'));
test('curriculum rooms remain accessible when campus decoration and Studio fail',async({page},info)=>{
 test.setTimeout(90000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/mature-eucalypt-b-packed.glb',r=>r.abort());
 await page.route('**/studio.js?*',r=>r.abort());
 await page.goto('/playable-3d/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#loading')).toBeHidden({timeout:30000});
 await page.locator('#places-toggle').click();await page.locator('#studio-view').click();
 await expect(page.locator('#toast')).toContainText('Avatar Studio is getting ready');
 await page.locator('#places-toggle').click();await page.locator('#est-destination').click();
 await expect.poll(async()=>(await state(page)).mode,{timeout:12000}).toBe('interior');
 await page.locator('#scene').focus();await page.keyboard.down('w');
 try{await expect(page.locator('#interact')).toContainText('Open EST Prep',{timeout:10000});}finally{await page.keyboard.up('w');}
 await expect(page.locator('#interact')).toContainText('Open EST Prep');
 await page.locator('#interact').click();await expect(page.locator('#module-overlay')).toBeVisible();
 await expect(page.frameLocator('#module-frame').locator('body')).toContainText('EST');
 await page.locator('#close-module').click();
 await page.locator('#places-toggle').click();await page.locator('#town-view').click();await expect.poll(async()=>(await state(page)).mode).toBe('town');
 await page.locator('#places-toggle').click();await page.locator('#careers-destination').click();await expect.poll(async()=>(await state(page)).mode).toBe('careers');
 await page.locator('#places-toggle').click();await page.locator('#chapel-destination').click();await expect.poll(async()=>(await state(page)).mode,{timeout:15000}).toBe('chapel');
 await page.locator('#places-toggle').click();await page.locator('#town-view').click();await expect.poll(async()=>(await state(page)).mode).toBe('town');
 await page.screenshot({path:info.outputPath('curriculum-available.png')});expect(errors).toEqual([]);
});

for(const width of [1280,390])test(`slow saved avatar, Studio and poster never gate EST at ${width}px`,async({page},info)=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:844});
 let release;const gate=new Promise(resolve=>release=resolve),requests=[],errors=[];
 page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 const saved=JSON.stringify({activeId:'saved',profiles:[{id:'saved',name:'Saved student',body:'schoolboy'},{id:'other',name:'Other',body:'a'}]});
 await page.addInitScript(saved=>localStorage.setItem('career-empire-3d-profiles-v2-tripo',saved),saved);
 for(const glob of ['**/player-schoolboy*.glb','**/studio.js?*','**/est-lab-systems-poster.png','**/mature-eucalypt-b-packed.glb'])await page.route(glob,async r=>{await gate;await r.continue();});
 try{
  await page.goto('/playable-3d/',{waitUntil:'domcontentloaded'});await expect(page.locator('#loading')).toBeHidden({timeout:15000});
  await expect.poll(async()=>(await state(page)).avatarFallback).toBe(true);
  const start=(await state(page)).position[2];await page.keyboard.down('w');await page.waitForTimeout(650);await page.keyboard.up('w');
  await expect.poll(async()=>(await state(page)).position[2]).toBeLessThan(start-.5);
  await page.locator('#places-toggle').click();await page.locator('#studio-view').click();await expect(page.locator('#toast')).toContainText('Avatar Studio is getting ready');
  await page.locator('#places-toggle').click();await page.locator('#est-destination').click();await expect.poll(async()=>(await state(page)).mode,{timeout:12000}).toBe('interior');
  const timing=await page.evaluate(()=>({firstFrameMs:Number(document.querySelector('#scene').dataset.firstFrameMs),curriculumMs:performance.now()}));
  await writeFile(info.outputPath('timing.json'),JSON.stringify(timing,null,2));
  await info.attach('first-play-timing',{body:JSON.stringify(timing),contentType:'application/json'});
  expect(timing.firstFrameMs).toBeLessThan(15000);
  await page.screenshot({path:info.outputPath('est-with-temporary-avatar.png')});
  release();await expect.poll(async()=>(await state(page)).avatarFallback,{timeout:30000}).toBe(false);
  expect((await state(page)).mode).toBe('interior');await expect(page.locator('#studio-panel')).toBeHidden();
  expect(await page.evaluate(()=>localStorage.getItem('career-empire-3d-profiles-v2-tripo'))).toBe(saved);
  expect(requests.some(u=>/avatar-[ab]\.glb|occupational-|hair-.*\.glb|shoes-.*\.glb/.test(u))).toBe(false);
  await page.locator('#places-toggle').click();await page.locator('#studio-view').click();await expect(page.locator('#save-avatar')).toBeEnabled({timeout:15000});
  expect(errors).toEqual([]);
 }finally{release();}
});

test('failed avatar keeps fallback playable, retry restores saved avatar without rewriting it',async({page})=>{
 test.setTimeout(60000);let fail=true;
 const saved=JSON.stringify({activeId:'saved',profiles:[{id:'saved',name:'Saved student',body:'schoolboy'}]});
 await page.addInitScript(saved=>localStorage.setItem('career-empire-3d-profiles-v2-tripo',saved),saved);
 await page.route('**/player-schoolboy*.glb',r=>fail?r.abort():r.continue());
 await page.goto('/playable-3d/',{waitUntil:'domcontentloaded'});await expect(page.locator('#loading')).toBeHidden({timeout:15000});
 await expect.poll(async()=>(await state(page)).avatarFallback).toBe(true);
 await page.locator('#places-toggle').click();await page.locator('#est-destination').click();await expect.poll(async()=>(await state(page)).mode,{timeout:12000}).toBe('interior');
 fail=false;await page.getByRole('button',{name:'Retry saved avatar',exact:true}).click();
 await expect.poll(async()=>(await state(page)).avatarFallback,{timeout:15000}).toBe(false);
 expect((await state(page)).mode).toBe('interior');
 const actual=await page.evaluate(()=>JSON.parse(localStorage.getItem('career-empire-3d-profiles-v2-tripo')));
 expect(actual.activeId).toBe('saved');expect(actual.profiles[0].body).toBe('schoolboy');
 expect(await page.evaluate(()=>localStorage.getItem('career-empire-3d-profiles-v2-tripo'))).toBe(saved);
});

test('unavailable saved clothing uses fallback and never fetches other outfits',async({page})=>{
 test.setTimeout(60000);let fail=true;const requests=[];page.on('request',r=>requests.push(r.url()));
 const saved=JSON.stringify({activeId:'saved',profiles:[{id:'saved',name:'Saved outfit',body:'pantstest',workTop:'chef',pantsStyle:'suit',hairStyle:'bob',shoeStyle:'boots'}]});
 await page.addInitScript(saved=>localStorage.setItem('career-empire-3d-profiles-v2-tripo',saved),saved);
 await page.route('**/occupational-top-chef.glb?*',r=>fail?r.abort():r.continue());
 await page.goto('/playable-3d/',{waitUntil:'domcontentloaded'});await expect(page.locator('#loading')).toBeHidden({timeout:15000});
 await expect.poll(async()=>(await state(page)).avatarFallback).toBe(true);
 await page.locator('#places-toggle').click();await page.locator('#careers-destination').click();await expect.poll(async()=>(await state(page)).mode).toBe('careers');
 expect(requests.some(u=>/hospital-scrub-top|occupational-top-(work|suit)|occupational-pants-(chef|tradie|scrubs)|hair-(sweep|curls|ponytail)\.glb|shoes-(trainers|dress|clogs)\.glb/.test(u))).toBe(false);
 fail=false;await page.getByRole('button',{name:'Retry saved avatar',exact:true}).click();await expect.poll(async()=>(await state(page)).avatarFallback,{timeout:15000}).toBe(false);
 expect((await state(page)).mode).toBe('careers');expect(await page.evaluate(()=>localStorage.getItem('career-empire-3d-profiles-v2-tripo'))).toBe(saved);
});
