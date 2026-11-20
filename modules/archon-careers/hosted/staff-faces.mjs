import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/loaders/GLTFLoader.js';
const templates=new Map();
export async function loadStaffFaces(){
 const loader=new GLTFLoader();
 await Promise.all(['girl','boy'].map(async name=>{
  const gltf=await loader.loadAsync('./art/staff-reference-'+name+'.glb');gltf.scene.updateMatrixWorld(true);
  const neck=gltf.scene.getObjectByName('mixamorigNeck')||gltf.scene.getObjectByName('mixamorig:Neck');
  const cutoff=neck.getWorldPosition(new T.Vector3()).y+.018;
  const group=new T.Group();
  gltf.scene.traverse(mesh=>{if(!mesh.isMesh)return;
   const src=mesh.geometry,pos=src.attributes.position,points=[],uvs=[],indices=[],uv=src.attributes.uv,v=new T.Vector3();
   for(let i=0;i<pos.count;i++){mesh.getVertexPosition(i,v);mesh.localToWorld(v);points.push(v.x,v.y,v.z);uvs.push(uv.getX(i),uv.getY(i));}
   const order=src.index?Array.from(src.index.array):Array.from({length:pos.count},(_,i)=>i);
   for(let i=0;i<order.length;i+=3){const tri=order.slice(i,i+3);if(tri.every(k=>points[k*3+1]>=cutoff))indices.push(...tri);}
   const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(points,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeVertexNormals();
   const mat=mesh.material.clone();mat.transparent=false;mat.opacity=1;mat.roughness=.82;mat.metalness=0;group.add(new T.Mesh(geo.toNonIndexed(),mat));
  });
  const box=new T.Box3();group.traverse(m=>{if(m.isMesh){const v=new T.Vector3();for(const index of (m.geometry.index?.array??Array.from({length:m.geometry.attributes.position.count},(_,i)=>i))){v.fromBufferAttribute(m.geometry.attributes.position,index);box.expandByPoint(v);}}});
  // Centre the textured face/hair crop using the actual retained vertices.
  const centre=box.getCenter(new T.Vector3()),scale=.29/(box.max.y-box.min.y);
  group.children.forEach(m=>{m.geometry.translate(-centre.x,-box.min.y,-centre.z);m.geometry.scale(scale,scale,scale);});
  templates.set(name,group);
 }));
}
export function attachStaffFace(body,model,code){
 const head=model.getObjectByName('Head');if(!head)return;
 const pivot=body.worldToLocal(head.getWorldPosition(new T.Vector3()));const cutoff=pivot.y+.004;
 model.traverse(mesh=>{if(!mesh.isMesh)return;const geo=mesh.geometry.clone(),indices=[],v=new T.Vector3(),ys=[];
  for(let i=0;i<geo.attributes.position.count;i++){mesh.getVertexPosition(i,v);mesh.localToWorld(v);body.worldToLocal(v);ys.push(v.y);}
  const order=geo.index?Array.from(geo.index.array):Array.from({length:ys.length},(_,i)=>i);
  for(let i=0;i<order.length;i+=3){const tri=order.slice(i,i+3);if(tri.some(k=>ys[k]<cutoff))indices.push(...tri);}
  geo.setIndex(indices);mesh.geometry=geo;
 });
 const kind=['EL','NS','EC'].includes(code)?'girl':'boy';const face=templates.get(kind).clone(true);face.name='Detailed textured face and hair '+code;
 face.position.set(0,cutoff-.006,.0);body.add(face);body.updateMatrixWorld(true);head.attach(face);
 body.userData.staffHeadTop=cutoff+.284;
}
