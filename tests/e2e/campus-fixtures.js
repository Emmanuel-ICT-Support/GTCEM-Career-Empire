import {test as base,expect} from '@playwright/test';

// Explicit ANGLE software backend on CI; macOS retains its hardware backend.
// Only the trusted local test server is opened by these campus scenarios.
export const test=base.extend({
  launchOptions: async ({},use)=>use({args:process.platform==='darwin'
    ? ['--use-angle=metal']
    : ['--use-gl=angle','--use-angle=swiftshader']}),
  campusDiagnostics: [async ({page},use,testInfo)=>{
    await use();
    if(!process.env.CI)return;
    try{
      const evidence=await Promise.race([
        page.evaluate(()=>{
          const canvas=document.querySelector('#scene'),gl=canvas?.getContext('webgl2');
          const info=gl?.getExtension('WEBGL_debug_renderer_info');
          return {url:location.pathname,renderer:info?gl.getParameter(info.UNMASKED_RENDERER_WEBGL):null,
            state:document.querySelector('#diagnostics')?.dataset.state,
            loading:document.querySelector('#loading-message')?.textContent};
        }),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error('Diagnostics page response timed out')),5000))
      ]);
      console.log('Campus browser evidence',JSON.stringify({test:testInfo.title,...evidence}));
    }catch(error){console.log('Campus browser evidence unavailable:',error.message);}
  },{auto:true}]
});
export {expect};
