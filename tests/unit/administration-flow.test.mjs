import {describe,it,expect} from 'vitest';
import {inAdministration,nearestInteraction} from '../../playable-3d/administration-flow.js';
describe('administration arrival boundary and targets',()=>{
 it('does not flicker between market and office while crossing the doorway',()=>{
  expect(inAdministration(-12.9,false)).toBe(true);
  for(const x of [-12.7,-12.3,-12.05])expect(inAdministration(x,true)).toBe(true);
  expect(inAdministration(-11.8,true)).toBe(false);
  expect(inAdministration(-12.4,false)).toBe(false);
 });
 it('does not let an out-of-range exit hide an available person',()=>{
  const exit={x:0,z:0,radius:.8,label:'exit'},person={x:0,z:2.1,radius:1.5,label:'person'};
  expect(nearestInteraction([exit,person],{x:0,z:1}).label).toBe('person');
 });
 it('returns no prompt when none is reachable',()=>{
  expect(nearestInteraction([{x:0,z:0,radius:1}],{x:0,z:2})).toBeNull();
  expect(nearestInteraction([],{x:0,z:0})).toBeNull();
 });
 it('chooses the nearest reachable desk rather than source order',()=>{
  expect(nearestInteraction([{x:0,z:2,label:'desk'},{x:0,z:1,label:'Nora'}],{x:0,z:0}).label).toBe('Nora');
 });
});
