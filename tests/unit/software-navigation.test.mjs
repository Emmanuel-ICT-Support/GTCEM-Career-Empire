import {test,expect} from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
import {STEP,createLocomotion,accumulateTravelTime,turnTowards} from '../../playable-3d/locomotion.js';

const app=fs.readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');
const helpers=app.slice(app.indexOf('function takeNavigationElapsed('),app.indexOf('function animate(){'));
const frame=app.slice(app.indexOf('function animate(){'),app.indexOf('  updateTeacherLoading();'))+'\n}';
const reset=app.slice(app.indexOf('function resetNavigationInput(){'),app.indexOf('\nfunction explorationMenuOpen('));
class Position{
 constructor(x=0,y=0,z=23.3){Object.assign(this,{x,y,z});}
 clone(){return new Position(this.x,this.y,this.z);}
 set(x,y,z){Object.assign(this,{x,y,z});return this;}
 copy(p){return this.set(p.x,p.y,p.z);}
 distanceToSquared(p){return (this.x-p.x)**2+(this.y-p.y)**2+(this.z-p.z)**2;}
 lerpVectors(a,b,t){return this.set(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,a.z+(b.z-a.z)*t);}
}
function harness(){
 let now=0,steps=0,gaitSeconds=0,observations=0,clue=false;
 const flags={},position=new Position(),physical=position.clone(),keys=new Set(['KeyW']);
 const c=vm.createContext({softwareNavigationAt:0,clock:{getElapsedTime:()=>now},performance:{now:()=>now*1000},camera:{},detailFailed:false,requestAnimationFrame:()=>{},lastTime:0,publishDiagnostics:()=>observations++,updateEntryLoading:()=>{},document:{get hidden(){return Boolean(flags.hidden);},querySelectorAll:()=>[]},frames:0,renderedFrames:7,metricsTime:0,orientationTour:null,discoveryHandover:{open:()=>Boolean(flags.handover)},flyover:{get active(){return Boolean(flags.flyover);},refresh(){}},feedbackOpen:()=>Boolean(flags.feedback),mode:'town',entryReady:true,marketOpening:false,intro:{open:()=>Boolean(flags.intro)},discovery:{open:()=>clue||Boolean(flags.clue),reduced:()=>false,update:(mode,p,dt)=>{if(flags.parcel&&p.z<=22)clue=true;expect(dt).toBe(0);}},marketDialogOpen:()=>Boolean(flags.marketDialog),watchingEST:false,$:id=>({hidden:id==='module-overlay'?!flags.module:true,open:id==='reflection-dialog'&&Boolean(flags.reflection)}),explorationMenuOpen:()=>Boolean(flags.options),helperPicker:{open:()=>Boolean(flags.picker)},echo:{open:()=>Boolean(flags.echo)},tapMovement:null,keys,joystick:{x:0,z:0,reset(){}},drag:null,locomotion:createLocomotion(),accumulator:0,STEP,accumulateTravelTime,turnTowards,yaw:0,teachers:[],renderMotion:null,actor:{model:{position,rotation:{y:0}},setWalking(){},update:dt=>gaitSeconds+=dt},worlds:{move:(space,delta)=>{steps++;physical.x+=delta.x;physical.z+=delta.z;return physical;},update(){},scenery:{status:'ready'}},space:()=>false,campusReady:true,marketTravelCooldownUntil:0,prepareNextTask(){},updateInteraction(){},updateMission(){}});
 vm.runInContext(reset+'\n'+helpers+'\n'+frame,c);
 const tick=(t,draw=false)=>{now=t;if(draw)c.animate();else c.advanceSoftwareNavigation();};
 return {c,flags,tick,setTime:t=>now=t,position,keys,get steps(){return steps;},get gaitSeconds(){return gaitSeconds;},get observations(){return observations;},get clue(){return clue;}};
}
test('accepted walking advances through a stalled canvas without inventing rendered frames',()=>{
 const h=harness();for(let ms=16;ms<1800;ms+=16)h.tick(ms/1000);h.tick(1.8);
 expect((23.3-h.position.z)/1.8).toBeGreaterThan(2.2);expect(h.steps).toBeGreaterThan(100);
 expect(h.c.renderedFrames).toBe(7);expect(h.gaitSeconds).toBeCloseTo(1.8,8);expect(h.observations).toBeGreaterThan(100);
});
test('timer ticks and resumed animation callbacks consume each physics and gait interval once',()=>{
 const stalled=harness(),mixed=harness();
 for(let ms=16;ms<1800;ms+=16){stalled.tick(ms/1000);if(ms%128===0)mixed.tick(ms/1000,true);mixed.tick(ms/1000);}
 stalled.tick(1.8);mixed.tick(1.8,true);mixed.tick(1.8);
 expect(mixed.position.z).toBeCloseTo(stalled.position.z,8);expect(mixed.steps).toBe(stalled.steps);expect(mixed.gaitSeconds).toBeCloseTo(1.8,8);
});
test('native frame updates retain the same fixed-step travel and gait time',()=>{
 const software=harness(),native=harness();native.c.softwareNavigationAt=null;
 for(let ms=16;ms<1800;ms+=16){software.tick(ms/1000);native.tick(ms/1000,true);}
 software.tick(1.8);native.tick(1.8,true);
 expect(native.position.z).toBeCloseTo(software.position.z,8);expect(native.steps).toBe(software.steps);expect(native.gaitSeconds).toBeCloseTo(software.gaitSeconds,8);
});
test('key release and navigation reset do not replay an earlier held interval',()=>{
 const h=harness();for(let ms=16;ms<=800;ms+=16)h.tick(ms/1000);h.keys.clear();
 for(let ms=816;ms<=1500;ms+=16)h.tick(ms/1000);const stopped=h.position.z;
 for(let ms=1516;ms<=2200;ms+=16)h.tick(ms/1000);expect(Math.abs(h.position.z-stopped)).toBeLessThan(.001);
 h.c.resetNavigationInput();h.tick(4);expect(Math.abs(h.position.z-stopped)).toBeLessThan(.001);
});
test('proximity clues stop walking even before another canvas frame',()=>{
 const h=harness();h.flags.parcel=true;for(let ms=16;ms<=1800;ms+=16)h.tick(ms/1000);
 expect(h.clue).toBe(true);expect(h.position.z).toBeGreaterThan(21.9);expect(h.c.renderedFrames).toBe(7);
});
for(const guard of ['entry','opening','studio','intro','clue','hidden','feedback','marketDialog','est','module','reflection','options','picker','echo','flyover','handover'])test(`${guard} still blocks software navigation without a render callback`,()=>{
 const h=harness();
 if(guard==='entry')h.c.entryReady=false;else if(guard==='opening')h.c.marketOpening=true;else if(guard==='studio')h.c.mode='studio';else if(guard==='est')h.c.watchingEST=true;else h.flags[guard]=true;
 for(let ms=16;ms<=1000;ms+=16)h.tick(ms/1000);
 expect(h.steps).toBe(0);expect(h.position.z).toBe(23.3);expect(h.c.renderedFrames).toBe(7);
});

