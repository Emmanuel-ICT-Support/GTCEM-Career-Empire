import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as T from '../../playable-3d/vendor/three/build/three.module.js';

test('entry then full environment creates deferred colliders once using the shared helper',async()=>{
 const source=readFileSync(new URL('../../playable-3d/environment.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replace('export async function','async function').replace(/await import\(['"]\.\/environment\/surroundings\.js\?v=[^'"]+['"]\)/g,'await loadSurroundings()');
 const desc={setTranslation(){return this;},setRotation(){return this;}},colliders=[];
 const surroundings=new T.Group();surroundings.userData={extraBeds:[[0,0,1,1]],treePlacements:[{x:0,z:0},{x:2,z:2}]};
 const canvasContext=new Proxy({createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{})});
 const context={T,RAPIER:{ColliderDesc:{cuboid:()=>({...desc}),cylinder:()=>({...desc})}},document:{createElement:()=>({getContext:()=>canvasContext})},addExteriorLandmarks(){},addTeachingExteriors(){},approvedPalette:()=>({}),polishGround(){},partitionInstances(){},shadowAnchor(){},loadSurroundings:async()=>({addSurroundings:async()=>surroundings})};
 const integrate=vm.runInNewContext(source+';integrateEnvironment;',context);
 const world={town:new T.Scene(),est:new T.Group(),campus:{},townPhysics:{world:{createCollider:d=>{colliders.push(d);return d;}}},phase(){},update(){},position:()=>new T.Vector3()};
 await integrate(world,{entryOnly:true});const entryCount=colliders.length;expect(entryCount).toBeGreaterThan(0);
 await integrate(world);expect(colliders).toHaveLength(entryCount+3);
 await integrate(world);expect(colliders).toHaveLength(entryCount+3);
});
