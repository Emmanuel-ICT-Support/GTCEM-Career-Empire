import {test,expect} from 'vitest';
import {observeStartupGate} from '../e2e/startup-cost-hooks.js';
test('startup observation follows actual public gate transitions without extra calls',()=>{
 const events=[],calls=[];let complete=false,done=false;
 const gate={submittedFrame:0,completedFrame:0,submitted(present){calls.push(['submitted',present]);this.submittedFrame++;},ready(){calls.push(['ready']);if(complete)this.completedFrame=this.submittedFrame;return complete;},readyForDraw(){calls.push(['draw']);if(complete)this.completedFrame=this.submittedFrame;return false;}};
 observeStartupGate(gate,(...args)=>events.push(args),()=>done,()=>({cpuMs:7}));gate.submitted(false);expect(gate.ready()).toBe(false);expect(events).toEqual([['canvas-submit',{frame:1,cpuMs:7}]]);
 complete=true;expect(gate.readyForDraw()).toBe(false);gate.ready();expect(events[1]).toEqual(['gpu-complete',{frame:1}]);expect(events).toHaveLength(2);expect(calls).toEqual([['submitted',false],['ready'],['draw'],['ready']]);
 done=true;gate.submitted();gate.ready();expect(events).toHaveLength(2);
});
