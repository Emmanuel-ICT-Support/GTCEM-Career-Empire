import {describe,it,expect} from 'vitest';
import {freshState,applyEvent,decodeSave,createPracticeStore,MARKET_KEY} from '../../playable-3d/night-market-state.js';
const run=(...events)=>events.reduce(applyEvent,{...freshState(),revision:1});
const memory=()=>{const map=new Map([[MARKET_KEY,JSON.stringify({version:1,events:[]})]]);return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};};
describe('night market anonymous practice',()=>{
 it('requires an agreed task and a workable outcome before one atomic pay receipt',()=>{
  expect(run('pay').wallet).toBe(0);expect(run('sign-clear').solution).toBe(null);
  const s=run('accept','sign-clear','pay','pay');expect(s.wallet).toBe(1800);expect(s.tax).toBe(200);expect(s.events.filter(e=>e==='pay')).toHaveLength(1);
 });
 it('supports successful first attempts without forcing failure or listening',()=>{expect(run('accept','sign-clear','pay').badges).toEqual(['clarity']);});
 it('recognises listening even before success, and recovery without reducing pay',()=>{
  const s=run('accept','listen','sign-hidden','helper','pay');expect(s.wallet).toBe(1800);expect(s.badges).toEqual(['listening','teamwork','adapting']);
 });
 it('does not award retry badges merely for repeated clicks',()=>{const s=run('accept','listen','listen','sign-clear','sign-clear');expect(s.badges).toEqual(['listening','clarity']);});
 it('keeps money conserved through buying, saving, withdrawing and contributions',()=>{
  const s=run('accept','helper','pay','save','buy','donate','withdraw');expect(s.wallet+s.savings+s.tax+s.donated+600).toBe(2000);expect(s.keepsake).toBe(true);
 });
 it('prevents overdraft, repeat purchase and repeat donation',()=>{const s=run('accept','helper','pay','buy','buy','donate','donate','save','save','save');expect(s.wallet).toBe(0);expect(s.savings).toBe(1000);expect(s.donated).toBe(200);});
 it('allows free wellbeing before employment and without wealth or skill points',()=>{const s=run('rest');expect(s.rested).toBe(true);expect(s.wallet).toBe(0);expect(s.badges).toEqual([]);expect(s.accepted).toBe(false);});
 it('resumes before and after payment without another payout',()=>{const storage=memory();let p=createPracticeStore(storage);p.dispatch('accept');p.dispatch('helper');p=createPracticeStore(storage);expect(p.dispatch('pay')).toBe(true);p=createPracticeStore(storage);expect(p.dispatch('pay')).toBe(false);expect(p.state.wallet).toBe(1800);});
 it('retains a corrupted or newer save until deliberate restart',()=>{const storage=memory();storage.setItem(MARKET_KEY,'{"version":4,"events":[]}');const p=createPracticeStore(storage);expect(p.locked).toBe(true);expect(p.dispatch('accept')).toBe(false);expect(storage.getItem(MARKET_KEY)).toContain('4');p.reset();expect(p.dispatch('accept')).toBe(true);});
 it('rejects forged amounts, out of order receipts and unsupported events',()=>{expect(()=>decodeSave('{"version":1,"events":["pay"]}')).toThrow();expect(()=>decodeSave('{"version":1,"events":["accept","hack"]}')).toThrow();expect(decodeSave('{"version":1,"events":[],"wallet":99999}').wallet).toBe(0);});
 it('does not mutate rewards when storage quota is full',()=>{const storage=memory(),p=createPracticeStore(storage);p.dispatch('accept');p.dispatch('helper');storage.setItem=()=>{throw Error('quota');};expect(p.dispatch('pay')).toBe(false);expect(p.state.paid).toBe(false);expect(p.state.wallet).toBe(0);expect(p.error).toContain('Nothing was charged');});
 it('refreshes stale tabs before accepting another choice',()=>{const storage=memory(),a=createPracticeStore(storage),b=createPracticeStore(storage);a.dispatch('accept');expect(b.dispatch('helper')).toBe(false);expect(b.state.accepted).toBe(true);expect(b.dispatch('helper')).toBe(true);});
 it('resets only the practice, preserving other player and shop data',()=>{const storage=memory();storage.setItem('avatar','keep');const p=createPracticeStore(storage);p.dispatch('accept');p.reset();expect(storage.getItem('avatar')).toBe('keep');expect(p.state).toEqual(freshState());});
});
const revised=(...events)=>events.reduce(applyEvent,{...freshState(),revision:2});
const clues=['accept','listen','observe','learn'];
const completed=[...clues,'propose-sign','place-path','test','review','pay'];
describe('investigate, apply and review',()=>{
 it('blocks old shortcuts and premature rewards',()=>{
  expect(revised('accept','sign-clear','helper','pay').wallet).toBe(0);
  expect(revised('accept','propose-sign','place-path','test','review','pay').badges).toEqual([]);
  expect(revised(...clues,'propose-sign','place-path','review','pay').wallet).toBe(0);
 });
 it('awards distinct badges after checking results, then one pay and pass',()=>{
  expect(revised(...clues,'propose-sign','place-path','test').badges).toEqual([]);
  const s=revised(...completed,'pay','encore','encore');expect(s.badges).toEqual(['initiative','problem']);expect(s.wallet).toBe(1800);expect(s.pass).toBe(true);expect(s.encore).toBe(true);expect(s.events.filter(e=>e==='encore')).toHaveLength(1);
 });
 it('supports failed placement, free revision and full pay',()=>{
  const s=revised(...clues,'propose-sign','place-counter','test','pay','place-path','test','review','pay');expect(s.badges).toEqual(['initiative','problem','adapting']);expect(s.wallet).toBe(1800);
 });
 it('supports helpers and rejects mismatched setup',()=>{
  const s=revised(...clues,'propose-helper','place-path','assign-helper','test','review','pay');expect(s.solution).toBe('helper');expect(s.events).not.toContain('place-path');expect(s.pass).toBe(true);
 });
 it('resumes a new trial and preserves legacy owned items',()=>{
  expect(decodeSave(JSON.stringify({version:2,events:[...clues,'propose-sign','place-counter','test']})).attempted).toBe(true);
  const old=decodeSave(JSON.stringify({version:1,events:['accept','helper','pay','buy','save']}));expect(old.keepsake).toBe(true);expect(old.wallet).toBe(700);expect(old.savings).toBe(500);expect(old.pass).toBe(false);
 });
 it('does not award a pass or pay when saving fails',()=>{
  const storage=memory();storage.setItem(MARKET_KEY,JSON.stringify({version:2,events:[]}));const p=createPracticeStore(storage);completed.slice(0,-1).forEach(e=>p.dispatch(e));storage.setItem=()=>{throw Error('quota');};expect(p.dispatch('pay')).toBe(false);expect(p.state.pass).toBe(false);expect(p.state.wallet).toBe(0);
 });
 it('keeps free stage enjoyment independent',()=>{const s=revised('encore','rest');expect(s.encore).toBe(false);expect(s.rested).toBe(true);});
});
