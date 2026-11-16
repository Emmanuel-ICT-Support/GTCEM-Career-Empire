import {describe,it,expect} from 'vitest';
import {createClassroomGate} from '../../playable-3d/classroom-gate.mjs';
describe('Initiative direct-entry compatibility',()=>{
 it('allows first and repeated requests without opening a document prompt',async()=>{
  const document=new Proxy({}, {get(){throw Error('Direct entry must not create or read a pacing form');}});
  const calls=[];const gate=createClassroomGate({document,onPause:()=>calls.push('pause'),onClose:()=>calls.push('resume')});
  expect(gate.open()).toBe(false);const first=gate.request(),second=gate.request();expect(first).toBe(second);expect(await first).toBe(true);expect(await second).toBe(true);expect(await gate.request()).toBe(true);expect(gate.open()).toBe(false);expect(calls).toEqual(['pause','resume','pause','resume','pause','resume']);
 });
 it('keeps the async boundary so navigation changes can cancel an opening',async()=>{
  const gate=createClassroomGate();let modeRequest=1,opened=false;const captured=modeRequest;const opening=(async()=>{if(!await gate.request()||captured!==modeRequest)return;opened=true;})();modeRequest++;await opening;expect(opened).toBe(false);
 });
});
