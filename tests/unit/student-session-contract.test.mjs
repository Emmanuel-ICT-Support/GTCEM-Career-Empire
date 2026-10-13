import {test,expect,vi,afterEach} from 'vitest';
import {browserRun} from '../../playable-3d/game-session.mjs';
import {verifyStudentMembership,createStudentSaveGate} from '../../playable-3d/student-session-contract.mjs';

const AUTH_A='11111111-1111-4111-8111-111111111111',AUTH_B='22222222-2222-4222-8222-222222222222';
const STUDENT_A='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',STUDENT_B='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const SCHOOL='cccccccc-cccc-4ccc-8ccc-cccccccccccc',CLASS='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const TIME=100000;
const key=(auth,student)=>'ce-student:'+auth+':'+student+':progress';
const marker=(auth,student)=>JSON.stringify({schemaVersion:1,authUserId:auth,studentId:student});
const proof=(authUserId=AUTH_A)=>({authUserId,studentId:authUserId===AUTH_A?STUDENT_A:STUDENT_B,schoolId:SCHOOL,classId:CLASS,role:'student',active:true,expiresAt:TIME+10000});
function store(initial={}){
  const data={...initial};
  Object.defineProperties(data,{
    getItem:{value:key=>data[key]??null},setItem:{value:(key,value)=>{data[key]=String(value);}},
    removeItem:{value:key=>{delete data[key];}},dump:{value:()=>({...data})}
  });return data;
}
function fixture(member=proof()){
  const storage=store(),clock={value:TIME},user={id:AUTH_A};
  const getUser=vi.fn(async()=>({data:{user},error:null})),resolveMembership=vi.fn(async()=>member);
  const gate=createStudentSaveGate({client:{auth:{getUser}},resolveMembership,storage,now:()=>clock.value});
  return {gate,storage,clock,user,getUser,resolveMembership};
}
afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers();});

