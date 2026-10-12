import {test,expect} from '@playwright/test';
import {test as ownedTest} from './owned-account-fixtures.js';
// Entry collision readiness permits walking while optional campus detail stays deferred.
test('a stalled decorative surface cannot trap the player behind Arrival readiness',async({page})=>{
 test.setTimeout(90000);let release;const held=new Promise(r=>release=r),urls=[],errors=[];page.on('request',r=>urls.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/plaza/limestone-ecc-campus-v1.png',async route=>{await held;await route.continue();});
 try{
  await page.goto('/playable-3d/');await expect(page.locator('#taster-skip')).toBeVisible({timeout:30000});await page.locator('#taster-skip').click();await expect.poll(()=>page.evaluate(()=>JSON.parse(document.querySelector('#diagnostics')?.dataset.state||'{}')),{timeout:30000}).toMatchObject({entryReady:true,campusReady:false});
  console.log('held-image ready at',await page.evaluate(()=>performance.now()));await expect(page.locator('#campus-retry')).toBeVisible({timeout:30000});await expect(page.locator('#campus-progress-message')).toContainText('keep exploring');
  const p=await page.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state||'{}').position);await page.locator('#scene').focus();await page.keyboard.down('KeyW');await page.waitForTimeout(1200);await page.keyboard.up('KeyW');await expect.poll(()=>page.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state||'{}').position)).not.toEqual(p);
  expect(urls.filter(u=>u.includes('/whole-characters/'))).toHaveLength(1);expect(urls.some(u=>u.includes('test-avatar-catalog')||u.includes('career-empire-intro.mp4'))).toBe(false);
  release();await expect(page.locator('#campus-progress')).toBeHidden({timeout:30000});await expect.poll(()=>page.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state||'{}').surfaceDetailPending)).toBe(0);await page.screenshot({path:'qa/perf-surfaces-restored.png'});expect(errors).toEqual([]);
 }catch(error){console.log('held-surface state',await page.locator('#diagnostics').getAttribute('data-state'));throw error;}finally{release();}
});
test('complete intro reaches natural end and hands over to usable movement',async({page})=>{
 test.setTimeout(180000);const urls=[],errors=[];page.on('request',r=>urls.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/playable-3d/');await expect(page.locator('#taster-play')).toBeVisible({timeout:30000});expect(urls.some(u=>u.includes('career-empire-intro.mp4'))).toBe(false);
 await page.locator('#taster-play').click();await expect.poll(()=>page.locator('#taster-video').evaluate(v=>v.currentTime),{timeout:30000}).toBeGreaterThan(1);await expect.poll(()=>page.locator('#taster-video').evaluate(v=>v.duration)).toBe(66);
 await expect(page.locator('#taster-intro')).not.toBeVisible({timeout:120000});expect(await page.locator('#taster-video').evaluate(v=>v.ended)).toBe(true);
 await expect.poll(()=>page.evaluate(()=>JSON.parse(document.querySelector('#diagnostics')?.dataset.state||'{}')),{timeout:30000}).toMatchObject({entryReady:true,campusReady:false});const before=await page.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state||'{}').position);await page.locator('#scene').focus();await page.keyboard.down('KeyW');await page.waitForTimeout(1200);await page.keyboard.up('KeyW');await expect.poll(()=>page.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state||'{}').position)).not.toEqual(before);
 await page.keyboard.down('KeyW');try{await expect.poll(()=>page.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state||'{}').discovery?.step),{timeout:10000}).toBe(1);}finally{await page.keyboard.up('KeyW');}
 await expect(page.locator('#discovery-dialog')).toBeVisible();await page.keyboard.press('Escape');
 expect(urls.filter(u=>u.includes('/whole-characters/'))).toHaveLength(1);expect(urls.some(u=>u.includes('test-avatar-catalog'))).toBe(false);expect(errors).toEqual([]);console.log('natural intro handover',await page.locator('#diagnostics').getAttribute('data-state'));
});
test('deferred GLTF surfaces keep their target, UV sampler, colour space and flip orientation',async({page})=>{
 await page.goto('/playable-3d/');await expect(page.locator('#taster-skip')).toBeVisible({timeout:30000});
 const result=await page.evaluate(async()=>{
  const T=await import('three'),{createDeferredTextures}=await import('./deferred-textures.js?v=startup-20261012');const jobs=createDeferredTextures();
  const target=new T.Texture(document.createElement('canvas'));target.flipY=false;target.wrapS=T.RepeatWrapping;target.wrapT=T.MirroredRepeatWrapping;target.colorSpace=T.SRGBColorSpace;target.repeat.set(.3,.7);target.offset.set(.2,.4);target.rotation=.5;
  const replacement=new T.Texture(document.createElement('canvas'));const before={wrapS:target.wrapS,wrapT:target.wrapT,colorSpace:target.colorSpace,repeat:target.repeat.toArray(),offset:target.offset.toArray(),rotation:target.rotation};const same=await jobs.load({loadAsync:async()=>replacement},'original.png',{target,flipY:target.flipY});await jobs.start();
  return {same:same===target,source:target.source===replacement.source,pending:jobs.pending,flipY:target.flipY,before,after:{wrapS:target.wrapS,wrapT:target.wrapT,colorSpace:target.colorSpace,repeat:target.repeat.toArray(),offset:target.offset.toArray(),rotation:target.rotation}};
 });expect(result.same).toBe(true);expect(result.source).toBe(true);expect(result.pending).toBe(0);expect(result.flipY).toBe(false);expect(result.after).toEqual(result.before);
});
ownedTest('mocked owned-account parcel, map and shared wallet persist without a duplicate reward',async({page})=>{
 test.setTimeout(90000);await page.goto('/playable-3d/');await expect(page.locator('#taster-skip')).toBeVisible({timeout:30000});await page.locator('#taster-skip').click();await expect.poll(()=>page.evaluate(()=>JSON.parse(document.querySelector('#diagnostics')?.dataset.state||'{}')),{timeout:30000}).toMatchObject({entryReady:true,campusReady:false});
 await page.locator('#scene').focus();await page.keyboard.down('KeyW');try{await expect.poll(()=>page.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state||'{}').discovery.step),{timeout:10000}).toBe(1);}finally{await page.keyboard.up('KeyW');}
 await page.keyboard.press('Escape');await expect(page.locator('#campus-minimap')).toBeVisible();await page.getByRole('button',{name:'Hide map',exact:true}).click();await expect(page.locator('#campus-minimap')).toBeHidden();await page.getByRole('button',{name:'Show map',exact:true}).click();await expect(page.locator('#campus-minimap')).toBeVisible();
 const wallet=await page.evaluate(async()=>{const {project}=await import('../economy-lab/economy.mjs?v=initiative-20261011');return project(JSON.parse(localStorage.getItem('ce-player:e2e-owned:'+'career-empire-economy-lab-v1')));});expect(wallet.cash).toBe(102500);expect(wallet.initiativeRewards).toBe(2500);expect(wallet.initiatives).toEqual(['parcel-taster']);const raw=await page.evaluate(()=>localStorage.getItem('ce-player:e2e-owned:'+'career-empire-economy-lab-v1'));await page.reload();await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true',{timeout:30000});expect(await page.evaluate(()=>localStorage.getItem('ce-player:e2e-owned:'+'career-empire-economy-lab-v1'))).toBe(raw);
});
