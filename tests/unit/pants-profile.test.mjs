import {describe,it,expect} from 'vitest';
import {normaliseProfile,loadProfiles,saveProfiles,STARTERS} from '../../playable-3d/profiles.js';
describe('pants test profile',()=>{
 it('persists the selected outfit without changing other profiles',()=>{
  const state={profiles:[normaliseProfile({...STARTERS[0],body:'pantstest'}),structuredClone(STARTERS[1])],activeId:STARTERS[0].id};
  let data;const storage={setItem:(_,v)=>data=v,getItem:()=>data};saveProfiles(storage,state);
  const loaded=loadProfiles(storage);expect(loaded.profiles[0].body).toBe('pantstest');expect(loaded.profiles[1]).toEqual(STARTERS[1]);
 });
 it('keeps the existing default and rejects unknown bodies',()=>{
  expect(loadProfiles({getItem:()=>null}).profiles[0].body).toBe('schoolboy');
  expect(normaliseProfile({body:'untrusted-url'}).body).toBe('a');
 });
});
