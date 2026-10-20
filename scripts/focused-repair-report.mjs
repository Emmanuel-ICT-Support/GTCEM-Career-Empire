import fs from 'node:fs';
import path from 'node:path';
import {cases} from './ci-shard-proof.mjs';

const [inventoryPath,reportPath,outputPath]=process.argv.slice(2);
const inventory=JSON.parse(fs.readFileSync(inventoryPath,'utf8'));
const report=JSON.parse(fs.readFileSync(reportPath,'utf8'));
const expected=cases(inventory),actual=cases(report),wanted=new Set(expected.map(row=>row.id));
const seen=new Map();for(const row of actual)seen.set(row.id,(seen.get(row.id)||0)+1);
const missing=[...wanted].filter(id=>!seen.has(id)),unexpected=[...seen.keys()].filter(id=>!wanted.has(id));
const duplicates=[...seen].filter(([,count])=>count!==1).map(([id])=>id);
const counts={passed:0,failed:0,skipped:0,interrupted:0,flaky:0,notRun:0};
for(const row of actual)counts[row.outcome]++;
const observations=[];
function compact(state){return state&&{mode:state.mode,entryReady:state.entryReady,campusReady:state.campusReady,marketOpening:state.marketOpening,renderedFrames:state.renderedFrames,renderBackend:state.renderBackend,avatarFallback:state.avatarFallback,position:state.position,market:state.market&&{wallet:state.market.wallet,paid:state.market.paid,officeFlow:state.market.officeFlow},exploration:state.exploration&&{statsOpen:state.exploration.statsOpen,market:state.exploration.market&&{wallet:state.exploration.market.wallet,savings:state.exploration.market.savings}}};}
function visit(suite){
 for(const spec of suite.specs||[])for(const test of spec.tests||[])for(const result of test.results||[]){
  for(const attachment of result.attachments||[]){
   if(!attachment.body||!['admin-initial-state-observation','admin-reentry-observation','actual-world-draws','movement-timing-observation'].includes(attachment.name))continue;
   let body;try{body=JSON.parse(Buffer.from(attachment.body,'base64').toString('utf8'));}catch{continue;}
   observations.push({file:spec.file,title:spec.title,attachment:attachment.name,...(attachment.name.startsWith('admin-')?{actual:compact(body.actual),published:compact(body.published)}:attachment.name==='actual-world-draws'?{final:body.final&&{...compact(body.final),actual:compact(body.final.actual)},samples:body.observations?.map(row=>({phase:row.phase,actual:compact(row.probe?.actual),published:compact(row.state),diagnosticError:row.diagnosticError}))}:{walk:body.walk,run:body.run,backend:body.evidence?.backend,steps:body.evidence?.steps,inputs:body.evidence?.inputs,resets:body.evidence?.resets})});
  }
 }
 for(const child of suite.suites||[])visit(child);
}
for(const suite of report.suites||[])visit(suite);
const selectedCountMatches=expected.length===Number(process.env.EXPECTED_CASES);
const exactPartition=selectedCountMatches&&wanted.size===expected.length&&!missing.length&&!unexpected.length&&!duplicates.length;
const complete=exactPartition&&!report.errors?.length&&Object.entries(counts).every(([key,count])=>key==='passed'||count===0);
const result={headSha:process.env.GITHUB_SHA,expected:expected.length,reported:actual.length,selectedCountMatches,exactPartition,complete,counts,missing,unexpected,duplicates,runnerErrors:report.errors||[],cases:actual,observations,limits:{schoolHardwareQualified:false,softwareWaitingAcceptanceMs:null}};
fs.mkdirSync(path.dirname(outputPath),{recursive:true});fs.writeFileSync(outputPath,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));if(!complete)process.exitCode=1;
