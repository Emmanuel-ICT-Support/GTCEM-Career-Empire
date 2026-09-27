import {createLocomotion,STEP,turnTowards} from '../../playable-3d/locomotion.js';
import {test,expect} from 'vitest';
test('bounded acceleration, smooth stop and exact walking/running speeds',()=>{
 const c=createLocomotion();let d=c.step(0,-1,0,false);expect(-d.z/STEP).toBeCloseTo(1/3);
 for(let i=0;i<60;i++)d=c.step(0,-1,0,false);expect(-d.z/STEP).toBeCloseTo(2.8);
 for(let i=0;i<60;i++)d=c.step(0,-1,0,true);expect(-d.z/STEP).toBeCloseTo(4.6);
 let stopping=0;for(let i=0;i<20;i++){d=c.step(0,0,0,false);stopping-=d.z;}expect(stopping).toBeLessThan(.4);expect(d.z).toBe(0);
});
test('diagonal normalization, camera-relative direction and reset',()=>{
 const c=createLocomotion();let d;for(let i=0;i<60;i++)d=c.step(1,-1,Math.PI/2,false);
 expect(Math.hypot(d.x,d.z)/STEP).toBeCloseTo(2.8);expect(d.x).toBeLessThan(0);expect(d.z).toBeLessThan(0);
 c.reset();expect(c.step(0,0,0,false)).toEqual({x:0,z:0});
});
test('shortest-arc rotation is frame-rate independent',()=>{
 const simulate=hz=>{let angle=3.1;for(let i=0;i<hz;i++)angle=turnTowards(angle,-.04,-1,1/hz);return angle};
 expect(simulate(30)).toBeCloseTo(simulate(144),10);expect(simulate(60)).toBeGreaterThan(3.1);
});
