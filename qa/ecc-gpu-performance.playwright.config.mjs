import base from './ecc-root-causes.playwright.config.mjs';
import path from 'node:path';
export default {...base,metadata:{...base.metadata,runtimeLane:'gpu-performance'},
 outputDir:path.resolve(process.env.CE_TEST_OUTPUT||'coverage/runtime-lanes/gpu-performance/browser'),
 testMatch:['**/startup-campus-entry.spec.js','**/startup-costs.spec.js'],
 grep:/video to complete exterior|measure complete campus handover costs cold-skip/,
 projects:base.projects.map(p=>({...p,use:{...p.use,launchOptions:{args:[...(process.platform==='darwin'?['--use-angle=metal']:[]),...(process.env.CE_COLD_SHADERS==='1'?['--disable-gpu-shader-disk-cache']:[])]}}}))
};
