import config from './playwright.startup-regression.config.mjs';

// System browser validation in the saved cloud environment. Chromium's own
// sandbox stays enabled; the workspace command wrapper may require approval.
const launchOptions={executablePath:process.env.CE_CHROMIUM_PATH||'/usr/bin/chromium',chromiumSandbox:true};
export default {...config,workers:1,webServer:{...config.webServer,stdout:'ignore',stderr:'ignore'},projects:config.projects.map(project=>({...project,use:{...project.use,launchOptions:{...project.use.launchOptions,...launchOptions}}})),reporter:[['line'],['json',{outputFile:'coverage/cloud-browser-results.json'}]]};
