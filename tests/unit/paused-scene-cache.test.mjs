import {test,expect} from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';

const app=fs.readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');
const stamp=app.slice(app.indexOf('function sceneViewStamp('),app.indexOf('function animate(){'));
const decision=app.slice(app.indexOf('  let frameStamp=null;'),app.indexOf('  renderer.setViewport(0,0,viewport.width,viewport.height);renderer.setScissorTest(false);renderer.clear();'));
function harness(){
 const c=vm.createContext({paused:false,softwareNavigationAt:0,lastPausedSceneStamp:null,scene:{uuid:'town',children:[]},mode:'town',phase:'flourishing',$:()=>({value:'auto'}),viewport:{width:1280,height:720},entryReady:true,campusReady:false,worlds:{scenery:{status:'pending'}},actor:{model:{uuid:'avatar',rotation:{y:0},position:{toArray:()=>[0,0,0]}}},camera:{position:{toArray:()=>[0,3,6]},quaternion:{toArray:()=>[0,0,0,1]}},teachers:[],discovery:null,echo:null,draws:0});
 vm.runInContext(stamp+'\nfunction draw(){'+decision+'draws++;lastPausedSceneStamp=frameStamp;return true;}',c);return c;
}
test('entering a paused panel reuses an unchanged submitted software frame',()=>{
 const c=harness();expect(c.draw()).toBe(true);c.paused=true;expect(c.draw()).toBeUndefined();expect(c.draws).toBe(1);
});
test('real viewport, model, scenery and camera changes require an honest new draw',()=>{
 const c=harness();c.draw();c.paused=true;
 for(const change of [()=>c.viewport.width=390,()=>c.actor.model.uuid='selected-avatar',()=>c.campusReady=true,()=>c.camera.position.toArray=()=>[1,3,6]]){
  change();const before=c.draws;expect(c.draw()).toBe(true);expect(c.draws).toBe(before+1);expect(c.draw()).toBeUndefined();
 }
});
test('native active views keep drawing rather than using the software cache',()=>{
 const c=harness();c.softwareNavigationAt=null;c.draw();c.draw();expect(c.draws).toBe(2);expect(c.lastPausedSceneStamp).toBe(null);
});
