import {defineConfig,devices} from '@playwright/test';
import base from './playwright.config.mjs';

// Release-only Safari engine check; install with npx playwright install webkit.
export default defineConfig({
 ...base,
 testMatch:'wardrobe-release.spec.js',
 outputDir:'coverage/wardrobe-webkit',
 workers:1,
 projects:[{name:'webkit',use:{...devices['Desktop Safari'],viewport:{width:1366,height:768}}}]
});
