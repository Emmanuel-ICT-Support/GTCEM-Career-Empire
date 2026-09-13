import {test as base,expect} from '@playwright/test';

// Explicit ANGLE software backend on CI; macOS retains its hardware backend.
// Only the trusted local test server is opened by these campus scenarios.
export const test=base.extend({
  // Hosted runners have no GPU. Load all assets and retain gameplay/collision.
  // Cap test raster and draw a tiny foliage sample; architecture/player remain
  // unchanged. This is functional coverage, never foliage/visual acceptance. Full-size visual
  // acceptance is recorded separately on the hardware-rendered playable build.
  softwareRasterBudget: [async ({page},use)=>{
    if(process.env.CI){
      await page.route('**/playable-3d/app.js*',async route=>{
        const response=await route.fetch();let source=await response.text();
        const create="renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});";
        const draw='renderer.render(scene,camera);';
        if(!source.includes(create)||!source.includes(draw))throw new Error('Campus CI raster adapter no longer matches production renderer');
        source=source.replace(create,create+'const nativePixelRatio=renderer.setPixelRatio.bind(renderer);renderer.setPixelRatio=value=>nativePixelRatio(Math.min(value,.25));');
        source=source.replace(draw,"scene.traverse(o=>{if(o.shadow)o.shadow.mapSize.set(256,256);if(o.isMesh&&/^(Courtyard (eucalyptus|native|lomandra)|Approved (tufted-grass|yellow-flower-clump|olive-shrub|mature-eucalypt|small-multistem)|Oval edge eucalypts|imported-trees-)/.test(o.name))o.geometry.setDrawRange(0,24);});"+draw);
        await route.fulfill({response,body:source});
      });
    }
    await use();
  },{auto:true}],
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
