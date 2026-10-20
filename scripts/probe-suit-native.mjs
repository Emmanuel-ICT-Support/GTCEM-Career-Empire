// Diagnostic only. No fallback, skip, or browser flags that differ from config.
import fs from 'node:fs';
import {chromium} from '@playwright/test';
import config from '../playwright.config.mjs';
const output='coverage/suit-diagnostic';
fs.mkdirSync(output,{recursive:true});
// Apple documents Paravirtualized Graphics as hardware-accelerated VM graphics.
// This classification permits diagnosis; it is not physical-device or release qualification.
const classifyMetal=value=>{
 const backend=String(value||'');
 if(/swiftshader|llvmpipe|softpipe|software/i.test(backend))return 'rejected-software';
 if(/ANGLE Metal Renderer:\s*Apple M\d/i.test(backend))return 'physical-apple-metal-reported';
 if(/ANGLE Metal Renderer:\s*Apple Paravirtual device(?:,|\))/i.test(backend))return 'virtual-apple-metal-reported';
 return 'unrecognized-or-unavailable';
};
const isAppleMetal=value=>['physical-apple-metal-reported','virtual-apple-metal-reported'].includes(classifyMetal(value));
if(process.argv.includes('--verify-game')){
 const log=fs.readFileSync(`${output}/console.log`,'utf8').replace(/\x1b\[[0-9;]*[A-Za-z]/g,'');
 const records=log.split('\n').filter(line=>line.includes('SUIT_FRAME_TIMING ')).map(line=>{
  const result=JSON.parse(line.slice(line.indexOf('SUIT_FRAME_TIMING ')+'SUIT_FRAME_TIMING '.length));
  const backend=JSON.parse(result.state).renderBackend;
  return {width:result.width,backend,classification:classifyMetal(backend),physicalNativeVerified:false,movingFrames:result.movingFrames};
 });
 fs.writeFileSync(`${output}/game-native-backends.json`,JSON.stringify(records,null,2));
 if(records.length!==2||![1280,390].every(width=>records.some(r=>r.width===width&&isAppleMetal(r.backend))))throw new Error('Metal diagnostic evidence incomplete: need both game runs on recognized Apple Metal, with no software fallback.');
 console.log('Recorded actual Metal game backends (not release qualification)',JSON.stringify(records));
}else{
 const project=config.projects.find(p=>p.name==='chromium');
 if(!project)throw new Error('Chromium project missing');
 const use={...config.use,...project.use};
 const launch={...config.use?.launchOptions,...project.use?.launchOptions};
 if(use.channel!==undefined)launch.channel=use.channel;
 if(use.headless!==undefined)launch.headless=use.headless;
 // Defaults are Playwright Chromium's normal headless defaults, as in the tests.
 const browser=await chromium.launch(launch);
 try{
  const page=await browser.newPage();
  const result=await page.evaluate(()=>{
   const gl=document.createElement('canvas').getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});
   if(!gl)return {backend:null,error:'WebGL2 unavailable'};
   const ext=gl.getExtension('WEBGL_debug_renderer_info');
   return {backend:String(gl.getParameter(ext?ext.UNMASKED_RENDERER_WEBGL:gl.RENDERER)),attributes:gl.getContextAttributes()};
  });
  const evidence={...result,classification:classifyMetal(result.backend),physicalNativeVerified:false,qualification:'diagnostic only; physical GPU and release suitability not verified',platform:process.platform,architecture:process.arch,browser:browser.version(),launch};
  fs.writeFileSync(`${output}/native-capability.json`,JSON.stringify(evidence,null,2));
  console.log('NATIVE_CAPABILITY',JSON.stringify(evidence));
  if(process.platform!=='darwin'||!isAppleMetal(result.backend))throw new Error('Metal diagnostic unavailable: no recognized Apple Metal backend. Stop; do not skip tests and report success.');
 }finally{await browser.close();}
}
