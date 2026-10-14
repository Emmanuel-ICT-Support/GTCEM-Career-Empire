import {defineConfig,devices} from '@playwright/test';
import base from './playwright.config.mjs';

export default defineConfig({
 ...base,
 testMatch:['first-play.spec.js','game-entry-loading.spec.js','wardrobe-release.spec.js'],
 outputDir:'coverage/first-play-webkit',
 workers:1,
 projects:[{name:'webkit',use:{...devices['Desktop Safari']}}]
});
