import {test} from 'node:test';
import assert from 'node:assert/strict';
import {prove} from './ci-shard-proof.mjs';
const report=(ids,shard,status='passed')=>({config:{shard:{current:shard,total:4}},suites:[{specs:ids.map(id=>({id,file:'fixture.spec.js',title:id,tests:[{projectId:'chromium',status:status==='passed'?'expected':'unexpected',results:status==='notRun'?[]:[{status}]}]}))}]});
const inventory=report(['a','b','c','d'],0,'notRun');
test('four unique completed shards prove all expected cases once',()=>{const proof=prove(inventory,['a','b','c','d'].map((id,i)=>report([id],i+1)));assert.equal(proof.complete,true);assert.equal(proof.counts.passed,4);});
test('duplicate and missing cases cannot appear as complete coverage',()=>{const proof=prove(inventory,['a','a','c','d'].map((id,i)=>report([id],i+1)));assert.equal(proof.complete,false);assert.equal(proof.duplicates.length,1);assert.equal(proof.missing.length,1);});
test('collection-only proof never claims execution and execution rejects unrun cases',()=>{const reports=['a','b','c','d'].map((id,i)=>report([id],i+1,'notRun'));assert.equal(prove(inventory,reports,{plan:true}).mode,'collection-only');assert.equal(prove(inventory,reports,{plan:true}).complete,true);assert.equal(prove(inventory,reports).complete,false);});
test('failed, skipped, interrupted and runner errors remain failures',()=>{for(const status of ['failed','skipped','interrupted']){const reports=['a','b','c','d'].map((id,i)=>report([id],i+1));reports[0]=report(['a'],1,status);assert.equal(prove(inventory,reports).complete,false);}const reports=['a','b','c','d'].map((id,i)=>report([id],i+1));reports[0].errors=[{message:'crash'}];assert.equal(prove(inventory,reports).complete,false);});
test('critical stage and four complementary groups cover cases once without duplication',()=>{const full=report(['a','b','c','d','e'],0,'notRun'),critical=report(['a'],0);critical.config.shard=null;const reports=['b','c','d','e'].map((id,i)=>report([id],i+1));assert.equal(prove(full,reports,{critical}).complete,true);reports[0]=report(['a','b'],1);assert.equal(prove(full,reports,{critical}).complete,false);});

function primarySoftwareSample(status='passed'){
 const full=report(['critical','a','b','c','d','software'],0,'notRun');
 const software=report(['software'],0,status);software.config.shard=null;
 software.suites[0].specs[0].title='Stats changes publish while the cached world keeps its honest frame count';
 software.suites[0].specs[0].file='runtime-recovery.spec.js';
 const critical=report(['critical'],0);critical.config.shard=null;
 return {full,software,critical,shards:['a','b','c','d'].map((id,i)=>report([id],i+1))};
}
test('critical, four accelerated shards and one unsharded software case form one exact primary inventory',()=>{
 const {full,software,critical,shards}=primarySoftwareSample();
 const proof=prove(full,shards,{critical,software});
 assert.equal(proof.complete,true);assert.equal(proof.exactPartition,true);assert.equal(proof.counts.passed,6);
});
test('primary software case cannot be absent, duplicated, skipped, failed, flaky or unrun',()=>{
 for(const status of ['passed','failed','skipped','interrupted','notRun','flaky']){
  const {full,software,critical,shards}=primarySoftwareSample(status==='flaky'?'passed':status);
  if(status==='passed')software.suites=[];
  if(status==='flaky')software.suites[0].specs[0].tests[0].status='flaky';
  assert.equal(prove(full,shards,{critical,software}).complete,false,status);
 }
 const {full,software,critical,shards}=primarySoftwareSample();shards[0]=report(['a','software'],1);
 assert.equal(prove(full,shards,{critical,software}).complete,false);
});
test('compatibility report with extra startup case or wrong identity cannot substitute for primary software evidence',()=>{
 const {full,software,critical,shards}=primarySoftwareSample();
 for(const mutate of [r=>r.suites[0].specs.push(report(['a'],0).suites[0].specs[0]),r=>r.config.shard={current:1,total:4},r=>r.suites[0].specs[0].title='different case',r=>r.suites[0].specs[0].tests[0].projectId='different-project',r=>r.errors=[{message:'crash'}]]){
  const changed=structuredClone(software);mutate(changed);assert.equal(prove(full,shards,{critical,software:changed}).complete,false);
 }
});

test('collector requires the dedicated software report and successful job result',async()=>{
 const fs=await import('node:fs'),os=await import('node:os'),path=await import('node:path');
 const {spawnSync}=await import('node:child_process');
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'ce-software-proof-'));
 const {full,software,critical,shards}=primarySoftwareSample();
 const inventoryFile=path.join(root,'inventory.json');fs.writeFileSync(inventoryFile,JSON.stringify(full));
 function save(name,value){const directory=path.join(root,name);fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(path.join(directory,'browser-report.json'),JSON.stringify(value));}
 shards.forEach((r,i)=>save('browser-evidence-shard-'+(i+1),r));save('browser-evidence-critical',critical);save('browser-evidence-software-fixture',software);
 function run(result){const env={...process.env,CHECKS_RESULT:'success',CRITICAL_RESULT:'success',BROWSER_RESULT:'success'};delete env.SOFTWARE_FIXTURE_RESULT;if(result)env.SOFTWARE_FIXTURE_RESULT=result;return spawnSync(process.execPath,['scripts/ci-shard-proof.mjs',inventoryFile,root,path.join(root,'proof.json')],{env,encoding:'utf8'});}
 assert.equal(run('success').status,0);
 for(const result of [undefined,'failure','skipped','cancelled'])assert.equal(run(result).status,1,String(result));
 save('browser-evidence-software-fixture',{errors:[{message:'missing report'}],suites:[]});assert.equal(run('success').status,1);
});
