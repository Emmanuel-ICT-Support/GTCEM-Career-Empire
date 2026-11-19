// One pending destination, not another navigation or progression system.
// An in-flight task keeps its lease; a new request replaces only queued work.
const targets={market:{x:43,z:-22,radius:18},oval:{x:-4,z:-51,radius:22},studio:{x:-13.25,z:5,radius:10}};
export function createDestinationPreparation({settleMs=1000,explicitMs=30000,holdMs=5000}={}){
 let explicit,previous,candidate,held,selected=null,running=null,serial=0;const events=[];
 const note=(event,id,now,extra={})=>{events.push({event,id,at:Math.round(now),...extra});if(events.length>24)events.shift();};
 function request(id,now){explicit={id,until:now+explicitMs};selected=id;candidate=null;note('requested',id,now);}
 function select({now,position,mode='town',legacy=null}){
  if(!['town','market'].includes(mode)){previous=null;selected=null;return null;}
  if(mode==='market'){selected='market';return selected;}
  if(explicit&&now<explicit.until){selected=explicit.id;previous=position?{...position}:null;return selected;}explicit=null;
  let approaching=null;
  if(position&&previous&&Math.hypot(position.x-previous.x,position.z-previous.z)>.08){
   const ranked=Object.entries(targets).map(([id,t])=>({id,d:Math.hypot(position.x-t.x,position.z-t.z),before:Math.hypot(previous.x-t.x,previous.z-t.z),radius:t.radius})).filter(t=>t.d<t.radius&&t.before-t.d>.06).sort((a,b)=>a.d/a.radius-b.d/b.radius);
   approaching=ranked[0]?.id||null;
   // A clear near-door approach is already stronger evidence than another
   // sample after the player has stopped at its collision boundary.
   if(ranked[0]&&ranked[0].before-ranked[0].d>=1.5&&ranked[0].d<ranked[0].radius*.5)held={id:approaching,until:now+holdMs};
  }
  previous=position?{...position}:null;
  if(approaching){if(candidate?.id!==approaching)candidate={id:approaching,since:now};else if(now-candidate.since>=settleMs){held={id:approaching,until:now+holdMs};}}
  else if(!held||now>=held.until)candidate=null;
  selected=held&&now<held.until?held.id:legacy;return selected;
 }
 function begin(id,now){if(running)return null;const lease={id,token:++serial,started:now};running=lease;note('started',id,now);return lease;}
 function finish(lease,now,ok){if(running?.token!==lease?.token)return;note('settled',lease.id,now,{ms:Math.max(0,Math.round(now-lease.started)),ok:Boolean(ok)});running=null;}
 return {request,select,begin,finish,isCurrent:id=>selected===id,snapshot:()=>({selected,running:running?.id||null,events:events.map(e=>({...e}))})};
}

// These existing maps are shared by the outdoor campus and Sunday Markets.
// Keep their original artwork; only unrelated maps wait behind Market entry.
export const isMarketSurface=url=>/\/(?:grass-ecc-campus-v1-lossless\.webp|sandstone-(?:diffuse|normal|arm)\.jpg|stone-surface-(?:diffuse|normal|arm)\.webp)(?:[?#].*)?$/.test(url);
