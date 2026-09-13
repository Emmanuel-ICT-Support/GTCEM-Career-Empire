import {describe,it,expect} from 'vitest';
import {mergePavingPolygons,polygonArea} from '../../playable-3d/environment/paving-polygons.js';
const rect=(x,z,w,d)=>[[x,z],[x+w,z],[x+w,z+d],[x,z+d]];
const area=p=>p.reduce((n,a)=>n+Math.abs(polygonArea(a)),0);
describe('continuous campus paving',()=>{
 it('draws intersecting paths once, retaining their full union',()=>{
  expect(area(mergePavingPolygons([rect(-3,-1,6,2),rect(-1,-3,2,6)]))).toBeCloseTo(20,8);
 });
 it('removes duplicate and reversed triangles at tight bends',()=>{
  const a=[[0,0],[4,0],[0,4]],b=[[4,0],[4,4],[0,4]];
  expect(area(mergePavingPolygons([a,b,a.slice().reverse(),b]))).toBeCloseTo(16,8);
 });
 it('preserves an unpaved planted island and tolerates a shared edge',()=>{
  const p=mergePavingPolygons([rect(0,0,6,1),rect(0,5,6,1),rect(0,1,1,4),rect(5,1,1,4)]);
  expect(area(p)).toBeCloseTo(20,8);
  expect(p.every(poly=>polygonArea(poly)>0)).toBe(true);
 });
 it('handles an oblique junction without extra overlap area',()=>{
  const p=mergePavingPolygons([rect(0,0,4,4),[[2,0],[6,0],[2,4]]]);
  expect(area(p)).toBeCloseTo(18,8);
 });
});
