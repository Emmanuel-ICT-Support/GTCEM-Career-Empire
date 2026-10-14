import {describe,it,expect} from 'vitest';
import {HELPERS,createHelperStore} from '../../playable-3d/helper-state.js';
describe('local helper choice',()=>{
 it('retains exactly seven choices and isolates characters across reload',()=>{const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};const a=createHelperStore(storage);expect(HELPERS.map(h=>h.name)).toEqual(['Echo','Sprout','Moss','Bloom','Spark','Pax','Atlas']);a.write('one','moss');a.write('two','pax');const b=createHelperStore(storage);expect(b.read('one')).toBe('moss');expect(b.read('two')).toBe('pax');expect(b.read('three')).toBe(null);expect(b.write('one','nova')).toBe(false);expect(b.read('one')).toBe('moss');});
 it('ignores obsolete/corrupt choices without deleting other storage',()=>{const a=createHelperStore({getItem:()=> 'crown-bot'});expect(a.read('one')).toBe(null);});
 it('continues in memory when browser storage is denied',()=>{const a=createHelperStore({getItem(){throw Error();},setItem(){throw Error();}});expect(a.read('one')).toBe(null);a.write('one','atlas');expect(a.read('one')).toBe('atlas');expect(a.persistent).toBe(false);});
});

it('stores non-creature modes without migrating old creature choices automatically',()=>{const m=new Map([['ce-helper-v1:avery','moss']]);const storage={getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v)};const store=createHelperStore(storage);expect(store.read('avery')).toBe(null);expect(store.legacy('avery')).toBe('moss');store.write('avery','none');expect(createHelperStore(storage).read('avery')).toBe('none');store.write('avery','journal');expect(createHelperStore(storage).read('avery')).toBe('journal');expect(m.get('ce-helper-v1:avery')).toBe('moss');});
