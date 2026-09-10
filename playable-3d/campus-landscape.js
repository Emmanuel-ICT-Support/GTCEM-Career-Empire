import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
function mergeStatic(root){
 root.updateMatrixWorld(true);const groups=new Map();root.traverse(o=>{if(!o.isMesh)return;const materials=Array.isArray(o.material)?o.material:[o.material];if(materials.length!==1)throw new Error('Unexpected multi-material campus mesh');const m=materials[0],g=o.geometry.clone().applyMatrix4(o.matrixWorld);if(!g.attributes.uv)g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(g.attributes.position.count*2),2));const key=m.uuid;if(!groups.has(key))groups.set(key,{material:m,geometries:[]});groups.get(key).geometries.push(g);});const result=new THREE.Group();for(const {material,geometries}of groups.values()){const geometry=mergeGeometries(geometries.map(g=>g.index?g.toNonIndexed():g),false);if(!geometry)throw new Error('Campus geometry merge failed');const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=mesh.receiveShadow=true;result.add(mesh);}return result;
}
export async function createCampusLandscape(scene,physics){
const group=new THREE.Group();group.name='Campus landscape';scene.add(group);
const loader=new GLTFLoader(),placements=[];const colliders=[];
const pavingTexture=await new THREE.TextureLoader().loadAsync('./assets/plaza/limestone-ecc-campus-v1.png');pavingTexture.colorSpace=THREE.SRGBColorSpace;pavingTexture.wrapS=pavingTexture.wrapT=THREE.RepeatWrapping;
const paving=new THREE.MeshStandardMaterial({map:pavingTexture,color:0xd9cfb7,roughness:1,side:THREE.DoubleSide}),soil=new THREE.MeshStandardMaterial({color:0x615345,roughness:1}),edge=new THREE.MeshStandardMaterial({color:0xc8c0a6,roughness:1});
function rect(x,z,w,d,material,y=.095){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),material);m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.receiveShadow=true;group.add(m);return m;}
function path(points,width){const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,.085,z)),false,'centripetal');const a=[],uv=[],ix=[];for(let i=0;i<=120;i++){const t=i/120,p=curve.getPoint(t),v=curve.getTangent(t),n=new THREE.Vector3(-v.z,0,v.x).multiplyScalar(width/2);for(const s of [-1,1]){const q=p.clone().addScaledVector(n,s);a.push(q.x,q.y,q.z);uv.push(q.x/3,q.z/3);}if(i<120){let k=i*2;ix.push(k,k+2,k+1,k+1,k+2,k+3);}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();const m=new THREE.Mesh(g,paving);m.receiveShadow=true;group.add(m);}
path([[-7,25],[-7,18],[-7,8],[-6,5],[-6,2],[-6,-1],[-3,-4],[0,-8.4]],4.2);
path([[-7,5],[-12.4,5]],4);path([[-7,18],[-13,18],[-13,12],[-19,12],[-19,14.8]],3.2);
path([[0,8],[8,8],[15,8],[15,13]],3.6);
path([[-7,5],[-8,0],[-11,-5],[-17,-5]],3.2);
path([[9,8],[10,2],[11,-5],[13,-9],[13,-16],[9,-20],[0,-22]],3.2);
path([[-20,-22],[-8,-22],[5,-22],[18,-22]],3.2);
path([[-11,-5],[-11,-14],[-11,-19],[-15,-22]],3.2);
const plaza=new THREE.Mesh(new THREE.CircleGeometry(5.5,64),paving);plaza.rotation.x=-Math.PI/2;plaza.position.set(0,.09,4);plaza.receiveShadow=true;group.add(plaza);
const water=new THREE.Mesh(new THREE.CircleGeometry(1,96),new THREE.MeshStandardMaterial({color:0x488c98,roughness:.28,metalness:.15}));water.rotation.x=-Math.PI/2;water.scale.set(17.156,4.746,1);water.position.set(0,.07,-28.582);water.material.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,0,1),26)];group.add(water);
function add(id,x,z,scale=1,rotation=0){placements.push({id,x,z,scale,rotation});}
const beds=[[-10.7,13.5,1.4,8],[-3.7,13.2,1.3,6],[-19,-8.6,7,2.3],[-16,-1.7,6,1.4],[7.5,-2.5,1.7,7],[15.7,-16.8,2.2,5],[3,-20,5,1.4],[-17,-19.5,5,1.5],[22,3,6,1.8]];
beds.forEach(([x,z,w,d],j)=>{rect(x,z,w,d,soil,.1);colliders.push([x,.25,z,w,.5,d]);rect(x-w/2-.09,z,.18,d+.3,edge,.13);rect(x+w/2+.09,z,.18,d+.3,edge,.13);rect(x,z-d/2-.09,w,.18,edge,.13);rect(x,z+d/2+.09,w,.18,edge,.13);for(let i=0;i<5;i++){const px=x+(w>d?(i-2)*w/5:0),pz=z+(d>w?(i-2)*d/5:0);add(i%2?'silver-shrub':'olive-shrub',px,pz,.65,(i+j)*1.3);add('tufted-grass',px+.4,pz+.35,.7,i);if(i%2===0)add('yellow-flower-clump',px-.3,pz-.25,.6,j);}});
[[-11,20],[-3,21],[-13,10],[-1,13],[-22,-11],[-17,-12],[-8,-18],[-20,-19],[8,-18],[18,-21],[16,-3],[23,4],[6,12],[25,21]].forEach(([x,z],i)=>add(i%2?'mature-eucalypt-a':'mature-eucalypt-b',x,z,.78,i));
[[-20,-2],[-14,-9],[7,-6],[18,1],[-3,9]].forEach(([x,z],i)=>add('small-multistem-a',x,z,.65,i));
[[-19,-8],[8,-4],[16,-16],[-17,-19]].forEach(([x,z],i)=>add('boulder-a',x,z,.8,i));

