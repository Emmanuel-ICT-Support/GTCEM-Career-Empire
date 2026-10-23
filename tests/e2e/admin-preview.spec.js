import {startMarketShift,finishMarketLearning,optionalMarketAction} from './market-teaching-controls.js';
import {enterClassroomWhenAsked} from './market-controls.js';
import {test,expect} from '@playwright/test';
import {enterMarket} from './market-controls.js';
const previewURL='/playable-3d/?experience=night-market&market-review=1&admin-review=1';
const state=p=>p.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state||'{}'));
const unpaid={paid:false,accepted:false,wallet:0,tax:0,pass:false,researchPaid:false,badges:[],events:[]};
const click=(p,name)=>optionalMarketAction(p,name);
for(const width of [1280,390])test(`public shortcut opens isolated fresh Admin and preserves normal gates ${width}`,async({page,context},info)=>{
 test.setTimeout(120000);await page.setViewportSize({width,height:844});
 await context.route('**/playable-3d/app.js*',async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+`\nwindow.adminRouteClicks=0;document.querySelector('#market-destination').addEventListener('click',()=>window.adminRouteClicks++,true);window.observeAdminRoute=()=>({pageMs:performance.now(),hidden:document.hidden,clicks:window.adminRouteClicks,actual:{mode,marketOpening,marketLeaving,modeRequest,marketTravelRequest,position:actor.model.position.toArray(),market:nightMarket?.snapshot()},published:JSON.parse(document.querySelector('#diagnostics').dataset.state||'{}')});`});});
 await page.addInitScript(()=>localStorage.setItem('synthetic-unrelated-save','preserved'));
 const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/playable-3d/');await page.locator('#taster-skip').click();await expect.poll(()=>state(page),{timeout:30000}).toMatchObject({entryReady:true});
 await page.evaluate(()=>window.CareerEmpireGameRun.storage.setItem('synthetic-run-marker','original'));
 const before=await page.evaluate(()=>window.CareerEmpireGameRun.snapshot());
 expect(requests.some(u=>/opening-district|opening-chapters/.test(u))).toBe(false);
 await page.locator('#exploration-options > summary').click();await page.locator('#preview-tools > summary').click();
 await expect(page.locator('#preview-tools')).toContainText('Public preview tools');
 const created=context.waitForEvent('page');await page.getByRole('link',{name:'Open Market Admin for review',exact:true}).click();const preview=await created;
 await preview.setViewportSize({width,height:844});preview.on('pageerror',e=>errors.push(e.message));
 await expect(preview.locator('#market-dialog-title')).toHaveText('Reception / welcome',{timeout:45000});await expect(preview.locator('#scene')).toHaveAttribute('data-rendered','true',{timeout:30000});
 try{await expect.poll(()=>state(preview)).toMatchObject({adminReview:true,mode:'market',market:{...unpaid,adminReview:true,officeFlow:{active:true}}});}finally{await info.attach('admin-initial-state-observation',{body:JSON.stringify(await preview.evaluate(()=>window.observeAdminRoute())),contentType:'application/json'});}
 await expect(preview.locator('#market-review-notice')).toContainText('no wages or crew pass');
 expect(await preview.locator('#market-dialog').evaluate(n=>n.scrollWidth<=n.clientWidth)).toBe(true);await preview.screenshot({path:info.outputPath(`public-admin-${width}.png`)});
 await click(preview,'I’ll walk there');await preview.locator('#market-district-route').click();await click(preview,'Return to Sunday Market');
 await expect.poll(()=>state(preview)).toMatchObject({market:{paid:false,wallet:0,officeFlow:{active:false}}});
 await preview.locator('#market-reception').click();await expect(preview.locator('#market-dialog-title')).toHaveText('Reception / welcome');await click(preview,'I’ll walk there');
 await preview.locator('#market-card summary').click();await preview.locator('#market-exit').click();await expect.poll(()=>state(preview),{timeout:45000}).toMatchObject({mode:'town'});
 await preview.locator('#destination-menu > summary').click();await preview.locator('#market-destination').click();await expect(preview.locator('#market-dialog-title')).toHaveText('Reception / welcome',{timeout:30000});
 await expect(preview.locator('#market-dialog')).toBeVisible();
 try{await expect.poll(()=>preview.evaluate(()=>window.observeAdminRoute().actual)).toMatchObject({mode:'market',market:{...unpaid,officeFlow:{active:true}}});}finally{await info.attach('admin-reentry-observation',{body:JSON.stringify(await preview.evaluate(()=>window.observeAdminRoute())),contentType:'application/json'});}
 await preview.close();expect(await page.evaluate(()=>window.CareerEmpireGameRun.snapshot())).toEqual(before);expect(await page.evaluate(()=>localStorage.getItem('synthetic-unrelated-save'))).toBe('preserved');
 await enterMarket(page);await expect.poll(()=>state(page),{timeout:30000}).toMatchObject({adminReview:false,mode:'market',market:{paid:false,wallet:0,pass:false,officeFlow:{active:false}}});
 await expect(page.locator('#market-reception')).toBeHidden();await page.locator('#market-card summary').click();await page.locator('#market-journal').click();await click(page,'Markets Administration · after the first gig');await expect(page.locator('#market-dialog-title')).toHaveText('Your next assignment');expect(errors).toEqual([]);
});

