import {test,expect} from '@playwright/test';

test('entry geometry, walking collision and later detail reuse the same teaching roots',async({page},info)=>{
 test.setTimeout(30000);
 await page.route('**/entry-geometry-harness',route=>route.fulfill({contentType:'text/html',body:'<script type="importmap">{"imports":{"three":"/playable-3d/vendor/three/build/three.module.js","three/addons/":"/playable-3d/vendor/three/examples/jsm/","@dimforge/rapier3d-compat":"/playable-3d/vendor/rapier/rapier.mjs"}}</script><base href="/playable-3d/">'}));
 await page.goto('/entry-geometry-harness');
 const result=await page.evaluate(async()=>{
  const {createWorlds}=await import('./world.js'),{integrateEnvironment}=await import('./environment.js'),{addTeachingDetail}=await import('./environment/teaching-exteriors.js');
  const w=await createWorlds();await w.loadEntry();await integrateEnvironment(w,{entryOnly:true});w.openCampus();
  const root=w.town.getObjectByName('Campus teaching building exteriors'),shells=[...root.children],entryColliders=w.townPhysics.world.colliders.len(),before=shells.map(s=>s.children[0]);
  const initial={garden:Boolean(w.town.getObjectByName('ECC courtyard garden detail')),arrivalGarden:Boolean(w.town.getObjectByName('Arrival authored garden detail')),rooms:Boolean(w.town.getObjectByName('Media learning rooms'))};
  await integrateEnvironment(w,{entryOnly:true});const repeatedColliders=w.townPhysics.world.colliders.len();
  function walk(x,z,dx,dz){w.teleport(false,x,z);for(let i=0;i<120;i++)w.move(false,{x:dx,z:dz});return w.position(false).toArray();}
  const parcel=walk(-7,23.3,0,-.065),mediaWall=walk(-4,-29,0,-.065),hallWall=walk(18,-39,0,-.065),oval=walk(-4,-54,.065,0);
  await addTeachingDetail(w.town,w.campusPalette);const details=shells.map(s=>s.children.at(-1));await addTeachingDetail(w.town,w.campusPalette);
  const detailColliders=w.townPhysics.world.colliders.len();await w.loadScenery();await integrateEnvironment(w);const fullColliders=w.townPhysics.world.colliders.len();await integrateEnvironment(w);
  return {initial,entryColliders,repeatedColliders,parcel,mediaWall,hallWall,oval,unchanged:shells.every((s,i)=>root.children[i]===s&&s.children[0]===before[i]&&s.children.at(-1)===details[i]),children:shells.map(s=>s.children.length),detailNames:details.map(d=>d.name),detailColliders,fullColliders,repeatedFullColliders:w.townPhysics.world.colliders.len(),surroundings:Boolean(w.town.getObjectByName('Approved campus surroundings and connections'))};
 });
 expect(result.initial).toEqual({garden:true,arrivalGarden:true,rooms:false});expect(result.repeatedColliders).toBe(result.entryColliders);expect(result.detailColliders).toBe(result.entryColliders);
 expect(result.parcel[2]).toBeLessThan(17);expect(result.mediaWall[2]).toBeGreaterThan(-34);expect(result.hallWall[2]).toBeGreaterThan(-43);expect(result.oval[0]).toBeGreaterThan(3);
 expect(result.unchanged).toBe(true);expect(result.children).toEqual([2,2]);expect(result.detailNames).toEqual(['Media learning rooms','SPACE learning hall']);await info.attach('geometry-and-collision',{body:JSON.stringify(result,null,2),contentType:'application/json'});
 expect(result.surroundings).toBe(true);expect(result.fullColliders).toBeGreaterThan(result.entryColliders);expect(result.repeatedFullColliders).toBe(result.fullColliders);
});
