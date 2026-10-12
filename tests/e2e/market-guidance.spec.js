import {test,expect} from '@playwright/test';
const state=page=>page.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state||'{}'));
for(const width of [1280,390])test(`market outside arrival, walking, visual briefing and progressive signs ${width}`,async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width,height:844});const requests=[];page.on('request',r=>requests.push(r.url()));const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/playable-3d/');await page.locator('#taster-skip').click();await expect.poll(()=>state(page),{timeout:30000}).toMatchObject({entryReady:true,guestRun:true});
 await page.evaluate(()=>document.querySelector('#market-destination').click());await expect.poll(()=>state(page),{timeout:60000}).toMatchObject({mode:'market',position:[0,0,15]});await expect.poll(async()=> (await state(page)).market.guidance).toEqual(['Mara']);
 await page.screenshot({path:`/tmp/market-after-arrival-${width}.png`});
 await page.locator('#scene').focus();await page.keyboard.down('KeyW');try{await expect.poll(async()=> (await state(page)).position[2],{timeout:15000}).toBeLessThan(10.8);}finally{await page.keyboard.up('KeyW');}
 await page.screenshot({path:`/tmp/market-after-entered-${width}.png`});
 await page.locator('#scene').focus();await page.keyboard.down('KeyW');try{await expect(page.locator('#interact')).toHaveText('Talk to Mara',{timeout:30000});}finally{await page.keyboard.up('KeyW');}
 expect(requests.some(u=>u.includes('lunch-rush'))).toBe(false);await page.locator('#interact').click();await expect(page.locator('.market-intro-image')).toBeVisible();expect(await page.locator('.market-intro-image').evaluate(i=>i.naturalWidth)).toBe(768);
 await page.waitForTimeout(2700);await page.screenshot({path:`/tmp/market-after-intro-${width}.png`});
 await page.getByRole('button',{name:'Pause',exact:true}).click();
 for(const beat of [2,3,4,5]){await page.getByRole('button',{name:'Next',exact:true}).click();await page.waitForTimeout(2700);await page.screenshot({path:`/tmp/market-after-beat-${beat}-${width}.png`});expect(await page.locator('#market-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);}
 await page.getByRole('button',{name:'Skip intro',exact:true}).click();await expect(page.locator('#market-dialog')).toContainText('Your agreed job');await page.getByRole('button',{name:'Replay intro',exact:true}).click();await expect(page.locator('#market-dialog-title')).toHaveText('Meet the Juniper crew');
 await page.getByRole('button',{name:'Take the shift',exact:true}).click();await expect(page.locator('#market-dialog')).not.toBeVisible();await expect.poll(async()=> (await state(page)).market.accepted).toBe(true);await expect.poll(async()=> (await state(page)).market.guidance).toContain('Customer flow');
 if(width===390){const a=await page.locator('#interact').boundingBox(),b=await page.locator('#campus-minimap').boundingBox();expect(a.y+a.height<=b.y||a.x+a.width<=b.x||b.x+b.width<=a.x).toBe(true);}await page.screenshot({path:`/tmp/market-after-shift-${width}.png`});expect(errors).toEqual([]);console.log('MARKET',width,JSON.stringify(await state(page)));
});

test('reduced-motion briefing stays manual; returning market state and optional activities remain available',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.route('**/market-module-test',r=>r.fulfill({contentType:'text/html',body:'<script type="importmap">{"imports":{"three":"/playable-3d/vendor/three/build/three.module.js","three/addons/":"/playable-3d/vendor/three/examples/jsm/"}}</script><main id="experience"><canvas id="scene" tabindex="0"></canvas></main>'}));await page.goto('/market-module-test');
 await page.evaluate(async()=>{const {createNightMarket}=await import('/playable-3d/night-market.js');const data=new Map();window.qaStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};window.qaMarket=createNightMarket({storage:qaStorage,onPause(){},onClose(){},onExit(){}});qaMarket.setVisible(true);qaMarket.interaction({x:0,z:-3.6}).action();});
 await expect(page.locator('#market-dialog-title')).toHaveText('Meet the Juniper crew');await page.waitForTimeout(6500);await expect(page.locator('#market-dialog-title')).toHaveText('Meet the Juniper crew');await page.getByRole('button',{name:'Take the shift',exact:true}).click();
 const before=await page.evaluate(()=>qaMarket.snapshot());await page.evaluate(()=>{qaMarket.setVisible(false);qaMarket.setVisible(true);});expect((await page.evaluate(()=>qaMarket.snapshot())).events).toEqual(before.events);expect((await page.evaluate(()=>qaMarket.snapshot())).accepted).toBe(true);
 await page.evaluate(()=>qaMarket.replayIntro());await page.getByRole('button',{name:'Continue my shift',exact:true}).click();expect((await page.evaluate(()=>qaMarket.snapshot())).events).toEqual(before.events);
 const labels=await page.evaluate(()=>[[-6,1.2],[6.5,2.4]].map(([x,z])=>qaMarket.interaction({x,z}).label));expect(labels).toEqual(['Browse Little Finds','Take a stage break']);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>qaMarket.replayIntro());await expect(page.locator('#market-dialog-title')).toHaveText('Meet the Juniper crew');await expect(page.locator('#market-dialog-title')).toHaveText('Order or collect?',{timeout:8000});await page.getByRole('button',{name:'Pause',exact:true}).click();await page.waitForTimeout(10500);await expect(page.locator('#market-dialog-title')).toHaveText('Order or collect?');await page.locator('.market-close').click();
 await page.evaluate(()=>qaMarket.journal());await page.getByRole('button',{name:'Initiative / reference sheet',exact:true}).click();await page.getByText('Teacher curriculum context',{exact:true}).click();await expect(page.getByRole('link',{name:'Official 2027 Year 12 syllabus'})).toHaveAttribute('href',/Syllabus-for-teaching-from-2027.PDF/);

});
