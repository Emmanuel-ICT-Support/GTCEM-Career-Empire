import {describe,it,expect} from 'vitest';
import {reviewSourceInterpretation} from '../../playable-3d/opening-chapters-state.js';
describe('source interpretation feedback',()=>{
 it('rejects treating a one-stall clip as regional evidence even when the claim says every job',()=>{
  expect(reviewSourceInterpretation('feed',{scope:'region',kind:'unsupported'}).ok).toBe(false);
  expect(reviewSourceInterpretation('feed',{scope:'stall',kind:'unsupported'}).ok).toBe(true);
 });
 it('distinguishes the old forecast from observed results and retains its limitation',()=>{
  expect(reviewSourceInterpretation('archive',{scope:'overseas',kind:'observed'}).ok).toBe(false);
  const r=reviewSourceInterpretation('archive',{scope:'overseas',kind:'forecast'});expect(r.ok).toBe(true);expect(r.feedback).toContain('whether a forecast actually happened');
 });
 it('permits correction and checks both dimensions for local and regional observations',()=>{
  for(const [id,scope] of [['report','region'],['mara','stall']]){
   expect(reviewSourceInterpretation(id,{scope,kind:'forecast'}).ok).toBe(false);
   expect(reviewSourceInterpretation(id,{scope,kind:'observed'}).ok).toBe(true);
  }
  expect(reviewSourceInterpretation('missing').ok).toBe(false);expect(reviewSourceInterpretation('report',{}).ok).toBe(false);
 });
});
