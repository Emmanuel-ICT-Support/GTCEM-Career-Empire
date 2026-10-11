import {test,expect} from 'vitest';
import {Vector3} from '../../playable-3d/vendor/three/build/three.module.js';
import {keepOutdoorClearance,keepChapelClearance,insideCanopy} from '../../playable-3d/camera-clearance.mjs';
const T={Vector3},p=new Vector3();
test('clear views stay untouched; obstructed close view can recover above a low obstacle',()=>{
 const camera={position:new Vector3(0,3,6)};const clear={protectCamera(){throw Error('clear view should not be retraced');}};
 expect(keepOutdoorClearance(T,clear,p,camera,0)).toBe(false);
 camera.position.set(0,1.4,.2);
 expect(keepOutdoorClearance(T,{protectCamera(){}},p,camera,0)).toBe(true);
 expect(camera.position.z).toBe(6.4);expect(camera.position.y).toBe(3.1);
});
test('blocked alternatives never override existing collision-safe camera position',()=>{
 const camera={position:new Vector3(0,1.4,.2)},before=camera.position.clone();
 expect(keepOutdoorClearance(T,{protectCamera(_inside,_p,q){q.set(0,1.4,.2);}},p,camera,Math.PI)).toBe(false);
 expect(camera.position.equals(before)).toBe(true);
});

test('Chapel doorway clamp gets a stable collision-checked side view without changing the player',()=>{const p=new Vector3(0,0,7.9),camera={position:new Vector3(0,1.95,8.05)},before=p.clone();const world={protectCamera(inside,_p,q){expect(inside).toBe('chapel');q.z=Math.min(q.z,8.05);}};expect(keepChapelClearance(T,world,p,camera,0)).toBe(true);expect(Math.hypot(camera.position.x-p.x,camera.position.z-p.z)).toBeGreaterThan(1.8);expect(camera.position.z).toBeLessThanOrEqual(8.05);expect(p.equals(before)).toBe(true);const first=camera.position.clone();camera.position.set(0,1.95,8.05);keepChapelClearance(T,world,p,camera,0);expect(camera.position.equals(first)).toBe(true);});
test('normal Chapel framing and fully blocked recovery preserve the protected view',()=>{const camera={position:new Vector3(0,1.95,2.7)},world={protectCamera(_inside,_p,q){q.set(0,1.4,.1);}};expect(keepChapelClearance(T,world,p,camera,0)).toBe(false);camera.position.set(0,1.4,.1);const old=camera.position.clone();expect(keepChapelClearance(T,world,p,camera,0)).toBe(false);expect(camera.position.equals(old)).toBe(true);});
test('outdoor recovery rejects a nearly vertical top-of-head view',()=>{const camera={position:new Vector3(.1,6,0)};expect(keepOutdoorClearance(T,{protectCamera(){}},p,camera,0)).toBe(true);expect(Math.hypot(camera.position.x,camera.position.z)).toBeGreaterThan(2.8);});

test('a normal trailing camera cannot stay inside the authored canopy above the Chapel approach',()=>{const p=new Vector3(-2,0,-16.5),camera={position:new Vector3(-2,3.1,-11)};expect(keepOutdoorClearance(T,{protectCamera(){}},p,camera,0)).toBe(true);expect(insideCanopy(camera.position)).toBe(false);expect(p.toArray()).toEqual([-2,0,-16.5]);});
