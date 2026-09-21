import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'tests/e2e',testMatch:'hair-shoes.spec.js',workers:1,timeout:120000,
 outputDir:process.env.CE_HAIR_EVIDENCE||'coverage/hair-shoes',webServer:process.env.CE_WARDROBE_URL?undefined:{command:'python3 scripts/serve-test-site.py 8785',url:'http://127.0.0.1:8785',reuseExistingServer:!process.env.CI},use:{baseURL:'http://127.0.0.1:8785',trace:'off',screenshot:'only-on-failure'},
 projects:[{name:'chromium',use:{...devices['Desktop Chrome'],viewport:{width:1366,height:900},launchOptions:{args:['--use-angle=metal']}}},{name:'webkit',use:{...devices['Desktop Safari'],viewport:{width:1366,height:900}}}]
});
