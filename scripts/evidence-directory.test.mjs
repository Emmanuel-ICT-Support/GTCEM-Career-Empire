import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createEvidenceDirectory,coverageArguments,coverageDirectory,assertSafeCoverageOverrides} from './evidence-directory.mjs';

test('fresh run outputs preserve old siblings and never reuse an existing directory',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'ecc-evidence-guard-'));
 const old=path.join(root,'old-evidence.json');fs.writeFileSync(old,'original evidence');
 const first=createEvidenceDirectory('unit-coverage',{root});fs.writeFileSync(path.join(first,'saved.txt'),'first run');
 const second=createEvidenceDirectory('unit-coverage',{root});
 assert.notEqual(first,second);assert.equal(fs.readFileSync(old,'utf8'),'original evidence');assert.equal(fs.readFileSync(path.join(first,'saved.txt'),'utf8'),'first run');
 assert.equal(JSON.parse(fs.readFileSync(path.join(second,'run.json'))).cleanupAllowed,false);
});
test('run kind cannot escape its evidence parent',()=>{
 for(const kind of ['../coverage','/tmp/run','','a/b'])assert.throws(()=>createEvidenceDirectory(kind),/Invalid/);
});
test('coverage CLI cannot redirect or turn on cleanup of earlier evidence',()=>{
 for(const flag of ['--coverage.clean=true','--coverage.reportsDirectory=coverage','--config=old.mjs','-c','--root=..','--outputFile=old.json','--reporter=json'])assert.throws(()=>coverageArguments([flag]),/managed/);
 assert.deepEqual(coverageArguments(['tests/unit/locomotion.test.mjs']),['tests/unit/locomotion.test.mjs']);
});
test('an environment override cannot select an existing report directory',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'ecc-coverage-path-')),run=createEvidenceDirectory('unit-coverage',{root}),directory=path.join(run,'coverage'),previous=process.env.CE_UNIT_COVERAGE_DIRECTORY;
 try{process.env.CE_UNIT_COVERAGE_DIRECTORY=directory;assert.equal(coverageDirectory(),directory);fs.mkdirSync(directory);fs.writeFileSync(path.join(directory,'old.txt'),'keep');assert.throws(()=>coverageDirectory(),/fresh/);assert.equal(fs.readFileSync(path.join(directory,'old.txt'),'utf8'),'keep');}
 finally{if(previous===undefined)delete process.env.CE_UNIT_COVERAGE_DIRECTORY;else process.env.CE_UNIT_COVERAGE_DIRECTORY=previous;}
});
test('direct Vitest calls cannot enable cleanup or replace the output directory',()=>{
 assert.doesNotThrow(()=>assertSafeCoverageOverrides(['run','--coverage']));
 for(const arg of ['--coverage.clean=true','--coverage.cleanOnRerun','--coverage.reportsDirectory=coverage'])assert.throws(()=>assertSafeCoverageOverrides([arg]),/disabled/);
});
