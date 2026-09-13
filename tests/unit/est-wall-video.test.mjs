import {test} from 'vitest';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../../playable-3d/est-wall-video.js',import.meta.url),'utf8').replace("import * as THREE from 'three';",'').replace('export function','function');
function fixture(){
 let active=false;const calls=[];
 const video={error:null,currentTime:12,setAttribute(){},addEventListener(){},load(){calls.push('load');},pause(){calls.push('pause');},play(){calls.push('play');return active?Promise.resolve():Promise.reject(Error('No user gesture'));}};
 class Material{constructor(options){Object.assign(this,options);}}
 class Mesh{constructor(){this.position={set(){}};}}
 const context={document:{createElement:()=>video,body:{append(){}}},Promise,THREE:{MeshBasicMaterial:Material,MeshStandardMaterial:Material,Mesh,PlaneGeometry:class{},BoxGeometry:class{},TextureLoader:class{load(){return {};}},VideoTexture:class{},SRGBColorSpace:'srgb'}};
 vm.createContext(context);vm.runInContext(source+';globalThis.player=createESTWallVideo({add(){}});',context);
 return {player:context.player,video,calls,tap(fn){active=true;try{return fn();}finally{active=false;}}};
}
test('cold audible start calls native play inside the user gesture without fetching a blob',async()=>{const f=fixture();await f.tap(()=>f.player.play());assert.deepEqual(f.calls,['load','play']);assert.match(f.video.src,/est-lab-systems\.mp4/);assert.equal(f.video.playsInline,true);});
test('preparation is idempotent; restart remains within the tap and resets position',async()=>{const f=fixture();await f.player.prepare();await f.player.prepare();await f.tap(()=>f.player.restart());assert.deepEqual(f.calls,['load','play']);assert.equal(f.video.currentTime,0);});
test('closing immediately pauses without a deferred play; reopening does not reload',async()=>{const f=fixture();const p=f.tap(()=>f.player.play());f.player.pause();await p;assert.deepEqual(f.calls,['load','play','pause']);await f.tap(()=>f.player.play());assert.equal(f.calls.filter(x=>x==='load').length,1);});
test('load errors can be retried and playback rejection reaches the caller',async()=>{const f=fixture();await assert.rejects(f.player.play(),/No user gesture/);f.video.error={code:2};await f.tap(()=>f.player.play());assert.equal(f.calls.filter(x=>x==='load').length,2);});
