import {test,expect} from './campus-fixtures.js';
test.setTimeout(120000);
const diagnostics=page=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}'));
test('Dress ups base appears before delayed clothing, retry and latest choice work',async({page},info)=>{
 let release;const gate=new Promise(r=>release=r);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/hospital-scrub-top.glb*',async route=>{await Promise.race([gate,new Promise(r=>setTimeout(r,20000))]);await route.continue();});
 await page.goto('/playable-3d/?outfit=wardrobe&review=1',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#scene')).toHaveAttribute('data-preview-body','pantstest',{timeout:30000});
 await expect(page.locator('#edit-state')).toContainText('loading selected clothing');
 await expect(page.locator('#save-avatar')).toBeDisabled();
 await page.screenshot({path:info.outputPath('base-before-clothing.png')});release();
 await expect(page.locator('#save-avatar')).toBeEnabled({timeout:30000});
 await expect.poll(async()=>(await diagnostics(page)).wardrobe?.visibleTops).toEqual(['scrubs']);
 let fail=true;await page.route('**/occupational-top-work.glb*',r=>fail?r.abort():r.continue());
 await page.getByRole('button',{name:'Tops',exact:true}).click();await page.getByRole('button',{name:'Work shirt',exact:true}).click();
 await expect(page.locator('#retry-outfit')).toBeVisible();fail=false;await page.locator('#retry-outfit').click();
 await expect.poll(async()=>(await diagnostics(page)).wardrobe?.visibleTops).toEqual(['work']);
 await page.getByRole('button',{name:'Suit jacket',exact:true}).click();await page.getByRole('button',{name:'Chef jacket',exact:true}).click();
 await expect.poll(async()=>(await diagnostics(page)).wardrobe?.visibleTops).toEqual(['chef']);
 await expect(page.locator('#save-avatar')).toBeEnabled();expect(errors).toEqual([]);
});
test('real paving supports feet and camera stays inside room walls',async({page})=>{
 await page.route('**/review-harness',r=>r.fulfill({contentType:'text/html',body:'<script type="importmap">{"imports":{"three":"/playable-3d/vendor/three/build/three.module.js","three/addons/":"/playable-3d/vendor/three/examples/jsm/","@dimforge/rapier3d-compat":"/playable-3d/vendor/rapier/rapier.mjs"}}</script><base href="/playable-3d/">'}));
 await page.goto('/review-harness');
 const result=await page.evaluate(async()=>{
  const {createWorlds}=await import('/playable-3d/world.js');const T=await import('three');const w=await createWorlds(()=>{});await w.loadScenery();w.openCampus();
  const feet=[];for(const [x,z]of [[-7,18],[-13,12],[-19,12],[15,8]]){w.teleport(false,x,z);for(let i=0;i<90;i++)w.move(false,{x:0,z:0});feet.push(w.position(false).toArray());}
  const cameras=[];for(const [x,z,dx,dz]of [[6,0,4,0],[-6,0,-4,0],[0,-6,0,-4],[0,6,0,4]]){w.teleport(true,x,z);const target=new T.Vector3(x+dx,3,z+dz);w.protectCamera(true,new T.Vector3(x,0,z),target);cameras.push(target.toArray());}
  return {feet,cameras};
 });
 console.log(JSON.stringify(result));for(const p of result.feet)expect(p[1]).toBeGreaterThan(.07);
 for(const p of result.cameras){expect(Math.abs(p[0])).toBeLessThan(7.15);expect(p[2]).toBeGreaterThan(-6.85);expect(p[2]).toBeLessThan(7.15);}
});
test('saved Dress ups enters Studio despite failed clothing; body dropdown choices replace preview',async({page},info)=>{
 const saved=JSON.stringify({activeId:'review',profiles:[{id:'review',name:'Review avatar',body:'pantstest',workTop:'chef',outer:'none'}]});
 await page.addInitScript(saved=>localStorage.setItem('career-empire-3d-profiles-v2-tripo',saved),saved);
 await page.route('**/occupational-top-chef.glb*',r=>r.abort());
 await page.goto('/playable-3d/?review=1',{waitUntil:'domcontentloaded'});await expect(page.locator('#loading')).toBeHidden({timeout:30000});
 await page.locator('#studio-view').click();await expect(page.locator('#studio-panel')).toBeVisible({timeout:30000});
 await expect(page.locator('#scene')).toHaveAttribute('data-preview-body','pantstest');await expect(page.locator('#retry-outfit')).toBeVisible();
 for(const body of ['a','b','tripo','shirt','jackettest','schoolboy']){
  await page.getByLabel('Body',{exact:true}).selectOption(body);
  await expect(page.locator('#scene')).toHaveAttribute('data-preview-body',body,{timeout:30000});await expect(page.locator('#save-avatar')).toBeEnabled();
 }
 await page.screenshot({path:info.outputPath('body-dropdown.png')});
 expect(await page.evaluate(()=>localStorage.getItem('career-empire-3d-profiles-v2-tripo'))).toBe(saved);
});
