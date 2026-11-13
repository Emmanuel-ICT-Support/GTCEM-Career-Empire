import { it, expect } from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
function setup({denied=false}={}) {
  let retryListener, frame, timer;
  const status={textContent:''}, retry={hidden:true,disabled:false,addEventListener:(name,fn)=>retryListener=fn};
  const listeners={};const video={readyState:0,paused:true,dataset:{},getAttribute:n=>n==='src'?'./selected.mp4':null,querySelector:()=>null,addEventListener:(n,f)=>listeners[n]=f,play(){if(denied)return Promise.reject(Error('Denied'));this.paused=false;return Promise.resolve();},load(){this.loads=(this.loads||0)+1;this.readyState=0},requestVideoFrameCallback:fn=>frame=fn};
  const shell={isConnected:true,dataset:{},querySelector:s=>s.startsWith('video')?video:s.includes('status')?status:retry};
  const context={window:{},WeakSet,URL,document:{baseURI:'https://game.example/est/'},setTimeout:fn=>{timer=fn;return 1},clearTimeout(){}};
  vm.runInNewContext(fs.readFileSync(new URL('../../modules/est-prep/est-media-ready.js',import.meta.url),'utf8'),context);
  context.window.ESTMediaReady.bind({querySelectorAll:()=>[shell]});
  return {video,shell,status,retry,event:n=>listeners[n](),frame:()=>frame(),timeout:()=>timer(),retryClick:()=>retryListener()};
}
it('keeps the real poster until an actual playable video frame, rather than metadata alone', () => {
  const h=setup();expect(h.shell.dataset.mediaState).toBe('loading');
  h.video.readyState=1;h.event('loadeddata');expect(h.shell.dataset.mediaState).toBe('loading');
  h.video.readyState=2;h.event('playing');expect(h.shell.dataset.mediaState).toBe('loading');
  h.frame();expect(h.shell.dataset.mediaState).toBe('ready');expect(h.retry.hidden).toBe(true);
});
it('offers recoverable failure/retry without replacing the question or progress', () => {
  const h=setup();h.event('error');expect(h.retry.hidden).toBe(false);expect(h.status.textContent).toContain('question and reading remain available');
  h.retryClick();expect(h.video.loads).toBe(1);expect(h.shell.dataset.mediaState).toBe('loading');
  h.video.readyState=2;h.event('playing');h.frame();expect(h.shell.dataset.mediaState).toBe('ready');
});
it('makes delayed and autoplay-denied playback actionable', async () => {
  const h=setup();h.timeout();expect(h.retry.hidden).toBe(false);expect(h.status.textContent).toContain('still loading');
  const denied=setup({denied:true});await Promise.resolve();expect(denied.retry.hidden).toBe(false);expect(denied.status.textContent).toContain('paused or unavailable');
});
