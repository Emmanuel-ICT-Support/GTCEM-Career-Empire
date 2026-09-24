import {connectMarketWork,MARKET_WORK_ID} from './market-work-bridge.mjs?v=activity-library-1';
import {WORK_KEY,createWorkStore,archiveWork} from './work-store.mjs?v=my-life-1';
export function mountWork({review=false,onChange=()=>{}}={}){
 const $=id=>document.getElementById(id);let storage;try{storage=localStorage;}catch{storage={getItem(){throw Error('Storage unavailable');}};}
 const store=createWorkStore(storage,{review});let selected=null,busy=false;
 const notify=text=>{$('work-status').textContent=text;};
 const lock=task=>navigator.locks?navigator.locks.request(WORK_KEY,task):Promise.resolve().then(task);
 const canLeave=()=>!busy;
 const download=(name,text,type='application/json')=>{const u=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);};
 function loadItem(id){selected=id;const item=store.state.entries.find(x=>x.id===id),r=item?.revisions.at(-1);$('work-title').textContent=r?.title||'Your activity records will appear here.';$('work-body').textContent=r?.body||'Use Save to My work in a connected activity to keep its record.';
 $('archive-work').disabled=!item;$('archive-work').textContent=item?.archived?'Restore to My work':'Archive this item';$('download-draft').disabled=!item;
 $('work-versions').replaceChildren();for(const [i,v] of (item?.revisions||[]).entries()){const o=document.createElement('option');o.value=String(i);o.textContent=`Version ${i+1} · ${new Date(v.at).toLocaleString()}`;$('work-versions').append(o);}if(item)$('work-versions').value=String(item.revisions.length-1);$('work-version-preview').textContent='';
 $('market-work-reference')?.remove();if(id===MARKET_WORK_ID){const a=document.createElement('a');a.id='market-work-reference';a.textContent='Open Initiative one-pager';a.href=location.port==='8792'?'http://127.0.0.1:8793/Assets/EST%20Preparation/initiative-one-page-summary.png':new URL('../Assets/EST%20Preparation/initiative-one-page-summary.png',location.href).href;a.target='_blank';a.rel='noopener';$('work-status').after(a);}
 notify(store.error||(r?`Saved activity record · ${item.revisions.length} version(s) · Read only`:'No activity record selected.'));
 }
 function renderList(){const state=store.state,query=$('work-search').value.toLowerCase(),archived=$('show-archived').checked;$('work-list').replaceChildren();for(const item of [...state.entries].reverse().filter(x=>x.archived===archived&&x.revisions.at(-1).title.toLowerCase().includes(query))){const b=document.createElement('button');b.className='work-list-item';b.textContent=item.revisions.at(-1).title;b.onclick=()=>{if(canLeave())loadItem(item.id);};$('work-list').append(b);}if(!$('work-list').children.length)$('work-list').textContent='No matching saved activity records.';$('work-count').textContent=String(state.entries.filter(x=>!x.archived).length);onChange(state);}
 $('work-search').oninput=renderList;$('show-archived').onchange=renderList;
 $('archive-work').onclick=async()=>{if(!selected||busy)return;busy=true;try{await lock(()=>store.commit(s=>archiveWork(s,selected,!s.entries.find(x=>x.id===selected).archived)));renderList();loadItem(selected);}catch(e){notify('Not changed: '+e.message);}finally{busy=false;}};
 $('work-versions').onchange=()=>{const r=store.state.entries.find(x=>x.id===selected)?.revisions[Number($('work-versions').value)];$('work-version-preview').textContent=r?`${r.title}\n\n${r.body}`:'';};
 $('export-work').onclick=()=>{if(store.error&&store.raw===null){notify('Storage unavailable; no backup could be read.');return;}download('career-empire-my-work.json',store.error?store.raw:JSON.stringify(store.state,null,2));};
 $('download-draft').onclick=()=>{const r=store.state.entries.find(x=>x.id===selected)?.revisions.at(-1);if(r)download('career-empire-activity.txt',`${r.title}\n\n${r.body}`,'text/plain');};
 window.addEventListener('storage',e=>{if(!review&&(e.key===WORK_KEY||e.key===null)&&!busy){store.reload();renderList();loadItem(selected);}});
 connectMarketWork({review,store,lock,canLeave,renderList,loadItem,notify});
 const resumeLatest=()=>{if(canLeave())loadItem(store.state.entries.filter(x=>!x.archived).sort((a,b)=>Date.parse(b.revisions.at(-1).at)-Date.parse(a.revisions.at(-1).at))[0]?.id||null);};renderList();resumeLatest();return {get state(){return store.state;},get dirty(){return false;},resumeLatest};
}
