import {buildMedia} from './media-building.js';
import {buildSpace} from './space-building.js';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
// Stage 2 composition study. Reference-derived silhouettes, not enterable buildings.
export async function addSurroundings(scene){
 const root=new T.Group();root.name='Stage 2 proposed campus surroundings';scene.add(root);
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.88});
 const stone=mat(0xc4bda7),glass=mat(0x668992),fin=mat(0x454c4b),roof=mat(0xb8c6c4),blue=mat(0x31596f);
 function box(g,w,h,d,m,x,y,z){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.receiveShadow=true;g.add(o);return o;}
 // Compact aerial relationship: SPACE west of admin; Media southwest, angled into the oval; mural end toward SPACE.
 const english=buildMedia();english.position.set(-32,0,21);english.rotation.y=-.6;english.scale.setScalar(.9);root.add(english);
 const space=buildSpace();space.position.set(-49,0,-11);space.scale.setScalar(.85);root.add(space);
 // Home Economics is a low connecting roofline, subordinate to the hero Chapel.
 box(root,12,2.8,3,stone,43,1.4,-26);box(root,13,.25,4.4,roof,43,2.95,-25.7);
 // Reuse the approved eucalypt model for a consistent distant campus canopy.
 let originalGrass;scene.traverse(o=>{if(o.isMesh&&!originalGrass){const ms=Array.isArray(o.material)?o.material:[o.material];originalGrass=ms.find(m=>m.map?.image?.src?.includes('grass-ecc-campus'));}});
 if(!originalGrass)throw Error('Existing campus grass material missing');
 // Continue exactly the original 2-unit tile grid and material, excluding existing tiles.
 const positions=[];for(let x=-86;x<52;x+=2)for(let z=-42;z<78;z+=2){if(x>=-26&&x<28&&z>=-26&&z<28)continue;positions.push([x+1,z+1]);}
 const ground=new T.InstancedMesh(new T.PlaneGeometry(2,2),originalGrass,positions.length);ground.name='Continued campus grass tiles';const q=new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),-Math.PI/2);positions.forEach(([x,z],i)=>ground.setMatrixAt(i,new T.Matrix4().compose(new T.Vector3(x,0,z),q,new T.Vector3(1,1,1))));ground.receiveShadow=true;ground.computeBoundingSphere();root.add(ground);
 // Australian rules oval: continuous grass, oval perimeter, four posts at each end.
 const points=[];for(let i=0;i<=128;i++){const a=i/128*Math.PI*2;points.push(new T.Vector3(-54+23*Math.cos(a),.025,43+29*Math.sin(a)));}
 const line=new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0xeeeede,transparent:true,opacity:.55}));root.add(line);
 const postMat=mat(0xe1e4dc);for(const z of [14,72])for(const dx of [-7,-2.4,2.4,7]){const h=Math.abs(dx)<3?5:3.1;box(root,.12,h,.12,postMat,-54+dx,h/2,z);}
 const asset=await new GLTFLoader().loadAsync('./assets/campus-landscape/mature-eucalypt-a.glb');asset.scene.updateMatrixWorld(true);
 const bounds=new T.Box3().setFromObject(asset.scene),center=bounds.getCenter(new T.Vector3()),height=bounds.max.y-bounds.min.y;
 const normal=new T.Matrix4().makeTranslation(-center.x,-bounds.min.y,-center.z);
 // Staggered western and southern tree belt, outside the playing oval.
 const trees=[];
 for(let i=0;i<20;i++)trees.push({x:-81.5+(i%2)*2,z:-25+i*5.05,h:6.5+(i%4)*.55});
 for(let i=0;i<13;i++)trees.push({x:-76+i*4.5,z:75+(i%2)*.9,h:6.8+(i%3)*.65});
 root.userData.treePlacements=trees;
 asset.scene.traverse(o=>{if(!o.isMesh)return;const geo=o.geometry.clone().applyMatrix4(o.matrixWorld).applyMatrix4(normal);const inst=new T.InstancedMesh(geo,o.material,trees.length);inst.name='Oval edge eucalypts';trees.forEach(({x,z,h},i)=>{const scale=h/height;inst.setMatrixAt(i,new T.Matrix4().compose(new T.Vector3(x,0,z),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),i*1.7),new T.Vector3(scale,scale,scale)));});inst.castShadow=inst.receiveShadow=true;inst.computeBoundingSphere();root.add(inst);});
 return root;
}
