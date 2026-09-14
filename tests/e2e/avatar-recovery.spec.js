import {test,expect} from './campus-fixtures.js';
test('failed startup avatar can retry without reloading or changing the saved profile',async({page})=>{
 test.setTimeout(90000);let requests=0,navigations=0;
 page.on('framenavigated',frame=>{if(frame===page.mainFrame())navigations++;});
 await page.addInitScript(()=>localStorage.setItem('career-empire-3d-profiles-v2-tripo',JSON.stringify({activeId:'saved',profiles:[{id:'saved',name:'Saved Student',body:'schoolboy'}]})));
 await page.route('**/player-schoolboy-2k-20260914.glb',route=>++requests===1?route.fulfill({status:503,body:'Temporary failure'}):route.continue());
 await page.goto('/playable-3d/');const saved=await page.evaluate(()=>localStorage.getItem('career-empire-3d-profiles-v2-tripo'));
 await expect(page.locator('#avatar-retry')).toBeVisible();await expect(page.locator('#loading-message')).toContainText('try again');
 await page.locator('#avatar-retry').click();await expect(page.locator('#loading')).toBeHidden({timeout:60000});
 expect(requests).toBe(2);expect(navigations).toBe(1);expect(await page.evaluate(()=>localStorage.getItem('career-empire-3d-profiles-v2-tripo'))).toBe(saved);
 await expect(page.locator('#profile')).toHaveValue('saved');
});
