import base from './ecc-admin-preview.playwright.config.mjs';
export default {...base,outputDir:'../coverage/full-integration-run-38543515871/admin-software',projects:base.projects.map(p=>({...p,use:{...p.use,launchOptions:{args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']}}}))};
