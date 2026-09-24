// Local practice only. This library has no student identity or assessment authority.
export const WORK_KEY='career-empire-my-life-work-v1';
export const blankWork=()=>({schemaVersion:1,entries:[]});
export function validateWork(value){
 if(value?.schemaVersion!==1||!Array.isArray(value.entries)||value.entries.length>100)throw Error('This is not a supported My work backup (maximum 100 items).');
 const ids=new Set();
 for(const item of value.entries){
  if(!item||typeof item.id!=='string'||item.id.length>100||!item.id||ids.has(item.id)||typeof item.archived!=='boolean'||!Array.isArray(item.revisions)||!item.revisions.length||item.revisions.length>100)throw Error('Invalid work item or revision history.');ids.add(item.id);
  for(const rev of item.revisions){
   if(!rev||typeof rev.title!=='string'||!rev.title.trim()||rev.title.length>120||typeof rev.body!=='string'||rev.body.length>20000||!['note','draft','reflection'].includes(rev.kind)||!['draft','finished'].includes(rev.status)||typeof rev.at!=='string'||!Number.isFinite(Date.parse(rev.at)))throw Error('Invalid work content. Titles allow 120 characters and work allows 20,000 characters.');
  }
 }
 if(JSON.stringify(value).length>2000000)throw Error('The work library is too large. Keep a backup before continuing.');
 // Only expected fields survive imports; HTML is always displayed as plain text.
 return {schemaVersion:1,entries:value.entries.map(x=>({id:x.id,archived:x.archived,revisions:x.revisions.map(r=>({title:r.title,body:r.body,kind:r.kind,status:r.status,at:r.at}))}))};
}
export function saveWork(previous,{id,title,body,kind,status,at}){
 const next=validateWork(previous),revision={title:title.trim(),body,kind,status,at};
 const item=next.entries.find(x=>x.id===id);
 if(item){const last=item.revisions.at(-1);if(['title','body','kind','status'].every(k=>last[k]===revision[k]))return next;if(item.revisions.length>=100)throw Error('This item has 100 saved versions. Create a new item to continue; all earlier versions are kept.');item.revisions.push(revision);}
 else next.entries.push({id,archived:false,revisions:[revision]});
 return validateWork(next);
}
export function archiveWork(previous,id,archived){const next=validateWork(previous),item=next.entries.find(x=>x.id===id);if(!item)throw Error('Work item not found.');item.archived=archived;return next;}
export function importWork(previous,incoming,makeId){
 const next=validateWork(previous),data=validateWork(incoming);let count=0;
 for(const item of data.entries){
  if(next.entries.some(x=>JSON.stringify(x.revisions)===JSON.stringify(item.revisions)&&x.archived===item.archived))continue;
  next.entries.push({...item,id:makeId()});count++;
 }
 return {document:validateWork(next),count};
}
export function createWorkStore(storage,{review=false}={}){
 let raw=null,state=blankWork(),error='';
 function load(){try{raw=review?null:storage.getItem(WORK_KEY);state=raw===null?blankWork():validateWork(JSON.parse(raw));error='';}catch{error='Your saved work could not be read. It has been preserved. Download a recovery copy before asking for help.';}}
 load();
 return {get state(){return structuredClone(state);},get error(){return error;},get raw(){return raw;},reload:load,
 commit(change){if(error)throw Error(error);const next=validateWork(change(state));const encoded=JSON.stringify(next);if(!review){if(storage.getItem(WORK_KEY)!==raw)throw Error('Another tab changed My work. Your edits are still here. Download them, then reload before saving.');storage.setItem(WORK_KEY,encoded);}state=next;raw=review?null:encoded;return this.state;}
 };
}
