import {test,expect} from '@playwright/test';
for(const width of [1280,390])test(`classroom pacing word cancel, retry and same-run acceptance ${width}`,async({page},info)=>{
 await page.setViewportSize({width,height:844});
 await page.route('**/classroom-fixture',r=>r.fulfill({contentType:'text/html',body:'<button id="enter">Enter Markets</button>'}));await page.goto('/classroom-fixture');
 await page.evaluate(async()=>{const {createClassroomGate}=await import('/playable-3d/classroom-gate.mjs');window.results=[];window.gate=createClassroomGate();document.querySelector('#enter').onclick=async()=>results.push(await gate.request());});
 await page.locator('#enter').click();await expect(page.locator('#classroom-gate')).toContainText('not a secure login');await page.getByRole('textbox',{name:'Classroom word'}).fill('wrong');await page.getByRole('button',{name:'Begin Initiative'}).click();await expect(page.getByRole('status')).toContainText('does not match');
 await page.getByRole('button',{name:'Keep exploring'}).click();expect(await page.evaluate(()=>results)).toEqual([false]);await page.locator('#enter').click();await page.keyboard.press('Escape');expect(await page.evaluate(()=>results)).toEqual([false,false]);
 await page.locator('#enter').click();await page.screenshot({path:info.outputPath(`classroom-word-${width}.png`)});await page.getByRole('textbox',{name:'Classroom word'}).fill('Emmanuel');await page.getByRole('button',{name:'Begin Initiative'}).click();expect(await page.evaluate(()=>results)).toEqual([false,false,true]);await page.locator('#enter').click();expect(await page.evaluate(()=>results)).toEqual([false,false,true,true]);await expect(page.locator('#classroom-gate')).not.toBeVisible();
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});

import {observeMarketWalking,walkMarket} from './market-controls.js';
for(const width of [1280,390])test(`actual outdoor Market word gate cancels safely and retries ${width}`,async({page},info)=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:844});const errors=[];page.on('pageerror',e=>errors.push(e.message));await observeMarketWalking(page);
 await page.goto('/playable-3d/?experience=sunday-markets&market-review=1');
 await page.waitForFunction(()=>{const d=JSON.parse(document.querySelector('#diagnostics').dataset.state||'{}');return d.entryReady&&d.position?.[0]===43;},null,{timeout:45000});
 await walkMarket(page,'KeyW',{selector:'#interact',text:'Enter Live Music & Sunday Markets'},15000);await page.locator('#interact').click();
 await expect(page.locator('#classroom-gate')).toBeVisible();await page.getByRole('textbox',{name:'Classroom word'}).fill('incorrect');await page.getByRole('button',{name:'Begin Initiative'}).click();await expect(page.locator('#classroom-gate [role=status]')).toContainText('does not match');
 await page.getByRole('button',{name:'Keep exploring'}).click();expect(await page.evaluate(()=>window.observeMarketWalking().mode)).toBe('town');await expect(page.locator('#market-hud')).toHaveCount(0);
 await page.getByRole('button',{name:'Enter Live Music & Sunday Markets',exact:true}).click();await expect(page.locator('#classroom-gate')).toBeVisible();await page.screenshot({path:info.outputPath(`actual-classroom-gate-${width}.png`)});
 await page.getByRole('textbox',{name:'Classroom word'}).fill('Emmanuel');await page.getByRole('button',{name:'Begin Initiative'}).click();await expect(page.locator('#market-hud')).toBeVisible({timeout:30000});await expect.poll(()=>page.evaluate(()=>window.observeMarketWalking().mode)).toBe('market');expect(errors).toEqual([]);
});
