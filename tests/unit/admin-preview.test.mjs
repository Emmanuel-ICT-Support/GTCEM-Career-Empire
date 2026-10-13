import {test,expect,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {isAdminPreview,administrationAvailable,adminPreviewURL,createPreviewStorage} from '../../playable-3d/admin-preview.mjs';
import {marketComplete,freshState} from '../../playable-3d/night-market-state.js';

test('public preview requires both explicit flags, not an auth label',()=>{
 expect(isAdminPreview(new URLSearchParams('admin-review=1&market-review=1'))).toBe(true);
 for(const query of ['','admin-review=1','market-review=1','admin-review=0&market-review=1','teacher=true'])expect(isAdminPreview(new URLSearchParams(query))).toBe(false);
});
test('navigation preview does not alter Mara completion or rewards and leaves normal gate intact',()=>{
 const s=freshState(),before=JSON.stringify(s);expect(administrationAvailable(s)).toBe(false);expect(administrationAvailable(s,true)).toBe(true);expect(marketComplete(s)).toBe(false);
 expect(JSON.stringify(s)).toBe(before);expect(s).toMatchObject({paid:false,accepted:false,wallet:0,tax:0,pass:false});expect(administrationAvailable({...s,paid:true})).toBe(true);
});
test('preview URL starts a clean tab without carrying guest handoff or account-looking parameters',()=>{
 const original='https://school.invalid/playable-3d/?guestRun=original&studentId=fixture&access_token=fixture-only#old';
 const target=new URL(adminPreviewURL(original));expect(target.origin).toBe('https://school.invalid');expect(target.pathname).toBe('/playable-3d/');expect(target.hash).toBe('');
 expect([...target.searchParams]).toEqual([['experience','night-market'],['market-review','1'],['admin-review','1']]);
});
test('preview storage is document memory and a fresh instance does not restore it',()=>{
 const a=createPreviewStorage();a.setItem('progress',17);expect(a.persistent).toBe(false);expect(a.getItem('progress')).toBe('17');expect(createPreviewStorage().getItem('progress')).toBeNull();a.removeItem('progress');expect(a.getItem('progress')).toBeNull();
});
test('real Market commit handler rejects preview wages and fees before dispatch',()=>{
 const source=readFileSync(new URL('../../playable-3d/night-market.js',import.meta.url),'utf8').match(/ function commit\(type,success\)\{[^\n]+/)[0];
 const dispatch=vi.fn(()=>{throw Error('preview wrote a reward');}),announce=vi.fn();
 const commit=vm.runInNewContext(source+';commit;',{publicAdminReview:true,store:{dispatch},announce});
 expect(commit('pay','')).toBe(false);expect(commit('research-fee','')).toBe(false);expect(commit({type:'pay'},'')).toBe(false);expect(dispatch).not.toHaveBeenCalled();expect(announce).toHaveBeenCalledWith('Public preview: no wages or fees are paid or saved.');
});
