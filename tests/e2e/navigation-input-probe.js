// Bounded, read-only evidence for the unchanged short-hold movement gates.
export async function installNavigationProbe(page){
 await page.route('**/app.js?*',async route=>{
  const response=await route.fetch();let source=await response.text();
  const reset='function resetNavigationInput(){';if(!source.includes(reset))throw Error('Navigation reset probe anchor is missing');
  source=source.replace(reset,reset+"window.__navigationProbeRecord?.('reset',null,new Error().stack?.split('\\n').slice(1,5));");
  source+=String.raw`
window.__navigationProbe={events:[],frameGaps:[]};
window.__navigationProbeRecord=(phase,code=null,stack=null)=>{
 const p=window.__navigationProbe;if(p.events.length>=96)return;
 p.events.push({phase,code,pageMs:performance.now(),keys:[...keys],position:actor?.model?.position.toArray(),canStep:canStepNavigation(),hidden:document.hidden,activeTag:document.activeElement?.tagName,renderedFrames,lastTime,softwareNavigationAt,stack});
};
const observedKeys=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight']);
for(const name of ['keydown','keyup'])window.addEventListener(name,event=>{if(!observedKeys.has(event.code))return;window.__navigationProbeRecord(name,event.code);setTimeout(()=>window.__navigationProbeRecord('after-'+name,event.code),0);},true);
window.addEventListener('blur',()=>window.__navigationProbeRecord('blur'),true);
document.addEventListener('visibilitychange',()=>window.__navigationProbeRecord('visibility'),true);
let previousProbeFrame=null;function observeProbeFrame(now){const p=window.__navigationProbe;if(previousProbeFrame!==null&&now-previousProbeFrame>150&&p.frameGaps.length<32)p.frameGaps.push({pageMs:now,gapMs:now-previousProbeFrame,keys:[...keys]});previousProbeFrame=now;requestAnimationFrame(observeProbeFrame);}requestAnimationFrame(observeProbeFrame);
`;
  await route.fulfill({response,body:source});
 });
}
export async function attachNavigationProbe(page,info){
 try{const evidence=await page.evaluate(()=>window.__navigationProbe||null);if(!evidence)return;await info.attach('navigation-input-probe',{body:JSON.stringify(evidence,null,2),contentType:'application/json'});console.log('NAVIGATION_INPUT_PROBE',JSON.stringify(evidence));}catch(error){console.log('NAVIGATION_INPUT_PROBE unavailable:',error.message);}
}
