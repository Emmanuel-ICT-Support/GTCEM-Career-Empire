import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export function cases(report){
 const found=[];
 function visit(suite){
  for(const spec of suite.specs||[])for(const [index,test] of (spec.tests||[]).entries()){
   const last=test.results?.at(-1);
   const outcome=!last?'notRun':last.status==='skipped'?'skipped':last.status==='interrupted'?'interrupted':test.status==='flaky'?'flaky':test.status==='expected'?'passed':'failed';
   found.push({id:`${spec.id}:${test.projectId||test.projectName}:${index}`,file:spec.file,title:spec.title,outcome});
  }
  for(const child of suite.suites||[])visit(child);
 }
 for(const suite of report.suites||[])visit(suite);
 return found;
}

export function prove(inventory,reports,{plan=false,critical}={}){
 const expected=cases(inventory),ids=new Set(expected.map(test=>test.id)),seen=new Map(),errors=[];
 if(ids.size!==expected.length)errors.push('Duplicate IDs in full inventory');
 if(!ids.size)errors.push('Full inventory is empty');
 const shards=reports.map((report,index)=>{
  const tests=cases(report);
  if(report.config?.shard?.current!==index+1||report.config?.shard?.total!==reports.length)errors.push(`Invalid shard identity ${index+1}`);
  for(const test of tests){seen.set(test.id,(seen.get(test.id)||0)+1);}
  if(report.errors?.length)errors.push(`Shard ${index+1} has ${report.errors.length} runner errors`);
  return {shard:index+1,count:tests.length,tests,runnerErrors:report.errors||[]};
 });
 if(critical){const tests=cases(critical);for(const test of tests)seen.set(test.id,(seen.get(test.id)||0)+1);if(critical.config?.shard)errors.push('Critical report must be unsharded');if(critical.errors?.length)errors.push('Critical runner errors');shards.unshift({shard:'critical',count:tests.length,tests,runnerErrors:critical.errors||[]});}
 const missing=[...ids].filter(id=>!seen.has(id)),unexpected=[...seen.keys()].filter(id=>!ids.has(id)),duplicates=[...seen].filter(([,count])=>count!==1).map(([id])=>id);
 if(missing.length)errors.push(`${missing.length} missing tests`);
 if(unexpected.length)errors.push(`${unexpected.length} unexpected tests`);
 if(duplicates.length)errors.push(`${duplicates.length} duplicate tests`);
 const counts={passed:0,failed:0,skipped:0,interrupted:0,flaky:0,notRun:0};
 for(const shard of shards)for(const test of shard.tests)counts[test.outcome]++;
 const exactPartition=ids.size>0&&ids.size===expected.length&&!missing.length&&!unexpected.length&&!duplicates.length;
 if(!plan)for(const key of ['failed','skipped','interrupted','flaky','notRun'])if(counts[key])errors.push(`${counts[key]} ${key}`);
 return {mode:plan?'collection-only':'executed',expected:expected.length,reported:shards.reduce((sum,s)=>sum+s.count,0),exactPartition,complete:errors.length===0,counts,missing,unexpected,duplicates,errors,shards};
}

function main(args){
 const plan=args[0]==='--plan';if(plan)args=args.slice(1);
 const [inventoryFile,evidenceRoot,output]=args;
 if(!inventoryFile||!evidenceRoot||!output)throw Error('Usage: ci-shard-proof.mjs [--plan] inventory.json evidence-directory output.json');
 const read=file=>{try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch(error){return {errors:[{message:`Missing or unreadable report ${file}: ${error.message}`}],suites:[]};}};
 const reports=[];
 for(let shard=1;shard<=4;shard++)reports.push(read(path.join(evidenceRoot,`browser-evidence-shard-${shard}`,'browser-report.json')));
 const criticalFile=path.join(evidenceRoot,'browser-evidence-critical','browser-report.json');
 const critical=read(criticalFile);
 const proof=prove(read(inventoryFile),reports,{plan,critical});
 if(!plan)for(const [name,result] of [['checks',process.env.CHECKS_RESULT],['critical',process.env.CRITICAL_RESULT],['browser',process.env.BROWSER_RESULT]])if(result&&result!=='success'){proof.errors.push(`${name} job result: ${result}`);proof.complete=false;}
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(proof,null,2)+'\n');
 console.log(JSON.stringify({mode:proof.mode,expected:proof.expected,reported:proof.reported,exactPartition:proof.exactPartition,complete:proof.complete,counts:proof.counts,shards:proof.shards.map(({shard,count})=>({shard,count})),errors:proof.errors},null,2));
 if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,`### Browser count proof\n\n${proof.reported}/${proof.expected} cases; exact partition: ${proof.exactPartition}; complete: ${proof.complete}.\n\n\`${JSON.stringify(proof.counts)}\`\n`);
 if(!proof.complete)process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main(process.argv.slice(2));
