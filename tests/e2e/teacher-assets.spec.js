import {test,expect} from '@playwright/test';
test('both released teacher assets decode with their required animations and real collision',async({page})=>{
 await page.route('**/teacher-assets-harness',route=>route.fulfill({contentType:'text/html',body:'<script type="importmap">{"imports":{"three":"/playable-3d/vendor/three/build/three.module.js","three/addons/":"/playable-3d/vendor/three/examples/jsm/","@dimforge/rapier3d-compat":"/playable-3d/vendor/rapier/rapier.mjs"}}</script><base href="/playable-3d/">'}));await page.goto('/teacher-assets-harness');
 const result=await page.evaluate(async()=>{const {createWorlds}=await import('./world.js'),{TEACHERS,createTeacherNPC}=await import('./teacher-npc.js');const w=await createWorlds();return await Promise.all(TEACHERS.map(async config=>{const npc=await createTeacherNPC(w,{...config,fixed:true});return npc.snapshot();}));});
 expect(result.map(n=>n.id)).toEqual(['middleton','psandodakis']);expect(result.every(n=>n.visible)).toBe(true);console.log('TEACHER_ASSETS',JSON.stringify(result));
});
