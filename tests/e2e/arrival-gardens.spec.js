import {test,expect} from '@playwright/test';
test.use({launchOptions:{args:process.platform==='darwin'?['--use-angle=metal']:[]}});
test('arrival walk reaches Studio and retains first-day completion after reload',async({page})=>{
 test.setTimeout(180000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/playable-3d/');await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true',{timeout:60000});
 await page.locator('#recenter').click();
 const walkTo=async(axis,target)=>{
  for(let i=0;i<25;i++){
   const data=JSON.parse(await page.locator('#diagnostics').getAttribute('data-state'));
   const delta=target-data.position[axis];if(Math.abs(delta)<.35)return;
   const key=axis===2?(delta<0?'KeyW':'KeyS'):(delta<0?'KeyA':'KeyD');
   await page.keyboard.down(key);await page.waitForTimeout(Math.min(500,Math.abs(delta)/2.8*1000));await page.keyboard.up(key);
   // Diagnostics refresh once a second; inspect the settled position before the next step.
   await page.waitForTimeout(1100);
  }
  throw new Error('Walking did not reach the Studio approach');
 };
 await walkTo(2,5);await walkTo(0,-12.2);
 await page.getByRole('button',{name:'Open Avatar Studio',exact:true}).click();
 await expect(page.locator('#save-avatar')).toBeEnabled();await page.locator('#save-avatar').click();
 await expect(page.locator('#mission-title')).toHaveText('Your first step is saved');
 await page.reload();await expect(page.locator('#mission-title')).toHaveText('Your first step is saved',{timeout:60000});
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 expect(errors).toEqual([]);
});
