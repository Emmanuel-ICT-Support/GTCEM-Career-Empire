import config from './playwright.config.mjs';
export default {...config,outputDir:'evidence/helpers/browser',workers:1,timeout:120000,webServer:undefined,testMatch:'helpers.spec.js',use:{...config.use,baseURL:process.env.HELPER_TEST_URL||'http://127.0.0.1:8796'}};
