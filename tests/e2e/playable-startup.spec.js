import {test,expect} from '@playwright/test';

// Exercise full-quality WebGL with hardware rendering on macOS; Linux CI uses ANGLE.
test.use({launchOptions:{args:process.platform==='darwin'?['--use-angle=metal']:[]}});

test('startup defers unused bodies and hall; studio and hall remain usable',async({page})=>{
  test.setTimeout(180000);
  const requests=[],errors=[];
  page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/playable-3d/');
  await expect(page.locator('#loading')).toBeHidden({timeout:60000});
  await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true');
  expect(requests.some(u=>u.endsWith('player-bald-base.glb'))).toBeTruthy();
  expect(requests.filter(u=>/avatar-[ab]\.glb|est-interior\.glb/.test(u))).toEqual([]);
  for(const name of ['grass_day.png','stone_flag_day.png','asphalt_day.png','asphalt_dash_overlay.png','crosswalk_overlay.png','curb_cyan_trim.png'])expect(requests.some(u=>u.endsWith(name))).toBeTruthy();
  await page.locator('#studio-view').click();
  await page.getByLabel('Body',{exact:true}).selectOption('a');
  await expect(page.locator('#edit-state')).toHaveText('Unsaved',{timeout:30000});
  await page.getByLabel('Body',{exact:true}).selectOption('b');
  await expect(page.locator('#edit-state')).toHaveText('Unsaved',{timeout:30000});
  await page.locator('#undo').click();
  await expect(page.getByLabel('Body',{exact:true})).toHaveValue('a');
  await page.locator('#save-avatar').click();
  await page.locator('#est-destination').click();
  await expect.poll(()=>requests.some(u=>u.endsWith('est-interior.glb'))).toBeTruthy();
  await page.locator('#interact').click();
  await expect(page.locator('#scene')).toHaveAttribute('aria-label','Interactive EST Prep hall',{timeout:30000});
  await page.locator('#phase').selectOption('growth');
  await page.locator('#town-view').click();
  await expect(page.locator('#scene')).toHaveAttribute('aria-label','Interactive 3D town');
  expect(requests.filter(u=>u.endsWith('est-interior.glb'))).toHaveLength(1);
  expect(requests.filter(u=>u.endsWith('avatar-a.glb'))).toHaveLength(1);
  expect(errors).toEqual([]);
});

test('saved active body loads alone, and failed alternate selection can retry',async({page})=>{
  test.setTimeout(180000);
  await page.addInitScript(()=>localStorage.setItem('career-empire-3d-profiles-v2-tripo',JSON.stringify({activeId:'test',profiles:[{id:'test',name:'Test',body:'b'}]})));
  const requests=[];page.on('request',r=>requests.push(r.url()));
  await page.goto('/playable-3d/');
  await expect(page.locator('#loading')).toBeHidden({timeout:60000});
  expect(requests.filter(u=>/avatar-a\.glb|player-bald-base\.glb|est-interior\.glb/.test(u))).toEqual([]);
  await page.locator('#studio-view').click();
  await page.route('**/avatar-a.glb',r=>r.abort());
  await page.getByLabel('Body',{exact:true}).selectOption('a');
  await expect(page.locator('#edit-state')).toContainText('could not load');
  await page.locator('#save-avatar').click();
  await expect(page.locator('#studio-panel')).toBeVisible();
  await page.unroute('**/avatar-a.glb');
  await page.getByLabel('Body',{exact:true}).selectOption('b');
  await page.getByLabel('Body',{exact:true}).selectOption('a');
  await expect(page.locator('#edit-state')).toHaveText('Unsaved',{timeout:30000});
  await page.locator('#save-avatar').click();
  await expect(page.locator('#studio-panel')).toBeHidden();
});
