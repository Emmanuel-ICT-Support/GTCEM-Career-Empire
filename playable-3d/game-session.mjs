// Guest state is document memory. A one-shot tab handoff bridges explicit module
// navigation; ordinary entry/reload always begins a new guest run.
const HANDOFF='ce-game-run-handoff-v1';
export function createRun({data={},id='guest',user=null,persistentStorage=null,tabStorage=null,bridgePersist=false,baseURL=globalThis.location?.href||'https://game.invalid/'}={}){
 const memory=new Map(Object.entries(data)),prefix=user?'ce-player:'+user.id+':':null;
 const storage={persistent:Boolean(user),getItem(key){return user?persistentStorage.getItem(prefix+key):(memory.get(key)??null);},setItem(key,value){if(user)persistentStorage.setItem(prefix+key,String(value));else{memory.set(key,String(value));if(bridgePersist)tabStorage?.setItem(HANDOFF,JSON.stringify({id,data:Object.fromEntries(memory),createdAt:Date.now()}));}},removeItem(key){if(user)persistentStorage.removeItem(prefix+key);else{memory.delete(key);if(bridgePersist)tabStorage?.setItem(HANDOFF,JSON.stringify({id,data:Object.fromEntries(memory),createdAt:Date.now()}));}}};
 return {id,user,isGuest:!user,storage,snapshot:()=>Object.fromEntries(memory),handoffURL(target){const url=new URL(target,baseURL);if(!user){if(!tabStorage)throw Error('Temporary module handoff is unavailable');tabStorage.setItem(HANDOFF,JSON.stringify({id,data:Object.fromEntries(memory),createdAt:Date.now()}));url.searchParams.set('guestRun',id);}return url.href;}};
}
export async function verifyUser(client){try{const result=await client?.auth?.getUser();return !result?.error&&typeof result?.data?.user?.id==='string'&&result.data.user.id.length>0?result.data.user:null;}catch{return null;}}
export function openRun({url,persistentStorage,tabStorage,user=null,newEntry=true,id=()=>crypto.randomUUID()}={}){
 const parsed=new URL(url),token=parsed.searchParams.get('guestRun');let handoff=null;
 if(token)try{const value=JSON.parse(tabStorage?.getItem(HANDOFF)||'null');if(value?.id===token&&Date.now()-value.createdAt<3600000)handoff=value;}catch{}
 if(newEntry){try{tabStorage?.removeItem(HANDOFF);}catch{}if(token)parsed.searchParams.delete('guestRun');}
 return {run:createRun({id:user?user.id:handoff?.id||id(),data:handoff?.data||{},user,persistentStorage,tabStorage,bridgePersist:!newEntry&&Boolean(handoff),baseURL:parsed.href}),url:parsed.href,continued:Boolean(handoff)};
}
export async function browserRun({newEntry=true}={}){
 let user=null,real=null,tab=null;try{real=localStorage;}catch{}try{tab=sessionStorage;}catch{}
 // Token presence only requests server verification; it is never login proof.
 let tokenPresent=false;try{tokenPresent=Boolean(real&&Object.keys(real).some(key=>/^sb-.*-auth-token$/.test(key)));}catch{}
 if(tokenPresent&&window.CareerEmpireSupabase){let timer,userTimer;try{
  const client=await Promise.race([window.CareerEmpireSupabase.getClient(),new Promise((_,reject)=>timer=setTimeout(()=>reject(Error('Account verification unavailable')),2000))]);
  user=await Promise.race([verifyUser(client),new Promise(resolve=>userTimer=setTimeout(()=>resolve(null),2000))]);
 }catch{}finally{clearTimeout(timer);clearTimeout(userTimer);}}
 const result=openRun({url:location.href,persistentStorage:real,tabStorage:tab,user,newEntry});if(newEntry&&result.url!==location.href)history.replaceState(null,'',result.url);return result.run;
}
