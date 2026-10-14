import {test,expect} from './campus-fixtures.js';

const state=page=>page.locator('#diagnostics').getAttribute('data-state').then(s=>JSON.parse(s||'{}'));

test('campus waits for both buildings and keeps destinations and movement',async({page})=>{
  test.setTimeout(180000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // Required slow buildings must keep entry unready until complete geometry is available.
  let release;const hold=new Promise(resolve=>release=resolve);
  await page.route('**/assets/campus-*/**/*.glb',async route=>{await hold;await route.continue();});
  await page.goto('/playable-3d/');
  await expect(page.locator('#campus-progress')).toBeVisible();await expect.poll(async()=>(await state(page)).entryReady).toBe(false);
  release();
  await expect(page.locator('#loading')).toBeHidden({timeout:90000});
  await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true');await expect.poll(async()=>(await state(page)).entryReady,{timeout:60000}).toBe(true);await page.locator('#world-tools summary').click();await page.locator('#aerial').click();await page.locator('#aerial').click();await page.locator('#world-tools summary').click();
  await page.locator('#phase').selectOption('disrepair');
  await expect.poll(async()=>(await state(page)).scenery?.status,{timeout:90000}).toBe('ready');
  await expect.poll(async()=>(await state(page)).phase).toBe('disrepair');
  const loaded=await state(page);
  expect(loaded.scenery.trees).toBe(19);expect(loaded.scenery.home).toBe(true);expect(loaded.scenery.buildings).toBe(2);

  expect(loaded.phase).toBe('disrepair');
  const before=loaded.position;
  await page.locator('#scene').focus();await page.keyboard.down('KeyD');await page.waitForTimeout(600);await page.keyboard.up('KeyD');
  await expect.poll(async()=>(await state(page)).position[0]).toBeGreaterThan(before[0]+.2);
  await page.locator('#places-toggle').click();await page.locator('#studio-view').click();
  await expect(page.locator('#studio-panel')).toBeVisible();
  await page.locator('#places-toggle').click();await page.locator('#town-view').click();
  await page.locator('#places-toggle').click();await page.locator('#est-destination').click();
  await expect(page.locator('#scene')).toHaveAttribute('aria-label','Interactive EST Prep hall',{timeout:30000});
  await page.locator('#places-toggle').click();await page.locator('#town-view').click();
  await expect.poll(async()=>(await state(page)).position.slice(0,3).map((n,i)=>i===1?0:Math.round(n*10)/10)).toEqual([16,0,12.5]);
  const original=page.locator('.legacy-link');await expect(original).toHaveAttribute('href','https://emmanuel-ict-support.github.io/GTCEM-Career-Empire/');await expect(original).toHaveAttribute('target','_blank');
  expect(errors).toEqual([]);
});

test('failed campus loading explains retry instead of revealing missing buildings',async({page})=>{
  test.setTimeout(120000);
  await page.route('**/assets/campus-*/**/*.glb',route=>route.abort());
  await page.goto('/playable-3d/');
  await expect(page.locator('#campus-progress')).toBeVisible();await expect(page.locator('#campus-retry')).toBeVisible({timeout:60000});await expect(page.locator('#campus-progress-message')).toContainText('Campus buildings could not load. Retry to open campus.');await expect.poll(async()=>(await state(page)).entryReady).toBe(false);
});
