import base from '../playwright.config.mjs';
import path from 'node:path';
import {createEvidenceDirectory} from '../scripts/evidence-directory.mjs';
export default {...base,testDir:'../tests/e2e',outputDir:path.join(createEvidenceDirectory('browser',{root:path.resolve(process.env.CE_TEST_OUTPUT||'coverage/runtime-lanes/admin-software-followup/browser')}),'browser'),webServer:{...base.webServer,cwd:process.cwd()},projects:base.projects.map(p=>({...p,use:{...p.use,channel:process.env.CE_BROWSER_CHANNEL||'chrome',launchOptions:{args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']}}}))};
