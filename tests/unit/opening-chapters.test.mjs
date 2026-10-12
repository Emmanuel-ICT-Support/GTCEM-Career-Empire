import {describe,it,expect} from 'vitest';
import {SHIFTS,ADS,evaluateAllocation,reviewApplication} from '../../playable-3d/opening-chapters-state.js';
describe('opening rehearsal constraints',()=>{
 it('accepts multiple allocations while respecting the fixed resource limit',()=>{
  for(const s of SHIFTS){let feasible=0;for(let a=0;a<=6;a++)for(let b=0;b<=6;b++)for(let c=0;c<=6;c++){
   const r=evaluateAllocation(s.id,[a,b,c]);
   if(a+b+c>6){expect(r.valid).toBe(false);continue;}
   expect(r.valid).toBe(true);expect(r.served).toBeGreaterThanOrEqual(0);expect(r.served).toBeLessThanOrEqual(6);
   if(r.ready){feasible++;expect(r.served).toBe(6);}
  }expect(feasible).toBeGreaterThan(1);}
 });
 it('reveals a different bottleneck when conditions change',()=>{
  expect(evaluateAllocation('technology',[2,2,2]).ready).toBe(true);
  expect(evaluateAllocation('economy',[2,2,2]).gaps).toEqual([0,1,0]);
  expect(evaluateAllocation('economy',[1,3,2]).ready).toBe(true);
  expect(evaluateAllocation('economy',[1,3,2]).served).toBe(6);
 });
 it('rejects impossible allocations instead of treating invalid values as success',()=>{
  for(const values of [[NaN,2,2],[2.5,1,1],[-1,3,3],[7,0,0],[],[1,2]])expect(evaluateAllocation('technology',values).valid).toBe(false);
  expect(()=>evaluateAllocation('unknown',[2,2,2])).toThrow();
 });
 it('ad changes require relevant evidence, correct submission and deadline',()=>{
  const application={evidence:['customer','team'],method:'online',day:3,response:{situation:'queue',action:'acted',outcome:'observed'}};
  expect(reviewApplication('service',application).ready).toBe(true);
  const other=reviewApplication('stock',application);expect(other.ready).toBe(false);expect(other.missing).toEqual(['planning']);expect(other.checks.method).toBe(false);
  expect(reviewApplication('stock',{...application,evidence:['planning','team'],method:'written'}).ready).toBe(true);
  for(const ad of ADS)expect(reviewApplication(ad.id,{...application,day:ad.deadline+1}).checks.deadline).toBe(false);
  expect(reviewApplication('service',{...application,response:{situation:'vague',action:'others',outcome:'claim'}}).checks.response).toBe(false);
 });
});
