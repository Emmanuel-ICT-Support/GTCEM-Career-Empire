import {describe,it,expect} from 'vitest';
import {normaliseProfile,loadProfiles,saveProfiles,STORAGE_KEY,TOP_DEFAULTS,PANTS_DEFAULTS} from '../../playable-3d/profiles.js';

describe('production wardrobe profile compatibility',()=>{
 it('keeps the production storage key and migrates existing profiles without losing identity or colours',()=>{
  expect(STORAGE_KEY).toBe('career-empire-3d-profiles-v2-tripo');
  const old={id:'fictional',name:'Example',body:'pantstest',outer:'none',colours:{hair:'#123456'},future:{occupation:'Example role'}};
  const result=loadProfiles({getItem:key=>key===STORAGE_KEY?JSON.stringify({profiles:[old],activeId:old.id}):null});
  expect(result.profiles[0]).toMatchObject({...old,topColours:TOP_DEFAULTS,pantsColours:PANTS_DEFAULTS});
 });
 it('persists independent per-style hex colours, selected clothes and off choices',()=>{
  const profile=normaliseProfile({body:'pantstest',workTop:'suit',topColour:'#13579b',topColours:{chef:'#eeeecc'},pantsStyle:'tradie',pantsColours:{tradie:'#bada55'},outer:'none'});
  let text;saveProfiles({setItem:(_,value)=>text=value},{profiles:[profile],activeId:profile.id});
  expect(loadProfiles({getItem:()=>text}).profiles[0]).toEqual(profile);
  expect(profile.topColours.suit).toBe('#13579B');expect(profile.topColours.chef).toBe('#EEEECC');
  expect(profile.pantsColours.tradie).toBe('#BADA55');
 });
 it('rejects malformed styles and colours while keeping valid legacy choices',()=>{
  const p=normaliseProfile({body:'schoolboy',workTop:'../../bad',pantsStyle:'unknown',topColours:{work:'url(fake)'},pantsColours:{chef:'#12'}});
  expect(p.body).toBe('schoolboy');expect(p.workTop).toBe('scrubs');expect(p.pantsStyle).toBe('scrubs');
  expect(p.topColours.work).toBe(TOP_DEFAULTS.work);expect(p.pantsColours.chef).toBe(PANTS_DEFAULTS.chef);
 });
});
