import base from './ecc-admin-preview.playwright.config.mjs';
import path from 'node:path';
const software=process.env.CE_TEST_RENDERER==='software';
const nativeArgs=process.platform==='darwin'?['--use-angle=metal']:[];
export default {...base,
 outputDir:path.resolve(process.env.CE_TEST_OUTPUT||'coverage/broader-targeted-20261014/current'),
 use:{...base.use,baseURL:'http://127.0.0.1:4277'},
 webServer:{...base.webServer,command:'python3 scripts/serve-test-site.py 4277',url:'http://127.0.0.1:4277',reuseExistingServer:false},
 projects:base.projects.map(project=>({...project,use:{...project.use,launchOptions:{args:software?['--use-angle=swiftshader','--enable-unsafe-swiftshader']:nativeArgs}}}))
};
