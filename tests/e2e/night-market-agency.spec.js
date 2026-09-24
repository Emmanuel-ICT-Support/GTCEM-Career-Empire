import {test,expect} from './campus-fixtures.js';
async function start(page,width){
 await page.setViewportSize({width,height:844});
 await page.route('**/agency-test',r=>r.fulfill({contentType:'text/html',body:'<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><script type="importmap">{"imports":{"three":"/playable-3d/vendor/three/build/three.module.js","three/addons/":"/playable-3d/vendor/three/examples/jsm/"}}</script></head><body><main id="experience"><canvas id="scene" tabindex="0"></canvas></main></body></html>'}));
 await page.goto('/agency-test');await page.evaluate(async()=>{
  const {createNightMarket}=await import('/playable-3d/night-market.js');const THREE=await import('three');
  const data=new Map();window.testStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
  window.market=createNightMarket({storage:testStorage,onPause(){},onClose(){},onExit(){}});market.setVisible(true);window.camera=new THREE.PerspectiveCamera();camera.position.set(0,5,12);
 });
}
const visit=(page,x,z)=>page.evaluate(([x,z])=>{const spot=market.interaction({x,z});if(!spot)throw Error('No interaction');spot.action();},[x,z]);
const click=(page,name)=>page.getByRole('button',{name,exact:true}).click();
const close=page=>page.locator('.market-close').click();
async function wave(page){await visit(page,4.2,-1.8);await click(page,'Try it with the next customers');await page.evaluate(()=>market.update(6,6,camera));await click(page,'Record that I checked this result');}
async function pay(page){await click(page,'Hand over to Mara');await click(page,'Keep this learning connection');await click(page,'Finish the shift · receive $18 and crew pass');}
for(const width of [1280,390])test(`agency, trial comparison and editable artifact ${width}`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await start(page,width);
 await visit(page,0,-3.6);await click(page,'Take the shift');
 await visit(page,4.2,-1.8);await page.getByLabel('Sign wording',{exact:true}).selectOption('orders');await page.getByLabel('Sign position',{exact:true}).selectOption('approach');await click(page,'Set this arrangement');
 await visit(page,0,-3.6);await click(page,'Explain this arrangement to Mara');await close(page);
 await wave(page);await expect(page.locator('#market-dialog')).toContainText('0 of 4');await close(page);
 await visit(page,4.2,-1.8);await page.getByLabel('Sign wording',{exact:true}).selectOption('both');await click(page,'Set this arrangement');
 await wave(page);await expect(page.locator('#market-dialog')).toContainText('4 of 4');await pay(page);await click(page,'My first gig / case note');
 await page.getByLabel('I noticed…',{exact:true}).selectOption('Customers were unsure where to collect paid orders.');await page.getByLabel('In another workplace, I could…',{exact:true}).selectOption('Ask people what they need before making a change.');await click(page,'Save my case note');
 await expect(page.locator('#case-note-status')).toContainText('saved in this browser');await close(page);
 await page.evaluate(()=>market.caseNote());await expect(page.getByLabel('I noticed…',{exact:true})).toHaveValue('Customers were unsure where to collect paid orders.');
 await page.getByText('Game record · 2 trials',{exact:true}).click();await expect(page.locator('.market-record')).toContainText('Trial 1:');await expect(page.locator('.market-record')).toContainText('Trial 2:');
 expect(await page.locator('#market-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
 const download=page.waitForEvent('download');await click(page,'Download my case note');expect((await download).suggestedFilename()).toBe('My-first-gig-case-note.txt');
 const snapshot=await page.evaluate(()=>market.snapshot());expect(snapshot.wallet).toBe(1800);expect(snapshot.learned).toBe(false);expect(snapshot.badges).toEqual(['initiative','problem','adapting']);expect(errors).toEqual([]);
});
test('unresolved baseline is paid without writing or guessing a reflection answer',async({page})=>{
 await start(page,1280);await visit(page,0,-3.6);await click(page,'Take the shift');await visit(page,0,-3.6);await click(page,'Explain this arrangement to Mara');await close(page);await wave(page);await pay(page);
 const s=await page.evaluate(()=>market.snapshot());expect(s.wallet).toBe(1800);expect(s.solution).toBe(null);expect(s.caseNote).toEqual({});expect(s.badges).toEqual(['problem']);
});
for(const width of [1280,390])test(`optional guide and My work bridge ${width}`,async({page})=>{
 await start(page,width);await visit(page,0,-3.6);await click(page,'Show me the thinking guide');await expect(page.locator('#market-dialog')).toContainText('Notice');expect((await page.evaluate(()=>market.snapshot())).accepted).toBe(false);await click(page,'Back to Mara');await click(page,'Take the shift');await page.evaluate(()=>market.caseNote());await page.getByLabel('I noticed…',{exact:true}).selectOption('Customers were unsure where to collect paid orders.');
 const popupPromise=page.waitForEvent('popup');await click(page,'Save to My work');const popup=await popupPromise;await expect(page.locator('#case-note-status')).toContainText('Saved in My work',{timeout:25000});await expect(popup.locator('#work-body')).toContainText(/Customers were unsure/ );await expect(popup.locator('#market-work-reference')).toBeVisible();const data=await popup.evaluate(()=>JSON.parse(localStorage.getItem('career-empire-my-life-work-v1')));expect(data.entries).toHaveLength(1);await popup.close();
 await click(page,'Initiative / reference sheet');await page.getByText('View the original one-pager',{exact:true}).click();await expect(page.locator('#market-dialog img')).toBeVisible();expect(await page.locator('#market-dialog img').evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);expect(await page.locator('#market-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
});
test('Home Economics entrance and return use real navigation',async({page})=>{
 test.setTimeout(90000);await page.goto('/playable-3d/?view=home-economics&market-review=1');await expect(page.locator('#loading')).toBeHidden({timeout:60000});await page.locator('#scene').focus();await page.keyboard.down('w');await page.waitForTimeout(700);await page.keyboard.up('w');await expect(page.locator('#interact')).toHaveText(/Enter Live Music/,{timeout:15000});await page.locator('#interact').click();await expect(page.locator('#market-hud')).toBeVisible();await page.locator('#market-hud summary').click();await page.locator('#market-exit').click();await expect(page.locator('#market-hud')).toBeHidden();await expect(page.locator('#interact')).toHaveText(/Enter Live Music/);await page.screenshot({path:'/tmp/sunday-home-economics.png'});
});
for(const width of [1280,390])test(`complete keyboard shift, learning, review transfer and return ${width}`,async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width,height:844});await page.goto('/playable-3d/?experience=sunday-markets&market-review=1');await expect(page.locator('#loading')).toBeHidden({timeout:40000});
 const walk=async(key,label)=>{await page.locator('#scene').focus();await page.keyboard.down(key);try{await page.waitForFunction(expected=>document.getElementById('interact').textContent.trim()===expected,label,{timeout:15000,polling:'raf'});}finally{await page.keyboard.up(key);}};
 await walk('w','Talk to Mara');await expect(page.locator('#interact')).toHaveText('Talk to Mara');await page.locator('#interact').click();await click(page,'Take the shift');await page.locator('#interact').click();await click(page,'Explain this arrangement to Mara');await close(page);
 await walk('d','Set up & test');await expect(page.locator('#interact')).toHaveText('Set up & test');await page.locator('#interact').click();await page.getByLabel('Sign wording',{exact:true}).selectOption('both');await page.getByLabel('Sign position',{exact:true}).selectOption('approach');await click(page,'Set this arrangement');await page.locator('#interact').click();await click(page,'Try it with the next customers');await expect(page.getByRole('button',{name:'Record that I checked this result',exact:true})).toBeVisible({timeout:12000});await click(page,'Record that I checked this result');await pay(page);await click(page,'My first gig / case note');await page.getByLabel('I noticed…',{exact:true}).selectOption('Customers were unsure where to collect paid orders.');
 const popupPromise=page.waitForEvent('popup');await click(page,'Save to My work');const popup=await popupPromise;await expect(page.locator('#case-note-status')).toContainText('review only',{timeout:25000});await expect(popup.locator('#work-body')).toContainText(/Customers were unsure/);expect(await popup.evaluate(()=>localStorage.getItem('career-empire-my-life-work-v1'))).toBe(null);await popup.close();await close(page);await walk('d','Use crew pass');await expect(page.locator('#interact')).toHaveText('Use crew pass');await page.locator('#interact').click();await click(page,'Use my crew pass');await expect(page.locator('#market-dialog')).not.toBeVisible();await page.screenshot({path:`/tmp/sunday-daytime-market-${width}.png`});await page.locator('#market-hud summary').click();await page.locator('#market-exit').click();await expect(page.locator('#market-hud')).toBeHidden();await expect(page.locator('#interact')).toHaveText(/Enter Live Music/,{timeout:30000});await page.waitForTimeout(1000);await page.screenshot({path:'/tmp/sunday-home-economics.png'});
});
for(const width of [1280,390])test(`purchases, preserved reflection and celebration ${width}`,async({page})=>{
 await start(page,width);
 await page.evaluate(()=>{market.setVisible(false);testStorage.setItem('ce-night-market-practice-v1',JSON.stringify({version:3,events:['accept','share-plan','run-trial','inspect-trial','consolidate','pay',{type:'case-note',fields:{noticed:'An earlier personal reflection to preserve.'}}]}));market.setVisible(true);market.caseNote();});
 await expect(page.locator('#market-dialog textarea,#market-dialog input')).toHaveCount(0);await expect(page.locator('#market-dialog')).toContainText('An earlier personal reflection to preserve.');await click(page,'Save my case note');expect((await page.evaluate(()=>market.snapshot())).caseNote.noticed).toBe('An earlier personal reflection to preserve.');await close(page);
 await visit(page,-6,1.2);await click(page,'Buy Little green plant · $4.00');await expect(page.getByRole('button',{name:'Little green plant · owned',exact:true})).toBeDisabled();await click(page,'Buy Amber lantern · $6.00');await expect(page.locator('#market-dialog')).toContainText('Wallet $8.00');await close(page);
 const before=await page.evaluate(()=>market.snapshot());expect(before.purchases).toEqual(['plant','lantern']);await visit(page,9,-1.8);await click(page,'Use my crew pass');await visit(page,9,-1.8);await click(page,'Replay crew celebration');const after=await page.evaluate(()=>market.snapshot());expect(after.wallet).toBe(before.wallet);expect(after.badges).toEqual(before.badges);expect(after.encore).toBe(true);
 await page.evaluate(()=>{market.setVisible(false);market.setVisible(true);});expect((await page.evaluate(()=>market.snapshot())).purchases).toEqual(['plant','lantern']);await visit(page,-7,5.7);await expect(page.locator('#market-dialog')).toContainText('little green plant');await expect(page.locator('#market-dialog')).toContainText('ticket stub');
});
