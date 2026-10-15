import base from '../playwright.config.mjs';
import path from 'node:path';
export default {...base,testDir:'../tests/e2e',outputDir:path.resolve(process.env.CE_TEST_OUTPUT||'coverage/runtime-lanes/admin-software-followup/browser'),webServer:{...base.webServer,cwd:process.cwd()},projects:base.projects.map(p=>({...p,use:{...p.use,channel:process.env.CE_BROWSER_CHANNEL||'chrome',launchOptions:{args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']}}}))};
