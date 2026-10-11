import {test,expect} from 'vitest';
import {Vector3,PerspectiveCamera} from '../../playable-3d/vendor/three/build/three.module.js';
import {revealLayout} from '../../playable-3d/reveal-layout.mjs';
test('off-centre oval arrivals still frame avatar centrally and include both teachers',()=>{
 for(const x of [-6.7,-4,-1.5]){
  const p={x,z:-57},layout=revealLayout(p),camera=new PerspectiveCamera(50,900/960,.1,200);
  camera.position.set(...layout.photoCamera);camera.lookAt(...layout.photoLook);camera.updateMatrixWorld();
  expect(new Vector3(p.x,.9,p.z).project(camera).x).toBeCloseTo(0);
  for(const id of ['middleton','psandodakis']){
   const projected=new Vector3(layout.teacherX(id),.9,layout.teacherZ(1)).project(camera);
   expect(Math.abs(projected.x)).toBeLessThan(.9);expect(Math.abs(projected.y)).toBeLessThan(.9);
   expect(Math.abs(layout.teacherX(id)-p.x)).toBeGreaterThan(2);
  }
 }
});

import {Group} from '../../playable-3d/vendor/three/build/three.module.js';
import {preparePortrait} from '../../playable-3d/reveal-layout.mjs';
test('first pose and retake both settle idle and face the portrait camera from any travel heading',()=>{
 for(const heading of [0,Math.PI,-Math.PI/2,1.2]){
  const model=new Group();model.position.set(-6.7,0,-57);model.rotation.y=heading;
  let walking=true,settled=false;
  const actor={model,setWalking:v=>walking=v,update:dt=>{settled=!walking&&dt>=.18;model.rotation.y=0;}};
  const layout=revealLayout(model.position);preparePortrait(actor,layout);
  expect(settled).toBe(true);
  const forward=new Vector3(0,0,1).applyQuaternion(model.quaternion);
  const toCamera=new Vector3(...layout.photoCamera).sub(model.position);toCamera.y=0;toCamera.normalize();
  expect(forward.dot(toCamera)).toBeCloseTo(1);
  expect(model.position.toArray()).toEqual([-6.7,0,-57]);
 }
});

import {prepareCastPortrait} from '../../playable-3d/reveal-layout.mjs';
test('portrait transaction arranges both real cast ids, makes roots visible and updates world matrices',()=>{const p={x:-4,z:-57};const cast=['middleton','psandodakis'].map(id=>{const root=new Group();root.visible=false;return {id,root,stagePose(x,z,walking){expect(walking).toBe(false);root.position.set(x,0,z);}};});prepareCastPortrait(cast,p);for(const n of cast){expect(n.root.visible).toBe(true);const world=n.root.getWorldPosition(new Vector3());expect(world.x).toBeCloseTo(revealLayout(p).teacherX(n.id));expect(world.z).toBeCloseTo(revealLayout(p).teacherZ(1));}expect(Math.abs(cast[0].root.position.x-cast[1].root.position.x)).toBeGreaterThan(4);expect(()=>prepareCastPortrait([cast[0]],p)).toThrow(/Both teachers/);expect(()=>prepareCastPortrait([cast[0],cast[0]],p)).toThrow(/Both teachers/);});
