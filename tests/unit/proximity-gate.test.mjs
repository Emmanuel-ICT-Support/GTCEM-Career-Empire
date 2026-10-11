import {describe,it,expect} from 'vitest';
import {createProximityGate} from '../../playable-3d/proximity-gate.mjs';
describe('automatic interactions respect dismissal and busy menus',()=>{
 it('opens once near a place and requires leaving before returning',()=>{const g=createProximityGate();expect(g.sample('parcel',1)).toBe(true);expect(g.sample('parcel',1.7)).toBe(false);expect(g.sample('parcel',2.3)).toBe(false);expect(g.sample('parcel',1)).toBe(false);g.sample('parcel',3);expect(g.sample('parcel',1)).toBe(true);});
 it('does not consume an arrival while an opened menu blocks it',()=>{const g=createProximityGate();expect(g.sample('chapel',1,{enabled:false})).toBe(false);expect(g.sample('chapel',1,{enabled:true})).toBe(true);expect(g.sample('chapel',0)).toBe(false);});
 it('retains each separate location gate through a Chapel exit',()=>{const g=createProximityGate();g.sample('chapel',1);g.sample('chapel',0);expect(g.sample('chapel',1)).toBe(false);expect(g.sample('mural',1)).toBe(true);});
});
