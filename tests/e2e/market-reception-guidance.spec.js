import {test,expect} from '@playwright/test';
const prior=['accept','share-plan','run-trial','inspect-trial','consolidate'];
async function start(page,width,paid=false){
 await page.setViewportSize({width,height:844});
 await page.route('**/reception-guidance-test',r=>r.fulfill({contentType:'text/html',body:'<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/playable-3d/style.css"><script type="importmap">{"imports":{"three":"/playable-3d/vendor/three/build/three.module.js","three/addons/":"/playable-3d/vendor/three/examples/jsm/"}}</script><main id="experience"><canvas id="scene" tabindex="0"></canvas></main>'}));
 await page.goto('/reception-guidance-test');
 await page.evaluate(async events=>{
  const {createNightMarket}=await import('/playable-3d/night-market.js');
  const data=new Map([['ce-night-market-practice-v1',JSON.stringify({version:3,events})]]);
  window.practiceStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
  window.market=createNightMarket({storage:practiceStorage,onPause(){},onClose(){},onExit(){},onTravel:p=>window.travel=p});market.setVisible(true);
 },paid?[...prior,'pay']:prior);
}
for(const width of [1280,390]){
 test(`paid completion reveals Reception and preserves gates and wages ${width}`,async({page},info)=>{
  const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
  await start(page,width);
  await expect(page.locator('#market-reception')).toBeHidden();
  expect(requests.some(u=>/opening-district|opening-chapters/.test(u))).toBe(false);
  await page.evaluate(()=>market.interaction({x:0,z:-3.6}).action());
  await page.getByRole('button',{name:'Keep this learning connection',exact:true}).click();
  await page.getByRole('button',{name:'Finish the shift · receive $18 and crew pass',exact:true}).click();
  await expect(page.locator('#market-dialog-title')).toHaveText('First gig complete');
  await expect(page.locator('#market-dialog')).toContainText('Reception through the west entrance');
  expect(await page.evaluate(()=>market.snapshot().wallet)).toBe(1800);
  await page.getByRole('button',{name:'Visit Reception',exact:true}).last().click();
  await expect(page.locator('#market-dialog-title')).toHaveText('Reception / welcome');
  await expect(page.locator('#market-reception')).toBeHidden();
  await expect(page.getByRole('button',{name:'Meet Nora at her desk',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>market.snapshot().wallet)).toBe(1800);
  expect(await page.locator('#market-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  await page.screenshot({path:info.outputPath(`reception-${width}.png`)});expect(errors).toEqual([]);
 });
 test(`returning paid player sees Reception outside collapsed Journal ${width}`,async({page},info)=>{
  const requests=[];page.on('request',r=>requests.push(r.url()));await start(page,width,true);
  await expect(page.locator('#market-card')).toHaveJSProperty('open',false);
  await expect(page.locator('#market-objective')).toContainText('Reception through the west entrance');
  await expect(page.locator('#market-reception')).toBeVisible();
  expect(requests.some(u=>/opening-district|opening-chapters/.test(u))).toBe(false);
  await page.screenshot({path:info.outputPath(`paid-route-${width}.png`)});
  const before=await page.evaluate(()=>practiceStorage.getItem('ce-night-market-practice-v1'));await page.locator('#market-reception').click();
  await expect(page.locator('#market-dialog-title')).toHaveText('Reception / welcome');
  expect(await page.evaluate(()=>practiceStorage.getItem('ce-night-market-practice-v1'))).toBe(before);
  await page.evaluate(()=>{market.setVisible(false);practiceStorage.removeItem('ce-night-market-practice-v1');market.setVisible(true);});
  await expect(page.locator('#market-reception')).toBeHidden();
 });
}