test('public Admin loading can be cancelled without late travel and then retried',async({page})=>{
 test.setTimeout(60000);let release;const held=new Promise(resolve=>{release=resolve;});
 await page.route('**/opening-district.js?*',async route=>{await held;await route.continue();});
 await page.goto(previewURL,{waitUntil:'domcontentloaded'});await expect(page.locator('#market-dialog-title')).toHaveText('Entering the administration centre…',{timeout:30000});
 await page.locator('.market-close').click();release();await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true',{timeout:30000});
 await expect.poll(()=>state(page)).toMatchObject({mode:'market',market:{...unpaid,officeFlow:{active:false}}});
 await page.waitForTimeout(300);expect((await state(page)).market.officeFlow.active).toBe(false);
 await page.locator('#market-reception').click();await expect(page.locator('#market-dialog-title')).toHaveText('Reception / welcome',{timeout:15000});await expect.poll(()=>state(page)).toMatchObject({market:{...unpaid,officeFlow:{active:true}}});
});
test('public Admin module failure has a successful explicit retry without rewards',async({page})=>{
 test.setTimeout(60000);let failures=1;const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/opening-district.js?*',route=>failures-->0?route.abort():route.continue());
 await page.goto(previewURL,{waitUntil:'domcontentloaded'});await expect(page.locator('#market-dialog-title')).toHaveText('Administration could not load',{timeout:30000});
 await click(page,'Retry administration');await expect(page.locator('#market-dialog-title')).toHaveText('Reception / welcome',{timeout:20000});await expect.poll(()=>state(page)).toMatchObject({market:{...unpaid,officeFlow:{active:true}}});expect(errors).toEqual([]);
});
test('verified Auth still runs while public preview leaves owner storage untouched',async({page})=>{
 test.setTimeout(60000);const key='ce-player:synthetic-owned:career-empire-3d-profiles-v2-tripo';
 await page.addInitScript(key=>{localStorage.setItem('sb-synthetic-auth-token','fixture-presence-only');localStorage.setItem(key,'synthetic-owned-save');},key);
 await page.route('**/src/services/supabase-browser.js',route=>route.fulfill({contentType:'text/javascript',body:"window.CareerEmpireSupabase={getClient:async()=>({auth:{getUser:async()=>{window.syntheticVerificationCalls=(window.syntheticVerificationCalls||0)+1;return {data:{user:{id:'synthetic-owned'}},error:null};}}})};"}));
 await page.goto(previewURL,{waitUntil:'domcontentloaded'});await expect(page.locator('#market-dialog-title')).toHaveText('Reception / welcome',{timeout:30000});
 await expect.poll(()=>state(page)).toMatchObject({guestRun:false,adminReview:true,market:unpaid});
 expect(await page.evaluate(()=>window.syntheticVerificationCalls)).toBe(1);expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe('synthetic-owned-save');
});

test.beforeEach(({page})=>{enterClassroomWhenAsked(page);});
