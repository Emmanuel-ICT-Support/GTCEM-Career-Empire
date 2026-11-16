import {test,expect} from 'vitest';
import {marketEntranceDistance,canOfferMarketEntry} from '../../playable-3d/landing.mjs';
test('Enter is offered at the actual outdoor approach once first playable entry is ready',()=>{expect(canOfferMarketEntry({x:43,z:-17.8},{ready:true})).toBe(true);});
test('optional full-campus readiness does not gate an explicit Market entry',()=>{expect(canOfferMarketEntry({x:43,z:-20},{ready:true,campusReady:false})).toBe(true);});
test('initial loading, other rooms and blocked UI cannot offer entry',()=>{for(const state of[{ready:false},{ready:true,mode:'studio'},{ready:true,blocked:true}])expect(canOfferMarketEntry({x:43,z:-22},state)).toBe(false);});
test('the entrance retains physical proximity and the walking threshold distance',()=>{expect(canOfferMarketEntry({x:0,z:15},{ready:true})).toBe(false);expect(marketEntranceDistance({x:43,z:-22})).toBe(0);expect(marketEntranceDistance({x:43,z:-20.9})).toBeCloseTo(1.1);});
