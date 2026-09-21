import {test,expect} from './campus-fixtures.js';
import {writeFile} from 'node:fs/promises';

const gameURL=process.env.CE_GAME_URL||'/playable-3d/';
for(const scenario of [
 {name:'desktop current wardrobe',width:1366,height:768,touch:false,body:'pantstest'},
 {name:'phone default avatar',width:390,height:844,touch:true,body:'schoolboy'}
])test.describe(scenario.name,()=>{
 test.use({viewport:{width:scenario.width,height:scenario.height},isMobile:scenario.touch,hasTouch:scenario.touch});
 test('game entry loads only the active avatar and worn clothes',async({page},info)=>{
  test.setTimeout(150000);const requests=[],failures=[],errors=[];
  page.on('request',r=>requests.push(r.url()));page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()}));page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(body=>localStorage.setItem('career-empire-3d-profiles-v2-tripo',JSON.stringify({activeId:'example',profiles:[{id:'example',name:'Example',body,pantsStyle:'scrubs',workTop:'scrubs'},{id:'unused',name:'Unused',body:'jackettest'}]})),scenario.body);
  const start=Date.now();
  try{
   await page.goto(gameURL,{waitUntil:'domcontentloaded'});await expect(page.locator('#loading')).toBeHidden({timeout:120000});
   await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true',{timeout:15000});
   const data=await page.evaluate(()=>({firstFrameMs:Number(document.querySelector('#scene').dataset.firstFrameMs),state:JSON.parse(document.querySelector('#diagnostics').dataset.state),resources:performance.getEntriesByType('resource').map(e=>({url:e.name,bytes:e.encodedBodySize,transferred:e.transferSize,start:e.startTime,duration:e.duration}))}));
   await writeFile(info.outputPath('cold-game.json'),JSON.stringify({readyMs:Date.now()-start,...data,requests,failures,errors},null,2));
   const avatars=requests.filter(u=>/\/(player-[^/]+|avatar-[ab]|studio-walking-base)\.glb(?:\?|$)/.test(u));
   expect(avatars).toHaveLength(1);expect(avatars[0]).toContain(scenario.body==='pantstest'?'studio-walking-base':'player-schoolboy');
   expect(requests.some(u=>/occupational-(top|pants)-(chef|suit|tradie|work)|mr-middleton|mr-psandodakis|\/studio\.js|OrbitControls/.test(u))).toBe(false);
   expect(data.state.mode).toBe('town');expect(errors).toEqual([]);
   await expect.poll(()=>page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state).campusReady),{timeout:120000}).toBe(true);
   await writeFile(info.outputPath('complete-campus.json'),JSON.stringify({readyMs:Date.now()-start,state:await page.locator('#diagnostics').evaluate(e=>JSON.parse(e.dataset.state))},null,2));
   const warmStart=Date.now();await page.reload({waitUntil:'domcontentloaded'});await expect(page.locator('#loading')).toBeHidden({timeout:90000});await expect(page.locator('#scene')).toHaveAttribute('data-rendered','true');
   await writeFile(info.outputPath('warm-game.json'),JSON.stringify({readyMs:Date.now()-warmStart,firstFrameMs:await page.locator('#scene').getAttribute('data-first-frame-ms')},null,2));
  }finally{await writeFile(info.outputPath('requests.json'),JSON.stringify({elapsedMs:Date.now()-start,requests,failures,errors},null,2));}
 });
});
