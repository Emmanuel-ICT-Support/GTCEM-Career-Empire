import {test,expect} from './campus-fixtures.js';
// Isolated real module/DOM/scene integration. Separate from full avatar navigation.
for(const width of [1280,390])test(`research mission and pass ${width}`,async({page})=>{
 await page.setViewportSize({width,height:844});
 await page.route('**/market-test',r=>r.fulfill({contentType:'text/html',body:`<html><head><script type="importmap">{"imports":{"three":"/playable-3d/vendor/three/build/three.module.js"}}</script></head><body><main id="experience"><canvas id="scene" tabindex="0"></canvas></main></body></html>`}));
 await page.goto('/market-test');
 await page.evaluate(async()=>{
  const {createNightMarket}=await import('/playable-3d/night-market.js');const THREE=await import('three');
  const data=new Map([['ce-night-market-practice-v1',JSON.stringify({version:2,events:[]})]]);window.market=createNightMarket({storage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},onPause(){},onClose(){},onExit(){}});
  window.market.setVisible(true);window.camera=new THREE.PerspectiveCamera();camera.position.set(0,5,12);
 });
 const visit=async(x,z)=>{await page.evaluate(([x,z])=>{const spot=market.interaction({x,z});if(!spot)throw Error('Missing interaction');spot.action();},[x,z]);};
 const click=async(name)=>page.getByRole('button',{name,exact:true}).click();
 const close=async()=>click('Back to the market');
 const tick=async()=>page.evaluate(()=>market.update(6,6,camera));
 await visit(0,-3.6);await click('Take the shift');
 await visit(-2,-.2);await click('Ask: “What information would help you?”');await close();
 await visit(-3,4);await click('Watch the queue');await tick();await expect(page.locator('#market-dialog')).toContainText('bags sat at collection');await close();
 await visit(1.5,-3.3);await click('Record the workflow clue');
 await visit(0,-3.6);await click('Propose: separate ordering and pickup with a visible sign');
 await visit(4.2,-1.8);await click('Place the sign on the counter');
 await visit(4.2,-1.8);await click('Try it with the next customers');await tick();await expect(page.locator('#market-dialog')).toContainText('hidden behind');await close();
 await visit(4.2,-1.8);await click('Place the sign beside the approach path');
 await visit(4.2,-1.8);await click('Try it with the next customers');await tick();await close();
 await visit(2.8,-2);await click('We made the food faster');await expect(page.locator('#market-dialog')).toContainText('same speed');await close();
 expect((await page.evaluate(()=>market.snapshot())).paid).toBe(false);
 await visit(2.8,-2);await click('People got the right information before choosing a queue');await close();
 await visit(0,-3.6);await click('Finish the shift · receive $18 and crew pass');await click('Explore the market');
 await visit(4,-9);await click('Use my crew pass');
 const s=await page.evaluate(()=>market.snapshot());expect(s.wallet).toBe(1800);expect(s.badges).toEqual(['initiative','problem','adapting']);expect(s.encore).toBe(true);
 await page.evaluate(()=>market.journal());await expect(page.locator('#market-dialog')).toContainText('Ticket stub: MY FIRST GIG');
 expect(await page.locator('#market-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
});
test('fresh review uses the actual game and leaves existing saves untouched',async({page})=>{
 test.setTimeout(60000);
 const old=JSON.stringify({version:1,events:['accept','helper','pay','buy']});
 await page.addInitScript(value=>localStorage.setItem('ce-night-market-practice-v1',value),old);
 await page.goto('/playable-3d/?experience=night-market&market-review=1',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#loading')).toBeHidden({timeout:30000});await expect(page.locator('#market-objective')).toHaveText('Start: meet Mara at Juniper Kitchen.');
 await page.keyboard.down('w');try{await expect(page.locator('#interact')).toHaveText('Talk to Mara',{timeout:15000});}finally{await page.keyboard.up('w');}
 await page.locator('#interact').click();await page.getByRole('button',{name:'Take the shift',exact:true}).click();
 await expect(page.locator('#market-objective')).toContainText('Your goal: make service smoother.');
 expect(await page.evaluate(()=>localStorage.getItem('ce-night-market-practice-v1'))).toBe(old);
 await page.reload();await expect(page.locator('#market-objective')).toHaveText('Start: meet Mara at Juniper Kitchen.',{timeout:30000});
});
