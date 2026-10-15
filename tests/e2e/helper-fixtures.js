// Saved world scenarios use the mocked verified-account contract and Echo. Guest
// reset/choice behaviour is
// tested independently in helpers.spec.js using the unmodified Playwright page.
import {test as base,expect} from './owned-account-fixtures.js';
export {expect};
export const test=base.extend({page:async({page,baseURL},use)=>{
 const goto=page.goto.bind(page),helperOpen=page.locator('#helper-picker[open]');
 const dismissHelper=async()=>{
  if(!await helperOpen.isVisible())return;
  await page.locator('#helper-picker [name="guidance"][value="creature"]').check();
  await page.locator('#helper-picker [data-continue]').click();
 };
 page.goto=async(...args)=>{
  const game=String(args[0]).includes('/playable-3d/');
  // Navigation performs one explicit dismissal before installing the handler.
  // Otherwise the handler can dismiss during that same check/Continue action.
  await page.removeLocatorHandler(helperOpen);
  if(game){const url=new URL(args[0],baseURL);if(!url.searchParams.has('discovery'))url.searchParams.set('mode','full');args[0]=url.href;}
  const response=await goto(...args);
  if(game){await page.locator('#helper-picker').waitFor({state:'attached',timeout:60000});await dismissHelper();}
  await page.addLocatorHandler(helperOpen,dismissHelper);
  return response;
 };
 await use(page);
}});
