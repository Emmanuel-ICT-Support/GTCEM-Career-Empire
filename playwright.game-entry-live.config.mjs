import {defineConfig,devices} from '@playwright/test';
import base from './playwright.config.mjs';
process.env.CE_GAME_URL='https://emmanuel-ict-support.github.io/GTCEM-Career-Empire/playable-3d/';
export default defineConfig({...base,testMatch:'game-entry-loading.spec.js',webServer:undefined,outputDir:'coverage/game-entry-live',workers:1,projects:[{name:'game-live-chromium',use:{...devices['Desktop Chrome']}},{name:'game-live-webkit',use:{...devices['Desktop Safari']}}]});