test('contract rejects local student labels without verified Auth',async()=>{
  const resolveMembership=vi.fn();
  const gate=createStudentSaveGate({storage:store(),resolveMembership,
    studentLogin:{id:STUDENT_A},session:{studentId:STUDENT_A},now:()=>TIME});
  expect(await gate.verify()).toMatchObject({kind:'guest',sameBrowserPersistence:false,cloudPersistence:false});
  expect(resolveMembership).not.toHaveBeenCalled();expect(()=>gate.openStorage()).toThrow('no-auth-client');
});
test('contract binds only a matching server membership to the verified Auth subject',async()=>{
  const f=fixture();const receipt=await f.gate.verify();expect(receipt).toMatchObject({kind:'verified-student',identity:{authUserId:AUTH_A,studentId:STUDENT_A,schoolId:SCHOOL,classId:CLASS}});
  expect(f.resolveMembership).toHaveBeenCalledWith(AUTH_A);
  f.gate.openStorage(receipt).setItem('progress','owned');expect(f.storage.dump()).toEqual({['ce-student-binding:'+AUTH_A]:marker(AUTH_A,STUDENT_A),[key(AUTH_A,STUDENT_A)]:'owned'});
});
test.each([
  ['different Auth subject',{authUserId:AUTH_B},'identity-mismatch'],
  ['retained teacher identity',{role:'teacher'},'inactive-or-nonstudent-membership'],
  ['inactive student',{active:false},'inactive-or-nonstudent-membership'],
  ['missing school',{schoolId:null},'invalid-membership'],
  ['missing class',{classId:null},'invalid-membership'],
  ['client label instead of student ID',{studentId:'student-label'},'invalid-membership'],
  ['expired server proof',{expiresAt:TIME},'expired-membership']
])('contract denies %s without touching saved data',async(_,override,reason)=>{
  const f=fixture({...proof(),...override});f.storage.setItem('old-save','preserved');
  expect(await f.gate.verify()).toMatchObject({kind:'guest',reason,sameBrowserPersistence:false});
  expect(()=>f.gate.openStorage()).toThrow();expect(f.storage.dump()).toEqual({'old-save':'preserved'});
});
test('missing membership service does not downgrade verified Auth into a trusted local label',async()=>{
  const result=await verifyStudentMembership({client:{auth:{getUser:async()=>({data:{user:{id:AUTH_A,user_metadata:{role:'student',studentId:STUDENT_A}}},error:null})}},now:()=>TIME});
  expect(result).toEqual({kind:'unavailable',reason:'membership-service-unconfigured'});
});
test('verification errors pause account saving and preserve data',async()=>{
  const f=fixture();const old=f.gate.openStorage(await f.gate.verify());old.setItem('progress','preserved');
  f.getUser.mockRejectedValueOnce(Error('synthetic offline'));
  expect(await f.gate.verify()).toMatchObject({kind:'unavailable',sameBrowserPersistence:false});
  expect(old.persistent).toBe(false);expect(()=>old.setItem('progress','wrong')).toThrow('stale identity');
  expect(f.storage.getItem(key(AUTH_A,STUDENT_A))).toBe('preserved');
  f.resolveMembership.mockRejectedValueOnce(Error('synthetic membership offline'));
  expect(await f.gate.verify()).toMatchObject({kind:'unavailable',reason:'membership-verification-unavailable'});
});
test('logout invalidates old readers, writers and removers without erasing their records',async()=>{
  const f=fixture();const old=f.gate.openStorage(await f.gate.verify());old.setItem('progress','preserved');
  f.gate.onAuthEvent('SIGNED_OUT');expect(old.persistent).toBe(false);
  expect(()=>old.getItem('progress')).toThrow('stale identity');expect(()=>old.setItem('progress','wrong')).toThrow('stale identity');expect(()=>old.removeItem('progress')).toThrow('stale identity');
  expect(f.gate.status()).toMatchObject({kind:'guest',reason:'signed-out',sameBrowserPersistence:false});
  expect(f.storage.getItem(key(AUTH_A,STUDENT_A))).toBe('preserved');
});
test('proof expiry blocks subsequent storage access at the exact boundary',async()=>{
  const f=fixture();const old=f.gate.openStorage(await f.gate.verify());old.setItem('progress','preserved');
  f.clock.value=TIME+10000;expect(()=>old.setItem('progress','wrong')).toThrow('stale identity');
  expect(f.gate.status()).toMatchObject({reason:'expired-membership',sameBrowserPersistence:false});
  expect(f.storage.getItem(key(AUTH_A,STUDENT_A))).toBe('preserved');
});
test('account switch requires re-verification and never imports another owner or legacy save',async()=>{
  const f=fixture();f.storage.setItem('career-empire-old-save','legacy');f.storage.setItem(key(AUTH_B,STUDENT_B),'existing B');
  const a=f.gate.openStorage(await f.gate.verify());a.setItem('progress','owned A');
  f.gate.onAuthEvent('SIGNED_IN');f.user.id=AUTH_B;f.resolveMembership.mockResolvedValue(proof(AUTH_B));
  const pending=f.gate.verify();expect(()=>a.setItem('progress','wrong')).toThrow('stale identity');
  expect(f.gate.status().kind).toBe('checking');const receiptB=await pending;
  const b=f.gate.openStorage(receiptB);expect(b.getItem('progress')).toBe('existing B');b.setItem('progress','owned B');
  expect(f.storage.dump()).toEqual({'career-empire-old-save':'legacy',['ce-student-binding:'+AUTH_A]:marker(AUTH_A,STUDENT_A),['ce-student-binding:'+AUTH_B]:marker(AUTH_B,STUDENT_B),[key(AUTH_A,STUDENT_A)]:'owned A',[key(AUTH_B,STUDENT_B)]:'owned B'});
});
test('late membership response cannot restore a session after logout',async()=>{
  const f=fixture();let release;f.resolveMembership.mockImplementation(()=>new Promise(resolve=>{release=resolve;}));
  const pending=f.gate.verify();await Promise.resolve();expect(release).toBeTypeOf('function');
  f.gate.onAuthEvent('SIGNED_OUT');release(proof());await pending;
  expect(f.gate.status()).toMatchObject({kind:'guest',reason:'signed-out'});expect(()=>f.gate.openStorage()).toThrow();
});
test('the verified Auth subject is captured before a mutable response can change',async()=>{
  const f=fixture();let release;f.resolveMembership.mockImplementation(()=>new Promise(resolve=>{release=resolve;}));
  const pending=f.gate.verify();await Promise.resolve();f.user.id=AUTH_B;release(proof(AUTH_B));
  expect(await pending).toMatchObject({kind:'guest',reason:'identity-mismatch'});
});
test('a long server expiry is capped and a delayed proof cannot outlive fresh Auth verification',async()=>{
  const f=fixture({...proof(),expiresAt:TIME+3600000});await f.gate.verify();
  expect(f.gate.status().identity.expiresAt).toBe(TIME+60000);
  let release;f.resolveMembership.mockImplementation(()=>new Promise(resolve=>{release=resolve;}));
  const pending=f.gate.verify();await Promise.resolve();f.clock.value=TIME+60001;release({...proof(),expiresAt:TIME+3600000});
  expect(await pending).toMatchObject({kind:'guest',reason:'expired-membership'});
});
test('verified membership without browser storage does not claim saving is available',async()=>{
  const gate=createStudentSaveGate({client:{auth:{getUser:async()=>({data:{user:{id:AUTH_A}},error:null})}},resolveMembership:async()=>proof(),now:()=>TIME});
  expect(await gate.verify()).toMatchObject({kind:'unavailable',reason:'browser-storage-unavailable',sameBrowserPersistence:false,lastSaveSucceeded:false});
  expect(()=>gate.openStorage()).toThrow('browser-storage-unavailable');
});
test('status distinguishes saving capability, successful local save and absence of cloud sync',async()=>{
  const f=fixture();expect(f.gate.status().lastSaveSucceeded).toBe(false);const receipt=await f.gate.verify();
  expect(f.gate.status()).toMatchObject({sameBrowserPersistence:true,cloudPersistence:false,lastSaveSucceeded:false});
  expect(f.gate.status().message).toContain('Same-browser saving is available');
  f.gate.openStorage(receipt).setItem('progress','local');expect(f.gate.status()).toMatchObject({lastSaveSucceeded:true,cloudPersistence:false});
  expect(f.gate.status().message).toContain('Saved on this browser');
});
test('a failed storage write does not claim saving succeeded and retains the earlier value',async()=>{
  const memory=store(),storage={getItem:memory.getItem,removeItem:memory.removeItem,setItem:vi.fn(memory.setItem)};
  const gate=createStudentSaveGate({client:{auth:{getUser:async()=>({data:{user:{id:AUTH_A}},error:null})}},resolveMembership:async()=>proof(),storage,now:()=>TIME});
  const bound=gate.openStorage(await gate.verify());bound.setItem('progress','earlier');storage.setItem.mockImplementationOnce(()=>{throw Error('synthetic quota');});
  expect(()=>bound.setItem('progress','lost')).toThrow('synthetic quota');expect(bound.getItem('progress')).toBe('earlier');
  expect(gate.status()).toMatchObject({sameBrowserPersistence:false,lastSaveSucceeded:false,cloudPersistence:false});expect(gate.status().message).toContain('browser save failed');
  bound.setItem('progress','retried');expect(gate.status().lastSaveSucceeded).toBe(true);
});

