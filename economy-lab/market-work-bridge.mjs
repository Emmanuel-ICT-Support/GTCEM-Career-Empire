import {saveWork} from './work-store.mjs?v=my-life-1';
export const MARKET_WORK_ID='practice-sunday-market-first-gig';
const start='--- MARKET SNAPSHOT ',end='--- END MARKET SNAPSHOT ---';
const checksum=text=>{let n=2166136261;for(const c of text)n=Math.imul(n^c.charCodeAt(0),16777619);return (n>>>0).toString(16);};
export function mergeMarketWork(previous,{body,resource},at=new Date().toISOString()){
 if(typeof body!=='string'||body.length>16000||typeof resource!=='string'||!resource.endsWith('/Assets/EST%20Preparation/initiative-one-page-summary.png'))throw Error('Unsupported market record or reference.');
 const item=previous.entries.find(x=>x.id===MARKET_WORK_ID);if(item?.archived)throw Error('Your market record is archived. Restore it in My work before updating it.');
 const old=item?.revisions.at(-1);let retained=old?.body||'MY OWN ADDITIONAL NOTES\nAdd any further thoughts here.\n\n';
 const a=retained.indexOf(start),b=retained.indexOf(end,a);
 if(a>=0&&b>=0){const block=retained.slice(a,b+end.length),line=block.indexOf('\n'),content=block.slice(line+1,-end.length).replace(/\n$/,'');const signature=block.slice(start.length,line).trim();if(checksum(content)===signature)retained=retained.slice(0,a)+retained.slice(b+end.length);else retained=retained.slice(0,a)+'RETAINED EDITS TO AN EARLIER MARKET SNAPSHOT\n'+block.replace(start,'Earlier snapshot ').replace(end,'End earlier snapshot')+retained.slice(b+end.length);}
 const content=body+'\n\nREFERENCE RESOURCE\nEST Initiative one-pager: '+resource+'\nNotice / Think / Act / Support / Review. Optional support, not assessment completion.';
 return saveWork(previous,{id:MARKET_WORK_ID,title:old?.title||'My first gig · Sunday Markets',body:retained.trimEnd()+'\n\n'+start+checksum(content)+'\n'+content+'\n'+end,kind:old?.kind||'reflection',status:old?.status||'draft',at});
}
export function connectMarketWork({review,store,lock,canLeave,renderList,loadItem,notify}){
 if(new URLSearchParams(location.search).get('market-import')!=='1'||!window.opener)return;
 const source=window.opener,origin=location.origin==='http://127.0.0.1:8792'?'http://127.0.0.1:8793':location.origin;let receiving=false,done=false;
 window.addEventListener('message',async e=>{if(e.source!==source||e.origin!==origin||e.data?.type!=='ce-market-work'||done||receiving)return;
 const data=e.data;const expectedResource=new URL('../Assets/EST%20Preparation/initiative-one-page-summary.png',location.href);if(origin==='http://127.0.0.1:8793')expectedResource.port='8793';if(data.resource!==expectedResource.href)return;if(typeof data.token!=='string'||data.token.length>100)return;
 receiving=true;
 try{if(data.review!==review)throw Error('Review and saved work must stay separate.');if(!canLeave())throw Error('Save your current My work edits before sending this record again.');await lock(()=>store.commit(s=>mergeMarketWork(s,data)));renderList();loadItem(MARKET_WORK_ID);document.querySelector('[data-open="work"]')?.click();document.querySelector('[data-panel="work"]')?.click();notify(review?'Market record received for this review only. Download to keep.':'Market record saved. Earlier versions and your additional notes are retained.');done=true;source.postMessage({type:'ce-market-receipt',token:data.token,ok:true},origin);
 }catch(error){notify('Market record not saved: '+error.message);source.postMessage({type:'ce-market-receipt',token:data.token,ok:false,error:error.message},origin);}finally{receiving=false;}});
 source.postMessage({type:'ce-work-ready'},origin);
}
