// Read-only phase observations; retain the normal student UI and game state.
export async function installMarketTimingProbe(page,{extraSource=''}={}){
 page.on('console',m=>{if(m.text().startsWith('MARKET_PHASE '))console.log(m.text());});
 page.on('requestfinished',r=>{if(/\/(?:night-market|market-[^/]+)\.(?:js|mjs)(?:\?|$)/.test(r.url()))console.log('MARKET_NETWORK '+JSON.stringify({url:r.url(),timing:r.timing()}));});
 await page.addInitScript(()=>{
  window.marketTimings=[];
  window.recordMarketPhase=(phase,extra={})=>{const row={phase,pageMs:performance.now(),url:location.href,...extra};window.marketTimings.push(row);console.info('MARKET_PHASE '+JSON.stringify(row));};
  document.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&['discovery-pose','discovery-continue','film-comedy','discovery-retake','discovery-market-handover','market-destination','resume-options'].includes(b.id))window.recordMarketPhase('click:'+b.id);},true);
 });
 await page.route('**/app.js?*',async route=>{
  const response=await route.fetch();let source=await response.text();
  const replace=(from,to)=>{if(!source.includes(from))throw Error('Market timing marker missing: '+from);source=source.replace(from,to);};
  const mark=phase=>`window.recordMarketPhase('${phase}');`;
  replace("marketOpening=true;resetNavigationInput();", "marketOpening=true;"+mark('opening')+"resetNavigationInput();");
  replace("if(!nightMarket){const moduleReady=", "if(!nightMarket){"+mark('module-requested')+'const moduleReady=');
  replace("if(request!==marketTravelRequest)return;nightMarket=createNightMarket(",mark('module-ready')+"if(request!==marketTravelRequest)return;"+mark('construction-start')+'nightMarket=createNightMarket(');
  replace('});nightMarket.scene.environment=worlds.town.environment;', '});'+mark('construction-end')+'nightMarket.scene.environment=worlds.town.environment;');
  replace("await setMode('market');}",mark('set-mode-start')+"await setMode('market');"+mark('set-mode-end')+'}');
  replace('portraitCapturePending=true;', 'portraitCapturePending=true;'+mark('portrait-requested'));
  replace("frameGate=createGpuFrameGate(renderer,renderQuality(renderBackend,'auto',devicePixelRatio).software);", "frameGate=createGpuFrameGate(renderer,renderQuality(renderBackend,'auto',devicePixelRatio).software);const observeFrameReady=frameGate.ready,observeDrawReady=frameGate.readyForDraw;const recordCompletedMarket=()=>{const draw=window.marketTimings.find(r=>r.phase==='market-render-submitted');if(mode==='market'&&draw&&frameGate.completedFrame>=draw.submission&&!window.marketTimings.some(r=>r.phase==='market-gpu-complete'))window.recordMarketPhase('market-gpu-complete');};frameGate.ready=(...args)=>{const ready=observeFrameReady(...args);recordCompletedMarket();return ready;};frameGate.readyForDraw=(...args)=>{const ready=observeDrawReady(...args);recordCompletedMarket();return ready;};");
  replace('const oldSize=renderer.getSize(new THREE.Vector2()),oldRatio=',mark('portrait-gpu-ready')+'const oldSize=renderer.getSize(new THREE.Vector2()),oldRatio=');
  replace('renderer.render(worlds.town,shot);frameGate.submitted();',mark('portrait-render-start')+'renderer.render(worlds.town,shot);frameGate.submitted();'+mark('portrait-render-submitted'));
  replace("if(!blob)throw Error('Photo could not be encoded');", "if(!blob)throw Error('Photo could not be encoded');"+mark('portrait-encoded'));
  replace('lastRenderMs=performance.now()-renderStarted;frameGate.submitted();',"lastRenderMs=performance.now()-renderStarted;frameGate.submitted();if(mode==='market'&&!window.marketTimings.some(r=>r.phase==='market-render-submitted'))window.recordMarketPhase('market-render-submitted',{cpuMs:lastRenderMs,frame:renderedFrames,submission:frameGate.submittedFrame,triangles:renderer.info.render.triangles});if(marketOpening&&mode!=='market')window.recordMarketPhase('old-scene-render-submitted',{cpuMs:lastRenderMs,frame:renderedFrames,submission:frameGate.submittedFrame,triangles:renderer.info.render.triangles});");
  replace('catch(error){if(request!==marketTravelRequest)return;marketModuleAttempt++;',"catch(error){if(request!==marketTravelRequest)return;"+mark('import-failure')+'marketModuleAttempt++;');
  replace('if(request===marketTravelRequest){marketOpening=false;marketTravelController=null;}',"if(request===marketTravelRequest){marketOpening=false;marketTravelController=null;"+mark('opening-released')+'}');
  source+=extraSource;
  source+=`\nwindow.marketTransitionProbe=()=>({pageMs:performance.now(),mode,opening:marketOpening,frame:renderer?.info.render.frame,position:actor?.model.position.toArray(),market:nightMarket?.snapshot(),timings:window.marketTimings});`;
  await route.fulfill({response,body:source});
 });
}
