import {test} from 'node:test';
import assert from 'node:assert/strict';
import {proveFocusedWorkflow} from './focused-workflow-proof.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
function sample(){
 const report={suites:[{specs:['startup','stats'].map(id=>({id,tests:[{projectId:'chromium',status:'expected',results:[{status:'passed'}]}]}))}]};
 const lanes={complete:true,executions:2,uniqueLogicalCases:2,softwareCompatibility:{observed:2,counts:{passed:2},waitingTimeAcceptance:{targetMs:null},handoverMeasurementsMs:[24000]},gpuPerformance:{observed:0,status:'not-verified'},schoolDeviceValidation:{status:'outstanding'},observations:[{softwareStartupFixed:false},{softwareStartupFixed:false}]};
 return {report,lanes,units:{success:true,numTotalTests:15,numPassedTests:15,numFailedTests:0}};
}
test('focused proof qualifies exact software execution without a hardware/full-suite claim',()=>{const {report,lanes,units}=sample();assert.equal(proveFocusedWorkflow(report,report,lanes,units).complete,true);});
test('missing and duplicate browser cases remain incomplete',()=>{const {report,lanes,units}=sample();const actual=structuredClone(report);actual.suites[0].specs[1]=actual.suites[0].specs[0];assert.equal(proveFocusedWorkflow(report,actual,lanes,units).complete,false);});
test('invented software deadline and hardware coverage are rejected',()=>{const {report,lanes,units}=sample();lanes.softwareCompatibility.waitingTimeAcceptance.targetMs=60000;lanes.gpuPerformance.observed=1;assert.equal(proveFocusedWorkflow(report,report,lanes,units).complete,false);});
test('unit failures and fabricated school acceptance are rejected',()=>{const {report,lanes,units}=sample();units.numFailedTests=1;lanes.schoolDeviceValidation.status='validated';assert.equal(proveFocusedWorkflow(report,report,lanes,units).complete,false);});
test('relative lane-config dependencies are tracked and available in a clean checkout',()=>{
 const visited=new Set();function visit(file){if(visited.has(file))return;visited.add(file);execFileSync('git',['ls-files','--error-unmatch',file],{stdio:'pipe'});const source=fs.readFileSync(file,'utf8');for(const match of source.matchAll(/^import .*?from ['"](\.[^'"]+)['"]/gm))visit(path.normalize(path.join(path.dirname(file),match[1])));}
 for(const file of ['qa/ecc-gpu-performance.playwright.config.mjs','qa/ecc-software-compatibility.playwright.config.mjs','qa/ecc-followup-software.playwright.config.mjs'])visit(file);
});
