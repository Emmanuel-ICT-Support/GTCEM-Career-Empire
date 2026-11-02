export async function optionalMarketAction(page,name){
 const visible=page.getByRole('button',{name,exact:true});if(await visible.isVisible()){await visible.click();return;}
 const hidden=page.getByRole('button',{name,exact:true,includeHidden:true});const details=page.locator('#market-dialog .market-teaching-resources').filter({has:hidden}).first();if(await details.getAttribute('open')===null)await details.locator(':scope > summary').click();await visible.click();
}
export async function startMarketShift(page){
 const look=page.getByRole('button',{name:'Let’s take a look',exact:true});
 if(await look.isVisible()){
  await look.click();
  await page.evaluate(async()=>{const market=window.teachingMarket||window.qaMarket||window.market;if(market){const T=await import('/playable-3d/vendor/three/build/three.module.js');market.update(10,10,new T.PerspectiveCamera());}});
  await page.getByRole('button',{name:'Tell Mara',exact:true}).click();
  await page.getByRole('button',{name:'People who had paid were waiting to order',exact:true}).click();
  await page.getByRole('button',{name:'What can I do to help?',exact:true}).click();
  await page.getByRole('button',{name:'Yes, let’s try it',exact:true}).click();return;
 }
 const start=page.getByRole('button',{name:'Start my shift',exact:true});if(await start.isVisible())await start.click();else await page.getByRole('button',{name:'Take the shift',exact:true}).click();
}
export async function finishMarketLearning(page,{answer='support'}={}){
 for(let stage=0;stage<20;stage++){
  if(await page.locator('#market-dialog').getAttribute('data-market-teaching-stage')===null)break;
  const check=page.locator('#market-dialog input[name="market-behaviour-check"][value="reason"]');if(await check.isVisible())await check.check();
  if(await page.locator('#market-dialog').getAttribute('data-market-teaching-stage')==='application')await page.locator(`#market-dialog input[name="market-transfer"][value="${answer}"]`).check();
  await page.locator('#market-dialog [data-teaching-primary]').click();
 }
}
