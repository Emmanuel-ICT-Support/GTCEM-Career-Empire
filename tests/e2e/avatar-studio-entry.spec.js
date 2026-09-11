import {test,expect} from '@playwright/test';
test.use({launchOptions:{args:process.platform==='darwin'?['--use-angle=metal']:[]}});
test('Home Base returns to ECC welcome; Studio remains separate',async({page})=>{
 test.setTimeout(180000);
 await page.goto('/playable-3d/');
 await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true',{timeout:120000});
 await page.locator('#home-destination').click();
 await expect.poll(async()=>JSON.parse(await page.locator('#diagnostics').getAttribute('data-state')).position[0]).toBeCloseTo(-3.2,1);
 await expect.poll(async()=>JSON.parse(await page.locator('#diagnostics').getAttribute('data-state')).position[2]).toBeCloseTo(-1.7,1);
 await expect(page.locator('#studio-panel')).toBeHidden();
 await expect(page.locator('#location-title')).toHaveText('Home Base');
 await page.locator('#studio-view').click();
 await expect(page.locator('#save-avatar')).toBeEnabled();
 await page.locator('#save-avatar').click();
 await expect(page.locator('#studio-panel')).toBeHidden();
});
