import fs from 'node:fs';
import path from 'node:path';
import {cases,prove} from './ci-shard-proof.mjs';
const [inventoryFile,reportFile,outputFile,testedSourceTree=null]=process.argv.slice(2);
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const inventory=read(inventoryFile),report=read(reportFile),baseline=read('qa/combined-baseline-20261015.json');
const proof=prove(inventory,[report]);
const current=new Map(cases(report).map(row=>[row.id,row]));
const mappings=new Map((baseline.candidateCaseMappings||[]).map(row=>[row.baselineId,row]));
const priorEvidence=read('docs/broader-failure-ledger-20261014.json');
const publishedErrors=read('qa/published-failure-errors-20261018.json').failures;
const errors=new Map();
function visit(suite){for(const spec of suite.specs||[])for(const [i,t]of(spec.tests||[]).entries()){const last=t.results?.at(-1);errors.set(`${spec.id}:${t.projectId||t.projectName}:${i}`,last?.errors?.map(e=>e.message)||[]);}for(const child of suite.suites||[])visit(child);}
for(const suite of report.suites||[])visit(suite);
const comparison=baseline.tests.map(before=>{
 const mapping=mappings.get(before.id),after=current.get(mapping?.candidateId||before.id);
 const saved=priorEvidence.entries.find(row=>row.file===before.file&&row.title===before.title);
 return {baselineId:before.id,file:before.file,baselineTitle:before.title,before:before.outcome,after:after?.outcome||'missing',candidateId:after?.id||null,candidateTitle:after?.title||null,mapping:mapping||null,publishedLogErrors:publishedErrors.filter(row=>row.file===before.file&&(row.title===before.title||row.title.endsWith(' › '+before.title))),savedInvestigation:saved?{group:saved.group,notes:saved.notes,status:saved.status}:null,currentErrors:errors.get(after?.id)||[]};
});
const missing=comparison.filter(row=>row.after==='missing');
const result={scope:'Complete local broad run before the saved-tour follow-up; later focused validation is separate',testedSourceTree,...proof,baseline:{run:baseline.runId,sha:baseline.commit,counts:baseline.counts},comparison,historicalFailures:comparison.filter(row=>row.before==='failed'),missingBaselineCases:missing,qualification:{deployed:false,authenticationGrantsChanged:false,realStudentRecordsAccessed:false,physicalDevicesTested:false,schoolCrossDevicePersistenceComplete:false}};
fs.mkdirSync(path.dirname(outputFile),{recursive:true});
fs.writeFileSync(outputFile,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({expected:proof.expected,reported:proof.reported,exactPartition:proof.exactPartition,counts:proof.counts,missingBaseline:missing.length,improved:comparison.filter(r=>r.before==='failed'&&r.after==='passed').length,regressed:comparison.filter(r=>r.before==='passed'&&r.after==='failed').length},null,2));
if(!proof.complete||missing.length)process.exitCode=1;
