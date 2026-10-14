import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {runtimeObservation} from '../qa/runtime-test-policy.mjs';

export function reportRuntimeLanes(reports){
 const executions=[],observations=[],errors=[],seen=new Set();
 for(const [reportIndex,report] of reports.entries()){
  const requestedLane=report.config?.metadata?.runtimeLane||'auto';
  for(const error of report.errors||[])errors.push(`Runner ${reportIndex}: ${error.message}`);
  function visit(suites){for(const suite of suites){
   for(const spec of suite.specs||[])for(const [index,test] of (spec.tests||[]).entries()){
    const id=`${spec.id}:${test.projectId||test.projectName}:${index}`,result=test.results?.at(-1);
    const outcome=!result?'notRun':result.status==='skipped'?'skipped':result.status==='interrupted'?'interrupted':result.status==='passed'&&test.status==='expected'?'passed':'failed';
    const key=requestedLane+':'+id;if(seen.has(key))errors.push(`Repeated ID within ${requestedLane}: ${id}`);seen.add(key);
    executions.push({id,title:spec.title,requestedLane,outcome});
    let observed=false;
    for(const attachment of result?.attachments||[]){
     if(attachment.name!=='runtime-lane-observation')continue;
     try{
      const body=Buffer.isBuffer(attachment.body)?attachment.body:Buffer.from(attachment.body||'','base64');
      const raw=JSON.parse(body.toString()),declared=test.annotations?.find(a=>a.type==='runtime-lane')?.description;
      const observation=runtimeObservation({...raw,expectedLane:declared||(requestedLane!=='auto'?requestedLane:raw.expectedLane||'auto')});observed=true;
      if(!observation.backendMatches)errors.push(`Backend mismatch: ${id}`);
      observations.push({id,title:spec.title,outcome,...observation});
     }catch(error){errors.push(`Invalid runtime observation for ${id}: ${error.message}`);}
    }
    if(!observed&&requestedLane!=='auto')errors.push(`Actual backend not observed for ${id}`);
   }
   visit(suite.suites||[]);
  }}visit(report.suites||[]);
 }
 const count=items=>Object.fromEntries(['passed','failed','skipped','interrupted','notRun'].map(outcome=>[outcome,items.filter(x=>x.outcome===outcome).length]));
 const gpu=observations.filter(x=>x.gpuPerformance.evaluated),software=observations.filter(x=>x.lane==='software-compatibility');
 const gpuPassed=gpu.filter(x=>x.gpuPerformance.result==='passed').length,gpuFailed=gpu.length-gpuPassed;
 if(gpuFailed)errors.push(`${gpuFailed} accelerated startup observations exceeded eight seconds`);
 const counts=count(executions),complete=executions.length>0&&!errors.length&&!['failed','skipped','interrupted','notRun'].some(k=>counts[k]);
 return {schemaVersion:1,executions:executions.length,uniqueLogicalCases:new Set(executions.map(x=>x.id)).size,functionalCounts:counts,complete,errors,
  lanes:[...new Set(executions.map(x=>x.requestedLane))].map(lane=>({lane,executions:executions.filter(x=>x.requestedLane===lane).length,counts:count(executions.filter(x=>x.requestedLane===lane))})),
  gpuPerformance:{targetMs:8000,observed:gpu.length,passed:gpuPassed,failed:gpuFailed,status:gpu.length?(gpuFailed?'failed':'passed'):'not-verified'},
  softwareCompatibility:{observed:software.length,counts:count(software),handoverMeasurementsMs:software.map(x=>x.handoverMs).filter(Number.isFinite),navigationToReadyMeasurementsMs:software.map(x=>x.navigationToReadyMs).filter(Number.isFinite),waitingTimeAcceptance:{targetMs:null,status:'not-assessed; no numerical acceptance deadline approved'},startupLimitation:'approximately 24-second software handover remains documented; not fixed'},
  schoolDeviceValidation:{status:'outstanding',representativeDevices:[],note:'Mac automation and software rendering do not establish realistic school-device performance'},observations};
}
function inputs(entry){if(fs.statSync(entry).isFile())return [entry];return fs.readdirSync(entry,{withFileTypes:true}).flatMap(item=>item.isDirectory()?inputs(path.join(entry,item.name)):item.name==='browser-report.json'?[path.join(entry,item.name)]:[]);}
function main([output,...entries]){
 if(!output||!entries.length)throw Error('Usage: runtime-lane-report.mjs output.json report.json|evidence-directory [...]');
 const files=entries.flatMap(inputs);const summary=reportRuntimeLanes(files.map(file=>JSON.parse(fs.readFileSync(file,'utf8'))));
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(summary,null,2)+'\n');
 console.log(JSON.stringify({...summary,observations:undefined},null,2));
 if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,`### Runtime lanes\n\nGPU eight-second checks: ${summary.gpuPerformance.status} (${summary.gpuPerformance.observed} observations). Software compatibility: ${JSON.stringify(summary.softwareCompatibility.counts)}. Software waits are measured, with no numerical acceptance deadline. School-device validation: outstanding.\n`);
 if(!summary.complete)process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main(process.argv.slice(2));
