import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export function requireMetal(renderer,platform=process.platform){
 if(platform!=='darwin'||!/ANGLE Metal Renderer: Apple /.test(renderer)||/SwiftShader|llvmpipe|lavapipe|software/i.test(renderer))throw new Error('Accelerated qualification requires a verified Apple Metal WebGL renderer: '+renderer);
 return {renderer,classification:/Paravirtual/.test(renderer)?'virtual-apple-metal-reported':'apple-metal-reported',physicalDeviceQualification:false,schoolDeviceQualification:'outstanding'};
}
async function main(){
 const {chromium}=await import('@playwright/test');
 const {default:config}=await import('../playwright.config.mjs');
 const project=config.projects.find(project=>project.name==='chromium');
 const {launchOptions,channel}=project.use;
 const browser=await chromium.launch({...launchOptions,channel});
 try{
  const page=await browser.newPage();
  const renderer=await page.evaluate(()=>{
   const gl=document.createElement('canvas').getContext('webgl2');
   if(!gl)throw new Error('WebGL2 unavailable');
   const debug=gl.getExtension('WEBGL_debug_renderer_info');
   if(!debug)throw new Error('Unmasked renderer unavailable');
   return gl.getParameter(debug.UNMASKED_RENDERER_WEBGL);
  });
  const evidence={...requireMetal(renderer),project:project.name,browser:browser.version(),launchOptions,channel:channel||null,scope:'Actual browser WebGL2 preflight using the same project launch options; explicit software-test overrides remain separate'};
  fs.mkdirSync('coverage',{recursive:true});
  fs.writeFileSync('coverage/accelerated-renderer.json',JSON.stringify(evidence,null,2)+'\n');
  console.log('ACCELERATED_RENDERER',JSON.stringify(evidence));
 }finally{await browser.close();}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)await main();
