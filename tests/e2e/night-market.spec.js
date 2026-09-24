import {test,expect} from './campus-fixtures.js';
const path='/playable-3d/?experience=night-market';
const data=page=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}'));
async function open(page){await page.goto(path,{waitUntil:'domcontentloaded'});await expect(page.locator('#market-hud')).toBeVisible({timeout:30000});await expect(page.locator('#loading')).toBeHidden();}
async function walkUntil(page,key,label){await page.keyboard.down(key);try{await expect(page.locator('#interact')).toHaveText(label,{timeout:12000});}finally{await page.keyboard.up(key);}}
for(const width of [1280,390])test(`legacy night market complete loop and saved rewards at ${width}px`,async({page},info)=>{
 test.setTimeout(120000);await page.addInitScript(()=>{if(!localStorage.getItem('ce-night-market-practice-v1'))localStorage.setItem('ce-night-market-practice-v1',JSON.stringify({version:1,events:[]}));});await page.setViewportSize({width,height:844});const errors=[];page.on('pageerror',e=>errors.push(e.message));await open(page);
 const profile=await page.evaluate(()=>localStorage.getItem('career-empire-3d-profiles-v2-tripo'));
 await walkUntil(page,'w',/Talk to Mara/);await page.locator('#interact').click();await page.getByRole('button',{name:'Take the shift',exact:true}).click();
 await walkUntil(page,'s',/Talk to the waiting customer/);await page.locator('#interact').click();await page.getByRole('button',{name:'Ask: “What information would help you?”',exact:true}).click();
 await expect(page.locator('#market-dialog')).toContainText('Communication game badge');await page.getByRole('button',{name:'Back to the market',exact:true}).click();
 await walkUntil(page,'w',/Talk to Mara/);await page.locator('#interact').click();await page.getByRole('button',{name:'Try a sign on the counter',exact:true}).click();
 await expect(page.locator('#market-dialog')).toContainText('blocked');await page.getByRole('button',{name:'Move the sign to the path',exact:true}).click();await expect(page.locator('#market-balance')).toContainText('3 game badges');
 await page.locator('#interact').click();await page.getByRole('button',{name:'Finish the shift · receive $18',exact:true}).click();await expect(page.locator('#market-dialog')).toContainText('$20 gross − $2 community tax = $18 net');await page.getByRole('button',{name:'Explore the market',exact:true}).click();
 await page.screenshot({path:info.outputPath('first-shift-complete.png')});
 await page.reload();await expect(page.locator('#market-hud')).toBeVisible({timeout:30000});await expect(page.locator('#market-balance')).toContainText('Wallet $18.00');
 await walkUntil(page,'w',/Talk to Mara/);await page.locator('#interact').click();await expect(page.locator('#market-dialog')).toContainText('already paid');await expect(page.getByRole('button',{name:'Finish the shift · receive $18',exact:true})).toHaveCount(0);await page.getByRole('button',{name:'Back to the market',exact:true}).click();
 await page.locator('#market-card > summary').click();await page.locator('#market-exit').click();await expect.poll(async()=>(await data(page)).mode).toBe('town');await page.locator('#est-destination').click();await expect.poll(async()=>(await data(page)).mode,{timeout:20000}).toBe('interior');
 await page.locator('#night-market-entry').click();await expect(page.locator('#market-balance')).toContainText('Wallet $18.00');
 expect(await page.evaluate(()=>localStorage.getItem('career-empire-3d-profiles-v2-tripo'))).toBe(profile);expect(errors).toEqual([]);
});
test('ordinary entry never requests the market modules',async({page})=>{
 test.setTimeout(60000);const requests=[];page.on('request',r=>requests.push(r.url()));await page.goto('/playable-3d/');await expect(page.locator('#loading')).toBeHidden({timeout:30000});expect(requests.some(u=>/night-market\.(js|css)|night-market-state/.test(u))).toBe(false);await expect(page.locator('#market-hud')).toHaveCount(0);
});
test('market failure leaves campus and curriculum reachable',async({page})=>{
 test.setTimeout(60000);await page.route('**/night-market.js?*',r=>r.abort());await page.goto(path);await expect(page.locator('#loading')).toBeHidden({timeout:30000});await expect(page.locator('#toast')).toContainText('night market could not open');await page.locator('#est-destination').click();await expect.poll(async()=>(await data(page)).mode,{timeout:20000}).toBe('interior');
});
