import {test,expect} from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
import {STEP,createLocomotion,accumulateTravelTime,turnTowards} from '../../playable-3d/locomotion.js';

const app=fs.readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');
// Execute production navigation through its frame boundary, before rendering.
const navigation=app.slice(app.indexOf('function animate(){'),app.indexOf('  updateTeacherLoading();'))+'\n}';
const stepping=app.slice(app.indexOf('function takeNavigationElapsed('),app.indexOf('function animate(){'));
const reset=app.slice(app.indexOf('function resetNavigationInput(){'),app.indexOf('\nfunction explorationMenuOpen('));
class Position{
 constructor(x=0,y=0,z=0){Object.assign(this,{x,y,z});}
 clone(){return new Position(this.x,this.y,this.z);}
 copy(p){return this.set(p.x,p.y,p.z);}
 set(x,y,z){Object.assign(this,{x,y,z});return this;}
 distanceToSquared(p){return (this.x-p.x)**2+(this.y-p.y)**2+(this.z-p.z)**2;}
 lerpVectors(a,b,t){return this.set(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,a.z+(b.z-a.z)*t);}
}
for(const panel of ['Options','companion picker','Echo','discovery handover'])test(`${panel} freezes the displayed player instead of stepping to a pending physics pose`,()=>{
 const shown=new Position(),physical=new Position(.03,0,0),keys=new Set(['KeyW']);let physicsSteps=0,walking=true;
 const c=vm.createContext({softwareNavigationAt:null,nativeNavigationAt:null,camera:{},detailFailed:false,requestAnimationFrame:()=>{},clock:{getElapsedTime:()=>2},lastTime:1,publishDiagnostics:()=>{},updateEntryLoading:()=>{},document:{hidden:false,querySelectorAll:()=>[]},frames:0,metricsTime:0,orientationTour:null,discoveryHandover:{open:()=>panel==='discovery handover'},flyover:null,feedbackOpen:()=>false,mode:'town',entryReady:true,marketOpening:false,intro:null,discovery:null,marketDialogOpen:()=>false,watchingEST:false,$:id=>({hidden:true,open:false}),explorationMenuOpen:()=>panel==='Options',helperPicker:{open:()=>panel==='companion picker'},echo:panel==='Echo'?{open:()=>true}:null,tapMovement:null,keys,joystick:{x:0,z:0,reset(){}},drag:null,locomotion:createLocomotion(),accumulator:0,STEP,accumulateTravelTime,turnTowards,yaw:0,teachers:[],renderMotion:{previous:shown.clone(),current:physical.clone(),shown:shown.clone()},actor:{model:{position:shown,rotation:{y:0}},setWalking:v=>walking=v,update:()=>{}},worlds:{move:()=>{physicsSteps++;return physical;},update:()=>{},scenery:{status:'ready'}},space:()=>false,campusReady:true,performance:{now:()=>0},marketTravelCooldownUntil:0,prepareNextTask:()=>{},updateInteraction:()=>{},updateMission:()=>{}});
 vm.runInContext(reset+'\n'+stepping+'\n'+navigation,c);c.animate();
 expect(physicsSteps).toBe(0);expect([shown.x,shown.z]).toEqual([0,0]);expect(walking).toBe(false);expect(c.accumulator).toBe(0);
});
