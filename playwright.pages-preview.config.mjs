import config from './playwright.cloud-sandbox.config.mjs';
import path from 'node:path';
export default {...config,testDir:'coverage/pages-browser-tests',outputDir:'coverage/pages-browser-evidence',use:{...config.use,baseURL:'http://127.0.0.1:4290'},webServer:{...config.webServer,command:`python3 ${path.resolve('scripts/serve-test-site.py')} 4290`,cwd:path.resolve(process.env.CE_PAGES_ROOT||'coverage/pages-site'),url:'http://127.0.0.1:4290/test-career-empire/',reuseExistingServer:false},reporter:[['line'],['json',{outputFile:'coverage/pages-browser-results.json'}]]};
