// Optional owned adapter. Original UI owner replaces its 600ms interval when approved.
export function createAdaptivePoller({transport,seat,onState,onError=()=>{},clock=globalThis,minDelay=1000,maxIdleDelay=4000,maxActiveDelay=2000,maxErrorDelay=30000}){
 if(!seat?.id||!seat.token||[minDelay,maxIdleDelay,maxActiveDelay,maxErrorDelay].some(x=>!Number.isFinite(x)||x<1)||maxIdleDelay<minDelay||maxActiveDelay<minDelay||maxErrorDelay<minDelay)throw Error('Valid seat and bounded polling policy required');
 let running=false,visible=true,timer=null,flight=null,version,cache,idle=0,errors=0,generation=0;
 const clear=()=>{if(timer!==null)clock.clearTimeout(timer);timer=null;};
 function schedule(delay){clear();if(running&&visible)timer=clock.setTimeout(tick,delay);}
 function accept(next){if(!Number.isSafeInteger(next?.version)||next.version<0)throw Error('Versioned room response required');if(version!==undefined&&next.version<version)return false;if(next.unchanged){if(!cache||next.version!==version)throw Error('Unchanged response lacks matching prior view');return false;}const changed=version!==next.version;version=next.version;cache=next;if(changed)onState(next);return changed;}
 function delay(){const max=cache&&['lobby','writing','review','territory','resolved'].includes(cache.phase)?maxActiveDelay:maxIdleDelay;return Math.min(max,minDelay*2**Math.min(idle,8));}
 async function tick(){timer=null;if(!running||!visible||flight)return;const request={controller:new AbortController(),generation};flight=request;
  try{const next=await transport.match(seat,null,{knownVersion:version,signal:request.controller.signal});if(generation!==request.generation||!running||!visible)return;idle=accept(next)?0:idle+1;errors=0;}
  catch(error){if(generation!==request.generation||request.controller.signal.aborted)return;errors++;onError(error);}
  finally{if(flight===request){flight=null;if(running&&visible&&generation===request.generation)schedule(errors?Math.min(maxErrorDelay,minDelay*2**Math.min(errors,10)):delay());}}
 }
 function invalidate(){generation++;clear();flight?.controller.abort();flight=null;}
 return {start(){if(running)return;running=true;schedule(0);},stop(){running=false;invalidate();},setVisible(value){value=Boolean(value);if(value===visible)return;visible=value;invalidate();if(visible&&running){idle=0;errors=0;schedule(0);}},nudge(){idle=0;errors=0;invalidate();schedule(0);},afterWrite(state){invalidate();accept(state);idle=0;errors=0;schedule(minDelay);},snapshot(){return {running,visible,version,delay:delay(),pending:Boolean(flight)};}};
}
