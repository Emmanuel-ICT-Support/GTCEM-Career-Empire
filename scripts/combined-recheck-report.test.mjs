import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
function fixture({failure=false,missingShard=false,mapping=false,missingBaseline=false}={}){
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ecc-combined-proof-'));
 const spec=(id,result)=>({id,file:'movement.spec.js',title:id,tests:[{projectId:'chromium',status:result==='failed'?'unexpected':'expected',results:[{status:result}]}]});
 const specs=['a','b','c','d'].map((id,i)=>spec(id,failure&&i===1?'failed':'passed'));
 fs.writeFileSync(path.join(directory,'inventory.json'),JSON.stringify({suites:[{specs}]}));
 const baseline={runId:1,counts:{passed:2,failed:1},tests:['a','b','c'].map((id,i)=>({id:`${id}:chromium:0`,file:'movement.spec.js',title:id,outcome:i===0?'failed':'passed'}))};
 if(mapping){baseline.tests[0].id='old-a:chromium:0';baseline.candidateCaseMappings=[{baselineId:'old-a:chromium:0',candidateId:'a:chromium:0',classification:'explicit test rename',reason:'same requirement, renamed observer'}];}
 if(missingBaseline)baseline.tests.push({id:'removed:chromium:0',title:'removed movement requirement',outcome:'failed'});
 fs.writeFileSync(path.join(directory,'baseline.json'),JSON.stringify(baseline));
 for(let i=1;i<=4;i++){if(missingShard&&i===4)continue;const target=path.join(directory,'evidence',`combined-browser-shard-${i}`);fs.mkdirSync(target,{recursive:true});fs.writeFileSync(path.join(target,'browser-report.json'),JSON.stringify({config:{shard:{current:i,total:4}},suites:[{specs:[specs[i-1]]}],errors:[]}));}
 const output=path.join(directory,'proof.json');const process=spawnSync('node',['scripts/combined-recheck-report.mjs',path.join(directory,'inventory.json'),path.join(directory,'evidence'),path.join(directory,'baseline.json'),output],{cwd:root,env:{...globalThis.process.env,CHECKS_RESULT:'success',BROWSER_RESULT:failure?'failure':'success',COMPATIBILITY_RESULT:'success'},encoding:'utf8'});
 return {status:process.status,proof:JSON.parse(fs.readFileSync(output))};
}
test('full candidate comparison preserves explicit renamed IDs and identifies the new regression case',()=>{const {status,proof}=fixture({mapping:true});assert.equal(status,0);assert.equal(proof.complete,true);assert.equal(proof.comparison.improved.length,1);assert.equal(proof.comparison.improved[0].baselineId,'old-a:chromium:0');assert.equal(proof.comparison.newCases.length,1);});
test('actual movement failure remains a failed/regressed case and fails the aggregate',()=>{const {status,proof}=fixture({failure:true});assert.equal(status,1);assert.equal(proof.counts.failed,1);assert.equal(proof.complete,false);assert.equal(proof.comparison.regressed.length,1);});
test('a missing shard cannot pass or disappear from inventory accounting',()=>{const {status,proof}=fixture({missingShard:true});assert.equal(status,1);assert.equal(proof.exactPartition,false);assert.equal(proof.missing.length,1);});
test('removing an old movement case fails even when the new inventory is internally complete',()=>{const {status,proof}=fixture({missingBaseline:true});assert.equal(status,1);assert.equal(proof.exactPartition,true);assert.equal(proof.complete,false);assert.equal(proof.comparison.missingBaselineCases.length,1);});
