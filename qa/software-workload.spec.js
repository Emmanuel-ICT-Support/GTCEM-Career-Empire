// Opt-in diagnostic only; deliberately retains strict performance failures.
// GL wrappers observe existing calls, without extra queries, fences or draws.
// The optional compile experiment changes only the intercepted response.
import {test,expect} from '../tests/e2e/campus-fixtures.js';
function install(){
 Error.stackTraceLimit=24;
 const p=window.__workload={phase:'module-boot',calls:{},slow:[],frames:[],uploads:[],ticks:[],timers:[],events:[],longTasks:[],extensions:[]};
 new PerformanceObserver(list=>p.longTasks.push(...list.getEntries().map(e=>({atMs:e.startTime,ms:e.duration})))).observe({type:'longtask',buffered:true});
 const proto=WebGL2RenderingContext.prototype,queryNames=new Set(['getProgramInfoLog','getShaderInfoLog','getProgramParameter','getUniformLocation','getActiveUniform','getActiveAttrib','getParameter','getExtension']);p.queryCallers=[];const callerCounts={};
 if(!window.__disableGLObservers)
 for(const name of ['getExtension','getProgramInfoLog','getShaderInfoLog','getShaderParameter','getUniformLocation','getActiveUniform','getActiveAttrib','getParameter','checkFramebufferStatus','texStorage2D','linkProgram','getProgramParameter','compileShader','texImage2D','texSubImage2D','generateMipmap','bufferData','drawElements','drawArrays','clientWaitSync','fenceSync','flush','readPixels']){
  const original=proto[name];if(!original)continue;
  proto[name]=function(...args){const start=performance.now(),phase=p.phase;try{const result=original.apply(this,args);if(name==='getExtension')p.extensions.push({name:args[0],supported:Boolean(result),atMs:start});return result;}finally{const ms=performance.now()-start,key=phase+':'+name,s=p.calls[key]||={count:0,totalMs:0,maxMs:0};s.count++;s.totalMs+=ms;s.maxMs=Math.max(s.maxMs,ms);if(queryNames.has(name)&&((callerCounts[name]||0)<2||ms>100)){callerCounts[name]=(callerCounts[name]||0)+1;p.queryCallers.push({name,atMs:start,ms,parameter:typeof args[1]==='number'?args[1]:null,parameterName:name==='getProgramParameter'?Object.entries({LINK_STATUS:this.LINK_STATUS,ACTIVE_UNIFORMS:this.ACTIVE_UNIFORMS,ACTIVE_ATTRIBUTES:this.ACTIVE_ATTRIBUTES}).find(([,value])=>value===args[1])?.[0]:null,argument:name==='getExtension'?args[0]:null,program:window.__identifyProgram?.(args[0]),stack:new Error().stack});}if(ms>5&&p.slow.length<500)p.slow.push({name,phase,atMs:start,ms,arg:name==='getExtension'?args[0]:undefined});if(ms>500)console.log('WORKLOAD-SLOW '+JSON.stringify({name,phase,atMs:start,ms}));}};
 }
 window.__profileEvent=(name,extra={})=>{const event={name,atMs:performance.now(),...extra};p.events.push(event);if(!name.startsWith('surface'))console.log('WORKLOAD-STAGE '+JSON.stringify(event));};
 const timer=setInterval(()=>{if(p.timers.length<3000)p.timers.push(performance.now());},50);
 window.__stopProfile=()=>clearInterval(timer);
}
const rendererProbe=`
window.__profileEvent('renderer-ready');
window.__identifyProgram=program=>{const p=renderer.info.programs.find(p=>p.program===program);return p?{id:p.id,name:p.name,type:p.type}:null;};
if(window.__shaderErrorsOff){renderer.debug.checkShaderErrors=false;window.__profileEvent('shader-error-checks-disabled');}
for(const name of ['render','initTexture']){const original=renderer[name].bind(renderer);renderer[name]=(...args)=>{const start=performance.now(),previous=window.__workload.phase;window.__workload.phase=name;try{return original(...args);}finally{const ms=performance.now()-start;window.__workload.phase=previous;if(name==='render')window.__workload.frames.push({atMs:start,ms,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,scene:args[0].name,type:args[0].type,entryReady:typeof entryReady==='undefined'?false:entryReady});else{const t=args[0],im=t.image;window.__workload.uploads.push({atMs:start,ms,name:t.name,src:im?.currentSrc||im?.src,width:im?.width,height:im?.height});}}};}
window.__workload.phase='pmrem';
`;
const endProbe=`
window.__movement={get actor(){return actor},get worlds(){return worlds},reset:resetNavigationInput};
window.__profileSnapshot=()=>({...window.__workload,backend:renderBackend,entryVisibleMs:Number(canvas.dataset.entryVisibleMs),state:JSON.parse($('diagnostics').dataset.state||'{}')});
`;
test('cold graphics workload and first usable movement',async({page},info)=>{
 test.setTimeout(120000);const errors=[];const candidate=process.env.CE_PROFILE_CANDIDATE;if(candidate&&!['visible-parallel-compile','shader-errors-off'].includes(candidate))throw Error('Unknown workload experiment: '+candidate);page.on('console',m=>{if(m.text().startsWith('WORKLOAD-'))console.log(m.text());});page.on('pageerror',error=>{errors.push(error.message);console.log('WORKLOAD-PAGEERROR '+error.message);});await page.setViewportSize({width:1280,height:844});await page.addInitScript(({off,unwrapped})=>{window.__shaderErrorsOff=off;window.__disableGLObservers=unwrapped;},{off:candidate==='shader-errors-off',unwrapped:process.env.CE_GL_OBSERVERS==='off'});await page.addInitScript(install);
 await page.route('**/playable-3d/app.js*',async route=>{
  const response=await route.fetch();let source=await response.text();
  for(const [needle,replacement] of [
   ['    const pmrem=new THREE.PMREMGenerator(renderer)',rendererProbe+'    const pmrem=new THREE.PMREMGenerator(renderer)'],
   ['room.dispose();pmrem.dispose();',"room.dispose();pmrem.dispose();window.__profileEvent('pmrem-complete');window.__workload.phase='world-construction';"],
   ['lastTime=now;publishDiagnostics(now);',"lastTime=now;if(window.__workload.ticks.length<3000)window.__workload.ticks.push({atMs:performance.now(),entryReady,keys:[...keys],surfaceWaiting:surfaceUploads.waitingForFrame,submitted:frameGate.submittedFrame,completed:frameGate.completedFrame});publishDiagnostics(now);"],
   ['canvas.dataset.entryVisibleMs=String(performance.now());startSurfaceDetail();',"canvas.dataset.entryVisibleMs=String(performance.now());window.__profileEvent('entry-visible');startSurfaceDetail();"],
   ['(hydrate,options)=>surfaceUploads.schedule(hydrate,options)',"(hydrate,options)=>{window.__profileEvent('surface-queued');return surfaceUploads.schedule(()=>{const p=window.__workload,previous=p.phase,start=performance.now();p.phase='surface-hydrate';try{return hydrate();}finally{p.phase=previous;window.__profileEvent('surface-hydrated',{durationMs:performance.now()-start});}},options);}"]
  ]){if(source.split(needle).length!==2)throw Error('Probe anchor not unique: '+needle);source=source.replace(needle,replacement);}
  if(candidate==='visible-parallel-compile'){const needle='entryGeometryReady=true;updateCamera(1,true);';if(source.split(needle).length!==2)throw Error('Compile anchor not unique');source=source.replace(needle,"updateCamera(1,true);if(renderQuality(renderBackend,'auto',1).software){window.__profileEvent('compile-start');worlds.town.updateMatrixWorld(true);camera.updateMatrixWorld();const frustum=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));const preparation=new THREE.Group();worlds.town.traverseVisible(object=>{if(object.isLOD)object.update(camera);});worlds.town.traverseVisible(object=>{if((object.isMesh||object.isLine||object.isPoints||object.isSprite)&&object.layers.test(camera.layers)&&(!object.frustumCulled||frustum.intersectsObject(object)))preparation.add(object.clone(false));});window.__profileEvent('compile-selection',{objects:preparation.children.length});await renderer.compileAsync(preparation,camera,worlds.town);window.__profileEvent('compile-complete');}"+needle);}
  await route.fulfill({response,body:source+endProbe});
 });
 const windows=[];let observation;
 try{
  await page.goto('/playable-3d/?review=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__movement?.actor&&!window.__movement.actor.model.userData.fallback);
  await page.waitForFunction(()=>JSON.parse(document.querySelector('#diagnostics').dataset.state||'{}').entryReady,{timeout:90000});
  for(let attempt=0;attempt<4;attempt++)windows.push(await page.evaluate(async attempt=>{
   const t=window.__movement;t.reset();t.worlds.teleport(false,-7,23.3);t.actor.model.position.copy(t.worlds.position(false));
   const before=t.actor.model.position.toArray(),atMs=performance.now(),framesBefore=window.__workload.frames.length;
   window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyW'}));
   await new Promise(resolve=>setTimeout(resolve,1800));const endMs=performance.now(),after=t.actor.model.position.toArray();
   window.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyW'}));
   const frames=window.__workload.frames.slice(framesBefore);await new Promise(resolve=>setTimeout(resolve,700));
   return {attempt,atMs,endMs,speed:Math.hypot(after[0]-before[0],after[2]-before[2])/((endMs-atMs)/1000),before,after,frames};
  },attempt));
 }finally{
  observation=await page.evaluate(()=>{window.__stopProfile();return window.__profileSnapshot?.()||window.__workload;}).catch(error=>({unavailable:error.message}));
  await info.attach('graphics-workload',{body:JSON.stringify({candidate:candidate||null,glObservers:process.env.CE_GL_OBSERVERS!=='off',windows,observation,errors}),contentType:'application/json'});
 }
 expect.soft(windows[0]?.speed,'actual first keyboard movement speed').toBeGreaterThan(2.2);
 expect.soft(observation.entryVisibleMs,'navigation to a completed visible entry frame').toBeLessThanOrEqual(8000);
 expect.soft(errors,'uncaught page errors').toEqual([]);
 if(process.env.CE_TEST_RENDERER==='software')expect(observation.backend).toMatch(/swiftshader|llvmpipe|softpipe|software rasterizer/i);
});
