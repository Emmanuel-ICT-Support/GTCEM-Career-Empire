import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../../playable-3d/vendor/three/build/three.module.js';
const source=readFileSync(new URL('../../playable-3d/deferred-textures.js',import.meta.url),'utf8');
const create=vm.runInNewContext(source.replace(/^import .*;$/gm,'').replace(/export /g,'')+';createDeferredTextures;',{THREE,withAssetDeadline:p=>p,setTimeout});
const tick=()=>new Promise(resolve=>setTimeout(resolve,5));
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
