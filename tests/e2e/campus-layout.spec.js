import {test,expect} from '@playwright/test';
test.use({launchOptions:{args:process.platform==='darwin'?['--use-angle=metal']:[]}});
test('campus entrances and destination paths are walkable while walls and pond stay solid',async({page})=>{
 test.setTimeout(180000);
 // A minimal same-origin harness tests the production world and its real Rapier controller.
 await page.route('**/campus-harness',route=>route.fulfill({contentType:'text/html',body:`<script type="importmap">{"imports":{"three":"/playable-3d/vendor/three/build/three.module.js","three/addons/":"/playable-3d/vendor/three/examples/jsm/","@dimforge/rapier3d-compat":"/playable-3d/vendor/rapier/rapier.mjs"}}</script><base href="/playable-3d/">`}));
 await page.goto('/campus-harness');
 const result=await page.evaluate(async()=>{
  const {createWorlds}=await import('/playable-3d/world.js?v=campus1');const w=await createWorlds(()=>{});await w.loadScenery();
  function route(points){w.teleport(false,...points[0]);let failures=[];for(const [x,z]of points.slice(1)){for(let i=0;i<900;i++){const p=w.position(false),dx=x-p.x,dz=z-p.z,d=Math.hypot(dx,dz);if(d<.12)break;w.move(false,{x:dx/d*.065,z:dz/d*.065});}const p=w.position(false);if(Math.hypot(p.x-x,p.z-z)>.2)failures.push({target:[x,z],actual:[p.x,p.z]});}return failures;}
  const routes={studio:route([[-7,23.3],[-7,18],[-7,8],[-7,5],[-12.4,5]]),hall:route([[-7,5],[-6,5],[-6,-1],[-3,-4],[0,-8.35]]),careers:route([[-7,18],[-13,18],[-13,12],[-19,12],[-18,14.8],[-18,15.4]]),workplace:route([[0,8],[8,8],[15,8],[16,13.8],[16,14.4]]),north:route([[11,-5],[13,-9],[13,-16],[9,-20],[0,-22],[-15,-22]])};
  w.teleport(false,16,12);for(let i=0;i<80;i++)w.move(false,{x:0,z:.065});const entry=w.position(false).toArray();
  w.teleport(false,19,12);for(let i=0;i<80;i++)w.move(false,{x:0,z:.065});const wall=w.position(false).toArray();
  w.teleport(false,13,-10);for(let i=0;i<180;i++)w.move(false,{x:.065,z:0});const pond=w.position(false).toArray();
  return {routes,entry,wall,pond,buildings:w.campus.buildings};
 });
 console.log(JSON.stringify(result));
 for(const [name,failures]of Object.entries(result.routes))expect(failures,name).toEqual([]);
 expect(result.entry[2]).toBeGreaterThan(14);expect(result.wall[2]).toBeLessThan(14);expect(result.pond[0]).toBeLessThan(15.5);
 expect(result.buildings.map(x=>x.outward)).toEqual([[0,-1],[0,-1]]);
});
