import {defineConfig,devices} from '@playwright/test';
import base from './playwright.config.mjs';

process.env.CE_WARDROBE_URL='https://emmanuel-ict-support.github.io/GTCEM-Career-Empire/playable-3d/?outfit=wardrobe';
export default defineConfig({
 ...base,
 testMatch:'wardrobe-release.spec.js',
 outputDir:'coverage/wardrobe-live',
 webServer:undefined,
 workers:1,
 projects:[
  {name:'live-chromium',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:900}}},
  {name:'live-webkit',use:{...devices['Desktop Safari'],viewport:{width:1366,height:768}}}
 ]
});
