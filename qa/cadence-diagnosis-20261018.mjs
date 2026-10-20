import {chromium} from '@playwright/test';
import fs from 'node:fs';
const output=process.env.CE_CADENCE_OUTPUT;if(!output)throw Error('Set fresh CE_CADENCE_OUTPUT directory');fs.mkdirSync(output,{recursive:false});
const browser=await chromium.launch({executablePath:process.env.CE_CHROMIUM_EXECUTABLE||'/usr/bin/chromium'}),rows=[];
try{
 const cdp=await browser.newBrowserCDPSession();fs.writeFileSync(output+'/gpu.json',JSON.stringify(await cdp.send('SystemInfo.getInfo'),null,2));await cdp.detach();
 for(const width of [1280,390]){
  const context=await browser.newContext({viewport:{width,height:844}}),page=await context.newPage();
  await page.route('**/app.js?*',async route=>{const response=await route.fetch();let s=await response.text();
   s=s.replace('const renderStarted=performance.now();renderer.render(scene,camera);',"window.__cadenceEvents.push({kind:'draw',frame:renderedFrames+1,at:performance.now(),weight:actor.clips.walk?.getEffectiveWeight()||0,keys:[...keys],pending:worlds.pendingSurfaceDetails,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles});const renderStarted=performance.now();renderer.render(scene,camera);");
   s=s.replace('lastRenderMs=performance.now()-renderStarted;',"lastRenderMs=performance.now()-renderStarted;window.__cadenceEvents.push({kind:'returned',frame:renderedFrames+1,at:performance.now(),ms:lastRenderMs});");
   s=s.replace('function completeWorldPresentation(){',"function completeWorldPresentation(){window.__cadenceEvents.push({kind:'complete',at:performance.now(),frame:renderedFrames});");
   s=s.replace('softwarePresentation?.present(renderedFrames);',"softwarePresentation?.present(renderedFrames);window.__cadenceEvents.push({kind:'copied',at:performance.now(),frame:renderedFrames});");
   if(process.env.CE_PROBE_GPU_PULSE==='1')s+="\nsetInterval(()=>{if(frameGate?.constrained&&!document.hidden)frameGate.ready();},8);";
   s+="\nwindow.__cadenceEvents=[];window.__cadenceState=()=>({entryReady,mode,pending:worlds?.pendingSurfaceDetails,position:actor?.model?.position.toArray(),weight:actor?.clips.walk?.getEffectiveWeight()||0,rendered:renderedFrames,presented:Number(canvas.dataset.presentedFrame)||0,backend:renderBackend,ratio:renderer?.getPixelRatio(),sceneObjects:worlds?.town?.children.length});";
   await route.fulfill({response,body:s});
  });
  await page.goto('http://127.0.0.1:8000/playable-3d/?review=1&mode=full',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__cadenceState?.().entryReady,null,{timeout:90000});
  for(const [phase,key]of [['entry','KeyW'],['settled','KeyS'],['settled-repeat','KeyW']]){
   if(phase!=='entry')await page.waitForFunction(()=>{const s=window.__cadenceState();return s.pending===0&&s.presented>=3&&s.weight===0;},null,{timeout:45000});
   const before=await page.evaluate(()=>window.__cadenceState());
   const timing=await page.evaluate(key=>new Promise(resolve=>{const index=__cadenceEvents.length,start=performance.now();window.dispatchEvent(new KeyboardEvent('keydown',{code:key}));setTimeout(()=>{window.dispatchEvent(new KeyboardEvent('keyup',{code:key}));resolve({index,start,end:performance.now()});},1300);}),key);
   await page.waitForFunction(()=>window.__cadenceState().weight===0,null,{timeout:10000});await page.waitForTimeout(500);
   const events=await page.evaluate(index=>__cadenceEvents.slice(index),timing.index),after=await page.evaluate(()=>window.__cadenceState());
   const hold=events.filter(e=>e.at>=timing.start&&e.at<=timing.end),row={width,phase,key,gpuPulse:process.env.CE_PROBE_GPU_PULSE==='1',before,after,scheduledHoldMs:1300,actualHoldMs:timing.end-timing.start,movingDrawsDuringHold:hold.filter(e=>e.kind==='draw'&&e.weight>.01).length,allMovingDraws:events.filter(e=>e.kind==='draw'&&e.weight>.01).length,completedDuringHold:hold.filter(e=>e.kind==='complete').length,timing,events};rows.push(row);fs.writeFileSync(output+'/results.json',JSON.stringify(rows,null,2));console.log(JSON.stringify({width,phase,actualHoldMs:row.actualHoldMs,movingDrawsDuringHold:row.movingDrawsDuringHold,allMovingDraws:row.allMovingDraws,completedDuringHold:row.completedDuringHold,pending:before.pending}));
  }
  await page.screenshot({path:output+`/settled-${width}.png`});fs.writeFileSync(output+`/timeline-${width}.json`,JSON.stringify(await page.evaluate(()=>__cadenceEvents),null,2));await context.close();
 }
}finally{await browser.close();}
