import {test,expect} from './owned-account-fixtures.js';
const profileKey='career-empire-3d-profiles-v2-tripo',trailKey='ce-missing-frame-local-review-v1',walletKey='career-empire-economy-lab-v1';
async function walkUntil(page,key,condition){
 await page.locator('#scene').focus();const deadline=Date.now()+15000;
 try{while(!await condition()){if(Date.now()>deadline)throw new Error('Keyboard approach timed out: '+await page.locator('#diagnostics').getAttribute('data-state'));await page.keyboard.down(key);await page.waitForTimeout(150);}}finally{await page.keyboard.up(key);}
}
async function boot(page){await page.goto('/playable-3d/');await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true',{timeout:30000});await expect.poll(()=>page.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state||'{}').avatarBody),{timeout:30000}).toBe('cerys');await expect(page.locator('#taster-intro')).not.toBeVisible();}
async function saved(page){return page.evaluate(({profileKey,trailKey,walletKey})=>Object.fromEntries([profileKey,trailKey,walletKey].map(k=>[k,localStorage.getItem('ce-player:e2e-owned:'+k)])),{profileKey,trailKey,walletKey});}
for(const developed of [false,true])test(`saved Cerys current clue automatically reopens, rearms and survives reload (${developed?'developed':'first picture'})`,async({page})=>{
 test.setTimeout(90000);await page.addInitScript(({profileKey,trailKey,walletKey,developed})=>{
  if(!localStorage.getItem('ce-player:e2e-owned:'+profileKey))localStorage.setItem('ce-player:e2e-owned:'+profileKey,JSON.stringify({activeId:'returning',profiles:[{id:'returning',name:'Returning Cerys',body:'cerys'}]}));
  localStorage.setItem('ce-player:e2e-owned:'+'ce-taster-intro-v1:returning','seen');
  if(!localStorage.getItem('ce-player:e2e-owned:'+trailKey))localStorage.setItem('ce-player:e2e-owned:'+trailKey,JSON.stringify({step:1,developed,shots:{},chapelVisited:false,skipped:false}));
  if(!localStorage.getItem('ce-player:e2e-owned:'+walletKey))localStorage.setItem('ce-player:e2e-owned:'+walletKey,JSON.stringify({schemaVersion:1,scenario:'practice-20260923',events:[{id:'initiative:parcel-taster',type:'initiative',initiative:'parcel-taster'}]}));
 },{profileKey,trailKey,walletKey,developed});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await boot(page);const original=await saved(page);
 await walkUntil(page,'KeyW',()=>page.locator('#discovery-dialog').isVisible());await expect.poll(()=>page.locator('#diagnostics').evaluate(n=>{const p=JSON.parse(n.dataset.state).position;return Math.hypot(p[0]+7,p[2]-14.8);})).toBeLessThan(1.9);const d=await page.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state));expect(Math.hypot(d.position[0]+7,d.position[2]-14.8)).toBeLessThan(1.9);expect(d.discovery.step).toBe(1);
 const image=page.locator(developed?'#discovery-picture':'.develop-pictures img');await expect(image).toBeVisible();await expect(image).toHaveAttribute('src',/chapel-clue\.jpg/);expect(await saved(page)).toEqual(original);
 await page.keyboard.press('Escape');await page.waitForTimeout(900);await expect(page.locator('#discovery-dialog')).not.toBeVisible();expect(await saved(page)).toEqual(original);
 await walkUntil(page,'KeyS',()=>page.locator('#diagnostics').evaluate(n=>{const p=JSON.parse(n.dataset.state).position;return Math.hypot(p[0]+7,p[2]-14.8)>3.2;}));
 await walkUntil(page,'KeyW',()=>page.locator('#discovery-dialog').isVisible());expect(await saved(page)).toEqual(original);await page.keyboard.press('Escape');await page.waitForTimeout(800);await expect(page.locator('#discovery-dialog')).not.toBeVisible();
 await boot(page);expect(await saved(page)).toEqual(original);await walkUntil(page,'KeyW',()=>page.locator('#discovery-dialog').isVisible());expect(await saved(page)).toEqual(original);expect(errors).toEqual([]);console.log(JSON.stringify({developed,position:d.position,step:d.discovery.step,savesUnchanged:true,noPageErrors:true}));
});
