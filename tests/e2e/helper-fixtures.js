// Existing world regression scenarios enter with Echo. Fresh-choice behaviour is
// tested independently in helpers.spec.js using the unmodified Playwright page.
import {test as base,expect} from '@playwright/test';
export {expect};
export const test=base.extend({page:async({page},use)=>{
 const goto=page.goto.bind(page);
 page.goto=async(...args)=>{const response=await goto(...args);if(String(args[0]).includes('/playable-3d/')){await page.locator('#helper-picker').waitFor({state:'attached',timeout:60000});if(await page.locator('#helper-picker').isVisible())await page.locator('#helper-picker [data-continue]').click();}return response;};
 await page.addLocatorHandler(page.locator('#helper-picker[open]'),async()=>{await page.locator('#helper-picker [data-continue]').click();});
 await use(page);
}});
