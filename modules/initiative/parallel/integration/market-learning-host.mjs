import {validateLibrary} from '../learning/lesson.mjs';
// Isolated candidate: identity, persistence and routes are injected by the real host.
export function createMarketLearningHost({library,learnerKey,storage,openMara,openArchon,returnToMarket,syncTeacher,onStatus=()=>{}}){
 validateLibrary(library);
 if(typeof learnerKey!=='string'||!learnerKey.trim())throw Error('Explicit host learner key required');
 const key='ce.shared-learning.v1:'+encodeURIComponent(learnerKey)+':'+encodeURIComponent(library.libraryId)+':'+encodeURIComponent(library.revision);
 let state={schemaVersion:1,libraryRevision:library.revision,draft:'',attempts:[],route:'market',revision:0,syncedRevision:-1};
 let storageError=false;
 try{const saved=JSON.parse(storage.getItem(key)||'null');if(saved?.schemaVersion===1&&saved.libraryRevision===library.revision&&typeof saved.draft==='string'&&Array.isArray(saved.attempts))state={...state,...saved,route:'market'};}catch{storageError=true;onStatus('Saved learning could not be loaded. This session starts fresh.');}
 let disposed=false,busy=false;
 const clone=x=>JSON.parse(JSON.stringify(x));
 const snapshot=()=>clone(state);
 function persist(){try{storage.setItem(key,JSON.stringify(state));storageError=false;onStatus('Saved on this device; teacher sync not confirmed.');return true;}catch{storageError=true;onStatus('Could not save on this device. Keep this page open and retry.');return false;}}
 function update(patch){if(disposed)throw Error('Learning host closed');state={...state,...patch,revision:state.revision+1};return persist();}
 const routes={mara:openMara,archon:openArchon};
 async function open(route){if(disposed)throw Error('Learning host closed');if(route==='notes'){update({route});return snapshot();}const launch=routes[route];if(!launch)throw Error('Route unavailable: '+route);if(busy)return false;busy=true;update({route});try{await launch({libraryId:library.libraryId,libraryRevision:library.revision,onReturn:back});return true;}catch(error){update({route:'market'});onStatus('That option could not open. Your learning draft is retained.');throw error;}finally{busy=false;}}
 function back(){if(disposed)return;update({route:'market'});returnToMarket?.();}
 async function saveTeacher(){if(disposed)throw Error('Learning host closed');const payload=snapshot();const localSaved=persist();if(typeof syncTeacher!=='function'){onStatus(localSaved?'Saved on this device only; teacher sync unavailable.':'Device save failed; teacher sync unavailable.');return {localSaved,remoteSaved:false};}
 try{const result=await syncTeacher({learnerKey,libraryId:library.libraryId,libraryRevision:library.revision,idempotencyKey:key+':'+payload.revision,evidence:payload});if(result?.error||result?.saved!==true)throw Error('Teacher acknowledgement missing');if(disposed)return {localSaved,remoteSaved:true};if(state.revision===payload.revision){state.syncedRevision=payload.revision;persist();onStatus(localSaved?'Saved on this device and acknowledged by teacher service.':'Teacher service acknowledged; device save failed.');}else onStatus('Earlier revision synced; newer edits still need saving.');return {localSaved,remoteSaved:true};}catch{if(!disposed)onStatus('Teacher sync failed. '+(localSaved?'Device copy retained; retry saving.':'Device save also failed; keep this page open.'));return {localSaved,remoteSaved:false};}}
 return {snapshot,key,open,back,saveTeacher,saveDraft:text=>update({draft:String(text).slice(0,4000)}),recordAttempt(event){if(event.libraryRevision!==library.revision||event.type!=='practice-attempt'||!library.checks.some(q=>q.id===event.checkId&&q.options.some(o=>o.id===event.answerId)))throw Error('Unknown practice event');return update({attempts:[...state.attempts,clone(event)].slice(-200)});},retryLocalSave:persist,get storageError(){return storageError;},destroy(){disposed=true;}};
}
// Persistence bridge for connection-owner createInitiativeNotes; that adapter alone owns UI/routes.
export function createNotesPersistenceBridge(host, {learnerKey,library}) {
 const valid=context=>context?.learner===learnerKey&&context.libraryRevision===library.revision&&context.schemaVersion===library.schemaVersion&&context.lessonId==='ce.lesson.initiative.foundation';
 return {
  readDraft(context){if(!valid(context))throw Error('Wrong learner or learning context');return host.snapshot().draft;},
  saveDraft(context){if(!valid(context))return false;return host.saveDraft(context.text);},
  recordEvidence(event){if(!valid(event))return false;try{if(event.type==='practice-attempt')return host.recordAttempt(event);if(event.type==='transfer-draft')return host.saveDraft(event.text);return false;}catch{return false;}}
 };
}