for(const id of [...new Set(placements.map(p=>p.id))]){const asset=await loader.loadAsync(`./assets/campus-landscape/${id}.glb`);asset.scene=mergeStatic(asset.scene);asset.scene.updateMatrixWorld(true);const ps=placements.filter(p=>p.id===id);asset.scene.traverse(o=>{if(!o.isMesh)return;const inst=new THREE.InstancedMesh(o.geometry,o.material,ps.length);ps.forEach((p,i)=>{const m=new THREE.Matrix4().compose(new THREE.Vector3(p.x,.12,p.z),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),p.rotation),new THREE.Vector3(p.scale,p.scale,p.scale));m.multiply(o.matrixWorld);inst.setMatrixAt(i,m);});inst.castShadow=true;inst.receiveShadow=true;group.add(inst);});}
const garden=await loader.loadAsync('./assets/campus-buildings/garden.glb');garden.scene.updateMatrixWorld(true);const shade=new THREE.Group();garden.scene.traverse(o=>{if(o.isMesh&&/shade|bench|table/i.test(o.name)){const m=new THREE.Mesh(o.geometry,o.material);m.applyMatrix4(o.matrixWorld);m.castShadow=true;m.receiveShadow=true;shade.add(m);}});const bb=new THREE.Box3().setFromObject(shade),centre=bb.getCenter(new THREE.Vector3());shade.position.set(-centre.x,-bb.min.y,-centre.z);const normalized=new THREE.Group();normalized.add(shade);for(const [x,z]of [[-17,-5],[10,-1]]){const n=normalized.clone(true);n.position.set(x,.1,z);group.add(n);for(const dx of [-3.5,3.5])for(const dz of [-2,2])colliders.push([x+dx,1.6,z+dz,.15,3.2,.15]);rect(x,z,8.2,5.2,paving,.105);}

for(const p of placements.filter(p=>p.id.includes('eucalypt')||p.id.includes('multistem')))colliders.push([p.x,1.5,p.z,.4,3,.4]);
const buildings=[];
for(const spec of [{id:'careers',name:'Careers Advice Centre',x:-19,z:18,width:8,depth:6},{id:'workplace',name:'First Workplace',x:15,z:18,width:12,depth:8}]){
 const asset=await loader.loadAsync(`./assets/campus-buildings/${spec.id}.glb`);
 // Reuse the building, porch, furniture and planting. The display plate gives way to campus paths.
 for(const child of [...asset.scene.children])if(/^Whole item paving/i.test(child.name))asset.scene.remove(child);
 const model=mergeStatic(asset.scene);model.name=spec.name;model.rotation.y=Math.PI;model.position.set(spec.x,0,spec.z);scene.add(model);
 // Side/rear walls and front jambs leave the authored doorway (module centred at local x=-1) open.
 const front=spec.z-spec.depth/2,back=spec.z+spec.depth/2;
 colliders.push([spec.x-spec.width/2,1.8,spec.z,.24,3.6,spec.depth],[spec.x+spec.width/2,1.8,spec.z,.24,3.6,spec.depth],[spec.x,1.8,back,spec.width,3.6,.24]);
 const entryX=spec.x+1,left=spec.x-spec.width/2,right=spec.x+spec.width/2;
 const leftWidth=entryX-.88-left,rightWidth=right-entryX-.88;
 colliders.push([left+leftWidth/2,1.8,front,leftWidth,3.6,.24],[right-rightWidth/2,1.8,front,rightWidth,3.6,.24]);
 // Walkable landing/floor with a low rise, within the existing character autostep height.
 colliders.push([spec.x,.1,spec.z,spec.width,.2,spec.depth]);
 rect(entryX,front-1.5,3.4,3.4,paving,.105);
 buildings.push({...spec,front,entrance:[entryX,front],outward:[0,-1],model});
}
for(const b of colliders)physics.block(...b);
// Northern water remains outside the walking boundary; eastern pond and fountain use existing bodies.
return {group,buildings:buildings.map(({model,...spec})=>spec),placements,colliders:colliders.length};
}
