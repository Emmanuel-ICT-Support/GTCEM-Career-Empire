// Saved world scenarios use the mocked verified-account contract and Echo. Guest
// reset/choice behaviour is
// tested independently in helpers.spec.js using the unmodified Playwright page.
import {test as base,expect} from './owned-account-fixtures.js';
export {expect};
export const test=base.extend({page:async({page,baseURL},use)=>{
 const goto=page.goto.bind(page);
 page.goto=async(...args)=>{if(String(args[0]).includes('/playable-3d/')){const url=new URL(args[0],baseURL);if(!url.searchParams.has('discovery'))url.searchParams.set('mode','full');args[0]=url.href;}const response=await goto(...args);if(String(args[0]).includes('/playable-3d/')){await page.locator('#helper-picker').waitFor({state:'attached',timeout:60000});if(await page.locator('#helper-picker').isVisible()){await page.locator('#helper-picker [name="guidance"][value="creature"]').check();await page.locator('#helper-picker [data-continue]').click();}}return response;};
 await page.addLocatorHandler(page.locator('#helper-picker[open]'),async()=>{{await page.locator('#helper-picker [name="guidance"][value="creature"]').check();await page.locator('#helper-picker [data-continue]').click();}});
 await use(page);
}});
