// Test-only response instrumentation. Never imported by the shipped game.
// Exact single-match replacements fail closed if the reviewed source changes.
function once(source, before, after) {
  if (source.split(before).length !== 2) throw new Error(`Suit profile anchor changed: ${before.slice(0, 100)}`);
  return source.replace(before, after);
}
export function transformSuitSource(kind, source) {
  const replace = (before, after) => { source = once(source, before, after); };
  if (kind === 'app') {
    replace('function animate(){', `function animate(){
  const __sp=window.__suitStageProfile, __start=performance.now();let __stage=__start;
  const __mark=name=>{const end=performance.now();__sp.record(name,__stage,end-__stage,{frame:renderedFrames});__stage=end;};
  try {`);
    replace('  orientationTour?.update();flyover?.refresh();', "  __mark('animate.preamble');\n  orientationTour?.update();flyover?.refresh();");
    replace('  updateTeacherLoading();', "  __mark('animate.navigation-world');\n  updateTeacherLoading();");
    replace('  const entryFrameRequired=', "  __mark('animate.ui-camera');\n  const entryFrameRequired=");
    replace('  if(uploadHasPriority||portraitCapturePending||!frameGate.readyForDraw())return;', `  __mark('animate.pre-gate');
  if(uploadHasPriority){__sp.count('skip.upload-priority');return;}
  if(portraitCapturePending){__sp.count('skip.portrait');return;}
  if(!frameGate.readyForDraw()){__sp.count('skip.gate');return;}
  __mark('animate.gate-ready');`);
    replace('  const renderStarted=performance.now();renderer.render(scene,camera);', "  __mark('animate.render-setup');\n  const renderStarted=performance.now();renderer.render(scene,camera);__mark('animate.render-cpu');");
    replace('  publishDiagnostics(now,true);\n}', `  publishDiagnostics(now,true);
  } finally {__mark('animate.tail-or-early-return');__sp.record('animate.total',__start,performance.now()-__start,{frame:renderedFrames});}
}`);
    replace(' softwarePresentation?.present(renderedFrames);', " window.__suitStageProfile.measure('presentation.total',()=>softwarePresentation?.present(renderedFrames),{frame:renderedFrames});");
    replace('renderer.initTexture(texture);frameGate.uploadSubmitted();', "window.__suitStageProfile.measure('texture.upload-cpu',()=>renderer.initTexture(texture));frameGate.uploadSubmitted();");
  } else if (kind === 'gate') {
    replace(' const supported=enabled&&', ' let __submittedAt=0,__polls=0;\n const supported=enabled&&');
    replace('  const status=gl.clientWaitSync(fence,0,0);', "  __polls++;const __pollStart=performance.now();const status=gl.clientWaitSync(fence,0,0);window.__suitStageProfile.record('fence.poll-cpu',__pollStart,performance.now()-__pollStart);if(status===gl.TIMEOUT_EXPIRED)window.__suitStageProfile.count('fence.timeout-poll');");
    replace('  gl.deleteSync(fence);fence=null;', "  window.__suitStageProfile.record('fence.observed-latency',__submittedAt,performance.now()-__submittedAt,{kind:pendingIsFrame?'frame':'upload',frame:submittedFrame,polls:__polls});gl.deleteSync(fence);fence=null;");
    // Both submission paths receive identical observations without extra GPU calls.
    const anchor='fence=gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE,0);gl.flush();';
    if(source.split(anchor).length!==3)throw new Error('Expected exactly two fence submission anchors');
    source=source.split(anchor).join("__submittedAt=performance.now();__polls=0;"+anchor);
    replace('if(completedFrame!==releasedFrame){releasedFrame=completedFrame;nextDrawAt=now+48;return false;}', "if(completedFrame!==releasedFrame){window.__suitStageProfile.count('gate.release-cooldown');releasedFrame=completedFrame;nextDrawAt=now+48;return false;}");
    replace('  return now>=nextDrawAt;', "  if(now<nextDrawAt)window.__suitStageProfile.count('gate.cooldown-poll');return now>=nextDrawAt;");
    replace('const texture=task.hydrate();upload(texture);', "const texture=window.__suitStageProfile.measure('texture.hydrate-cpu',()=>task.hydrate());upload(texture);");
  } else if (kind === 'presentation') {
    replace('  context.drawImage(canvas,0,0);', "  window.__suitStageProfile.measure('presentation.drawImage-cpu',()=>context.drawImage(canvas,0,0),{frame:frameNumber});");
  } else throw new Error(`Unknown profile source: ${kind}`);
  return source;
}
export async function installSuitStageProfile(page) {
  await page.addInitScript(() => {
    const samples=[],totals={},counts={};let dropped=0;
    const record=(name,start,durationMs,detail={})=>{
      const total=totals[name]||(totals[name]={count:0,totalMs:0,maxMs:0});
      total.count++;total.totalMs+=durationMs;total.maxMs=Math.max(total.maxMs,durationMs);
      // Frequent polls retain aggregates only; event samples are bounded.
      if(name==='fence.poll-cpu')return;
      if(samples.length<5000)samples.push({name,start,durationMs,...detail});else dropped++;
    };
    window.__suitStageProfile={record,count:name=>{counts[name]=(counts[name]||0)+1;},
      measure(name,fn,detail){const start=performance.now();try{return fn();}finally{record(name,start,performance.now()-start,detail);}},
      snapshot:()=>({samples,totals,counts,dropped,note:'Nested CPU durations overlap. Fence latency is submission-to-observed-completion, not pure GPU time. Bounded diagnostic overhead applies.'})};
  });
  for(const [kind,file] of [['gate','frame-budget.mjs'],['presentation','software-presentation.mjs']]) {
    await page.route(`**/playable-3d/${file}*`,async route=>{
      const response=await route.fetch();const body=transformSuitSource(kind,await response.text());
      await route.fulfill({response,body});
    });
  }
}
