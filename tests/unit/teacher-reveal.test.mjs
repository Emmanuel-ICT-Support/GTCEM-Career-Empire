import {test,expect} from 'vitest';
import {teachersRevealed,restart} from '../../playable-3d/discovery-state.mjs';
test('teachers remain hidden before the actual photo-finish surprise',()=>{for(const step of [0,1,3])expect(teachersRevealed({step},false,null)).toBe(false);});
test('cancelled reveal keeps already revealed teachers visible without advancing trail or rewards',()=>{const state={step:3,souvenir:null};expect(teachersRevealed(state,true,'turn')).toBe(true);expect(teachersRevealed(state,true,null)).toBe(true);expect(state).toEqual({step:3,souvenir:null});});
test('completed photo restores teacher visibility; explicit trail replay hides them again',()=>{const state={step:4,souvenir:null};expect(teachersRevealed(state,false,null)).toBe(true);expect(teachersRevealed(restart(state),false,null)).toBe(false);});
