import {test,expect} from 'vitest';
import {createGpuFrameGate,createTextureUploadQueue} from '../../playable-3d/frame-budget.mjs';
test('unfinished software GPU frame defers another submission without CPU waiting',()=>{
 let complete=false,deleted=0,submitted=0;const gl={TIMEOUT_EXPIRED:1,ALREADY_SIGNALED:2,SYNC_GPU_COMMANDS_COMPLETE:3,fenceSync:()=>{submitted++;return {};},clientWaitSync:(f,flags,timeout)=>{expect(flags).toBe(0);expect(timeout).toBe(0);return complete?2:1;},deleteSync:()=>deleted++,flush(){}};
 const gate=createGpuFrameGate({getContext:()=>gl},true);expect(gate.ready()).toBe(true);gate.submitted();for(let i=0;i<5;i++)expect(gate.ready()).toBe(false);expect(submitted).toBe(1);expect(deleted).toBe(0);complete=true;expect(gate.ready()).toBe(true);expect(deleted).toBe(1);gate.submitted();expect(submitted).toBe(2);
});
test('hardware draw scheduling does not introduce a fence or change rendering availability',()=>{
 const gate=createGpuFrameGate({getContext:()=>({fenceSync:()=>{throw Error('unexpected hardware fence');}})},false);gate.submitted();gate.submitted();expect(gate.ready()).toBe(true);
});
test('decorative hydrations and GPU initialization advance one per frame opportunity',async()=>{
 const waiting=[],events=[];const queue=createTextureUploadQueue({waitForFrame:()=>new Promise(resolve=>waiting.push(resolve)),upload:t=>events.push('upload '+t)});
 const first=queue.schedule(()=>{events.push('hydrate grass');return 'grass';});const second=queue.schedule(()=>{events.push('hydrate wall');return 'wall';});await Promise.resolve();expect(events).toEqual([]);expect(waiting).toHaveLength(1);
 waiting.shift()();await first;await Promise.resolve();expect(events).toEqual(['hydrate grass','upload grass']);expect(waiting).toHaveLength(1);
 waiting.shift()();await second;expect(events).toEqual(['hydrate grass','upload grass','hydrate wall','upload wall']);
});
test('an upload failure does not strand later original artwork',async()=>{
 const events=[];const queue=createTextureUploadQueue({waitForFrame:async()=>{},upload:t=>{if(t==='bad')throw Error('upload failed');events.push(t);}});
 await expect(queue.schedule(()=> 'bad')).rejects.toThrow('upload failed');await queue.schedule(()=> 'grass');expect(events).toEqual(['grass']);
});
test('grass recovery overtakes queued building decoration without duplicating uploads',async()=>{
 const waiting=[],events=[];const queue=createTextureUploadQueue({waitForFrame:()=>new Promise(resolve=>waiting.push(resolve)),upload:t=>events.push(t)});
 const first=queue.schedule(()=> 'current-wall');const wall=queue.schedule(()=> 'queued-wall');const grass=queue.schedule(()=> 'grass',{priority:1});waiting.shift()();await first;waiting.shift()();await grass;expect(events).toEqual(['current-wall','grass']);waiting.shift()();await wall;expect(events).toEqual(['current-wall','grass','queued-wall']);
});
