// Review-only scaffold: deliberately not imported by any application entry.
// resolveMembership must call a trusted server endpoint, not local login labels.
// This local ownership guard is not authentication or server API authorization.
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isId=value=>typeof value==='string'&&UUID.test(value);
const MAX_PROOF_AGE_MS=60000; // Proposed local lease, not a deployed server policy.
const DEFAULT_TIMEOUT_MS=2000;
const cancelled=()=>Object.freeze({kind:'cancelled',reason:'verification-superseded',identity:null,
  sameBrowserPersistence:false,cloudPersistence:false,lastSaveSucceeded:false,lastMutationSucceeded:false,
  message:'This verification was superseded. Verify the current account before saving.'});

async function readStudentMembership({client,resolveMembership,now=Date.now}={}){
  if(!client?.auth?.getUser)return {kind:'guest',reason:'no-auth-client'};
  let result;
  try{result=await client.auth.getUser();}catch{return {kind:'unavailable',reason:'auth-verification-unavailable'};}
  if(result?.error)return {kind:'unavailable',reason:'auth-verification-failed'};
  const authUserId=result?.data?.user?.id,verifiedAt=now();
  if(!isId(authUserId))return {kind:'guest',reason:'unverified-identity'};
  if(typeof resolveMembership!=='function')return {kind:'unavailable',reason:'membership-service-unconfigured'};
  let member;
  try{member=await resolveMembership(authUserId);}catch{return {kind:'unavailable',reason:'membership-verification-unavailable'};}
  if(!member)return {kind:'guest',reason:'no-student-membership'};
  if(member.authUserId!==authUserId)return {kind:'guest',reason:'identity-mismatch'};
  if(member.role!=='student'||member.active!==true)return {kind:'guest',reason:'inactive-or-nonstudent-membership'};
  if(![member.studentId,member.schoolId,member.classId].every(isId))return {kind:'guest',reason:'invalid-membership'};
  const expiresAt=Math.min(member.expiresAt,verifiedAt+MAX_PROOF_AGE_MS);
  if(!Number.isFinite(member.expiresAt)||expiresAt<=now())return {kind:'guest',reason:'expired-membership'};
  const {studentId,schoolId,classId}=member;
  return {kind:'verified-student',reason:'verified',identity:Object.freeze({authUserId,studentId,schoolId,classId,expiresAt})};
}
export function verifyStudentMembership(options={}){
  const budget=Math.max(1,Math.min(10000,Number.isFinite(options.timeoutMs)?options.timeoutMs:DEFAULT_TIMEOUT_MS));
  let timer;
  const work=readStudentMembership(options).catch(()=>({kind:'unavailable',reason:'verification-failed'}));
  const deadline=new Promise(resolve=>{timer=setTimeout(()=>resolve({kind:'unavailable',reason:'verification-timeout'}),budget);});
  return Promise.race([work,deadline]).finally(()=>clearTimeout(timer));
}

