// Review-only scaffold: deliberately not imported by any application entry.
// resolveMembership must eventually call a trusted server endpoint; local login
// labels and client-controlled claims are not membership evidence. This guard
// protects local save ownership, not server API access or authentication itself.
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isId=value=>typeof value==='string'&&UUID.test(value);
const MAX_PROOF_AGE_MS=60000; // Proposed local lease for review, not a server policy.

export async function verifyStudentMembership({client,resolveMembership,now=Date.now}={}){
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

export function createStudentSaveGate({client,resolveMembership,storage,now=Date.now}={}){
  let generation=0,binding=null,state={kind:'guest',reason:'not-verified'},saved=false,saveFailed=false;
  const storageAvailable=()=>['getItem','setItem','removeItem'].every(key=>typeof storage?.[key]==='function');
  function invalidate(reason='identity-changed'){
    generation++;binding=null;saved=false;saveFailed=false;state={kind:'guest',reason};
  }
  function current(){
    if(binding&&binding.expiresAt<=now())invalidate('expired-membership');
    return binding;
  }
  function status(){
    const identity=current();
    const sameBrowserPersistence=Boolean(identity&&storageAvailable()&&!saveFailed);
    const message=identity
      ?saveFailed?'The browser save failed. Cross-device sync is not available.'
        :saved?'Saved on this browser for your verified student account. Cross-device sync is not available.'
          :'Same-browser saving is available for your verified student account. Cross-device sync is not available.'
      :state.kind==='checking'?'Verifying your student account. Saving is paused.'
        :state.kind==='unavailable'?'Student verification or browser saving is unavailable. Account saving is paused.'
          :'No verified student save is active. Temporary progress is not an account save.';
    return Object.freeze({...state,identity,sameBrowserPersistence,cloudPersistence:false,lastSaveSucceeded:saved,message});
  }
  async function verify(){
    const request=++generation;binding=null;saved=false;saveFailed=false;state={kind:'checking',reason:'verification-pending'};
    const result=await verifyStudentMembership({client,resolveMembership,now});
    if(request!==generation)return status();
    state={kind:result.kind,reason:result.reason};
    if(result.kind==='verified-student'){
      if(!storageAvailable())state={kind:'unavailable',reason:'browser-storage-unavailable'};
      else binding=result.identity;
    }
    return status();
  }
  function openStorage(){
    const owner=current(),request=generation;
    if(!owner)throw Error('Student save blocked: '+state.reason);
    const prefix='ce-player:'+owner.authUserId+':';
    function check(key){
      if(current()!==owner||request!==generation)throw Error('Student save blocked: stale identity');
      if(typeof key!=='string'||!key)throw Error('Student save blocked: invalid key');
    }
    return Object.freeze({
      get persistent(){return current()===owner&&request===generation&&!saveFailed;},
      getItem(key){check(key);return storage.getItem(prefix+key);},
      setItem(key,value){
        check(key);
        try{storage.setItem(prefix+key,value);saved=true;saveFailed=false;}catch(error){saved=false;saveFailed=true;throw error;}
      },
      removeItem(key){check(key);storage.removeItem(prefix+key);}
    });
  }
  return Object.freeze({verify,status,openStorage,invalidate,
    onAuthEvent:event=>invalidate(event==='SIGNED_OUT'?'signed-out':'identity-changed')});
}
