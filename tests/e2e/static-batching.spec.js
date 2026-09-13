import {test,expect} from '@playwright/test';

test('static batches retain world geometry, material identity and transparent surfaces',async({page})=>{
 await page.route('**/batch-harness',r=>r.fulfill({contentType:'text/html',body:'<script type="importmap">{"imports":{"three":"/playable-3d/vendor/three/build/three.module.js","three/addons/":"/playable-3d/vendor/three/examples/jsm/"}}</script>'}));
 await page.goto('/batch-harness');
 const r=await page.evaluate(async()=>{
  const T=await import('three'),{batchStatic,partitionInstances}=await import('/playable-3d/environment/static-batching.js');
  const root=new T.Group();root.position.set(4,1,-7);root.rotation.y=.7;root.scale.set(1.2,.8,1.1);
  const opaque=new T.MeshStandardMaterial(),glass=new T.MeshStandardMaterial({transparent:true,opacity:.3});
  for(let i=0;i<4;i++){const child=new T.Mesh(new T.BoxGeometry(1,2,3),i===3?glass:opaque);child.position.set(i*2,1,i);child.rotation.z=i*.2;child.castShadow=child.receiveShadow=true;root.add(child);}
  root.updateMatrixWorld(true);
  const vertices=node=>{const result=[];node.traverse(o=>{if(!o.isMesh)return;const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry;const v=new T.Vector3();for(let i=0;i<g.attributes.position.count;i++){v.fromBufferAttribute(g.attributes.position,i).applyMatrix4(o.matrixWorld);result.push(v.toArray());}});return result.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);};
  const before=vertices(root),batched=batchStatic(root);batched.updateMatrixWorld(true);const after=vertices(batched);
  // Match nearest source point, avoiding floating-point order changes for coplanar faces.
  const error=Math.max(...before.map(a=>Math.min(...after.map(b=>Math.hypot(...a.map((n,i)=>n-b[i]))))));
  const plant=new T.InstancedMesh(new T.BoxGeometry(2,4,2),opaque,4);plant.name='Approved tufted-grass';plant.castShadow=plant.receiveShadow=true;
  const expected=[];for(let i=0;i<4;i++){const m=new T.Matrix4().compose(new T.Vector3(i*19,0,i*13),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),i*.7),new T.Vector3(.6+i*.1,.8,.7));plant.setMatrixAt(i,m);const read=new T.Matrix4();plant.getMatrixAt(i,read);expected.push(read.toArray());}
  const group=new T.Group();group.add(plant);partitionInstances(group);
  const actual=[];group.traverse(o=>{if(o.isInstancedMesh)for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);actual.push(m.toArray());}});
  return {vertices:[before.length,after.length],error,meshes:batched.children.length,materials:batched.children.every(m=>m.material===opaque||m.material===glass),transparent:batched.children.filter(m=>m.material===glass).length,expected,actual,bounds:group.children.every(o=>o.boundingSphere?.radius>0),states:group.children.every(o=>o.name===plant.name&&o.castShadow&&o.receiveShadow)};
 });
 expect(r.vertices[0]).toBe(r.vertices[1]);expect(r.error).toBeLessThan(.00001);expect(r.meshes).toBe(2);expect(r.materials).toBe(true);expect(r.transparent).toBe(1);expect(r.actual).toEqual(r.expected);expect(r.bounds).toBe(true);expect(r.states).toBe(true);
});
