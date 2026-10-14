import {test as base,expect} from './helper-fixtures.js';

// Native platform rendering; keep full production graphics in these tests.
// Only the trusted local test server is opened by these campus scenarios.
export const test=base.extend({
  launchOptions: async ({browserName,launchOptions},use)=>use({...launchOptions,args:launchOptions.args?.length?launchOptions.args:process.platform==='darwin'&&browserName==='chromium'
    ? ['--use-angle=metal']
    : []}),
  campusDiagnostics: [async ({page},use,testInfo)=>{
    const record=process.env.CI||process.env.CE_RECORD_BACKEND;
    if(record)await page.addInitScript(()=>{window.__campusLongTasks=[];try{new PerformanceObserver(list=>window.__campusLongTasks.push(...list.getEntries().map(e=>({startMs:e.startTime,durationMs:e.duration})))).observe({type:'longtask',buffered:true});}catch{}});
    await use();
    if(!record)return;
    try{
      const evidence=await Promise.race([
        page.evaluate(()=>{
          const canvas=document.querySelector('#scene'),gl=canvas?.getContext('webgl2');
          const info=gl?.getExtension('WEBGL_debug_renderer_info');
          const loading=document.querySelector('#loading');
          return {url:location.href,pageMs:performance.now(),hidden:document.hidden,renderer:info?gl.getParameter(info.UNMASKED_RENDERER_WEBGL):null,
            state:document.querySelector('#diagnostics')?.dataset.state,
            loading:document.querySelector('#loading-message')?.textContent,loadingHidden:loading?.hidden,longTasks:window.__campusLongTasks,
            resources:performance.getEntriesByType('resource').filter(r=>r.name.startsWith(location.origin)).map(r=>({path:new URL(r.name).pathname,startMs:r.startTime,durationMs:r.duration,responseEndMs:r.responseEnd,bytes:r.decodedBodySize}))};
        }),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error('Diagnostics page response timed out')),5000))
      ]);
      console.log('Campus browser evidence',JSON.stringify({test:testInfo.title,...evidence}));
    }catch(error){console.log('Campus browser evidence unavailable:',error.message);}
  },{auto:true}]
});
export {expect};
