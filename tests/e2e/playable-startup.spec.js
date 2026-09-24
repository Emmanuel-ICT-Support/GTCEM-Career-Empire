import {test,expect} from './campus-fixtures.js';

// Exercise the production world; hosted software raster limits are documented in campus-fixtures.js.


test('startup loads only the active avatar and keeps the studio and hall usable',async({page})=>{
  test.setTimeout(180000);
  const requests=[],errors=[];
  page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/playable-3d/');
  await expect(page.locator('#loading')).toBeHidden({timeout:60000});
  await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true');
  expect(requests.some(u=>u.includes('player-schoolboy-2k-20260914.glb'))).toBeTruthy();
  await expect.poll(()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state).campusReady),{timeout:90000}).toBe(true);
  expect(requests.some(u=>u.endsWith('campus-buildings/careers-shared-textures.glb'))).toBeTruthy();
  expect(requests.some(u=>u.endsWith('campus-buildings/workplace-shared-textures.glb'))).toBeTruthy();
  expect(requests.some(u=>/player-uniform-shirt|avatar-[ab]\.glb/.test(u))).toBeFalsy();
  expect(requests.some(u=>u.endsWith('est-interior.glb'))).toBeFalsy();
  for(const name of ['grass-ecc-campus-v1-lossless.webp','limestone-ecc-campus-v1.png','asphalt_day-lossless.webp','asphalt_dash_overlay.png','crosswalk_overlay.png','curb_cyan_trim.png'])expect(requests.some(u=>u.endsWith(name))).toBeTruthy();
  await page.locator('#places-toggle').click();await page.locator('#studio-view').click();
  await page.getByLabel('Body',{exact:true}).selectOption('shirt');
  await expect.poll(()=>requests.some(u=>u.endsWith('player-uniform-shirt-20260908.glb'))).toBeTruthy();
  await expect(page.locator('#editor-fields .hint')).toContainText('Shirt avatar test model');
  await page.getByLabel('Body',{exact:true}).selectOption('a');
  await expect(page.locator('#edit-state')).toHaveText('Unsaved',{timeout:30000});
  await page.getByLabel('Body',{exact:true}).selectOption('b');
  await expect(page.locator('#edit-state')).toHaveText('Unsaved',{timeout:30000});
  await page.locator('#undo').click();
  await expect(page.getByLabel('Body',{exact:true})).toHaveValue('a');
  await page.locator('#save-avatar').click();
  await page.locator('#places-toggle').click();await page.locator('#est-destination').click();
  await expect.poll(()=>requests.some(u=>u.endsWith('est-interior.glb'))).toBeTruthy();
  await expect(page.locator('#est-video-dialog')).not.toBeVisible();
  await expect(page.locator('#scene')).toHaveAttribute('aria-label','Interactive EST Prep hall',{timeout:30000});
  await page.locator('#phase').selectOption('growth');
  await page.locator('#places-toggle').click();await page.locator('#town-view').click();
  await expect(page.locator('#scene')).toHaveAttribute('aria-label','Interactive 3D town');
  expect(requests.filter(u=>u.endsWith('est-interior.glb'))).toHaveLength(1);
  expect(requests.filter(u=>u.endsWith('avatar-a.glb'))).toHaveLength(1);
  expect(errors).toEqual([]);
});

test('a saved active avatar can still be changed in the studio',async({page})=>{
  test.setTimeout(180000);
  await page.addInitScript(()=>localStorage.setItem('career-empire-3d-profiles-v2-tripo',JSON.stringify({activeId:'test',profiles:[{id:'test',name:'Test',body:'b'}]})));
  const requests=[];page.on('request',r=>requests.push(r.url()));
  await page.goto('/playable-3d/');
  await expect(page.locator('#loading')).toBeHidden({timeout:60000});
  expect(requests.some(u=>u.includes('avatar-b.glb'))).toBeTruthy();
  expect(requests.some(u=>u.includes('player-schoolboy-2k-20260914.glb'))).toBeFalsy();
  await page.locator('#places-toggle').click();await page.locator('#studio-view').click();
  await page.getByLabel('Body',{exact:true}).selectOption('a');
  await expect(page.locator('#edit-state')).toHaveText('Unsaved',{timeout:30000});
  await page.locator('#save-avatar').click();
  await expect(page.locator('#studio-panel')).toBeHidden();
});
