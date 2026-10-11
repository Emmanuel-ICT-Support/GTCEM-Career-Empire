import {describe,it,expect} from 'vitest';
import {selectAvatarClips} from '../../playable-3d/avatar-clips.mjs';
import {normaliseProfile,loadProfiles} from '../../playable-3d/profiles.js';
import {WHOLE_AVATARS} from '../../playable-3d/whole-avatar-catalog.mjs';
describe('whole characters',()=>{
 it('keeps exact named choices and old saved IDs',()=>{expect(WHOLE_AVATARS.map(x=>x.name)).toEqual(['Antonio','Cerys','Che','Diego','Hannah','Lilly','Sienna','Taj']);for(const body of [...WHOLE_AVATARS.map(x=>x.id),'a','b','tripo','shirt','schoolboy','jackettest','pantstest'])expect(normaliseProfile({body}).body).toBe(body);expect(loadProfiles({getItem:()=>null}).profiles[0].body).toBe('antonio');});
 it('does not use run, turn or unexpected clips as idle',()=>{const clips=['run','turn','standing_relax','walk','idle'].map(name=>({name}));expect(selectAvatarClips(clips)).toEqual({idle:clips[2],walk:clips[3]});expect(selectAvatarClips([{name:'run'},{name:'unexpected'},{}])).toEqual({idle:undefined,walk:undefined});expect(selectAvatarClips([{name:'preset:biped:walk.001'}]).walk.name).toBe('preset:biped:walk.001');});
});