function stubReleasedBrowser(real,client){
  vi.stubGlobal('localStorage',real);vi.stubGlobal('sessionStorage',store());vi.stubGlobal('location',{href:'https://school.invalid/playable-3d/'});
  vi.stubGlobal('history',{replaceState:vi.fn()});vi.stubGlobal('crypto',{randomUUID:()=> 'synthetic-guest'});
  vi.stubGlobal('window',{CareerEmpireSupabase:{getClient:async()=>client}});
}
// Characterize the unchanged released gaps. These are not acceptance of secure
// student login; replace their expectations when reviewed integration is enabled.
test('released browserRun characterization: legacy labels are still rejected',async()=>{
  const getUser=vi.fn(async()=>({data:{user:{id:AUTH_A}},error:null}));
  stubReleasedBrowser(store({'career-empire-auth-demo':JSON.stringify({studentLogin:{id:STUDENT_A}}),'career-empire-session':JSON.stringify({studentId:STUDENT_A})}),{auth:{getUser}});
  const run=await browserRun();expect(run.isGuest).toBe(true);expect(getUser).not.toHaveBeenCalled();
});
test('released browserRun characterization: retained teacher identity still needs a membership guard',async()=>{
  const real=store({'sb-synthetic-auth-token':'fixture-only','career-empire-auth-demo':JSON.stringify({studentLogin:{id:STUDENT_B}})});
  stubReleasedBrowser(real,{auth:{getUser:async()=>({data:{user:{id:AUTH_A,app_metadata:{role:'teacher'}}},error:null})}});
  const run=await browserRun();expect(run.user.id).toBe(AUTH_A);run.storage.setItem('progress','synthetic teacher owner');
  expect(real.getItem('ce-player:'+AUTH_A+':progress')).toBe('synthetic teacher owner');
});
test('released run characterization: existing storage ownership is still captured until integration',async()=>{
  const real=store({'sb-synthetic-auth-token':'fixture-only'});let user={id:AUTH_A};
  stubReleasedBrowser(real,{auth:{getUser:async()=>({data:{user},error:null})}});
  const run=await browserRun();user=null;run.storage.setItem('progress','synthetic stale owner');
  expect(real.getItem('ce-player:'+AUTH_A+':progress')).toBe('synthetic stale owner');
});

