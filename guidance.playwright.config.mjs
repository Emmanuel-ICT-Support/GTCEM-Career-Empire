import config from './playwright.config.mjs';
export default {...config,workers:1,timeout:120000,outputDir:'evidence/guidance/browser',webServer:undefined,testMatch:['guidance.spec.js','echo.spec.js','staged-entry.spec.js'],use:{...config.use,baseURL:'http://127.0.0.1:8796'}};
