import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/loaders/GLTFLoader.js';
const roles=Object.freeze({EL:'owner',CP:'chef',NS:'waiter',RE:'cashier',EC:'cleaner'});
const teams=Object.freeze({A:'juniper',B:'lantern'});
const loader = new GLTFLoader();
const models = new Map();
let running=0;
const queue=[];
function operate(){
 while(running<3&&queue.length){
  const {key,resolve}=queue.shift();running++;
  loader.loadAsync(new URL('./art/board-staff/'+key+'.glb',import.meta.url).href).then(g=>{
   const src=g.scene, b=new T.Box3().setFromObject(src), size=b.getSize(new T.Vector3()), center=b.getCenter(new T.Vector3());
   if(![size.x,size.y,size.z].every(Number.isFinite)||size.y<.1||size.x<.1||size.z<=0)throw new Error('invalid board staff bounds');
   const scale=Math.min(1.05/size.y,.77/Math.hypot(size.x,size.z));
   const pivot=new T.Group();pivot.name='Optimized board staff '+key;pivot.userData.staffAsset=key;pivot.userData.motion='whole-piece-hop';pivot.add(src);src.scale.multiplyScalar(scale);
   src.position.set(-center.x*scale,.070-b.min.y*scale,-center.z*scale);
   src.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true;}});
   resolve(pivot);
  }).catch(e=>{console.warn('Board staff fallback:',key,e?.message);resolve(null);}).finally(()=>{running--;operate();});
 }
}
export function getStaticStaff(team,code){
 if(!teams[team]||!roles[code])return Promise.resolve(null);
 const key=teams[team]+'-'+roles[code];
 if(!models.has(key)) models.set(key,new Promise(resolve=>{queue.push({key,resolve});operate();}));
 return models.get(key).then(pivot=>pivot?.clone(true)??null);
}
export function staffLandingHeight(t,reducedMotion){
 return reducedMotion?.025:.025+.145*Math.sin(Math.PI*Math.min(1,Math.max(0,t)));
}

// Replace presentation only after a successful load. A late completion for a
// removed round cannot resurrect its piece or change any match coordinates.
export async function installStaticStaff(piece,{request=getStaticStaff}={}){
 if(!teams[piece.team]||!roles[piece.code])return false;
 const body=piece.body;
 let model;try{model=await request(piece.team,piece.code);}catch{return false;}
 if(!model||!piece.root.parent||piece.body!==body||body.parent!==piece.root)return false;
 piece.rig?.mixer?.stopAllAction();
 body.clear();delete body.userData.staffClothing;
 body.scale.setScalar(1);body.add(model);
 piece.rig=null;piece.limbs=[];piece.staticStaff=true;
 return true;
}
