import config from './playwright.config.mjs';
export default {...config,workers:1,timeout:180000,outputDir:'evidence/movement/browser',webServer:undefined,testMatch:['movement.spec.js','student-review.spec.js','helpers.spec.js'],use:{...config.use,trace:'off',baseURL:'http://127.0.0.1:8811'}};
