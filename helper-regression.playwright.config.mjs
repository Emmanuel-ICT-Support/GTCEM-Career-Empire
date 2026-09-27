import config from './playwright.config.mjs';
export default {...config,outputDir:'evidence/helpers/regression',workers:1,webServer:undefined,testMatch:['echo.spec.js','staged-entry.spec.js','deferred-hdr.spec.js','curriculum-loading.spec.js'],use:{...config.use,baseURL:'http://127.0.0.1:8796'}};
