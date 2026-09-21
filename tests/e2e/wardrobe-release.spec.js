import {test,expect} from './campus-fixtures.js';
import {writeFile} from 'node:fs/promises';

const wardrobeURL=process.env.CE_WARDROBE_URL||'/playable-3d/?outfit=wardrobe';

const state=page=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state||'{}'));
async function ready(page){await expect(page.locator('#loading')).toBeHidden({timeout:90000});await expect(page.locator('#save-avatar')).toBeEnabled({timeout:30000});await expect.poll(async()=>(await state(page)).wardrobe?.visibleTops).toEqual(['scrubs']);}
async function choose(page,label,style){await page.getByRole('button',{name:label,exact:true}).click();await expect(page.locator('#save-avatar')).toBeEnabled({timeout:30000});if(style)await expect.poll(async()=>(await state(page)).wardrobe?.visibleTops).toEqual([style]);}
async function metrics(page,info,label){const data=await page.evaluate(()=>({firstFrameMs:Number(document.querySelector('#scene').dataset.firstFrameMs),state:JSON.parse(document.querySelector('#diagnostics').dataset.state),resources:performance.getEntriesByType('resource').map(e=>({name:e.name.split('/').pop(),bytes:e.encodedBodySize,transferred:e.transferSize,duration:e.duration}))}));await writeFile(info.outputPath(label+'.json'),JSON.stringify(data,null,2));await info.attach(label,{body:JSON.stringify(data,null,2),contentType:'application/json'});return data;}

test('wardrobe opens without campus or unselected clothes, saves colours and returns to Town',async({page},info)=>{
 test.setTimeout(150000);const requested=[],errors=[];page.on('request',r=>requested.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.goto(wardrobeURL);await ready(page);
 expect((await state(page)).scenery.status).toBe('pending');
 expect(requested.some(u=>/occupational-top-(work|chef|suit)|occupational-pants-(chef|tradie|suit)|mature-eucalypt|campus-buildings/.test(u))).toBe(false);
 expect(requested.filter(u=>u.includes('hospital-scrub-top.glb'))).toHaveLength(1);
 expect(requested.filter(u=>u.includes('occupational-pants-scrubs.glb'))).toHaveLength(1);
 const initial=await metrics(page,info,'desktop-cold-studio');expect(initial.firstFrameMs).toBeGreaterThan(0);
 await page.getByRole('button',{name:'Tops',exact:true}).click();
 for(const [label,style]of [['Work shirt','work'],['Chef jacket','chef'],['Suit jacket','suit']])await choose(page,label,style);
 const hex=page.getByRole('textbox',{name:'Top hex colour',exact:true});await hex.fill('#ABCDEF');await hex.press('Enter');await hex.blur();
 // Change events are dispatched by leaving the actual field, as a player does.
 await page.getByRole('button',{name:'Walking preview',exact:true}).click();await expect.poll(async()=>(await state(page)).wardrobe.topHex).toBe('#ABCDEF');
 await page.getByRole('button',{name:'Pants',exact:true}).click();
 for(const label of ['Chef pants','Tradie work pants','Suit pants','Hospital scrub pants'])await choose(page,label);
 const pants=page.getByRole('textbox',{name:'Pants hex colour',exact:true});await pants.fill('#567890');await pants.press('Tab');
 await expect(page.locator('#save-avatar')).toBeEnabled();await page.locator('#save-avatar').click();
 await expect.poll(async()=>(await state(page)).mode,{timeout:90000}).toBe('town');expect((await state(page)).scenery.status).toBe('ready');
 await page.reload();await expect(page.locator('#loading')).toBeHidden({timeout:90000});
 await expect.poll(async()=>(await state(page)).wardrobe?.visibleTops).toEqual(['suit']);
 expect((await state(page)).wardrobe.topHex).toBe('#ABCDEF');
 await expect(page.getByRole('textbox',{name:'Pants hex colour',exact:true})).toHaveValue('#567890');
 await metrics(page,info,'desktop-saved-reload');expect(errors).toEqual([]);
});

test('failed garment remains retryable and rapid choices cannot display the wrong top',async({page})=>{
 test.setTimeout(90000);let fail=true;
 await page.route('**/occupational-top-work.glb?*',route=>fail?route.abort():route.continue());
 await page.goto(wardrobeURL);await ready(page);await page.getByRole('button',{name:'Tops',exact:true}).click();
 await page.getByRole('button',{name:'Work shirt',exact:true}).click();await expect(page.locator('#edit-state')).toContainText('could not load');await expect(page.locator('#save-avatar')).toBeDisabled();
 fail=false;await choose(page,'Work shirt','work');
 await page.getByRole('button',{name:'Suit jacket',exact:true}).click();await page.getByRole('button',{name:'Chef jacket',exact:true}).click();
 await expect.poll(async()=>(await state(page)).wardrobe?.visibleTops).toEqual(['chef']);
 await page.getByRole('button',{name:'No top',exact:true}).click();await expect.poll(async()=>(await state(page)).wardrobe?.necklineVisible).toBe(false);
 await page.getByRole('button',{name:'Undo appearance change',exact:true}).click();await expect.poll(async()=>(await state(page)).wardrobe?.visibleTops).toEqual(['chef']);
});

test.describe('phone-size wardrobe',()=>{
 test.use({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 test('portrait and landscape controls stay usable with native walking and saved hex colours',async({page},info)=>{
  test.setTimeout(120000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(wardrobeURL);await ready(page);await metrics(page,info,'phone-cold-studio');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Tops',exact:true}).tap();await choose(page,'Work shirt','work');
  const hex=page.getByRole('textbox',{name:'Top hex colour',exact:true});await hex.fill('#FF9900');await hex.press('Tab');await page.getByRole('button',{name:'Walking preview',exact:true}).tap();
  await expect.poll(async()=>(await state(page)).wardrobe.topHex).toBe('#FF9900');
  await page.getByRole('button',{name:'Turn avatar around',exact:true}).tap();await metrics(page,info,'phone-portrait');await page.screenshot({path:info.outputPath('phone-portrait.png')});
  await page.setViewportSize({width:844,height:390});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('#save-avatar')).toBeInViewport();await page.screenshot({path:info.outputPath('phone-landscape.png')});
  await page.setViewportSize({width:390,height:844});await choose(page,'Chef jacket','chef');await metrics(page,info,'phone-final');expect(errors).toEqual([]);
 });
});
