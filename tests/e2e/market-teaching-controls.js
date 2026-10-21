export async function optionalMarketAction(page,name){
 const target=page.getByRole('button',{name,exact:true,includeHidden:true});if(await target.isVisible()){await target.click();return;}
 const details=page.locator('#market-dialog .market-teaching-resources').filter({has:target}).first();if(await details.getAttribute('open')===null)await details.locator(':scope > summary').click();await target.click();
}
export async function startMarketShift(page){const start=page.getByRole('button',{name:'Start my shift',exact:true});if(await start.isVisible())await start.click();else await page.getByRole('button',{name:'Take the shift',exact:true}).click();}
export async function finishMarketLearning(page,{answer='support'}={}){
 for(let stage=0;stage<10;stage++){
  if(await page.locator('#market-dialog').getAttribute('data-market-teaching-stage')===null)break;
  if(await page.locator('#market-dialog').getAttribute('data-market-teaching-stage')==='application')await page.locator(`#market-dialog input[name="market-transfer"][value="${answer}"]`).check();
  await page.locator('#market-dialog [data-teaching-primary]').click();
 }
}
