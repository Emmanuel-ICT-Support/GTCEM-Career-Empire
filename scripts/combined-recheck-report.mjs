import fs from 'node:fs';
import path from 'node:path';
import {prove} from './ci-shard-proof.mjs';
const [inventoryFile,evidenceRoot,baselineFile,output]=process.argv.slice(2);
const read=file=>{try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch(error){return {errors:[{message:`Unreadable ${file}: ${error.message}`}],suites:[]};}};
const reports=Array.from({length:4},(_,i)=>read(path.join(evidenceRoot,`combined-browser-shard-${i+1}`,'browser-report.json')));
const proof=prove(read(inventoryFile),reports);
for(const [name,result]of [['checks',process.env.CHECKS_RESULT],['browser',process.env.BROWSER_RESULT],['softwareCompatibility',process.env.COMPATIBILITY_RESULT]])if(result&&result!=='success'){proof.errors.push(`${name} job result: ${result}`);proof.complete=false;}
const baseline=read(baselineFile),baselineTests=Array.isArray(baseline.tests)?baseline.tests:[],before=new Map(baselineTests.map(test=>[test.id,test])),after=new Map(proof.shards.flatMap(shard=>shard.tests).map(test=>[test.id,test]));
const mappings=new Map((baseline.candidateCaseMappings||[]).map(row=>[row.baselineId,row]));
const correspondingIds=new Set([...before.keys()].map(id=>mappings.get(id)?.candidateId||id));
if(!baselineTests.length||before.size!==baselineTests.length||correspondingIds.size!==before.size){proof.errors.push('Missing, duplicate or ambiguously mapped baseline cases');proof.complete=false;}
const comparison={baselineRun:baseline.runId,baselineCounts:baseline.counts,candidateCounts:proof.counts,improved:[],regressed:[],unchangedPassed:[],unchangedFailed:[],otherTransitions:[],newCases:[],missingBaselineCases:[]};
for(const [id,old]of before){const mapping=mappings.get(id),current=after.get(mapping?.candidateId||id);if(!current){comparison.missingBaselineCases.push(old);continue;}const row={...current,baselineId:id,baselineTitle:old.title,before:old.outcome,after:current.outcome,...(mapping?{mappingReason:mapping.reason,classification:mapping.classification}:{})};if(old.outcome==='failed'&&current.outcome==='passed')comparison.improved.push(row);else if(old.outcome==='passed'&&current.outcome==='failed')comparison.regressed.push(row);else if(old.outcome==='passed'&&current.outcome==='passed')comparison.unchangedPassed.push(row);else if(old.outcome==='failed'&&current.outcome==='failed')comparison.unchangedFailed.push(row);else comparison.otherTransitions.push(row);}
for(const [id,current]of after)if(!correspondingIds.has(id))comparison.newCases.push(current);
if(comparison.missingBaselineCases.length){proof.errors.push(`${comparison.missingBaselineCases.length} missing baseline cases`);proof.complete=false;}
comparison.explicitCaseMappings=baseline.candidateCaseMappings||[];
const result={scope:'Complete combined candidate recheck; all primary cases partitioned once across four shards',...proof,comparison,qualification:{gpuPerformance:'Requires actual accelerated evidence; hosted CPU cannot certify it',softwareStartupFixed:false,schoolDeviceValidation:'outstanding',openingPasscodeIncluded:false,liveDeploymentPerformed:false}};
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
const summary={expected:proof.expected,reported:proof.reported,exactPartition:proof.exactPartition,complete:proof.complete,counts:proof.counts,baselineCounts:baseline.counts,improved:comparison.improved.length,regressed:comparison.regressed.length,newCases:comparison.newCases.length,missingBaselineCases:comparison.missingBaselineCases.length,errors:proof.errors};console.log(JSON.stringify(summary,null,2));
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,`### Combined recheck\n\n\`${JSON.stringify(summary)}\`\n\nCPU functional outcomes do not certify accelerated startup or school devices.\n`);
if(!proof.complete||comparison.missingBaselineCases.length)process.exitCode=1;