test('overlapping A-to-B verification cancels A and cannot give its continuation B storage',async()=>{
  const f=fixture();let releaseA;
  f.resolveMembership.mockImplementationOnce(()=>new Promise(resolve=>{releaseA=resolve;})).mockResolvedValue(proof(AUTH_B));
  const pendingA=f.gate.verify();await Promise.resolve();
  const continuationA=pendingA.then(receipt=>{if(receipt.kind==='verified-student')f.gate.openStorage(receipt).setItem('progress','wrong A continuation');});
  f.gate.onAuthEvent('SIGNED_IN');f.user.id=AUTH_B;
  const receiptB=await f.gate.verify();const b=f.gate.openStorage(receiptB);b.setItem('progress','owned B');
  releaseA(proof());const receiptA=await pendingA;await continuationA;
  expect(receiptA).toMatchObject({kind:'cancelled',reason:'verification-superseded',identity:null,sameBrowserPersistence:false});
  expect(()=>f.gate.openStorage(receiptA)).toThrow('stale verification receipt');
  expect(f.gate.status()).toMatchObject({kind:'verified-student',identity:{authUserId:AUTH_B,studentId:STUDENT_B}});
  expect(b.getItem('progress')).toBe('owned B');expect(f.storage.getItem(key(AUTH_A,STUDENT_A))).toBeNull();
});
test('storage access requires the exact current verification receipt, not a copied UI status',async()=>{
  const f=fixture(),first=await f.gate.verify();
  expect(()=>f.gate.openStorage()).toThrow('stale verification receipt');expect(()=>f.gate.openStorage({...first})).toThrow('stale verification receipt');expect(()=>f.gate.openStorage(f.gate.status())).toThrow('stale verification receipt');
  const renewed=await f.gate.verify();expect(()=>f.gate.openStorage(first)).toThrow('stale verification receipt');
  f.gate.openStorage(renewed).setItem('progress','renewed owner');
});
test('same Auth UUID cannot be reassigned to another student across a fresh gate; all data is quarantined intact',async()=>{
  const f=fixture();f.storage.setItem('ce-player:'+AUTH_A+':progress','legacy UID-only data');
  const a=f.gate.openStorage(await f.gate.verify());expect(a.getItem('progress')).toBeNull();a.setItem('progress','owned A');expect(f.storage.getItem('ce-player:'+AUTH_A+':progress')).toBe('legacy UID-only data');const before=f.storage.dump();f.gate.invalidate('mapping-changed');
  const rebound=createStudentSaveGate({client:{auth:{getUser:async()=>({data:{user:{id:AUTH_A}},error:null})}},resolveMembership:async()=>({...proof(),studentId:STUDENT_B}),storage:f.storage,now:()=>TIME});
  const receipt=await rebound.verify();expect(receipt).toMatchObject({kind:'unavailable',reason:'mapping-review-required',sameBrowserPersistence:false});expect(()=>rebound.openStorage(receipt)).toThrow('mapping-review-required');
  expect(f.storage.dump()).toEqual(before);expect(a.persistent).toBe(false);
});
test('unknown mapping metadata is not overwritten or used to promote legacy data',async()=>{
  const f=fixture();f.storage.setItem('ce-student-binding:'+AUTH_A,'unknown earlier metadata');f.storage.setItem('ce-player:'+AUTH_A+':progress','legacy retained');const before=f.storage.dump();
  expect(await f.gate.verify()).toMatchObject({kind:'unavailable',reason:'mapping-review-required'});expect(f.storage.dump()).toEqual(before);
});
test('lease renewal revokes old receipts while retaining the immutable student and their records',async()=>{
  const f=fixture(),first=await f.gate.verify(),a=f.gate.openStorage(first);a.setItem('progress','retained');f.clock.value=TIME+5000;
  f.resolveMembership.mockResolvedValue({...proof(),classId:'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',expiresAt:TIME+20000});
  const renewed=await f.gate.verify();expect(a.persistent).toBe(false);expect(()=>f.gate.openStorage(first)).toThrow('stale verification receipt');expect(f.gate.openStorage(renewed).getItem('progress')).toBe('retained');
});
test('a read failure clears stale save acknowledgement and a read retry does not manufacture a save',async()=>{
  const memory=store(),storage={getItem:vi.fn(memory.getItem),setItem:memory.setItem,removeItem:memory.removeItem};
  const gate=createStudentSaveGate({client:{auth:{getUser:async()=>({data:{user:{id:AUTH_A}},error:null})}},resolveMembership:async()=>proof(),storage,now:()=>TIME});
  const bound=gate.openStorage(await gate.verify());bound.setItem('progress','earlier');storage.getItem.mockImplementationOnce(()=>{throw Error('synthetic read failure');});
  expect(()=>bound.getItem('progress')).toThrow('synthetic read failure');expect(gate.status()).toMatchObject({lastSaveSucceeded:false,sameBrowserPersistence:false,ioFailure:'read'});expect(gate.status().message).toContain('browser read failed');expect(memory.getItem(key(AUTH_A,STUDENT_A))).toBe('earlier');
  expect(bound.getItem('progress')).toBe('earlier');expect(gate.status()).toMatchObject({lastSaveSucceeded:false,lastMutationSucceeded:false,ioFailure:null});
});
test('a removal failure preserves the value and a successful retry reports removal, not a saved progress write',async()=>{
  const memory=store(),storage={getItem:memory.getItem,setItem:memory.setItem,removeItem:vi.fn(memory.removeItem)};
  const gate=createStudentSaveGate({client:{auth:{getUser:async()=>({data:{user:{id:AUTH_A}},error:null})}},resolveMembership:async()=>proof(),storage,now:()=>TIME});
  const bound=gate.openStorage(await gate.verify());bound.setItem('progress','earlier');storage.removeItem.mockImplementationOnce(()=>{throw Error('synthetic removal failure');});
  expect(()=>bound.removeItem('progress')).toThrow('synthetic removal failure');expect(bound.getItem('progress')).toBe('earlier');expect(gate.status()).toMatchObject({lastSaveSucceeded:false,lastMutationSucceeded:false,ioFailure:'remove'});expect(gate.status().message).toContain('browser removal failed');
  bound.removeItem('progress');expect(memory.getItem(key(AUTH_A,STUDENT_A))).toBeNull();expect(gate.status()).toMatchObject({lastSaveSucceeded:false,lastMutationSucceeded:true,lastMutation:'remove',ioFailure:null});expect(gate.status().message).toContain('Removed on this browser');
});
test.each([
  ['write','setItem','save'],['remove','removeItem','removal']
])('an unresolved %s failure survives a read failure and successful read until mutation retry succeeds',async(failure,method,label)=>{
  const memory=store(),storage={getItem:vi.fn(memory.getItem),setItem:vi.fn(memory.setItem),removeItem:vi.fn(memory.removeItem)};
  const gate=createStudentSaveGate({client:{auth:{getUser:async()=>({data:{user:{id:AUTH_A}},error:null})}},resolveMembership:async()=>proof(),storage,now:()=>TIME});
  const bound=gate.openStorage(await gate.verify());bound.setItem('progress','earlier');expect(gate.status().lastSaveSucceeded).toBe(true);
  const mutate=()=>failure==='write'?bound.setItem('progress','retried'):bound.removeItem('progress');
  storage[method].mockImplementation(()=>{throw Error('synthetic mutation failure');});
  expect(mutate).toThrow('synthetic mutation failure');
  storage.getItem.mockImplementationOnce(()=>{throw Error('synthetic read failure');});
  expect(()=>bound.getItem('progress')).toThrow('synthetic read failure');
  expect(gate.status()).toMatchObject({sameBrowserPersistence:false,lastSaveSucceeded:false,lastMutationSucceeded:false,ioFailure:failure,mutationFailure:failure,readFailure:true});
  expect(gate.status().message).toContain('browser '+label+' failed');
  expect(bound.getItem('progress')).toBe('earlier');
  expect(gate.status()).toMatchObject({sameBrowserPersistence:false,lastSaveSucceeded:false,lastMutationSucceeded:false,ioFailure:failure,mutationFailure:failure,readFailure:false});
  expect(bound.persistent).toBe(false);expect(gate.status().message).toContain('browser '+label+' failed');
  expect(mutate).toThrow('synthetic mutation failure');expect(memory.getItem(key(AUTH_A,STUDENT_A))).toBe('earlier');
  storage[method].mockImplementation(memory[method]);mutate();
  expect(gate.status()).toMatchObject({sameBrowserPersistence:true,lastSaveSucceeded:failure==='write',lastMutationSucceeded:true,lastMutation:failure,ioFailure:null,mutationFailure:null,readFailure:false});
  expect(bound.persistent).toBe(true);expect(memory.getItem(key(AUTH_A,STUDENT_A))).toBe(failure==='write'?'retried':null);
});
test('failed mapping metadata inspection cannot open data or erase earlier records',async()=>{
  const memory=store({'old-save':'retained'}),storage={getItem:()=>{throw Error('synthetic metadata read');},setItem:vi.fn(memory.setItem),removeItem:memory.removeItem};
  const gate=createStudentSaveGate({client:{auth:{getUser:async()=>({data:{user:{id:AUTH_A}},error:null})}},resolveMembership:async()=>proof(),storage,now:()=>TIME});
  expect(await gate.verify()).toMatchObject({kind:'unavailable',reason:'browser-storage-read-failed',sameBrowserPersistence:false});expect(storage.setItem).not.toHaveBeenCalled();expect(memory.dump()).toEqual({'old-save':'retained'});
});
test.each(['Auth','membership'])('bounded %s verification timeout ignores late success and leaves data untouched',async stage=>{
  vi.useFakeTimers();const f=fixture();let release;
  if(stage==='Auth')f.getUser.mockImplementationOnce(()=>new Promise(resolve=>{release=resolve;}));
  else f.resolveMembership.mockImplementationOnce(()=>new Promise(resolve=>{release=resolve;}));
  f.storage.setItem('old-save','retained');const before=f.storage.dump(),pending=f.gate.verify();await vi.advanceTimersByTimeAsync(2000);
  expect(await pending).toMatchObject({kind:'unavailable',reason:'verification-timeout',sameBrowserPersistence:false});
  release(stage==='Auth'?{data:{user:{id:AUTH_A}},error:null}:proof());await Promise.resolve();await Promise.resolve();
  expect(f.gate.status()).toMatchObject({kind:'unavailable',reason:'verification-timeout'});expect(f.storage.dump()).toEqual(before);expect(vi.getTimerCount()).toBe(0);
});
test('explicit event hookup invalidates old access and disposal unsubscribes without starting new verification',async()=>{
  const f=fixture();let callback;const unsubscribe=vi.fn();
  const client={auth:{getUser:f.getUser,onAuthStateChange:vi.fn(handler=>{callback=handler;return {data:{subscription:{unsubscribe}}};})}};
  const gate=createStudentSaveGate({client,resolveMembership:f.resolveMembership,storage:f.storage,now:()=>TIME});
  const stop=gate.connectAuthEvents(),receipt=await gate.verify(),bound=gate.openStorage(receipt);bound.setItem('progress','retained');callback('SIGNED_OUT');expect(bound.persistent).toBe(false);
  stop();expect(unsubscribe).toHaveBeenCalledTimes(1);const calls=f.getUser.mock.calls.length;gate.dispose();expect((await gate.verify()).kind).toBe('cancelled');expect(f.getUser).toHaveBeenCalledTimes(calls);callback('SIGNED_IN');expect(gate.status().reason).toBe('disposed');expect(f.storage.getItem(key(AUTH_A,STUDENT_A))).toBe('retained');
});
test('cleanup failure still revokes storage and can be retried without reconnecting',async()=>{
  const f=fixture(),unsubscribe=vi.fn().mockImplementationOnce(()=>{throw Error('synthetic unsubscribe');});
  const client={auth:{getUser:f.getUser,onAuthStateChange:()=>({data:{subscription:{unsubscribe}}})}};
  const gate=createStudentSaveGate({client,resolveMembership:f.resolveMembership,storage:f.storage,now:()=>TIME});gate.connectAuthEvents();const bound=gate.openStorage(await gate.verify());bound.setItem('progress','retained');
  expect(()=>gate.dispose()).toThrow('synthetic unsubscribe');expect(bound.persistent).toBe(false);expect(gate.status().reason).toBe('disposed');gate.dispose();expect(unsubscribe).toHaveBeenCalledTimes(2);expect(f.storage.getItem(key(AUTH_A,STUDENT_A))).toBe('retained');
});
