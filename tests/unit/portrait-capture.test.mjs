import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../../playable-3d/vendor/three/build/three.module.js';
const app=readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');
const body=app.slice(app.indexOf('async function capturePortraitFrame(){'),app.indexOf('function resize(){'));
function harness(){
 const raf=[],renders=[],sizes=[];let complete=false,encode,submitted=0,ratio=.5;
 class Reader{readAsDataURL(){this.result='data:image/png;base64,cGhvdG8=';queueMicrotask(()=>this.onload());}}
 const context={THREE,Promise,FileReader:Reader,portraitCapturePending:false,requestAnimationFrame:cb=>raf.push(cb),frameGate:{ready:()=>complete,submitted(){submitted++;}},renderer:{getSize:v=>v.set(1280,720),getPixelRatio:()=>ratio,setPixelRatio:v=>ratio=v,setSize:(w,h)=>sizes.push([w,h]),setViewport(){},clear(){},render:(scene,shot)=>renders.push({scene,aspect:shot.aspect})},actor:{model:{position:new THREE.Vector3(),rotation:{y:.7}}},camera:new THREE.PerspectiveCamera(),teachers:[],worlds:{town:new THREE.Scene()},canvas:{toBlob:cb=>encode=cb},revealLayout:()=>({photoCamera:[0,2,5],photoLook:[0,1,0]}),preparePortrait:actor=>actor.model.rotation.y=0,prepareCastPortrait(){}};
 const capture=vm.runInNewContext(body+';capturePortraitFrame;',context);
 return {context,capture,raf,renders,sizes,ready:()=>complete=true,encode:blob=>encode(blob),submitted:()=>submitted,ratio:()=>ratio};
}
test('portrait waits for the prior GPU frame, encodes asynchronously and restores the original viewport',async()=>{
 const h=harness(),photo=h.capture();expect(h.context.portraitCapturePending).toBe(true);h.raf.shift()();await new Promise(resolve=>setImmediate(resolve));expect(h.renders).toHaveLength(0);
 h.ready();h.raf.shift()();await new Promise(resolve=>setImmediate(resolve));expect(h.renders).toHaveLength(1);expect(h.renders[0].aspect).toBe(900/960);expect(h.submitted()).toBe(1);expect(h.context.portraitCapturePending).toBe(true);
 h.encode({});expect(await photo).toBe('data:image/png;base64,cGhvdG8=');expect(h.context.portraitCapturePending).toBe(false);expect(h.ratio()).toBe(.5);expect(h.sizes).toEqual([[900,960],[1280,720]]);expect(h.context.actor.model.rotation.y).toBe(.7);expect(h.renders).toHaveLength(1);
});
test('encoding failure restores the game and releases the photo frame reservation',async()=>{
 const h=harness(),photo=h.capture();h.ready();h.raf.shift()();await new Promise(resolve=>setImmediate(resolve));h.encode(null);await expect(photo).rejects.toThrow('encoded');expect(h.context.portraitCapturePending).toBe(false);expect(h.sizes.at(-1)).toEqual([1280,720]);expect(h.context.actor.model.rotation.y).toBe(.7);
});
