import {test,expect as baseExpect} from '@playwright/test';
// Hosted software rendering needs longer functional waits than native GPU runs.
const expect=baseExpect.configure({timeout:30000});
test.setTimeout(240000);
const wardrobeURL=process.env.CE_WARDROBE_URL||'/playable-3d/?outfit=wardrobe';
const state=p=>p.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}'));
async function ready(p){await expect(p.locator('#loading')).toBeHidden({timeout:90000});await expect(p.locator('#save-avatar')).toBeEnabled({timeout:30000});await expect.poll(async()=>(await state(p)).wardrobe?.visibleTops).toEqual(['scrubs']);}
async function choose(p,label,key,value){await p.getByRole('button',{name:label,exact:true}).click();await expect(p.locator('#save-avatar')).toBeEnabled({timeout:30000});await expect.poll(async()=>(await state(p)).wardrobe?.[key]).toEqual(value);}
test('lazy choices, stable body scale, colours, removal and saved reload',async({page},info)=>{
 const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.goto(wardrobeURL,{waitUntil:'domcontentloaded'});await ready(page);
 expect(requests.some(u=>/assets\/(hair-|shoes-)/.test(u))).toBe(false);
 const scale=(await state(page)).wardrobe.bodyScale;
 await page.getByRole('button',{name:'Hair',exact:true}).click();
 for(const [label,id]of [['Short sweep','sweep'],['Soft curls','curls'],['Side-part bob','bob'],['Ponytail','ponytail']]){
  await choose(page,label,'visibleHair',[id]);await page.screenshot({path:info.outputPath('hair-'+id+'.png')});expect((await state(page)).wardrobe.bodyScale).toBeCloseTo(scale,9);
 }
 const hex=page.getByRole('textbox',{name:'Hair hex colour'});await hex.fill('#70352a');await hex.press('Tab');await expect.poll(async()=>(await state(page)).wardrobe.hairHex).toBe('#70352A');
 await choose(page,'No hair','visibleHair',[]);await page.getByRole('button',{name:'Undo appearance change',exact:true}).click();await expect.poll(async()=>(await state(page)).wardrobe.visibleHair).toEqual(['ponytail']);
 await page.getByRole('button',{name:'Shoes',exact:true}).click();
 for(const [label,id]of [['Trainers','trainers'],['Work boots','boots'],['Dress shoes','dress'],['Clogs','clogs']]){
  await choose(page,label,'visibleShoes',[id]);await page.screenshot({path:info.outputPath('shoes-'+id+'.png')});expect((await state(page)).wardrobe.bodyScale).toBeCloseTo(scale,9);
 }
 const shoe=page.getByRole('textbox',{name:'Shoe hex colour'});await shoe.fill('247B86');await shoe.press('Tab');await expect.poll(async()=>(await state(page)).wardrobe.shoeHex).toBe('#247B86');
 await choose(page,'Bare feet','visibleShoes',[]);await choose(page,'Clogs','visibleShoes',['clogs']);
 await page.getByRole('button',{name:'Walking preview',exact:true}).click();await page.screenshot({path:info.outputPath('front.png')});
 await page.getByRole('button',{name:'Turn avatar around',exact:true}).click();await page.screenshot({path:info.outputPath('rear.png')});
 await page.locator('#save-avatar').click();await expect.poll(async()=>(await state(page)).mode,{timeout:90000}).toBe('town');
 await expect.poll(async()=>(await state(page)).campusReady,{timeout:90000}).toBe(true);
 requests.length=0;await page.reload({waitUntil:'domcontentloaded'});await ready(page);
 expect(requests.filter(u=>/assets\/(hair-|shoes-)/.test(u)).map(u=>u.split('/').pop().split('?')[0]).sort()).toEqual(['hair-ponytail.glb','shoes-clogs.glb']);
 await expect.poll(async()=>(await state(page)).wardrobe.visibleHair).toEqual(['ponytail']);
 expect((await state(page)).wardrobe).toMatchObject({visibleShoes:['clogs'],hairHex:'#70352A',shoeHex:'#247B86'});
 expect(errors).toEqual([]);
});
test.describe('phone-size touch controls',()=>{
 test.use({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 test('failed accessory retries; rapid choices and phone controls remain usable',async({page},info)=>{
 await page.setViewportSize({width:390,height:844});let fail=true;
 await page.route('**/hair-bob.glb?*',r=>fail?r.abort():r.continue());
 await page.goto(wardrobeURL,{waitUntil:'domcontentloaded'});await ready(page);
 await page.getByRole('button',{name:'Hair',exact:true}).tap();await page.getByRole('button',{name:'Side-part bob',exact:true}).tap();
 await expect(page.locator('#edit-state')).toContainText('could not load');await expect(page.locator('#save-avatar')).toBeDisabled();
 fail=false;await choose(page,'Side-part bob','visibleHair',['bob']);
 await page.getByRole('button',{name:'Soft curls',exact:true}).tap();await page.getByRole('button',{name:'Short sweep',exact:true}).tap();
 await expect.poll(async()=>(await state(page)).wardrobe.visibleHair).toEqual(['sweep']);
 await page.getByRole('button',{name:'Shoes',exact:true}).tap();await choose(page,'Work boots','visibleShoes',['boots']);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('#save-avatar')).toBeInViewport();await page.screenshot({path:info.outputPath('phone.png')});
 await page.setViewportSize({width:844,height:390});await expect(page.locator('#save-avatar')).toBeInViewport();await page.screenshot({path:info.outputPath('phone-landscape.png')});
});

});
