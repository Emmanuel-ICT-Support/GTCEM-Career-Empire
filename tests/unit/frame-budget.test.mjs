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
test('a queued upload reserves the completed GPU frame before animation can submit another',async()=>{
 let complete=false,submitted=0;const waiting=[],uploads=[];
 const gl={TIMEOUT_EXPIRED:1,ALREADY_SIGNALED:2,SYNC_GPU_COMMANDS_COMPLETE:3,fenceSync:()=>++submitted,clientWaitSync:()=>complete?2:1,deleteSync(){},flush(){}};
 const gate=createGpuFrameGate({getContext:()=>gl},true);gate.submitted();
 const queue=createTextureUploadQueue({waitForFrame:()=>new Promise(resolve=>waiting.push(resolve)),upload:t=>uploads.push(t)});
 const hydration=queue.schedule(()=> 'original-grass');expect(queue.waitingForFrame).toBe(true);
 complete=true;
 // Animation must yield this opportunity to the upload callback, which runs later.
 if(!queue.waitingForFrame&&gate.ready())gate.submitted();
 expect(submitted).toBe(1);expect(gate.ready()).toBe(true);waiting.shift()();await hydration;
 expect(uploads).toEqual(['original-grass']);expect(queue.waitingForFrame).toBe(false);
 if(!queue.waitingForFrame&&gate.ready())gate.submitted();expect(submitted).toBe(2);
});

test('first-view completion belongs to a real completed submission, never an invalid second draw',()=>{
 let complete=false;const gl={TIMEOUT_EXPIRED:1,SYNC_GPU_COMMANDS_COMPLETE:3,fenceSync:()=>({}),clientWaitSync:()=>complete?2:1,deleteSync(){},flush(){}};
 const gate=createGpuFrameGate({getContext:()=>gl},true);gate.submitted();expect(gate.submittedFrame).toBe(1);expect(gate.completedFrame).toBe(0);
 expect(()=>gate.submitted()).toThrow('preceding frame');expect(gate.submittedFrame).toBe(1);
 complete=true;expect(gate.ready()).toBe(true);expect(gate.completedFrame).toBe(1);
});

test('completed software frames leave browser layout/input ticks before another scene draw',()=>{
 let complete=false;const gl={TIMEOUT_EXPIRED:1,SYNC_GPU_COMMANDS_COMPLETE:3,fenceSync:()=>({}),clientWaitSync:()=>complete?2:1,deleteSync(){},flush(){}};
 const gate=createGpuFrameGate({getContext:()=>gl},true);expect(gate.readyForDraw(0)).toBe(true);gate.submitted();expect(gate.readyForDraw(10)).toBe(false);
 complete=true;expect(gate.readyForDraw(100)).toBe(false);expect(gate.completedFrame).toBe(1);expect(gate.ready()).toBe(true);expect(gate.readyForDraw(147)).toBe(false);expect(gate.readyForDraw(148)).toBe(true);
 gate.submitted();complete=false;expect(gate.readyForDraw(149)).toBe(false);
});
test('hardware input opportunities preserve ordinary draw scheduling',()=>{
 const gate=createGpuFrameGate({getContext:()=>({})},false);gate.submitted();expect(gate.readyForDraw(0)).toBe(true);gate.submitted();expect(gate.readyForDraw(1)).toBe(true);
});
