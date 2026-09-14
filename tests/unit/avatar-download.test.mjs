import {describe,it,expect,vi,afterEach} from 'vitest';
import {downloadAvatar} from '../../playable-3d/avatar-download.js';
afterEach(()=>vi.useRealTimers());
describe('avatar download recovery',()=>{
 it('returns the complete body and clears the deadline',async()=>{
  vi.useFakeTimers();const body=new ArrayBuffer(4);
  expect(await downloadAvatar('avatar.glb',{fetchImpl:async()=>({ok:true,arrayBuffer:async()=>body})})).toBe(body);
  expect(vi.getTimerCount()).toBe(0);
 });
 it('aborts a stalled response body and allows a fresh attempt',async()=>{
  vi.useFakeTimers();let signal;
  const pending=downloadAvatar('avatar.glb',{timeoutMs:100,fetchImpl:async(_,options)=>{signal=options.signal;return {ok:true,arrayBuffer:()=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(new Error('aborted'))))};}});
  const rejected=expect(pending).rejects.toThrow('took too long');await vi.advanceTimersByTimeAsync(100);await rejected;expect(signal.aborted).toBe(true);
  expect(await downloadAvatar('avatar.glb',{fetchImpl:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(2)})})).toHaveProperty('byteLength',2);
 });
 it('rejects HTTP errors without leaving a timer',async()=>{
  vi.useFakeTimers();await expect(downloadAvatar('avatar.glb',{fetchImpl:async()=>({ok:false,status:404})})).rejects.toThrow('404');expect(vi.getTimerCount()).toBe(0);
 });
});
