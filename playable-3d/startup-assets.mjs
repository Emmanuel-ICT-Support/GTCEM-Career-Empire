// Bound an asset's scheduling priority; an unavailable saved character must not
// prevent the playable fallback and arrival scenery from completing.
export async function waitForPriorityAsset(ready,budgetMs=8000){
 let timer;try{return await Promise.race([Promise.resolve(ready).catch(()=>false),new Promise(resolve=>{timer=setTimeout(()=>resolve(false),budgetMs);})]);}finally{clearTimeout(timer);}
}
export async function withAssetDeadline(ready,timeoutMs=15000){
 let timer;try{return await Promise.race([ready,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Surface download is taking too long. Retry missing detail.')),timeoutMs);})]);}finally{clearTimeout(timer);}
}

// Late texture recovery must not wait for optional full-campus scenery.
export function canClearDetailWarning({entryReady,campusReady,campusLoading,pending,campusFailed=false}){
 return !campusFailed&&pending===0&&(campusReady||(entryReady&&!campusLoading));
}
