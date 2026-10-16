import {test,expect} from './helper-fixtures.js';

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
 if(process.env.CE_DEPTH_PIXEL_PROOF==='1'){
 const shaderErrors=[];page.on('console',message=>{if(message.type()==='error')shaderErrors.push(message.text());});
 const parity=await page.evaluate(async()=>{
  const T=await import('three'),{createSoftwareDepthPass}=await import('/playable-3d/software-depth-pass.mjs');const renderer=new T.WebGLRenderer({antialias:true});renderer.setSize(128,96);renderer.autoClear=false;renderer.setClearColor(0xb4d4df,1);const target=new T.WebGLRenderTarget(128,96,{samples:4});renderer.setRenderTarget(target);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(45,128/96,.1,30);camera.position.set(3,3,6);camera.lookAt(0,0,0);scene.add(new T.HemisphereLight(0xffffff,0x334433,2));const sun=new T.DirectionalLight(0xffffff,3);sun.position.set(2,4,3);scene.add(sun);
  const floor=new T.Mesh(new T.PlaneGeometry(9,9),new T.MeshStandardMaterial({color:0x547b69,roughness:.8}));floor.rotation.x=-Math.PI/2;floor.position.y=-1;scene.add(floor);
  const material=new T.MeshStandardMaterial({color:0xb99c69,roughness:.5});material.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed.x += .1;');};const box=new T.Mesh(new T.BoxGeometry(1.5,2,1.5),material);box.rotation.y=.3;scene.add(box);
  const data=new Uint8Array(4*4*4);for(let i=0;i<16;i++)data.set([200,55,25,i%2?255:0],i*4);const texture=new T.DataTexture(data,4,4);texture.needsUpdate=true;const cutout=new T.Mesh(new T.PlaneGeometry(3,3),new T.MeshStandardMaterial({map:texture,alphaTest:.5,side:T.DoubleSide}));cutout.position.set(0,.2,1);scene.add(cutout);
  const glass=new T.Mesh(new T.SphereGeometry(.65,12,8),new T.MeshStandardMaterial({color:0x77bbff,transparent:true,opacity:.4,side:T.DoubleSide}));glass.position.set(-1,.2,.8);scene.add(glass);
  const originals=[];scene.traverse(o=>{if(o.isMesh)originals.push([o,o.material]);});const before=new Uint8Array(128*96*4),after=new Uint8Array(before.length);renderer.clear();renderer.render(scene,camera);renderer.readRenderTargetPixels(target,0,0,128,96,before);renderer.clear();createSoftwareDepthPass(renderer,T,true).render(scene,camera);renderer.render(scene,camera);renderer.readRenderTargetPixels(target,0,0,128,96,after);let changed=0,colourful=0;for(let i=0;i<before.length;i+=4){if(before.slice(i,i+4).some((v,j)=>v!==after[i+j]))changed++;if(before[i]!==before[0]||before[i+1]!==before[1]||before[i+2]!==before[2])colourful++;}return {changed,colourful,restored:originals.every(([o,m])=>o.material===m)};
 });
 expect(parity.changed).toBe(0);expect(parity.colourful).toBeGreaterThan(2000);expect(parity.restored).toBe(true);expect(shaderErrors).toEqual([]);console.log('DEPTH_PIXEL_EQUIVALENCE',JSON.stringify(parity));

 }

 const baked=await page.evaluate(async()=>{
  const T=await import('three'),{bakeStaticInstances}=await import('/playable-3d/software-static-instances.mjs');const renderer=new T.WebGLRenderer({antialias:true});renderer.setSize(128,96);renderer.autoClear=false;renderer.setClearColor(0xb4d4df,1);const target=new T.WebGLRenderTarget(128,96,{samples:4});renderer.setRenderTarget(target);const scene=new T.Scene(),camera=new T.PerspectiveCamera(45,128/96,.1,30);camera.position.set(0,2,7);camera.lookAt(0,0,0);scene.add(new T.HemisphereLight(0xffffff,0x334433,2));const light=new T.DirectionalLight(0xffffff,3);light.position.set(2,4,3);scene.add(light);
  const boxes=new T.InstancedMesh(new T.BoxGeometry(1,2,1),new T.MeshStandardMaterial({color:0xb99c69,roughness:.6}),3);for(let i=0;i<3;i++)boxes.setMatrixAt(i,new T.Matrix4().makeTranslation((i-1)*2,0,0));scene.add(boxes);
  const data=new Uint8Array(4*4*4);for(let i=0;i<16;i++)data.set([200,55,25,i%2?255:0],i*4);const texture=new T.DataTexture(data,4,4);texture.needsUpdate=true;const cutouts=new T.InstancedMesh(new T.PlaneGeometry(1.5,2),new T.MeshStandardMaterial({map:texture,alphaTest:.5,side:T.DoubleSide}),2);for(let i=0;i<2;i++)cutouts.setMatrixAt(i,new T.Matrix4().makeTranslation(i*2-1,0,1));scene.add(cutouts);const glass=new T.Mesh(new T.SphereGeometry(.6,12,8),new T.MeshStandardMaterial({color:0x77bbff,transparent:true,opacity:.4,side:T.DoubleSide}));glass.position.set(-1,.2,1.5);scene.add(glass);
  const before=new Uint8Array(128*96*4),after=new Uint8Array(before.length);renderer.clear();renderer.render(scene,camera);renderer.readRenderTargetPixels(target,0,0,128,96,before);const stats=await bakeStaticInstances(scene,{yieldFrame:async()=>{}});renderer.clear();renderer.render(scene,camera);renderer.readRenderTargetPixels(target,0,0,128,96,after);let changed=0,colourful=0;for(let i=0;i<before.length;i+=4){if(before.slice(i,i+4).some((v,j)=>v!==after[i+j]))changed++;if(before[i]!==before[0]||before[i+1]!==before[1]||before[i+2]!==before[2])colourful++;}return {stats,changed,colourful,glassRetained:glass.parent===scene};
 });
 console.log('STATIC_BAKE_PIXEL_EQUIVALENCE',JSON.stringify(baked));expect(baked.changed).toBe(0);expect(baked.colourful).toBeGreaterThan(1000);expect(baked.stats.instances).toBe(5);expect(baked.stats.triangles).toBe(40);expect(baked.glassRetained).toBe(true);

});
