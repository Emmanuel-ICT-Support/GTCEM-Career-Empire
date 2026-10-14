import {test,expect} from '@playwright/test';
const url='https://taniab1975.github.io/career-empire-blueprint/#overview';
for(const [width,mode]of [[1280,'quiet'],[390,'quiet'],[1280,'full']])test(`Blueprint menu opens a separate accessible tab ${width} ${mode}`,async({page,context},info)=>{
 test.setTimeout(60000);await page.setViewportSize({width,height:844});
 // Verify the actual navigation destination without relying on a second site's network.
 await context.route('https://taniab1975.github.io/career-empire-blueprint/**',r=>r.fulfill({contentType:'text/html',body:'<title>Blueprint navigation fixture</title><main>Overview</main>'}));
 await page.goto('/playable-3d/'+(mode==='full'?'?mode=full':''));
 if(mode==='quiet')await page.locator('#taster-skip').click();
 await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true',{timeout:45000});
 const link=page.getByRole('link',{name:'Blueprint (opens in a new tab)',exact:true});await expect(link).toBeHidden();
 if(mode==='quiet')await page.locator('#exploration-options > summary').click();else await page.locator('#destination-menu > summary').click();
 await expect(link).toBeVisible();await expect(link).toHaveAttribute('href',url);await expect(link).toHaveAttribute('target','_blank');await expect(link).toHaveAttribute('rel','noopener noreferrer');
 const before=page.url();await link.focus();await expect(link).toBeFocused();await page.screenshot({path:info.outputPath(`blueprint-menu-${width}-${mode}.png`)});
 const created=context.waitForEvent('page');await page.keyboard.press('Enter');const blueprint=await created;await expect(blueprint).toHaveURL(url);await expect(blueprint).toHaveTitle('Blueprint navigation fixture');expect(await blueprint.evaluate(()=>window.opener)).toBeNull();expect(page.url()).toBe(before);await blueprint.close();
});
