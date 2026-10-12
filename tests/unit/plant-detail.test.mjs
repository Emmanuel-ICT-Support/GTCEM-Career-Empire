import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as T from '../../playable-3d/vendor/three/build/three.module.js';
const source=readFileSync(new URL('../../playable-3d/ecc-preview/authored-garden.js',import.meta.url),'utf8');
const thin=vm.runInNewContext(source.slice(source.indexOf('export function thinGeometry'),source.indexOf('function addDistanceDetail')).replace('export ', '')+';thinGeometry;',{T,cache:new Map()});
test('reduced leaf detail keeps source vertices, normals and UVs and leaves the full asset intact',()=>{
 const full=new T.PlaneGeometry(12,8,6,4),before=full.index.array.slice(),expanded=full.toNonIndexed(),low=thin(full,6,4);
 expect(low.attributes.position.count).toBe(expanded.attributes.position.count/4);expect(full.index.array).toEqual(before);expect(thin(full,6,4)).toBe(low);
 for(const [name,attribute]of Object.entries(low.attributes)){
  const original=expanded.attributes[name],size=attribute.itemSize;
  for(let i=0;i<attribute.count;i++){const values=[...attribute.array.slice(i*size,(i+1)*size)];const match=Array.from({length:original.count},(_,j)=>[...original.array.slice(j*size,(j+1)*size)]).some(row=>row.every((value,j)=>value===values[j]));expect(match).toBe(true);}
 }
});
test('spatial partitioning preserves managed detail levels instead of rendering high and low together',()=>{
 const code=readFileSync(new URL('../../playable-3d/environment/static-batching.js',import.meta.url),'utf8');const partition=vm.runInNewContext(code.slice(code.indexOf('export function partitionInstances')).replace('export ','')+';partitionInstances;',{T});
 const root=new T.Group(),lod=new T.LOD(),material=new T.MeshBasicMaterial(),high=new T.InstancedMesh(new T.BoxGeometry(),material,4),low=new T.InstancedMesh(new T.PlaneGeometry(),material,4);
 for(const object of [high,low])for(let i=0;i<4;i++)object.setMatrixAt(i,new T.Matrix4().makeTranslation(i%2?2:-2,0,i<2?-2:2));lod.addLevel(high,0);lod.addLevel(low,1);root.add(lod);partition(root);
 expect(lod.levels.map(level=>level.object)).toEqual([high,low]);expect(lod.children).toEqual([high,low]);const camera=new T.PerspectiveCamera();camera.position.z=10;camera.updateMatrixWorld();lod.update(camera);expect(high.visible).toBe(false);expect(low.visible).toBe(true);
});
