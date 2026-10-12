import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=new URL('../../',import.meta.url);
const read=file=>readFileSync(new URL(file,root),'utf8');
function staticGraph(file,seen=new Set()){
 if(seen.has(file))return seen;seen.add(file);
 for(const match of read(file).matchAll(/(?:\bfrom\s*|\bimport\s*)(['"])(\.[^'"]+)\1/g)){
  const next=path.posix.normalize(path.posix.join(path.posix.dirname(file),match[2].split('?')[0]));
  if(/\.m?js$/.test(next))staticGraph(next,seen);
 }
 return seen;
}
test('entry environment static graph excludes full surroundings, gardens and learning interiors',()=>{
 const graph=staticGraph('playable-3d/environment.js');
 expect(graph.has('playable-3d/environment/market-exterior.js')).toBe(true);
 for(const file of ['surroundings.js','campus-extensions.js','media-building.js','space-building.js'])expect(graph.has('playable-3d/environment/'+file)).toBe(false);
 expect([...graph].some(file=>/learning-interiors|authored-garden/.test(file))).toBe(false);
});
test('full campus retains the deferred surroundings graph and original market shell function',()=>{
 const source=read('playable-3d/environment.js');
 expect(source).toMatch(/if\(!entryOnly\)\{const \{addSurroundings\}=await import\(/);
 const full=staticGraph('playable-3d/environment/surroundings.js');
 expect(full.has('playable-3d/environment/media-building.js')).toBe(true);
 expect(full.has('playable-3d/environment/space-building.js')).toBe(true);
 expect(read('playable-3d/environment/campus-extensions.js')).toContain('export {createMarketExterior}');
});
test('entry starts module and paths together but opens only after integration and phase application',async()=>{
 let releasePaths,releaseModule;
 const calls=[];
 const paths=new Promise(resolve=>{releasePaths=resolve;});
 const module=new Promise(resolve=>{releaseModule=resolve;});
 const context={entryReady:false,entryLoad:null,environmentReady:false,phase:'flourishing',
  campusNotice(){},loadEnvironment(){calls.push('module');return module;},
  worlds:{loadEntry(){calls.push('paths');return paths;},phase(){calls.push('phase');},openCampus(){calls.push('open');},loadBuildingExteriors:()=>Promise.resolve()},
  showMarketExteriorSigns(){},clock:{getElapsedTime:()=>1},$:()=>({hidden:false}),startSurfaceDetail(){},setTimeout(){}};
 const app=read('playable-3d/app.js');
 const body=app.slice(app.indexOf('async function prepareEntry(){'),app.indexOf('function prepareNextTask('))
  .replace("import('./environment.js?v=entry-environment-20261012')",'loadEnvironment()');
 vm.createContext(context);vm.runInContext(body,context);
 const ready=context.prepareEntry();expect(calls).toEqual(['module','paths']);
 releasePaths();await Promise.resolve();expect(context.entryReady).toBe(false);
 releaseModule({integrateEnvironment:async()=>{calls.push('integrate');}});await ready;
 expect(calls).toEqual(['module','paths','integrate','phase','open']);expect(context.entryReady).toBe(true);
});
test('original building exteriors start alongside entry without becoming a readiness dependency',async()=>{
 const app=read('playable-3d/app.js');const body=app.slice(app.indexOf('async function prepareEntry(){'),app.indexOf('function prepareNextTask(')).replace("import('./environment.js?v=entry-environment-20261012')",'loadEnvironment()');
 let exteriors=0;const context={entryReady:false,entryLoad:null,environmentReady:false,phase:'flourishing',campusNotice(){},loadEnvironment:()=>Promise.resolve({integrateEnvironment:async()=>{}}),worlds:{loadEntry:()=>Promise.resolve(),phase(){},openCampus(){},loadBuildingExteriors(){exteriors++;return new Promise(()=>{});}},showMarketExteriorSigns(){},clock:{getElapsedTime:()=>1},$:()=>({hidden:false}),startSurfaceDetail(){},setTimeout:fn=>fn()};
 vm.createContext(context);vm.runInContext(body,context);await context.prepareEntry();expect(exteriors).toBe(1);expect(context.entryReady).toBe(true);
});
