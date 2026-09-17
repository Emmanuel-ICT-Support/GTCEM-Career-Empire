import {test,expect} from './campus-fixtures.js';
const key='career-empire-3d-profiles-v2-tripo';
const avatarRequests=urls=>urls.filter(u=>/\/(?:player-[^/]+|avatar-[ab])\.glb(?:\?|$)/.test(u)).map(u=>new URL(u).pathname.split('/').pop());
for(const body of ['schoolboy','pantstest','a'])test(`saved ${body}: boot, Studio edit, save and reload`,async({page})=>{
 test.setTimeout(180000);const requests=[],errors=[];
 page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(({key,body})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({activeId:'saved',profiles:[{id:'other',name:'Other',body:'jackettest'},{id:'saved',name:'Saved player',body}]}));},{key,body});
 const asset={schoolboy:'player-schoolboy-2k-20260914.glb',pantstest:'player-pants-test-20260916.glb',a:'avatar-a.glb'}[body];
 const start=Date.now();await page.goto('/playable-3d/');await expect(page.locator('#loading')).toBeHidden({timeout:120000});
 await expect(page.locator('#character-caption')).toHaveText('Saved player');
 expect(avatarRequests(requests)).toEqual([asset]);
 expect(requests.some(u=>/\/studio\.js|\/OrbitControls\.js/.test(u))).toBe(false);
 console.log(JSON.stringify({body,readyMs:Date.now()-start,bootAvatars:avatarRequests(requests)}));
 await page.locator('#studio-view').click();await expect(page.locator('#save-avatar')).toBeEnabled({timeout:15000});
 expect(requests.some(u=>u.includes('/studio.js'))).toBe(true);
 await page.getByLabel('Body', {exact:true}).selectOption('b');
 await expect(page.locator('#save-avatar')).toBeEnabled({timeout:30000});
 expect(avatarRequests(requests)).toEqual([asset,'avatar-b.glb']);
 await page.locator('#save-avatar').click();await expect(page.locator('#studio-panel')).toBeHidden();
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).profiles.find(p=>p.id==='saved').body,key)).toBe('b');
 requests.length=0;await page.reload();await expect(page.locator('#loading')).toBeHidden({timeout:120000});
 expect(avatarRequests(requests)).toEqual(['avatar-b.glb']);expect(requests.some(u=>u.includes('/studio.js'))).toBe(false);
 await page.locator('#studio-view').click();await expect(page.locator('#save-avatar')).toBeEnabled();
 await page.locator('#town-view').click();await expect(page.locator('#studio-panel')).toBeHidden();
 expect(errors).toEqual([]);
});

test('leaving while Studio imports prevents a late unwanted entry',async({page})=>{
 test.setTimeout(90000);let release;
 const held=new Promise(resolve=>release=resolve);
 await page.route('**/studio.js?*',async route=>{await held;await route.continue();});
 await page.goto('/playable-3d/');await expect(page.locator('#loading')).toBeHidden({timeout:60000});
 await page.locator('#studio-view').click();await page.locator('#town-view').click();release();
 await expect.poll(()=>page.evaluate(()=>performance.getEntriesByType('resource').some(r=>r.name.includes('/studio.js')))).toBe(true);
 await expect(page.locator('#studio-panel')).toBeHidden();
 await page.locator('#studio-view').click();await expect(page.locator('#save-avatar')).toBeEnabled();
 await page.locator('#town-view').click();await expect(page.locator('#studio-panel')).toBeHidden();
});

test('pants preview remains an unsaved Studio draft',async({page})=>{
 test.setTimeout(90000);await page.goto('/playable-3d/?outfit=pants');
 await expect(page.locator('#loading')).toBeHidden({timeout:60000});
 await expect(page.getByLabel('Body',{exact:true})).toHaveValue('pantstest');
 await expect(page.locator('#save-avatar')).toBeEnabled({timeout:30000});
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBeNull();
 await page.locator('#save-avatar').click();await expect(page.locator('#studio-panel')).toBeHidden();
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).profiles[0].body,key)).toBe('pantstest');
});
