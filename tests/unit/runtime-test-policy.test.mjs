import {test,expect} from 'vitest';
import {classifyBackend,runtimeObservation} from '../../qa/runtime-test-policy.mjs';
import {reportRuntimeLanes} from '../../scripts/runtime-lane-report.mjs';
const gpu='ANGLE (Apple, ANGLE Metal Renderer: Apple M3)',software='ANGLE (Google, SwiftShader Device LLVM)';
test('software identification takes precedence and generic WebGL is not GPU proof',()=>{
 for(const name of [software,'llvmpipe','softpipe','software rasterizer','Apple Software Renderer','lavapipe','swrast'])expect(classifyBackend(name)).toBe('software-compatibility');
 for(const name of [gpu,'Intel Iris','NVIDIA RTX','AMD Radeon','Adreno 640','Mali G76'])expect(classifyBackend(name)).toBe('gpu-performance');
 for(const name of ['','WebKit WebGL','ANGLE unknown'])expect(classifyBackend(name)).toBe('unverified');
});
test('accelerated startup keeps strict eight seconds and rejects missing metrics',()=>{
 expect(runtimeObservation({renderer:gpu,handoverMs:7999}).gpuPerformance.result).toBe('passed');
 expect(runtimeObservation({renderer:gpu,handoverMs:8000}).gpuPerformance.result).toBe('failed');
 expect(runtimeObservation({renderer:gpu}).gpuPerformance.evaluated).toBe(false);
});
test('software 24 seconds is measured without an invented performance or waiting acceptance',()=>{
 const r=runtimeObservation({renderer:software,handoverMs:24000,expectedLane:'software-compatibility'});
 expect(r.gpuPerformance).toMatchObject({targetMs:8000,evaluated:false,result:'not-applicable'});
 expect(r.softwareWaitingTimeAcceptance.targetMs).toBeNull();expect(r.softwareStartupFixed).toBe(false);expect(r.schoolDeviceValidation).toBe('outstanding');
});
test('a requested GPU lane cannot silently use software or an unidentified renderer',()=>{
 for(const renderer of [software,'WebKit WebGL'])expect(runtimeObservation({renderer,handoverMs:1000,expectedLane:'gpu-performance'}).backendMatches).toBe(false);
});
function report(lane,renderer,ms,id='startup',status='passed'){
 const observation=runtimeObservation({renderer,handoverMs:ms,expectedLane:lane});
 return {config:{metadata:{runtimeLane:lane}},suites:[{specs:[{id,title:id,tests:[{projectId:'chromium',status:status==='passed'?'expected':'unexpected',results:[{status,attachments:[{name:'runtime-lane-observation',body:Buffer.from(JSON.stringify(observation)).toString('base64')}]}]}]}]}]};
}
test('lane aggregation distinguishes executions from unique logical coverage',()=>{
 const r=reportRuntimeLanes([report('gpu-performance',gpu,1900),report('software-compatibility',software,24000)]);
 expect(r).toMatchObject({executions:2,uniqueLogicalCases:1,complete:true,gpuPerformance:{observed:1,passed:1}});
 expect(r.softwareCompatibility.handoverMeasurementsMs).toEqual([24000]);expect(r.softwareCompatibility.waitingTimeAcceptance.targetMs).toBeNull();
});
test('same-lane repeated evidence cannot inflate coverage',()=>{const a=report('gpu-performance',gpu,1900);expect(reportRuntimeLanes([a,a]).complete).toBe(false);});
test('functional failures and absent backend evidence remain failures',()=>{
 expect(reportRuntimeLanes([report('software-compatibility',software,24000,'startup','failed')]).complete).toBe(false);
 const a=report('gpu-performance',gpu,1900);a.suites[0].specs[0].tests[0].results[0].attachments=[];expect(reportRuntimeLanes([a]).complete).toBe(false);
});
test('aggregation recalculates backend policy instead of trusting a GPU label',()=>{
 const a=report('gpu-performance',software,1900);expect(reportRuntimeLanes([a]).gpuPerformance.observed).toBe(0);expect(reportRuntimeLanes([a]).complete).toBe(false);
});
test('an expected test failure does not count as functional compatibility success',()=>{
 const a=report('software-compatibility',software,24000,'startup','failed');a.suites[0].specs[0].tests[0].status='expected';expect(reportRuntimeLanes([a]).functionalCounts.failed).toBe(1);expect(reportRuntimeLanes([a]).complete).toBe(false);
});
test('an attachment cannot downgrade the configured GPU lane to automatic detection',()=>{
 const a=report('gpu-performance',software,1900);a.suites[0].specs[0].tests[0].results[0].attachments[0].body=Buffer.from(JSON.stringify(runtimeObservation({renderer:software,handoverMs:1900,expectedLane:'auto'}))).toString('base64');expect(reportRuntimeLanes([a]).complete).toBe(false);
});
