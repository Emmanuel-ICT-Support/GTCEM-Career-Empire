import base from '../playwright.config.mjs';
import path from 'node:path';
import {createEvidenceDirectory} from '../scripts/evidence-directory.mjs';
const software=process.env.CE_TEST_RENDERER==='software';
const nativeArgs=process.platform==='darwin'?['--use-angle=metal']:[];
const coldArgs=process.env.CE_COLD_SHADERS==='1'?['--disable-gpu-shader-disk-cache']:[];
export default {...base,
 testDir:'../tests/e2e',
 metadata:{...base.metadata,runtimeLane:process.env.CE_RUNTIME_LANE||'auto'},
 outputDir:path.join(createEvidenceDirectory('browser',{root:path.resolve(process.env.CE_TEST_OUTPUT||'coverage/runs')}),'browser'),
 use:{...base.use,baseURL:'http://127.0.0.1:4277'},
 webServer:{...base.webServer,cwd:process.cwd(),command:'python3 scripts/serve-test-site.py 4277',url:'http://127.0.0.1:4277',reuseExistingServer:false},
 projects:base.projects.map(project=>({...project,use:{...project.use,channel:process.env.CE_BROWSER_CHANNEL||'chrome',launchOptions:{args:[...(software?['--use-angle=swiftshader','--enable-unsafe-swiftshader']:nativeArgs),...coldArgs]}}}))
};
