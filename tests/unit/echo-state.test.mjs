import {describe,it,expect} from 'vitest';
import {createEchoStore,ECHO_STEPS,arrivalGuidance,resumeStep,taskDone} from '../../playable-3d/echo-state.js';
const storage=()=>{const m=new Map();return {getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v)}};
describe('Echo local onboarding adapter',()=>{
 it('resumes per local character without changing avatar saves',()=>{const s=storage();s.setItem('ce-avatar','original');const a=createEchoStore(s);a.write('one',{step:7,status:'reading'});expect(createEchoStore(s).read('one').step).toBe(7);expect(a.read('two').status).toBe('new');expect(s.getItem('ce-avatar')).toBe('original');});
 it('keeps skip distinct from seen and permits replay',()=>{const a=createEchoStore(storage());a.write('one',{step:4,status:'skipped'});expect(a.read('one')).toMatchObject({step:4,status:'skipped'});a.write('one',{step:ECHO_STEPS.length-1,status:'seen'});expect(a.read('one').status).toBe('seen');});
 it('handles malformed and future state safely',()=>{const s=storage();s.setItem('ce-echo-v2:one','broken');const a=createEchoStore(s);expect(a.read('one').status).toBe('new');s.setItem('ce-echo-v2:one',JSON.stringify({version:99,step:3,status:'reading'}));expect(createEchoStore(s).read('one').step).toBe(0);});
 it('survives blocked or full browser storage',()=>{const a=createEchoStore({getItem(){throw Error('blocked')},setItem(){throw Error('full')}});a.read('one');a.write('one',{step:6,status:'reading'});expect(a.read('one').step).toBe(6);expect(a.persistent).toBe(false);});
 it('review neither reads nor overwrites ordinary progress',()=>{const s=storage(),normal=createEchoStore(s);normal.write('one',{step:5,status:'skipped'});const review=createEchoStore(s,{review:true});expect(review.read('one').status).toBe('new');review.write('one',{step:10,status:'seen'});expect(normal.read('one').step).toBe(5);expect(review.persistent).toBe(false);});
});

it('task gates resume only on observed activity, never on skip',()=>{
 const store=createEchoStore(storage());
 store.write('one',{step:2,status:'reading',skippedTasks:[2]});
 expect(resumeStep(store.read('one'))).toBe(2);
 expect(taskDone(store.read('one'),2)).toBe(false);
 expect(arrivalGuidance({state:store.read('one')}).title).toBe('First · Course Documents');
 store.write('one',{step:2,status:'reading',resourcesVisited:true});
 expect(resumeStep(store.read('one'))).toBe(3);
 store.write('one',{step:5,status:'reading'});expect(resumeStep(store.read('one'))).toBe(5);
 store.write('one',{step:5,status:'reading',avatarSaved:true});expect(resumeStep(store.read('one'))).toBe(6);
 store.write('one',{step:10,status:'seen',marketVisited:true});
 expect(arrivalGuidance({state:store.read('one')}).progress).toBeLessThan(100);
 expect(arrivalGuidance({state:store.read('one')}).detail).toContain('pending');
});
