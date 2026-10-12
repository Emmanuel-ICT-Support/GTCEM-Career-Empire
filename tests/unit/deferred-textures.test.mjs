import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../../playable-3d/vendor/three/build/three.module.js';
const source=readFileSync(new URL('../../playable-3d/deferred-textures.js',import.meta.url),'utf8');
const create=vm.runInNewContext(source.replace(/^import .*;$/gm,'').replace(/export /g,'')+';createDeferredTextures;',{THREE,withAssetDeadline:p=>p,setTimeout});
const tick=()=>new Promise(resolve=>setTimeout(resolve,5));
test('critical mural artwork starts before decorative surfaces without duplicate requests',async()=>{
 const calls=[],target=new THREE.Texture(),queue=create();
 const loader={loadAsync:async url=>{calls.push(url);return new THREE.Texture({src:url,width:1024});}};
 await queue.load(loader,'decorative-stone',{target:new THREE.Texture()});await queue.load(loader,'media-mural',{target});
 await queue.startMatching(url=>url==='media-mural');expect(calls).toEqual(['media-mural']);expect(target.image.width).toBe(1024);expect(queue.pending).toBe(1);
 await queue.start();expect(calls).toEqual(['media-mural','decorative-stone']);expect(queue.pending).toBe(0);
});
test('cloned mural panels retain their source, artwork and UV crop through queued hydration',async()=>{
 let calls=0,hydrate;const target=new THREE.Texture({src:'neutral'}),panel=target.clone(),shared=target.source;panel.offset.set(.4,.383);panel.repeat.set(.6,.617);
 const queue=create({scheduleHydration:fn=>new Promise(resolve=>{hydrate=()=>resolve(fn());})});
 expect(queue.defer({loadAsync:async()=>{calls++;return new THREE.Texture({src:'original-mural'});}},'mural',{target,shareSource:true})).toBe(target);expect(calls).toBe(0);
 const batch=queue.start();await tick();expect(panel.image.src).toBe('neutral');hydrate();await batch;
 expect(target.source).toBe(shared);expect(panel.source).toBe(shared);expect(panel.image.src).toBe('original-mural');expect(panel.offset.toArray()).toEqual([.4,.383]);expect(panel.repeat.toArray()).toEqual([.6,.617]);expect(calls).toBe(1);expect(queue.pending).toBe(0);
});
test('failed grass is reported and retried before held decorative downloads drain',async()=>{
 const failures=[],calls=new Map(),releases=[];
 const queue=create({onFailure:e=>failures.push(e.message)});
 const loader={loadAsync:url=>{calls.set(url,(calls.get(url)||0)+1);if(url==='grass'&&calls.get(url)===1)return Promise.reject(Error('grass unavailable'));if(url==='grass')return Promise.resolve(new THREE.Texture({src:'original-grass'}));return new Promise(resolve=>releases.push(()=>resolve(new THREE.Texture({src:url}))));}};
 const target=new THREE.Texture();target.colorSpace=THREE.SRGBColorSpace;target.wrapS=THREE.RepeatWrapping;
 await queue.load(loader,'grass',{target,flipY:false});for(let i=0;i<4;i++)await queue.load(loader,'decor-'+i,{target:new THREE.Texture()});
 let drained=false;const batch=queue.start().then(()=>{drained=true;});await tick();
 expect(failures).toEqual(['grass unavailable']);expect(drained).toBe(false);expect(queue.failed).toBe(1);
 const retry=queue.retry();expect(queue.retry()).toBe(retry);await retry;
 expect(calls.get('grass')).toBe(2);expect(target.image.src).toBe('original-grass');expect(target.flipY).toBe(false);expect(target.colorSpace).toBe(THREE.SRGBColorSpace);expect(target.wrapS).toBe(THREE.RepeatWrapping);
 expect(queue.failed).toBe(0);expect(drained).toBe(false);expect(queue.pending).toBe(4);
 releases.forEach(release=>release());await batch;expect(queue.pending).toBe(0);expect([...calls.values()]).toEqual([2,1,1,1,1]);
});
test('failed retry remains retryable and does not reject until its own attempt finishes',async()=>{
 let attempts=0;const queue=create();await queue.load({loadAsync:()=>{attempts++;return Promise.reject(Error('offline'));}},'grass',{target:new THREE.Texture()});
 await expect(queue.start()).rejects.toThrow('Please retry');await expect(queue.retry()).rejects.toThrow('Please retry');expect(queue.failed).toBe(1);expect(attempts).toBe(2);
});
test('decoded artwork awaiting its upload budget is pending, not a download failure',async()=>{
 let hydrate;const failures=[];const target=new THREE.Texture();const queue=create({onFailure:e=>failures.push(e),scheduleHydration:fn=>new Promise(resolve=>{hydrate=()=>resolve(fn());})});await queue.load({loadAsync:async()=>new THREE.Texture({src:'original-grass'})},'grass',{target});let done=false;const batch=queue.start().then(()=>{done=true;});await tick();expect(queue.pending).toBe(1);expect(queue.failed).toBe(0);expect(failures).toEqual([]);expect(done).toBe(false);hydrate();await batch;expect(target.image.src).toBe('original-grass');expect(queue.pending).toBe(0);
});
