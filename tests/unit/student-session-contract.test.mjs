import {test,expect,vi,afterEach} from 'vitest';
import {browserRun} from '../../playable-3d/game-session.mjs';
import {verifyStudentMembership,createStudentSaveGate} from '../../playable-3d/student-session-contract.mjs';

const AUTH_A='11111111-1111-4111-8111-111111111111',AUTH_B='22222222-2222-4222-8222-222222222222';
const STUDENT_A='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',STUDENT_B='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const SCHOOL='cccccccc-cccc-4ccc-8ccc-cccccccccccc',CLASS='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const TIME=100000;
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
afterEach(()=>vi.unstubAllGlobals());

test('contract rejects local student labels without verified Auth',async()=>{
  const resolveMembership=vi.fn();
  const gate=createStudentSaveGate({storage:store(),resolveMembership,
    studentLogin:{id:STUDENT_A},session:{studentId:STUDENT_A},now:()=>TIME});
  expect(await gate.verify()).toMatchObject({kind:'guest',sameBrowserPersistence:false,cloudPersistence:false});
  expect(resolveMembership).not.toHaveBeenCalled();expect(()=>gate.openStorage()).toThrow('no-auth-client');
});
test('contract binds only a matching server membership to the verified Auth subject',async()=>{
  const f=fixture();expect(await f.gate.verify()).toMatchObject({kind:'verified-student',identity:{authUserId:AUTH_A,studentId:STUDENT_A,schoolId:SCHOOL,classId:CLASS}});
  expect(f.resolveMembership).toHaveBeenCalledWith(AUTH_A);
  f.gate.openStorage().setItem('progress','owned');expect(f.storage.dump()).toEqual({['ce-player:'+AUTH_A+':progress']:'owned'});
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
  const f=fixture();await f.gate.verify();const old=f.gate.openStorage();old.setItem('progress','preserved');
  f.getUser.mockRejectedValueOnce(Error('synthetic offline'));
  expect(await f.gate.verify()).toMatchObject({kind:'unavailable',sameBrowserPersistence:false});
  expect(old.persistent).toBe(false);expect(()=>old.setItem('progress','wrong')).toThrow('stale identity');
  expect(f.storage.getItem('ce-player:'+AUTH_A+':progress')).toBe('preserved');
  f.resolveMembership.mockRejectedValueOnce(Error('synthetic membership offline'));
  expect(await f.gate.verify()).toMatchObject({kind:'unavailable',reason:'membership-verification-unavailable'});
});
test('logout invalidates old readers, writers and removers without erasing their records',async()=>{
  const f=fixture();await f.gate.verify();const old=f.gate.openStorage();old.setItem('progress','preserved');
  f.gate.onAuthEvent('SIGNED_OUT');expect(old.persistent).toBe(false);
  expect(()=>old.getItem('progress')).toThrow('stale identity');expect(()=>old.setItem('progress','wrong')).toThrow('stale identity');expect(()=>old.removeItem('progress')).toThrow('stale identity');
  expect(f.gate.status()).toMatchObject({kind:'guest',reason:'signed-out',sameBrowserPersistence:false});
  expect(f.storage.getItem('ce-player:'+AUTH_A+':progress')).toBe('preserved');
});
test('proof expiry blocks subsequent storage access at the exact boundary',async()=>{
  const f=fixture();await f.gate.verify();const old=f.gate.openStorage();old.setItem('progress','preserved');
  f.clock.value=TIME+10000;expect(()=>old.setItem('progress','wrong')).toThrow('stale identity');
  expect(f.gate.status()).toMatchObject({reason:'expired-membership',sameBrowserPersistence:false});
  expect(f.storage.getItem('ce-player:'+AUTH_A+':progress')).toBe('preserved');
});
test('account switch requires re-verification and never imports another owner or legacy save',async()=>{
  const f=fixture();f.storage.setItem('career-empire-old-save','legacy');f.storage.setItem('ce-player:'+AUTH_B+':progress','existing B');
  await f.gate.verify();const a=f.gate.openStorage();a.setItem('progress','owned A');
  f.gate.onAuthEvent('SIGNED_IN');f.user.id=AUTH_B;f.resolveMembership.mockResolvedValue(proof(AUTH_B));
  const pending=f.gate.verify();expect(()=>a.setItem('progress','wrong')).toThrow('stale identity');
  expect(f.gate.status().kind).toBe('checking');await pending;
  const b=f.gate.openStorage();expect(b.getItem('progress')).toBe('existing B');b.setItem('progress','owned B');
  expect(f.storage.dump()).toEqual({'career-empire-old-save':'legacy',['ce-player:'+AUTH_A+':progress']:'owned A',['ce-player:'+AUTH_B+':progress']:'owned B'});
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
  const f=fixture();expect(f.gate.status().lastSaveSucceeded).toBe(false);await f.gate.verify();
  expect(f.gate.status()).toMatchObject({sameBrowserPersistence:true,cloudPersistence:false,lastSaveSucceeded:false});
  expect(f.gate.status().message).toContain('Same-browser saving is available');
  f.gate.openStorage().setItem('progress','local');expect(f.gate.status()).toMatchObject({lastSaveSucceeded:true,cloudPersistence:false});
  expect(f.gate.status().message).toContain('Saved on this browser');
});
test('a failed storage write does not claim saving succeeded and retains the earlier value',async()=>{
  const memory=store(),storage={getItem:memory.getItem,removeItem:memory.removeItem,setItem:vi.fn(memory.setItem)};
  const gate=createStudentSaveGate({client:{auth:{getUser:async()=>({data:{user:{id:AUTH_A}},error:null})}},resolveMembership:async()=>proof(),storage,now:()=>TIME});
  await gate.verify();const bound=gate.openStorage();bound.setItem('progress','earlier');storage.setItem.mockImplementationOnce(()=>{throw Error('synthetic quota');});
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
