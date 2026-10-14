import {test as base,expect} from '@playwright/test';
export {expect};
// Mock only the already verified-account contract. These scenarios exercise
// namespaced saved state; they are not acceptance of real student sign-in.
// Guest/reset tests deliberately keep the unmodified Playwright fixture.
export const test=base.extend({context:async({context},use)=>{
 await context.addInitScript(()=>localStorage.setItem('sb-e2e-auth-token','fixture-presence-only'));
 await context.route('**/src/services/supabase-browser.js',route=>route.fulfill({contentType:'text/javascript',body:"window.CareerEmpireSupabase={getClient:async()=>({auth:{getUser:async()=>({data:{user:{id:'e2e-owned'}},error:null})}})};"}));
 await use(context);
}});
