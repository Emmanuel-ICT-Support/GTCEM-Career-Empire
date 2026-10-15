import base from './ecc-root-causes.playwright.config.mjs';
import path from 'node:path';
export default {...base,metadata:{...base.metadata,runtimeLane:'software-compatibility'},
 outputDir:path.resolve(process.env.CE_TEST_OUTPUT||'coverage/runtime-lanes/software-compatibility/browser'),
 testMatch:['**/startup-costs.spec.js','**/runtime-recovery.spec.js'],
 grep:/measure complete campus handover costs cold-skip|Stats changes publish while the cached world/,
 projects:base.projects.map(p=>({...p,use:{...p.use,channel:process.env.CE_BROWSER_CHANNEL||p.use.channel,launchOptions:{args:['--use-angle=swiftshader','--enable-unsafe-swiftshader',...(process.env.CE_COLD_SHADERS==='1'?['--disable-gpu-shader-disk-cache']:[])]}}}))
};
