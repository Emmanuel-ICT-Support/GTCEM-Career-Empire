import base from './ecc-root-causes.playwright.config.mjs';
import path from 'node:path';
import {createEvidenceDirectory} from '../scripts/evidence-directory.mjs';

// Opt in explicitly; this diagnostic is outside the normal case inventory.
const directory=createEvidenceDirectory('software-workload',{root:path.resolve(process.env.CE_TEST_OUTPUT||'coverage/runs')});
export default {...base,testDir:'.',testMatch:'software-workload.spec.js',workers:1,retries:0,maxFailures:0,timeout:120000,globalTimeout:150000,outputDir:directory+'/browser',reporter:[['line'],['json',{outputFile:directory+'/browser-report.json'}]]};
