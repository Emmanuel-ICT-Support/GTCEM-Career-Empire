import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reportUIReadiness} from './ui-readiness-report.mjs';
const report=(stages,expected=true,attach=true)=>({suites:[{specs:[{file:'market-stats.spec.js',title:'Stats',tests:[{status:expected?'expected':'unexpected',results:[{attachments:attach?[{name:'ui-readiness-observation',body:Buffer.from(JSON.stringify({stages,runtime:{renderer:'SwiftShader'}})).toString('base64')}]:[]}]}]}]}]});
const good={readiness:{status:'passed',navigationToReadyMs:22942},content:{status:'passed',requestToDOMContentMs:25},functional:{status:'passed'}};
test('a longer passing functional journey cannot qualify slow software startup',()=>{const r=reportUIReadiness([report(good)]);assert.equal(r.functionalPassed,1);assert.equal(r.cases[0].navigationToReadyMs,22942);assert.equal(r.startupPerformanceQualified,false);assert.equal(r.softwareStartupFixed,false);assert.equal(r.softwareWaitingAcceptanceMs,null);});
test('readiness failure stays separate and cannot be cleared by a functional result',()=>{const r=reportUIReadiness([report({...good,readiness:{status:'failed'}})]);assert.equal(r.readinessFailed,1);assert.equal(r.functionalPassed,0);assert.equal(r.complete,false);assert.match(r.errors[0],/cannot clear/);});
test('a missing readiness observation cannot silently pass',()=>{const r=reportUIReadiness([report(good,true,false)]);assert.equal(r.unreported,1);assert.equal(r.complete,false);assert.equal(r.functionalPassed,0);});
