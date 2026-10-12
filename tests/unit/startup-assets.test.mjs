import {test,expect,vi} from 'vitest';
import {waitForPriorityAsset,withAssetDeadline} from '../../playable-3d/startup-assets.mjs';
test('selected character receives a bounded head start; success and failure release the queue',async()=>{
 vi.useFakeTimers();try{expect(await waitForPriorityAsset(Promise.resolve(true))).toBe(true);expect(await waitForPriorityAsset(Promise.reject(new Error('offline')))).toBe(false);const stalled=waitForPriorityAsset(new Promise(()=>{}));await vi.advanceTimersByTimeAsync(8000);expect(await stalled).toBe(false);expect(vi.getTimerCount()).toBe(0);}finally{vi.useRealTimers();}
});
test('stalled detail times out without cancelling its eventual exact artwork hydration',async()=>{
 vi.useFakeTimers();try{let resolve,painted=false;const request=new Promise(r=>resolve=r).then(()=>painted=true);const result=withAssetDeadline(request).catch(e=>e.message);await vi.advanceTimersByTimeAsync(15000);expect(await result).toContain('Retry');expect(painted).toBe(false);resolve();await Promise.resolve();await Promise.resolve();expect(painted).toBe(true);expect(vi.getTimerCount()).toBe(0);}finally{vi.useRealTimers();}
});
test('navigation cancellation clears the deadline while a late import stays handled',async()=>{
 vi.useFakeTimers();try{let resolve;const pending=new Promise(r=>resolve=r),controller=new AbortController();const result=withAssetDeadline(pending,15000,'Market timed out',controller.signal).catch(e=>e.name);controller.abort();expect(await result).toBe('AbortError');expect(vi.getTimerCount()).toBe(0);resolve('late module');await Promise.resolve();}finally{vi.useRealTimers();}
});
