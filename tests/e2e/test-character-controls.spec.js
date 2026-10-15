import {test,expect} from './campus-fixtures.js';
const key='ce-player:e2e-owned:career-empire-3d-profiles-v2-tripo';
const primary=['Antonio','Cerys','Che','Diego','Hannah','Lilly','Sienna','Taj'];
const snapshot=page=>page.locator('#diagnostics').evaluate(n=>JSON.parse(n.dataset.state||'{}'));
// Campus scenery can keep streaming after Studio opens. Only character and
// wardrobe requests belong to the selected-only avatar assertion.
const glbs=urls=>urls.filter(u=>/\/assets\/(?:whole-characters\/[^/]+|avatar-[^/]+|player-[^/]+|studio-walking-base|studio-separate-pants|occupational-[^/]+|hospital-scrub-top|hair-[^/]+|shoes-[^/]+|neckline-skin)\.glb(?:[?]|$)/.test(u));
async function ready(page,width){
 await page.setViewportSize({width,height:844});await page.goto('/playable-3d/?outfit=wardrobe',{waitUntil:'domcontentloaded'});
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#scene')).toHaveAttribute('data-preview-body','pantstest',{timeout:20000});await expect(page.locator('#edit-state')).toHaveText('Unsaved',{timeout:20000});await expect(page.locator('#save-avatar')).toBeEnabled({timeout:20000});
}
async function choose(page,name){await page.getByRole('button',{name,exact:true}).click();await expect(page.locator('#save-avatar')).toBeEnabled({timeout:15000});}
for(const width of [1280,390]){
 test(`Dress ups named colours, lazy archive and saved per-style choices ${width}`,async({page},info)=>{
  test.setTimeout(120000);const urls=[],errors=[];page.on('request',r=>urls.push(r.url()));page.on('pageerror',e=>errors.push(e.message));await ready(page,width);
  await page.locator('[data-tab="identity"]').click();
  expect(await page.getByLabel('Character',{exact:true}).locator('option').allTextContents()).toEqual(['Current: Dress ups · clothes & colours',...primary]);
  expect(urls.some(u=>u.includes('test-avatar-catalog'))).toBe(false);
  const before=glbs(urls).length;await page.getByText('Test characters',{exact:true}).click();
  await expect(page.getByLabel('Test character',{exact:true})).toHaveValue('pantstest');
  expect(await page.getByLabel('Test character',{exact:true}).locator('option').allTextContents()).toEqual(['Dress ups · clothes & colours','Jacket fit test · incomplete body','School student · fixed uniform','Base avatar · fixed appearance','Shirt test · fixed outfit','Body A · legacy customisable','Body B · legacy customisable']);
  expect(glbs(urls).length).toBe(before);await expect(page.locator('#editor-fields')).toContainText('Archived experiments');await expect(page.locator('#editor-fields')).toContainText('four hairstyles');
  await page.screenshot({path:info.outputPath(`archive-${width}.png`)});
  await page.locator('[data-tab="style"]').click();await choose(page,'Hair');await expect(page.getByLabel('Hair colour preset',{exact:true})).toHaveCount(0);
  await choose(page,'Short sweep');
  for(const [label,hex]of [['Teal','#107E7A'],['Silver','#B7B7B0'],['Deep auburn','#8A3A22']]){
   const count=glbs(urls).length;await page.getByLabel('Hair colour preset',{exact:true}).selectOption({label});await expect(page.getByLabel('Hair hex colour',{exact:true})).toHaveValue(hex);await expect(page.locator('#save-avatar')).toBeEnabled();expect(glbs(urls).length).toBe(count);
  }
  await page.getByRole('button',{name:'Undo appearance change',exact:true}).click();await expect(page.getByLabel('Hair hex colour',{exact:true})).toHaveValue('#B7B7B0');await page.getByRole('button',{name:'Redo appearance change',exact:true}).click();
  await page.screenshot({path:info.outputPath(`hair-presets-${width}.png`)});
  await choose(page,'Pants');await choose(page,'Suit pants');await page.getByLabel('Pants colour preset',{exact:true}).selectOption({label:'Burgundy'});await expect(page.getByLabel('Pants hex colour',{exact:true})).toHaveValue('#75233D');
  await choose(page,'Tops');await choose(page,'Suit jacket');await page.getByLabel('Top colour preset',{exact:true}).selectOption({label:'Camel'});await expect(page.getByLabel('Top hex colour',{exact:true})).toHaveValue('#B08A4D');
  await choose(page,'Work shirt');await choose(page,'Suit jacket');await expect(page.getByLabel('Top colour preset',{exact:true})).toHaveValue('#B08A4D');
  await choose(page,'Shoes');await choose(page,'Work boots');await page.getByLabel('Shoe colour preset',{exact:true}).selectOption({label:'Brown'});await expect(page.getByLabel('Shoe hex colour',{exact:true})).toHaveValue('#AD8049');
  expect(await page.locator('#editor-fields').evaluate(n=>n.scrollWidth<=n.clientWidth)).toBe(true);
  await expect.poll(async()=>(await snapshot(page)).wardrobe?.hairHex).toBe('#8A3A22');
  await page.locator('#save-avatar').click();
  const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).profiles[0],key);
  expect(saved).toMatchObject({body:'pantstest',workTop:'suit',topColours:{suit:'#B08A4D'},pantsColours:{suit:'#75233D'},hairColours:{sweep:'#8A3A22'},shoeColours:{boots:'#AD8049'}});expect(errors).toEqual([]);
 });
 test(`legacy A and B capability descriptions and colour controls ${width}`,async({page},info)=>{
  test.setTimeout(90000);await ready(page,width);await page.locator('[data-tab="identity"]').click();
  for(const body of ['a','b']){
   await page.getByText('Test characters',{exact:true}).click();await page.getByLabel('Test character',{exact:true}).selectOption(body);await expect(page.locator('#save-avatar')).toBeEnabled({timeout:20000});
   await expect(page.locator('#editor-fields')).toContainText('Legacy Body '+body.toUpperCase());await expect(page.getByLabel('Face',{exact:true})).toBeVisible();
   await page.getByLabel('Hair colour preset',{exact:true}).selectOption({label:'Deep auburn'});await expect(page.getByLabel('Hair colour',{exact:true})).toHaveValue('#8a3a22');
   await page.locator('[data-tab="style"]').click();await page.getByLabel('Bottom colour preset',{exact:true}).selectOption({label:'Burgundy'});await page.getByLabel('Outer layer colour preset',{exact:true}).selectOption({label:'Camel'});
   expect(await page.locator('#editor-fields').evaluate(n=>n.scrollWidth<=n.clientWidth)).toBe(true);await page.screenshot({path:info.outputPath(`body-${body}-${width}.png`)});await page.locator('[data-tab="identity"]').click();
  }
 });
}
