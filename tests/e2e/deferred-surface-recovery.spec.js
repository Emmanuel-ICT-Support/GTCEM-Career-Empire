import {test,expect} from '@playwright/test';
test('real grass failure stays retryable and successful retry restores the completed entry',async({page},info)=>{
 test.setTimeout(60000);let grassRequests=0;const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('STARTUP_PAGE_ERROR',e.message);});
 await page.route('**/grass-ecc-campus-v1-lossless.webp',route=>{grassRequests++;console.log('STARTUP_GRASS_REQUEST',grassRequests);return grassRequests===1?route.abort('failed'):route.continue();});
 // Observe the real startup phases without changing scheduling or game state.
 page.on('console',message=>{if(message.text().startsWith('STARTUP_PHASE '))console.log(message.text());});
 await page.route('**/app.js?*',async route=>{
  const response=await route.fetch();let source=await response.text();
  const replaceOnce=(from,to)=>{if(source.split(from).length!==2)throw Error('Startup probe marker changed: '+from);source=source.replace(from,to);};
  const mark=phase=>"console.info('STARTUP_PHASE '+JSON.stringify({phase:'"+phase+"',ms:Math.round(performance.now())}));";
  replaceOnce('async function prepareEntry(){','async function prepareEntry(){'+mark('entry-requested'));
  replaceOnce('requestAnimationFrame(animate);const now=',"if(performance.now()-(window.__startupHeartbeat||0)>5000){window.__startupHeartbeat=performance.now();console.info('STARTUP_PHASE '+JSON.stringify({phase:'frame-heartbeat',ms:Math.round(performance.now()),hidden:document.hidden,entryReady,detailFailed,pending:worlds.pendingSurfaceDetails,metricsTime,frames,published:document.querySelector('#diagnostics')?.dataset.state}));}requestAnimationFrame(animate);const now=");
  replaceOnce('const renderStarted=performance.now();renderer.render(scene,camera);',"const postEntry=entryReady&&!window.__postEntryFrame; if(postEntry){window.__postEntryFrame=true;console.info('STARTUP_PHASE '+JSON.stringify({phase:'first-entry-render-start',ms:Math.round(performance.now())}));} const renderStarted=performance.now();renderer.render(scene,camera);if(postEntry)console.info('STARTUP_PHASE '+JSON.stringify({phase:'first-entry-render-end',ms:Math.round(performance.now())}));");
  replaceOnce("$('diagnostics').value=JSON.stringify(data);","if(data.entryReady&&!window.__publishedReady){window.__publishedReady=true;console.info('STARTUP_PHASE '+JSON.stringify({phase:'first-ready-publication',ms:Math.round(performance.now()),fps:data.fps,detailFailed:data.surfaceDetailFailed}));} $('diagnostics').value=JSON.stringify(data);");
  replaceOnce('flyover?.refresh();',"const frameProbe=entryReady&&!window.__firstEntryStages;const frameStage=phase=>{const seen=window.__entryStageSeen||=(Object.create(null));if(frameProbe&&!seen[phase]){seen[phase]=true;console.info('STARTUP_PHASE '+JSON.stringify({phase,ms:Math.round(performance.now())}));}};frameStage('first-entry-simulation-start');flyover?.refresh();");
  replaceOnce("if(mode==='market')nightMarket.update(dt,now,camera,actor.model.position);","frameStage('first-entry-simulation-end');if(mode==='market')nightMarket.update(dt,now,camera,actor.model.position);");
  replaceOnce('positionESTPlayButton();if(!frameGate.ready())return;renderer.setViewport(0,0,viewport.width,viewport.height);renderer.setScissorTest(false);renderer.clear();',"frameStage('first-entry-camera-ui-end');positionESTPlayButton();if(!frameGate.ready())return;renderer.setViewport(0,0,viewport.width,viewport.height);renderer.setScissorTest(false);frameStage('first-entry-clear-start');renderer.clear();frameStage('first-entry-clear-end');");
  replaceOnce('const qualityChanged=applyRenderQuality();',"frameStage('first-entry-quality-start');const qualityChanged=applyRenderQuality();frameStage('first-entry-quality-end');if(frameProbe)window.__firstEntryStages=true;");
  replaceOnce('entryLoad=worlds.loadEntry().then(async()=>{','entryLoad=worlds.loadEntry().then(async()=>{'+mark('path-assets-ready'));
  replaceOnce('entryReady=true;','entryReady=true;'+mark('entry-ready'));
  replaceOnce('renderBackend=rendererName(renderer);','renderBackend=rendererName(renderer);'+"console.info('STARTUP_PHASE '+JSON.stringify({phase:'render-backend',renderer:renderBackend,ms:Math.round(performance.now())}));");
  replaceOnce('lastRenderMs=performance.now()-renderStarted;','lastRenderMs=performance.now()-renderStarted;'+"if((window.__startupRenderSamples=(window.__startupRenderSamples||0)+1)<=8)console.info('STARTUP_PHASE '+JSON.stringify({phase:'render-cost',ms:Math.round(performance.now()),durationMs:Math.round(lastRenderMs),ratio:renderer.getPixelRatio()}));");
  replaceOnce("const environmentModule=environmentReady?null:import('./environment.js?v=entry-environment-20261012');",mark('environment-import-start')+"const environmentModule=environmentReady?null:import('./environment.js?v=entry-environment-20261012').then(module=>{"+mark('environment-import-ready')+"return module;});");
  replaceOnce('await integrateEnvironment(worlds,{entryOnly:true});worlds.phase(phase);',mark('environment-integration-start')+'await integrateEnvironment(worlds,{entryOnly:true});'+mark('environment-integration-ready')+'worlds.phase(phase);'+mark('environment-phase-applied'));
  replaceOnce('const avatarReady=loadProfileKit(copy(active())).then(()=>true,()=>false);','const avatarReady=loadProfileKit(copy(active())).then(()=>{'+mark('avatar-asset-ready')+'return true;},()=>false);');
  replaceOnce('afterFirstPaint().then(()=>waitForPriorityAsset(avatarReady)).then(()=>prepareEntry().catch(()=>{}))','afterFirstPaint().then(()=>{'+mark('first-paint')+'return waitForPriorityAsset(avatarReady);}).then(()=>{'+mark('avatar-priority-released')+'return prepareEntry().catch(()=>{});})');
  await route.fulfill({response,body:source});
 });
 await page.goto('/playable-3d/');await page.locator('#taster-skip').click();
 const state=()=>page.evaluate(()=>JSON.parse(document.querySelector('#diagnostics')?.dataset.state||'{}'));
 await expect.poll(state,{timeout:45000}).toMatchObject({entryReady:true,avatarBody:'antonio',surfaceDetailFailed:true});
 expect((await state()).surfaceDetailPending).toBeGreaterThan(0);await expect(page.locator('#campus-progress')).toBeVisible();
 await page.locator('#campus-retry').click();await expect.poll(state,{timeout:30000}).toMatchObject({surfaceDetailPending:0,surfaceDetailFailed:false,campusReady:false});
 await expect(page.locator('#campus-progress')).not.toBeVisible();await expect(page.locator('#campus-minimap')).toBeVisible();
 expect(grassRequests).toBe(2);expect(errors).toEqual([]);await page.screenshot({path:info.outputPath('grass-recovered.png')});
});
