import {describe,it,expect} from 'vitest';
import {normaliseProfile,migrateLegacyProfile,loadProfiles,saveProfiles,COLOUR_PRESETS,TEST_CHARACTER_INFO,OPTIONS} from '../../playable-3d/profiles.js';
import {TEST_AVATARS} from '../../playable-3d/test-avatar-catalog.mjs';
import {WHOLE_AVATARS} from '../../playable-3d/whole-avatar-catalog.mjs';
describe('archived character labels and colour compatibility',()=>{
 it('keeps eight named primary characters and exactly seven existing archived IDs',()=>{
  expect(OPTIONS.body.slice(0,8)).toEqual(WHOLE_AVATARS.map(({id,name})=>[id,name]));
  expect(TEST_AVATARS.map(([id])=>id)).toEqual(['pantstest','jackettest','schoolboy','tripo','shirt','a','b']);
  expect(TEST_AVATARS).toEqual(OPTIONS.body.slice(8));
  for(const [body,label]of TEST_AVATARS){expect(normaliseProfile({body}).body).toBe(body);expect(label).toBe(TEST_CHARACTER_INFO[body].label);expect(TEST_CHARACTER_INFO[body].description.length).toBeGreaterThan(40);}
 });
 it('imports deep auburn using the existing legacy ID and preserves explicit hair colour',()=>{
  expect(migrateLegacyProfile({hairColour:'auburn-deep'}).profile.colours.hair).toBe('#8a3a22');
  expect(migrateLegacyProfile({hairColour:'auburn-deep',colours:{hair:'#123456'}}).profile.colours.hair).toBe('#123456');
  expect(migrateLegacyProfile({hairColour:'auburn'}).profile.colours.hair).toBe('#923f29');
  expect(migrateLegacyProfile({hairColour:'unknown'}).profile.colours.hair).toBe('#543321');
 });
 it('round trips named colours independently for existing Dress ups styles',()=>{
  const hex=(part,name)=>COLOUR_PRESETS[part].find(([label])=>label===name)[1];
  const profile=normaliseProfile({body:'pantstest',workTop:'suit',topColour:hex('top','Camel'),pantsStyle:'suit',pantsColours:{suit:hex('bottom','Burgundy')},hairStyle:'sweep',hairColours:{sweep:hex('hair','Deep auburn'),bob:hex('hair','Silver'),curls:hex('hair','Teal')},shoeStyle:'boots',shoeColours:{boots:hex('shoes','Brown')}});
  let data;const storage={getItem:()=>data,setItem:(_,v)=>data=v};saveProfiles(storage,{profiles:[profile],activeId:profile.id});
  expect(loadProfiles(storage).profiles[0]).toEqual(profile);
  expect(profile.topColours.suit).toBe('#B08A4D');expect(profile.pantsColours.suit).toBe('#75233D');expect(profile.hairColours).toMatchObject({sweep:'#8A3A22',bob:'#B7B7B0',curls:'#107E7A'});
 });
});
