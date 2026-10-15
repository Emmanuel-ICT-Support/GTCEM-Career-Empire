import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const spec=(id,executed=true)=>({id,file:'controls.spec.js',title:id,tests:[{projectId:'chromium',status:'expected',results:executed?[{status:'passed'}]:[]}]});
function check(specs){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ecc-focused-proof-'));
 const inventory={suites:[{specs:[spec('first',false),spec('second',false)]}]};
 const report={suites:[{specs}],errors:[]};
 fs.writeFileSync(path.join(dir,'inventory.json'),JSON.stringify(inventory));fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report));
 const run=spawnSync(process.execPath,['scripts/focused-repair-report.mjs',path.join(dir,'inventory.json'),path.join(dir,'report.json'),path.join(dir,'summary.json')],{encoding:'utf8',env:{...process.env,EXPECTED_CASES:'2'}});
 return {status:run.status,proof:JSON.parse(fs.readFileSync(path.join(dir,'summary.json'),'utf8'))};
}
test('accepts two distinct executed cases',()=>{const r=check([spec('first'),spec('second')]);assert.equal(r.status,0);assert.equal(r.proof.complete,true);assert.equal(r.proof.counts.passed,2);});
test('rejects a missing selected case',()=>{const r=check([spec('first')]);assert.equal(r.status,1);assert.equal(r.proof.exactPartition,false);assert.equal(r.proof.missing.length,1);});
test('rejects a duplicate even when execution count is unchanged',()=>{const r=check([spec('first'),spec('first')]);assert.equal(r.status,1);assert.equal(r.proof.duplicates.length,1);});
test('collection without execution cannot be a passing result',()=>{const r=check([spec('first',false),spec('second',false)]);assert.equal(r.status,1);assert.equal(r.proof.exactPartition,true);assert.equal(r.proof.complete,false);assert.equal(r.proof.counts.notRun,2);});