function releaseHandler(h){let handler;h.c.window={addEventListener:(name,fn)=>{handler=fn;}};const start=app.indexOf("window.addEventListener('keyup'");const end=app.indexOf("window.addEventListener('blur'",start);vm.runInContext(app.slice(start,end),h.c);return handler;}
test('software key release settles the real held interval before removing intent, without extra frames',()=>{
 const h=harness(),release=releaseHandler(h);h.tick(.016);h.setTime(.6);release({code:'KeyW'});expect(23.3-h.position.z).toBeGreaterThan(.2);expect(h.steps).toBeLessThanOrEqual(30);expect(h.keys.has('KeyW')).toBe(false);expect(h.c.renderedFrames).toBe(7);
});
test('release settlement preserves paused guards and the unchanged half-second catch-up cap',()=>{
 const paused=harness(),releasePaused=releaseHandler(paused);paused.flags.options=true;paused.setTime(5);releasePaused({code:'KeyW'});expect(paused.steps).toBe(0);
 const h=harness(),release=releaseHandler(h);h.setTime(5);release({code:'KeyW'});expect(h.steps).toBeLessThanOrEqual(30);expect(23.3-h.position.z).toBeLessThan(1.5);
});
test('native key release retains the existing frame-only timing path',()=>{const h=harness();h.c.softwareNavigationAt=null;const release=releaseHandler(h);h.setTime(.6);release({code:'KeyW'});expect(h.steps).toBe(0);expect(h.keys.has('KeyW')).toBe(false);});
