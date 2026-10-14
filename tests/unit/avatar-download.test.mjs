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
 it('retries a stalled connection once within the overall deadline',async()=>{
  vi.useFakeTimers();let attempts=0;
  const result=downloadAvatar('avatar.glb',{headerTimeoutMs:100,fetchImpl:async(_,options)=>{
   attempts++;if(attempts===1)return new Promise((_,reject)=>options.signal.addEventListener('abort',()=>reject(new Error('stalled'))));
   return {ok:true,arrayBuffer:async()=>new ArrayBuffer(2)};
  }});
  await vi.advanceTimersByTimeAsync(100);expect((await result).byteLength).toBe(2);expect(attempts).toBe(2);expect(vi.getTimerCount()).toBe(0);
 });
 it('bounds transient failures and never loops indefinitely',async()=>{
  let attempts=0;await expect(downloadAvatar('avatar.glb',{fetchImpl:async()=>{attempts++;throw new TypeError('Network unavailable');}})).rejects.toThrow('Network unavailable');expect(attempts).toBe(2);
 });
});
