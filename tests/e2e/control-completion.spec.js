import {test,expect} from './helper-fixtures.js';

test('a real avatar save clears Echo revisit while initial campus geometry is still pending',async({page})=>{
 test.setTimeout(90000);
 await page.addInitScript(()=>localStorage.setItem('ce-player:e2e-owned:ce-echo-v2:avery',JSON.stringify({version:2,step:6,status:'reading',skippedTasks:[5],avatarSaved:false,resourcesVisited:false,marketVisited:false})));
 let release;const held=new Promise(resolve=>release=resolve);
 await page.route('**/ecc-exterior-annotations.glb?*',async route=>{await held;await route.continue();});
 await page.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+'\nwindow.controlCompletionState=()=>({entryReady,mode});'});});
 try{
  await page.goto('/playable-3d/');await expect(page.locator('#echo-cue')).toBeVisible({timeout:60000});await page.locator('#echo-cue').click();
  await expect(page.locator('#arrival-mission')).toBeHidden();
  await expect(page.locator('[data-revisit] button')).toHaveText('Revisit: Visit Avatar Studio');
  expect((await page.evaluate(()=>window.controlCompletionState())).entryReady).toBe(false);
  await page.locator('[data-revisit] button').click();await expect(page.locator('#studio-panel')).toBeVisible();await expect(page.locator('#save-avatar')).toBeEnabled({timeout:30000});await page.locator('#save-avatar').click();
  await expect(page.locator('#echo-cue')).toBeVisible();await page.locator('#echo-cue').click();await expect(page.locator('[data-revisit] button')).toHaveCount(0);
  expect((await page.evaluate(()=>window.controlCompletionState())).entryReady).toBe(false);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ce-player:e2e-owned:ce-echo-v2:avery')));
  expect(saved.avatarSaved).toBe(true);expect(saved.resourcesVisited).toBe(false);expect(saved.marketVisited).toBe(false);
 }finally{release();}
});
