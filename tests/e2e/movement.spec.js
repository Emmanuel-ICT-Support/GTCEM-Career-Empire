import {enterClassroomWhenAsked} from './market-controls.js';
import {test,expect} from './campus-fixtures.js';
import fs from 'node:fs';
const probe=`
const travelFrames=[],travelInputs=[],travelNavigation=[],travelResets=[],travelStages=[];let travelSteps=0;
window.startTravelEvidence=()=>{
 const originalRender=renderer.render.bind(renderer),originalStep=locomotion.step.bind(locomotion);
 const originalEntry=updateEntryLoading,originalReset=resetNavigationInput;
 updateEntryLoading=(...args)=>{const result=originalEntry(...args);travelNavigation.push({atMs:performance.now(),mode,entryReady,hidden:document.hidden,keys:[...keys],intro:intro?.open(),marketOpening,discovery:discovery?.open(),feedback:feedbackOpen(),marketDialog:marketDialogOpen(),menu:explorationMenuOpen(),helper:helperPicker.open(),echo:echo?.open(),est:watchingEST,module:!$('module-overlay').hidden,reflection:$('reflection-dialog').open});return result;};
 resetNavigationInput=(...args)=>{travelResets.push({atMs:performance.now(),keys:[...keys],caller:new Error().stack.split('\\n').slice(1,4)});return originalReset(...args);};
 renderer.render=(...args)=>{const start=performance.now();const result=originalRender(...args);travelFrames.push({startMs:start,durationMs:performance.now()-start});return result;};
 locomotion.step=(...args)=>{travelSteps++;return originalStep(...args);};
 if(window.__detailedTravel){
  const wrap=(object,name,label=name)=>{const original=object[name];object[name]=function(...args){const atMs=performance.now();try{return original.apply(this,args);}finally{const durationMs=performance.now()-atMs;if(durationMs>10)travelStages.push({name:label,atMs,durationMs});}};};
  for(const name of ['submitted','ready','readyForDraw'])wrap(frameGate,name,'frameGate.'+name);
  for(const name of ['flush','fenceSync','clientWaitSync','getProgramParameter','getProgramInfoLog','getUniformLocation','bufferData','texImage2D','texSubImage2D','drawElements','drawArrays','clear','getParameter'])wrap(renderer.getContext(),name,'gl.'+name);
  wrap(renderer,'clear','renderer.clear');
  for(const name of ['move','update','protectCamera'])wrap(worlds,name,'worlds.'+name);
 }
 window.addEventListener('keydown',event=>queueMicrotask(()=>travelInputs.push({code:event.code,atMs:performance.now(),accepted:keys.has(event.code),entryReady,options:explorationMenuOpen(),helper:helperPicker.open(),echo:echo?.open()})));
};
window.travelEvidence=()=>({steps:travelSteps,frames:travelFrames,stages:travelStages,inputs:travelInputs,navigation:travelNavigation,resets:travelResets,backend:renderBackend});
window.travelProbe={get actor(){return actor},get worlds(){return worlds},get yaw(){return yaw},set yaw(v){yaw=v},reset:resetNavigationInput};`;
for(const [width,slow] of [[1280,false],[390,false],[1280,true]])test(`player travel, gait, turn and stop at ${width}${slow?' at 8 FPS':''}`,async({page},info)=>{
 if(slow)await page.addInitScript(()=>{const native=requestAnimationFrame.bind(window);window.requestAnimationFrame=callback=>{let last=performance.now();const tick=now=>{if(now-last>=125)callback(now);else native(tick);};return native(tick);};});
 const detailed=process.env.CE_MOVEMENT_PROFILE==='1';if(detailed)await page.addInitScript(()=>window.__detailedTravel=true);
 await page.setViewportSize({width,height:844});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/playable-3d/app.js*',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:await res.text()+probe});});
 await page.goto('/playable-3d/?review=1',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.travelProbe?.actor&&!travelProbe.actor.model.userData.fallback);
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#diagnostics').dataset.state||'{}').entryReady,{timeout:90000});
 if(detailed){const browserSession=await page.context().browser().newBrowserCDPSession();const system=await browserSession.send('SystemInfo.getInfo');await info.attach('movement-browser-system',{body:JSON.stringify(system),contentType:'application/json'});await browserSession.detach();}
 const cdp=detailed?await page.context().newCDPSession(page):null;if(cdp){await cdp.send('Profiler.enable');await cdp.send('Profiler.start');if(width===1280&&!slow)await cdp.send('Tracing.start',{categories:'toplevel,devtools.timeline,blink,cc,gpu,viz,disabled-by-default-gpu.service',transferMode:'ReturnAsStream'});}
 await page.evaluate(()=>window.startTravelEvidence());
 const measure=async(run=false)=>page.evaluate(async run=>{
  const t=travelProbe;t.reset();t.worlds.teleport(false,-7,23.3);t.actor.model.position.copy(t.worlds.position(false));
  const before=t.actor.model.position.toArray(),start=performance.now();
  if(run)window.dispatchEvent(new KeyboardEvent('keydown',{code:'ShiftLeft'}));window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyW'}));
  await new Promise(r=>setTimeout(r,1800));
  const seconds=(performance.now()-start)/1000;
  const moving={position:t.actor.model.position.toArray(),rate:t.actor.clips.walk.getEffectiveTimeScale(),weight:t.actor.clips.walk.getEffectiveWeight(),angle:t.actor.model.rotation.y};
  window.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyW'}));window.dispatchEvent(new KeyboardEvent('keyup',{code:'ShiftLeft'}));
  await new Promise(r=>setTimeout(r,700));
  const stopped={position:t.actor.model.position.toArray(),weight:t.actor.clips.walk.getEffectiveWeight()};
  return {seconds,distance:Math.hypot(moving.position[0]-before[0],moving.position[2]-before[2])/seconds,moving,stopped};
 },run);
 const walk=await measure();const run=await measure(true);if(cdp){const {profile}=await cdp.send('Profiler.stop');await info.attach('movement-cpu-profile',{body:JSON.stringify(profile),contentType:'application/json'});if(width===1280&&!slow){const completed=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));await cdp.send('Tracing.end');const {stream}=await completed;let trace='';for(;;){const chunk=await cdp.send('IO.read',{handle:stream});trace+=chunk.base64Encoded?Buffer.from(chunk.data,'base64').toString():chunk.data;if(chunk.eof)break;}await cdp.send('IO.close',{handle:stream});await info.attach('movement-browser-trace',{body:trace,contentType:'application/json'});}await cdp.detach();}await info.attach('movement-timing-observation',{body:JSON.stringify({walk,run,evidence:await page.evaluate(()=>window.travelEvidence())}),contentType:'application/json'});expect(walk.distance).toBeGreaterThan(2.2);expect(run.distance).toBeGreaterThan(walk.distance*1.25);expect(run.moving.rate).toBeGreaterThan(walk.moving.rate*1.3);expect(walk.moving.weight).toBeGreaterThan(.9);expect(run.stopped.weight).toBeLessThan(.05);
 await page.evaluate(()=>{travelProbe.yaw=Math.PI/2;});const sideways=await measure();expect(sideways.moving.position[0]).toBeLessThan(run.stopped.position[0]);
 await page.screenshot({path:info.outputPath(`travel-${width}${slow?'-8fps':''}.png`)});console.log('TRAVEL',width,JSON.stringify({walk,run,sideways}));expect(errors).toEqual([]);
});
test('supplied animations keep walking on frames between physics ticks',async({page})=>{
 await page.route('**/animation-harness',r=>r.fulfill({contentType:'text/html',body:'<base href="/playable-3d/"><script type="importmap">{"imports":{"three":"/playable-3d/vendor/three/build/three.module.js","three/addons/":"/playable-3d/vendor/three/examples/jsm/"}}</script>'}));
 await page.route('**/characters.js?baseline',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync('playable-3d/characters.js','utf8').replace(/function bindClips\([\s\S]*?(?=\nconst kitLoads)/,()=>fs.readFileSync('tests/fixtures/legacy-bind-clips.txt','utf8'))}));
 await page.goto('/animation-harness');const result=await page.evaluate(async()=>{
  const {loadCharacterKit,createCharacter}=await import('/playable-3d/characters.js');const baseline=await import('/playable-3d/characters.js?baseline');const {normaliseProfile}=await import('/playable-3d/profiles.js');const out=[];
  for(const body of ['schoolboy','pantstest']){await loadCharacterKit(body);const a=createCharacter(normaliseProfile({id:'test',body,outer:'none',workTop:'none',hairStyle:'none',shoeStyle:'none'}));
   const values=[];for(const hz of [30,60,144]){a.setWalking(false);a.update(1);let acc=0;for(let i=0;i<hz*2;i++){acc+=1/hz;let steps=0;while(acc>=1/60){acc-=1/60;steps++}if(steps)a.setWalking(true,2.8);a.update(1/hz);}values.push({hz,weight:a.clips.walk.getEffectiveWeight(),time:a.clips.walk.time,rate:a.clips.walk.getEffectiveTimeScale()});}await baseline.loadCharacterKit(body);const old=baseline.createCharacter(normaliseProfile({id:'baseline',body,outer:'none',workTop:'none',hairStyle:'none',shoeStyle:'none'}));let acc=0;for(let i=0;i<288;i++){acc+=1/144;let steps=0;while(acc>=1/60){acc-=1/60;steps++;}old.setWalking(Boolean(steps));old.update(1/144);}out.push({body,values,baselineWeight144:old.clips.walk.getEffectiveWeight(),baselineTime144:old.clips.walk.time});old.dispose();a.dispose();}return out;
 });for(const a of result){expect(a.baselineTime144).toBeLessThan(.04);for(const v of a.values)expect(v.weight).toBeCloseTo(1);}console.log('GAIT',JSON.stringify(result));
});

test.beforeEach(({page})=>{enterClassroomWhenAsked(page);});
