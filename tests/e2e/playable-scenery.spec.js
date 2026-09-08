import {test,expect} from '@playwright/test';
test.use({launchOptions:{args:process.platform==='darwin'?['--use-angle=metal']:[]}});
const state=page=>page.locator('#diagnostics').getAttribute('data-state').then(s=>JSON.parse(s||'{}'));

test('scenery loads after entry, uses all 36 placements, and keeps destinations and movement',async({page})=>{
  test.setTimeout(120000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // Hold scenery until the playable shell is ready: it must never block entry.
  let release;const hold=new Promise(resolve=>release=resolve);
  await page.route('**/assets/scenery/*.glb',async route=>{await hold;await route.continue();});
  await page.goto('/playable-3d/');
  await expect(page.locator('#loading')).toBeHidden({timeout:60000});
  await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true');
  await page.locator('#phase').selectOption('disrepair');
  release();
  await expect.poll(async()=>(await state(page)).scenery?.status,{timeout:30000}).toBe('ready');
  const loaded=await state(page);
  expect(loaded.scenery.trees).toBe(36);expect(loaded.scenery.home).toBe(true);
  expect(loaded.scenery.lod.near+loaded.scenery.lod.far).toBe(36);
  expect(loaded.phase).toBe('disrepair');
  const before=loaded.position;
  await page.keyboard.down('KeyD');await page.waitForTimeout(600);await page.keyboard.up('KeyD');
  await expect.poll(async()=>(await state(page)).position[0]).toBeGreaterThan(before[0]+.2);
  await page.locator('#home-destination').click();await page.locator('#interact').click();
  await expect(page.locator('#studio-panel')).toBeVisible();
  await page.locator('#town-view').click();
  await page.locator('#est-destination').click();await page.locator('#interact').click();
  await expect(page.locator('#scene')).toHaveAttribute('aria-label','Interactive EST Prep hall',{timeout:30000});
  expect(errors).toEqual([]);
});

test('failed scenery retains a playable fallback world',async({page})=>{
  test.setTimeout(120000);
  await page.route('**/assets/scenery/*.glb',route=>route.abort());
  await page.goto('/playable-3d/');await expect(page.locator('#loading')).toBeHidden({timeout:60000});
  await expect.poll(async()=>(await state(page)).scenery?.status,{timeout:30000}).toBe('fallback');
  const data=await state(page);expect(data.scenery.trees).toBe(0);expect(data.scenery.home).toBe(false);
  await page.locator('#home-destination').click();await page.locator('#interact').click();await expect(page.locator('#studio-panel')).toBeVisible();
});
