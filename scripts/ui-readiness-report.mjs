import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
export function reportUIReadiness(reports){
 const cases=[],errors=[];
 function visit(suites){for(const suite of suites){for(const spec of suite.specs||[]){if(!spec.file?.endsWith('market-stats.spec.js'))continue;for(const test of spec.tests||[]){const result=test.results?.at(-1),attachment=result?.attachments?.find(a=>a.name==='ui-readiness-observation');let observation;
  try{if(attachment)observation=JSON.parse(Buffer.from(attachment.body,'base64').toString());}catch{errors.push('Invalid observation: '+spec.title);}
  if(!observation){errors.push('Missing observation: '+spec.title);cases.push({title:spec.title,readiness:'unreported',functional:'unreported',passed:false});continue;}
  const stages=observation.stages,ready=stages.readiness.status==='passed',content=stages.content.status==='passed',functional=stages.functional.status==='passed';
  if(functional&&(!ready||!content))errors.push('Functional result cannot clear failed readiness/content: '+spec.title);
  cases.push({title:spec.title,readiness:stages.readiness.status,content:stages.content.status,functional:stages.functional.status,passed:test.status==='expected'&&ready&&content&&functional,navigationToReadyMs:stages.readiness.navigationToReadyMs??null,requestToDOMContentMs:stages.content.requestToDOMContentMs??null,renderer:observation.runtime?.renderer??null,startupPerformanceQualified:false,softwareStartupFixed:false});
 }}visit(suite.suites||[]);}}
 for(const report of reports)visit(report.suites||[]);
 return {scope:'Stats functional journeys; readiness, first DOM content and money actions reported separately',observed:cases.length,functionalPassed:cases.filter(c=>c.passed).length,readinessFailed:cases.filter(c=>c.readiness==='failed').length,contentFailed:cases.filter(c=>c.content==='failed').length,functionalFailed:cases.filter(c=>c.functional==='failed').length,unreported:cases.filter(c=>c.readiness==='unreported').length,complete:cases.length>0&&!errors.length&&cases.every(c=>c.passed),startupPerformanceQualified:false,softwareStartupFixed:false,softwareWaitingAcceptanceMs:null,errors,cases};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){const [output,...files]=process.argv.slice(2);const result=reportUIReadiness(files.map(f=>JSON.parse(fs.readFileSync(f))));fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result,null,2));if(!result.complete)process.exitCode=1;}
