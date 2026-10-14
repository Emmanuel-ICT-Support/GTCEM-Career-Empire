import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {cases} from './ci-shard-proof.mjs';

export function proveFocusedWorkflow(inventory,report,lanes,units){
 const expected=cases(inventory),actual=cases(report),wanted=new Set(expected.map(x=>x.id)),seen=new Set(),errors=[];
 if(expected.length!==2||wanted.size!==2)errors.push('Focused inventory must contain exactly two unique cases');
 for(const item of actual){if(seen.has(item.id))errors.push('Repeated focused case: '+item.id);seen.add(item.id);if(item.outcome!=='passed')errors.push(item.outcome+': '+item.id);}
 const missing=[...wanted].filter(id=>!seen.has(id)),unexpected=[...seen].filter(id=>!wanted.has(id));
 if(missing.length||unexpected.length||actual.length!==2)errors.push('Focused execution does not exactly match its inventory');
 if(report.errors?.length||inventory.errors?.length)errors.push('Browser runner/collection errors');
 if(!lanes.complete||lanes.executions!==2||lanes.uniqueLogicalCases!==2||lanes.softwareCompatibility?.observed!==2||lanes.softwareCompatibility?.counts?.passed!==2)errors.push('Two verified software functional passes are required');
 if(lanes.gpuPerformance?.observed!==0||lanes.gpuPerformance?.status!=='not-verified')errors.push('CPU workflow must not claim accelerated performance coverage');
 if(lanes.softwareCompatibility?.waitingTimeAcceptance?.targetMs!==null)errors.push('No numerical software waiting acceptance is approved');
 if(lanes.schoolDeviceValidation?.status!=='outstanding'||lanes.observations?.some(x=>x.softwareStartupFixed!==false))errors.push('Software/school validation limitations must remain explicit');
 if(!units.success||units.numTotalTests!==15||units.numPassedTests!==15||units.numFailedTests!==0)errors.push('The fifteen focused policy, quality and saved-handler units must pass');
 return {scope:'focused changed-workflow verification; not a full-suite result',expected:2,reported:actual.length,missing,unexpected,complete:!errors.length,errors,unitsPassed:units.numPassedTests,softwareWaitMeasurementsMs:lanes.softwareCompatibility?.handoverMeasurementsMs||[],gpuPerformance:'not-verified-on-hosted-CPU',schoolDeviceValidation:'outstanding',softwareStartupFixed:false,softwareAcceptedWaitingDeadlineMs:null};
}
function main([inventory,report,lanes,units,output]){
 if(!output)throw Error('Usage: focused-workflow-proof.mjs inventory.json report.json lanes.json units.json output.json');
 const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));const proof=proveFocusedWorkflow(read(inventory),read(report),read(lanes),read(units));
 for(const [name,result] of [['checks',process.env.CHECKS_RESULT],['software-compatibility',process.env.COMPATIBILITY_RESULT]])if(result&&result!=='success'){proof.complete=false;proof.errors.push(`${name} job: ${result}`);}
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof,null,2));
 if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,`### Focused workflow proof\n\nExact execution: ${proof.reported}/${proof.expected}; complete: ${proof.complete}. Fifteen focused units: ${proof.unitsPassed} passed. Software handovers: ${proof.softwareWaitMeasurementsMs.join(', ')} ms, measured only. GPU performance and realistic school-device validation remain outstanding on this hosted CPU run. Software is not fixed and has no approved numerical waiting deadline.\n`);
 if(!proof.complete)process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main(process.argv.slice(2));
