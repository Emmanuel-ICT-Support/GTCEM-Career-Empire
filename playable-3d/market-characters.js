import * as THREE from 'three';
import {GLTFLoader} from './vendor/three/examples/jsm/loaders/GLTFLoader.js';
import {clone} from './vendor/three/examples/jsm/utils/SkeletonUtils.js';

// Market-only delivery copies. Originals and the player's wardrobe are untouched.
export function marketCharacters(){
 const loader=new GLTFLoader(),cache=new Map(),actors=[],states=new Map();let loading;
 const url=id=>new URL(`./assets/market-npcs/${id}.glb`,import.meta.url).href;
 function register(anchor,id,{height=1.72,facing=0}={}){
  const fallback=[...anchor.children];anchor.name=`Market actor / ${id}`;
  actors.push({anchor,id,height,facing,fallback,last:anchor.position.clone(),loaded:false,mixer:null,walking:false});
 }
 async function load(id){
  states.set(id,'loading');
  try{
   const kit=cache.get(id)||await loader.loadAsync(url(id));cache.set(id,kit);
   for(const a of actors.filter(a=>a.id===id&&!a.loaded)){
    const model=clone(kit.scene);model.updateMatrixWorld(true);model.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.update();});
    const bounds=new THREE.Box3().setFromObject(model,true),height=bounds.max.y-bounds.min.y;
    if(!Number.isFinite(height)||height<.01)throw Error('Invalid character bounds');
    model.scale.multiplyScalar(a.height/height);model.updateMatrixWorld(true);model.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.update();});
    const grounded=new THREE.Box3().setFromObject(model,true);model.position.y-=grounded.min.y;
    model.rotation.y=a.facing;model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;}});
    const mixer=new THREE.AnimationMixer(model);
    const idle=kit.animations.find(c=>/standing_relax/i.test(c.name))||kit.animations.find(c=>/wait|idle/i.test(c.name));
    const walk=kit.animations.find(c=>/walk/i.test(c.name));
    a.idle=idle?mixer.clipAction(idle):null;a.walk=walk?mixer.clipAction(walk):null;
    a.idle?.play();mixer.update(.2);
    // Exported rest poses can place the hips differently from the idle clip.
    model.updateMatrixWorld(true);model.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.update();});
    model.position.y-=new THREE.Box3().setFromObject(model,true).min.y;
    model.updateMatrixWorld(true);
    a.fallback.forEach(o=>o.visible=false);a.anchor.add(model);Object.assign(a,{model,mixer,loaded:true,initialised:false});a.last.copy(a.anchor.position);
   }
   states.set(id,'ready');
  }catch(error){states.set(id,'fallback');console.warn(`Market character ${id} unavailable; keeping playable stand-in.`,error.message);}
 }
 return {register,
  start(){if(loading)return loading;const ids=[...new Set(actors.map(a=>a.id))].filter(id=>states.get(id)!=='ready');let index=0;const worker=async()=>{while(index<ids.length)await load(ids[index++]);};loading=Promise.all([worker(),worker()]).finally(()=>loading=null);return loading;},
  update(dt,reduced=false){for(const a of actors){
   const dx=a.anchor.position.x-a.last.x,dz=a.anchor.position.z-a.last.z;
   const moving=a.initialised&&Math.hypot(dx,dz)>Math.max(.002,dt*.04)&&Math.hypot(dx,dz)<.5;a.last.copy(a.anchor.position);
   if(!a.loaded||!a.anchor.visible)continue;a.initialised=true;
   const walk=moving&&!reduced&&Boolean(a.walk);
   if(walk!==a.walking){(walk?a.idle:a.walk)?.fadeOut(.2);(walk?a.walk:a.idle)?.reset().fadeIn(.2).play();a.walking=walk;}
   if(moving&&!['mara','sam'].includes(a.id))a.model.rotation.y=Math.atan2(dx,dz);
   if(!reduced)a.mixer.update(Math.min(dt,.1));
  }},
  snapshot(){return {total:actors.length,ready:actors.filter(a=>a.loaded).length,assets:Object.fromEntries(states)};}
 };
}
