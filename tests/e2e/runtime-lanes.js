import {expect} from '@playwright/test';
import {runtimeObservation} from '../../qa/runtime-test-policy.mjs';

export async function reportRuntimeObservation(info,measurement){
 const declared=info.annotations.find(a=>a.type==='runtime-lane')?.description;
 const observation=runtimeObservation({...measurement,expectedLane:declared||info.config.metadata?.runtimeLane||'auto'});
 await info.attach('runtime-lane-observation',{body:JSON.stringify(observation,null,2),contentType:'application/json'});
 console.log('RUNTIME_LANE',JSON.stringify(observation));
 return observation;
}
export function assertRuntimeObservation(observation){
 expect(observation.backendMatches,'Requested lane requires its actual WebGL backend').toBe(true);
 if(observation.lane==='gpu-performance'&&observation.performanceRequired)expect(observation.gpuPerformance.evaluated,'Accelerated startup needs a real timing observation').toBe(true);
 if(observation.gpuPerformance.evaluated)expect(observation.handoverMs,'Accelerated startup retains the eight-second target').toBeLessThan(8000);
 if(observation.expectedLane==='gpu-performance')expect(observation.lane,'GPU evidence cannot come from software or an unidentified renderer').toBe('gpu-performance');
}
