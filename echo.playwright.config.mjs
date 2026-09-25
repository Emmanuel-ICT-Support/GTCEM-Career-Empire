import config from './playwright.config.mjs';
export default {...config,workers:1,webServer:undefined,testMatch:'echo.spec.js',use:{...config.use,baseURL:'http://127.0.0.1:8794'}};
