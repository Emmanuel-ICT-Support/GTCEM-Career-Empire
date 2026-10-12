import {test,expect,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../../playable-3d/vendor/three/build/three.module.js';
import {withAssetDeadline} from '../../playable-3d/startup-assets.mjs';
const app=readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};

function marketHarness(){
 const pending=[],urls=[],modes=[],messages=[];let created=0;
 const kit={createNightMarket:()=>{created++;return {scene:{}};}};
 const source=app.slice(app.indexOf('async function openMarket(){'),app.indexOf('async function leaveMarketByGate(){')).replace(/import\(([^)]+)\)/g,'importMarket($1)');
 const cancel=app.slice(app.indexOf('function cancelMarketOpening('),app.indexOf('// Capture only the already-loaded market scene'));
 const context={AbortController,withAssetDeadline,importMarket:url=>{urls.push(url);const p=deferred();pending.push(p);return p.promise;},resetNavigationInput(){},actor:{setWalking(){}},toast:m=>messages.push(m),setMode:async mode=>modes.push(mode),worlds:{town:{environment:{}},campusGrass:{},campusPalette:{}},marketBriefingImage(){},gameStorage:{},returnTown(){},console:{warn(){}}};
 const api=vm.runInNewContext('let marketOpening=false,marketTravelRequest=0,marketTravelController=null,marketModuleAttempt=0,nightMarket=null;'+cancel+source+';({openMarket,cancelMarketOpening,state:()=>({opening:marketOpening,attempt:marketModuleAttempt})});',context);
 return {api,pending,urls,modes,messages,kit,created:()=>created};
}
test('later navigation releases Market loading and late import cannot switch back',async()=>{
 const h=marketHarness(),first=h.api.openMarket();expect(h.api.state().opening).toBe(true);h.api.cancelMarketOpening('studio');expect(h.api.state().opening).toBe(false);await first;
 h.pending[0].resolve(h.kit);await Promise.resolve();expect(h.created()).toBe(0);expect(h.modes).toEqual([]);
});
test('cancelled request completion cannot clear a newer Market request',async()=>{
 const h=marketHarness(),first=h.api.openMarket();h.api.cancelMarketOpening('town');const second=h.api.openMarket();h.pending[0].resolve(h.kit);await first;expect(h.api.state().opening).toBe(true);
 h.pending[1].resolve(h.kit);await second;expect(h.created()).toBe(1);expect(h.modes).toEqual(['market']);expect(h.api.state().opening).toBe(false);
});
test('stalled Market import has bounded recovery, fresh retry and no late navigation',async()=>{
 vi.useFakeTimers();try{const h=marketHarness(),first=h.api.openMarket();await vi.advanceTimersByTimeAsync(15000);await first;expect(h.api.state()).toEqual({opening:false,attempt:1});expect(h.messages.at(-1)).toContain('could not open');expect(vi.getTimerCount()).toBe(0);
  h.pending[0].resolve(h.kit);await Promise.resolve();expect(h.created()).toBe(0);const retry=h.api.openMarket();expect(h.urls[1]).toContain('&retry=1');h.pending[1].resolve(h.kit);await retry;expect(h.modes).toEqual(['market']);expect(h.created()).toBe(1);
 }finally{vi.useRealTimers();}
});
function exitHarness(){const pending=deferred(),modes=[],teleports=[];const context={mode:'market',modeRequest:1,marketLeaving:false,resetNavigationInput(){},actor:{setWalking(){},model:{position:{copy(){}},rotation:{}}},ensureCampus:()=>pending.promise,setMode:async mode=>{context.mode=mode;context.modeRequest++;modes.push(mode);},worlds:{teleport:(...p)=>teleports.push(p),position:()=>({})},performance:{now:()=>100},marketTravelCooldownUntil:0,yaw:0,updateCamera(){},setLocation(){},canvas:{focus(){}},toast(){}};const source=app.slice(app.indexOf('async function leaveMarketByGate(){'),app.indexOf('function returnTown(){'));const leave=vm.runInNewContext(source+';leaveMarketByGate;',context);return {pending,modes,teleports,context,leave};}
test('a newer Market choice owns navigation while an earlier physical exit prepares campus',async()=>{const h=exitHarness(),exit=h.leave();h.context.modeRequest++;h.pending.resolve();await exit;expect(h.modes).toEqual([]);expect(h.teleports).toEqual([]);expect(h.context.marketLeaving).toBe(false);});
test('an unchanged physical exit reaches campus once and releases its guard',async()=>{const h=exitHarness(),exit=h.leave();h.pending.resolve();await exit;expect(h.modes).toEqual(['town']);expect(h.teleports).toEqual([[false,43,-17.8]]);expect(h.context.marketLeaving).toBe(false);});
function teacherHarness(failures){
 let now=0;const urls=[];
 const source=app.slice(app.indexOf('function updateTeacherLoading(){'),app.indexOf('function greetTeacher(')).replace(/import\(([^)]+)\)/g,'importTeachers($1)');
 const context={Math,Map,document:{hidden:false},performance:{now:()=>now},console:{warn(){}},discoveryReview:true,discovery:{revealed:()=>false,snapshot:()=>({step:3}),reduced:()=>false},mode:'town',actor:{model:{position:new THREE.Vector3(-4,0,-57)}},worlds:{},explore:async()=>true,importTeachers:async url=>{urls.push(url);if(failures-->0)throw Error('module offline');return {TEACHERS:[{id:'middleton'},{id:'psandodakis'}],createTeacherNPC:async(_,c)=>({id:c.id,near:()=>false})};}};
 const api=vm.runInNewContext('const teachers=[],teacherFailures=new Map();let teacherLoading=false,teacherAttempted=false,ovalVisitRecorded=false,teacherLoad,teacherModuleFailure=null,teacherModuleRequest=0;'+source+';({loadTeachers,updateTeacherLoading,state:()=>({count:teachers.length,attempted:teacherAttempted,loading:teacherLoading,failure:teacherModuleFailure})});',context);
 return {api,urls,time:t=>now=t};
}
test('teacher module failure retries after backoff with a fresh URL and shares loaded actors',async()=>{
 const h=teacherHarness(1);await h.api.updateTeacherLoading();expect(h.api.state()).toMatchObject({count:0,attempted:false,loading:false,failure:{attempts:1,retryAt:2000}});
 h.time(1999);await h.api.updateTeacherLoading();expect(h.urls).toHaveLength(1);h.time(2001);await h.api.updateTeacherLoading();expect(h.urls[1]).toContain('&retry=1');expect(h.api.state()).toMatchObject({count:2,failure:null});await h.api.loadTeachers({explicit:true});expect(h.urls).toHaveLength(2);
});
test('automatic teacher module retries stay bounded while explicit student retry recovers',async()=>{
 const h=teacherHarness(3);for(const t of [0,2001,6002]){h.time(t);await h.api.updateTeacherLoading();}expect(h.api.state().failure.attempts).toBe(3);h.time(60000);await h.api.updateTeacherLoading();expect(h.urls).toHaveLength(3);await h.api.loadTeachers({explicit:true});expect(h.api.state()).toMatchObject({count:2,failure:null});
});
test('paused heartbeat publishes new UI state without inventing rendered frames or pixel reads',()=>{
 const diagnostic={dataset:{}},model=new THREE.Group();model.position.set(1,0,2);const discovery={step:3},echo={helper:'none'};
 const context={$:()=>diagnostic,gameSession:{isGuest:true,id:'paused'},document:{documentElement:{dataset:{}}},entryReady:true,worlds:{pendingSurfaceDetails:0,arrivalOnly:false,scenery:{}},detailFailed:false,preparing:false,renderer:{getPixelRatio:()=>.5,info:{render:{calls:20,triangles:100}},getContext(){throw Error('paused readback');}},renderBackend:'software',lastRenderMs:4,discovery:{snapshot:()=>({...discovery})},intro:{snapshot:()=>({open:false})},echo:{snapshot:()=>({...echo})},actor:{model,profile:{body:'antonio'},clips:{}},campusReady:true,teachers:[],mode:'town',phase:'flourishing',state:{activeId:'avery'},pixelDiagnostics:true,frames:0,metricsTime:0,canvas:{dataset:{}}};
 Object.assign(context,{explorationTools:null,explorationMenuOpen:()=>false,marketOpening:false,teacherLoading:false,teacherModuleFailure:null});const source=app.slice(app.indexOf('let renderedFrames=0,'),app.indexOf('function animate(){'));
 const publish=vm.runInNewContext(source+';publishDiagnostics;',context);publish(1.1);discovery.step=4;echo.helper='sprout';publish(2.2);const state=JSON.parse(diagnostic.dataset.state);expect(state.discovery.step).toBe(4);expect(state.echo.helper).toBe('sprout');expect(state.renderedFrames).toBe(0);expect(state.fps).toBe(0);expect(context.canvas.dataset.rendered).toBeUndefined();
});

test('repeated manual module failures use unique URLs after automatic retries stop',async()=>{
 const h=teacherHarness(5);for(const t of [0,2001,6002]){h.time(t);await h.api.updateTeacherLoading();}
 for(let i=0;i<2;i++)await h.api.loadTeachers({explicit:true});
 await h.api.loadTeachers({explicit:true});
 expect(h.api.state()).toMatchObject({count:2,failure:null});
 expect(h.urls).toHaveLength(6);expect(new Set(h.urls).size).toBe(6);
 expect(h.urls.slice(1).map(url=>new URL(url,'https://game.test/').searchParams.get('retry'))).toEqual(['1','2','3','4','5']);
});
