import {test,expect} from '@playwright/test';
const fixture='/tests/fixtures/discovery-handover.html';
for(const outside of [false,true])test(`Stats repaint preserves open money panels and ${outside?'outside focus':'financial action focus'}`,async({page},info)=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.addInitScript(()=>localStorage.setItem('ce-night-market-practice-v1',JSON.stringify({version:3,events:['accept','share-plan','run-trial','inspect-trial','consolidate','pay']})));
 let release,held=false;const gate=new Promise(resolve=>release=resolve);await page.route('**/market-collection.mjs?*',async route=>{held=true;await gate;await route.continue();});
 await page.goto(fixture);await page.getByRole('button',{name:'Stats',exact:true}).click();await expect.poll(()=>held).toBe(true);
 const money=page.locator('[data-stats-disclosure="game-money"]'),summary=money.locator(':scope > summary');await summary.focus();await page.keyboard.press('Space');await expect(money).toHaveAttribute('open','');if(outside)await page.locator('#world').focus();
 release();await expect(money.getByRole('heading',{name:'Market money',exact:true})).toBeVisible();await expect(money).toHaveAttribute('open','');await expect(outside?page.locator('#world'):summary).toBeFocused();
 if(outside)return;
 const history=money.locator('[data-stats-disclosure="market-history"]');await history.locator(':scope > summary').click();
 const balance=money.locator('.stats-market-money > p').first(),save=money.getByRole('button',{name:'Save $5',exact:true}),withdraw=money.getByRole('button',{name:'Withdraw $5',exact:true}),give=money.getByRole('button',{name:'Give $2 to the community lantern',exact:true});
 await save.focus();await page.keyboard.press('Enter');await expect(balance).toBeVisible();await expect(balance).toContainText('Wallet $13.00 · Savings $5.00');await expect(save).toBeFocused();await expect(history).toHaveAttribute('open','');
 await withdraw.focus();await page.keyboard.press('Enter');await expect(balance).toBeVisible();await expect(balance).toContainText('Wallet $18.00 · Savings $0.00');await expect(withdraw).toBeDisabled();await expect(summary).toBeFocused();await expect(summary).toBeInViewport();
 await give.focus();await page.keyboard.press('Enter');await expect(balance).toBeVisible();await expect(balance).toContainText('Wallet $16.00 · Savings $0.00 · Community contributions $4.00');await expect(give).toBeDisabled();await expect(summary).toBeFocused();await expect(summary).toBeInViewport();await expect(history).toHaveAttribute('open','');await expect(money).toHaveAttribute('open','');
 await page.screenshot({path:info.outputPath('money-after-save-withdraw-give-phone.png')});
});
