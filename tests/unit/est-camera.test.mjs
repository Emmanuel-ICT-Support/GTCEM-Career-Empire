import {test,expect} from 'vitest';
import {estEyeHeight,estPlayTop} from '../../playable-3d/est-camera.mjs';
import {PerspectiveCamera,Vector3} from '../../playable-3d/vendor/three/build/three.module.js';
test('rear-clamped EST view frames its actual screen centre at desktop and phone widths',()=>{
 for(const [width,fov]of [[1440,55],[390,62]]){
  const feet=.015,camera=new PerspectiveCamera(fov,width/900,.08,220),screen=new Vector3(0,3.3,-6.48);
  camera.position.set(0,feet+3,6.75);camera.lookAt(0,feet+.9,5);camera.updateMatrixWorld(true);expect(screen.clone().project(camera).y).toBeGreaterThan(.85);
  camera.position.y=feet+estEyeHeight(1.75);camera.lookAt(0,feet+.9,5);camera.updateMatrixWorld(true);const projected=screen.clone().project(camera);expect(Math.abs(projected.y)).toBeLessThan(.85);expect(projected.z).toBeGreaterThan(0);expect(projected.z).toBeLessThan(1);
 }
});
test('unconstrained indoor height remains unchanged and near-wall height is bounded',()=>{expect(estEyeHeight(4.2)).toBe(3);expect(estEyeHeight(10)).toBe(3);expect(estEyeHeight(1.75)).toBeCloseTo(1.25);expect(estEyeHeight(0)).toBe(1.2);});

test('EST wall control stays below phone header without changing a free desktop anchor',()=>{expect(estPlayTop(.6075,900,205,52)).toBe(239);expect(estPlayTop(.7012,900,66,52)).toBeCloseTo(134.46);expect(estPlayTop(-1,500,66,52)).toBe(466);});
