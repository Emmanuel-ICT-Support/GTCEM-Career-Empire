import * as T from 'three';
import {indexExactVertices} from './environment/exact-index.mjs?v=software-instance-bake-20261016';

// Static instancing saves storage but repeats matrix/normal work in every GPU
// vertex. Bake those same transforms once on software backends. No instance,
// triangle, material, detail level or attribute is removed.
export async function bakeStaticInstances(root,{yieldFrame=()=>new Promise(resolve=>requestAnimationFrame(resolve))}={}){
 const originals=[];root.traverse(o=>{const g=o.geometry,m=o.material;if(o.isInstancedMesh&&o.count>0&&!o.instanceColor&&!o.customDepthMaterial&&!o.customDistanceMaterial&&o.instanceMatrix.usage===T.StaticDrawUsage&&!o.userData.walkable&&!o.children.length&&!Array.isArray(m)&&!m.displacementMap&&m.onBeforeCompile===T.Material.prototype.onBeforeCompile&&!g.isInstancedBufferGeometry&&!Object.values(g.morphAttributes||{}).some(a=>a.length)&&Object.values(g.attributes).every(a=>!a.isInterleavedBufferAttribute&&!a.isInstancedBufferAttribute&&a.usage===T.StaticDrawUsage&&a.count===g.attributes.position.count)&&g.drawRange.start===0&&!Number.isFinite(g.drawRange.count))originals.push(o);});
 let started=performance.now();const stats={meshes:0,instances:0,triangles:0};
 for(const original of originals){
  const prototype=indexExactVertices(original.geometry.clone()),geometry=new T.BufferGeometry(),attributes={};
  for(const [name,a]of Object.entries(prototype.attributes)){const copy=a.clone();copy.array=new a.array.constructor(a.array.length*original.count);copy.count=a.count*original.count;attributes[name]=copy;geometry.setAttribute(name,copy);}
  const sourceIndex=prototype.index,vertexCount=prototype.attributes.position.count,indices=[];const matrix=new T.Matrix4();
  for(let i=0;i<original.count;i++){
   original.getMatrixAt(i,matrix);const transformed=prototype.clone().applyMatrix4(matrix);
   for(const [name,a]of Object.entries(transformed.attributes)){const target=attributes[name].array,bytes=new Uint8Array(target.buffer,target.byteOffset,target.byteLength);bytes.set(new Uint8Array(a.array.buffer,a.array.byteOffset,a.array.byteLength),i*a.array.byteLength);}
   for(let j=0;j<(sourceIndex?.count??vertexCount);j++)indices.push((sourceIndex?sourceIndex.getX(j):j)+i*vertexCount);
   transformed.dispose();if(performance.now()-started>8){await yieldFrame();started=performance.now();}
  }
  geometry.setIndex(indices);geometry.computeBoundingBox();geometry.computeBoundingSphere();
  const mesh=new T.Mesh(geometry,original.material);mesh.name=original.name;mesh.userData=original.userData;mesh.position.copy(original.position);mesh.quaternion.copy(original.quaternion);mesh.scale.copy(original.scale);mesh.matrix.copy(original.matrix);mesh.matrixAutoUpdate=original.matrixAutoUpdate;mesh.visible=original.visible;mesh.castShadow=original.castShadow;mesh.receiveShadow=original.receiveShadow;mesh.renderOrder=original.renderOrder;mesh.layers.mask=original.layers.mask;mesh.frustumCulled=original.frustumCulled;mesh.customDepthMaterial=original.customDepthMaterial;mesh.customDistanceMaterial=original.customDistanceMaterial;
  const parent=original.parent;if(parent.isLOD)for(const level of parent.levels)if(level.object===original)level.object=mesh;
  parent.add(mesh);original.removeFromParent();original.dispose();prototype.dispose();stats.meshes++;stats.instances+=original.count;stats.triangles+=indices.length/3;
  if(performance.now()-started>8){await yieldFrame();started=performance.now();}
 }
 return stats;
}
