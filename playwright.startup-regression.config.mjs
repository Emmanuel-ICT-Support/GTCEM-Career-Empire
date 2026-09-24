import config from './playwright.config.mjs';
export default {...config, workers:1, use:{...config.use,baseURL:'http://127.0.0.1:4287'},webServer:{...config.webServer,command:'python3 scripts/serve-test-site.py 4287',url:'http://127.0.0.1:4287',reuseExistingServer:false}};