export function createStudentSaveGate({client,resolveMembership,storage,now=Date.now,timeoutMs=DEFAULT_TIMEOUT_MS}={}){
  let generation=0,binding=null,state={kind:'guest',reason:'not-verified'},mutation=null,ioFailure=null,disposed=false,detach=null;
  const receipts=new WeakMap();
  const storageAvailable=()=>['getItem','setItem','removeItem'].every(key=>typeof storage?.[key]==='function');
  function invalidate(reason='identity-changed'){
    generation++;binding=null;mutation=null;ioFailure=null;state={kind:'guest',reason};
  }
  function current(){
    if(binding&&binding.expiresAt<=now())invalidate('expired-membership');
    return binding;
  }
  function status(){
    const identity=current(),sameBrowserPersistence=Boolean(identity&&storageAvailable()&&!ioFailure);
    const failed={read:'read',write:'save',remove:'removal'}[ioFailure];
    const message=identity
      ?failed?`The browser ${failed} failed. Cross-device sync is not available.`
        :mutation==='write'?'Saved on this browser for your verified student account. Cross-device sync is not available.'
          :mutation==='remove'?'Removed on this browser for your verified student account. Cross-device sync is not available.'
            :'Same-browser saving is available for your verified student account. Cross-device sync is not available.'
      :state.kind==='checking'?'Verifying your student account. Saving is paused.'
        :state.reason==='mapping-review-required'?'Student mapping needs review. Existing browser data is untouched and account saving is paused.'
          :state.kind==='unavailable'?'Student verification or browser saving is unavailable. Account saving is paused.'
            :'No verified student save is active. Temporary progress is not an account save.';
    return Object.freeze({...state,identity,sameBrowserPersistence,cloudPersistence:false,
      lastSaveSucceeded:mutation==='write'&&!ioFailure,lastMutationSucceeded:Boolean(mutation)&&!ioFailure,lastMutation:mutation,ioFailure,message});
  }
  function rememberBinding(identity){
    const key='ce-student-binding:'+identity.authUserId;let raw;
    try{raw=storage.getItem(key);}catch{return 'browser-storage-read-failed';}
    if(raw!==null){
      let known;try{known=JSON.parse(raw);}catch{return 'mapping-review-required';}
      if(known?.schemaVersion!==1||known.authUserId!==identity.authUserId||known.studentId!==identity.studentId)return 'mapping-review-required';
    }
    const record=raw??JSON.stringify({schemaVersion:1,authUserId:identity.authUserId,studentId:identity.studentId});
    try{storage.setItem(key,record);}catch{return 'browser-storage-write-failed';}
    return null;
  }
  async function verify(){
    if(disposed)return cancelled();
    const request=++generation;binding=null;mutation=null;ioFailure=null;state={kind:'checking',reason:'verification-pending'};
    const result=await verifyStudentMembership({client,resolveMembership,now,timeoutMs});
    if(request!==generation||disposed)return cancelled();
    state={kind:result.kind,reason:result.reason};
    if(result.kind==='verified-student'){
      const problem=storageAvailable()?rememberBinding(result.identity):'browser-storage-unavailable';
      if(request!==generation||disposed)return cancelled();
      if(problem)state={kind:'unavailable',reason:problem};else binding=result.identity;
    }
    const receipt=status();if(binding)receipts.set(receipt,{generation,binding});return receipt;
  }
  function openStorage(receipt){
    const owner=current(),lease=receipts.get(receipt);
    if(!owner)throw Error('Student save blocked: '+state.reason);
    if(!lease||lease.generation!==generation||lease.binding!==owner)throw Error('Student save blocked: stale verification receipt');
    const request=generation,prefix='ce-student:'+owner.authUserId+':'+owner.studentId+':';
    function check(key){
      if(current()!==owner||request!==generation)throw Error('Student save blocked: stale identity');
      if(typeof key!=='string'||!key)throw Error('Student save blocked: invalid key');
    }
    return Object.freeze({
      get persistent(){return current()===owner&&request===generation&&!ioFailure;},
      getItem(key){
        check(key);try{const value=storage.getItem(prefix+key);if(ioFailure==='read')ioFailure=null;return value;}
        catch(error){mutation=null;ioFailure='read';throw error;}
      },
      setItem(key,value){
        check(key);try{storage.setItem(prefix+key,value);mutation='write';ioFailure=null;}
        catch(error){mutation=null;ioFailure='write';throw error;}
      },
      removeItem(key){
        check(key);try{storage.removeItem(prefix+key);mutation='remove';ioFailure=null;}
        catch(error){mutation=null;ioFailure='remove';throw error;}
      }
    });
  }
  const onAuthEvent=event=>{if(!disposed)invalidate(event==='SIGNED_OUT'?'signed-out':'identity-changed');};
  function connectAuthEvents(){
    if(disposed||typeof client?.auth?.onAuthStateChange!=='function')throw Error('Auth event connection unavailable');
    detach?.();invalidate('auth-events-connected');
    const subscription=client.auth.onAuthStateChange(event=>onAuthEvent(event))?.data?.subscription;
    if(typeof subscription?.unsubscribe!=='function')throw Error('Auth event cleanup unavailable');
    const stop=()=>{if(detach===stop){try{subscription.unsubscribe();detach=null;}finally{invalidate(disposed?'disposed':'auth-events-detached');}}};
    detach=stop;return stop;
  }
  function dispose(){if(!disposed){disposed=true;invalidate('disposed');}detach?.();}
  return Object.freeze({verify,status,openStorage,invalidate,onAuthEvent,connectAuthEvents,dispose});
}
