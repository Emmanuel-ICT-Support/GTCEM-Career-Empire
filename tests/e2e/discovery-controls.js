// Follow the student's optional picture-trail controls; never set readiness or progress.
export async function openDiscoveryClue(page){
 const options=page.locator('#exploration-options');if(await options.getAttribute('open')===null)await options.locator(':scope > summary').click();
 const trail=page.locator('#exploration-trail-options');if(await trail.getAttribute('open')===null)await trail.locator(':scope > summary').click();
 await page.locator('#discovery-open').click();
}
export async function openClueHelp(page){const help=page.locator('#discovery-help-options');if(await help.getAttribute('open')===null)await help.locator(':scope > summary').click();}
