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
 for(const file of ['media-building.js','space-building.js'])expect(graph.has('playable-3d/environment/'+file)).toBe(true);
 for(const file of ['surroundings.js','campus-extensions.js'])expect(graph.has('playable-3d/environment/'+file)).toBe(false);
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
 const context={entryReady:false,entryAvatarPriority:null,entryPreparing:false,entryGeometryReady:false,entryDrawSubmitted:false,entryFailure:false,canvas:{dataset:{}},performance:{now:()=>2},mode:'town',entryLoad:null,environmentReady:false,entryEnvironmentModule:null,phase:'flourishing',
  campusNotice(){},loadEnvironment(){calls.push('module');return module;},
  worlds:{loadEntry(){calls.push('paths');return paths;},phase(){calls.push('phase');},openCampus(){calls.push('open');},loadMuralTexture:()=>Promise.resolve(),loadBuildingExteriors:()=>Promise.resolve()},
  showMarketExteriorSigns(){},clock:{getElapsedTime:()=>1},$:()=>({hidden:false}),startSurfaceDetail(){},updateCamera(){},waitForVisibleEntryFrame:async()=>{},updateEntryLoading(){},setTimeout(){}};
 const app=read('playable-3d/app.js');
 const body=app.slice(app.indexOf('async function prepareEntry(){'),app.indexOf('function prepareNextTask('))
  .replace(/import\(['"]\.\/environment\.js\?v=[^'"]+['"]\)/g,'loadEnvironment()');
 vm.createContext(context);vm.runInContext(body,context);
 const ready=context.prepareEntry();expect(calls).toEqual(['module','paths']);
 releasePaths();await Promise.resolve();expect(context.entryReady).toBe(false);
 releaseModule({integrateEnvironment:async()=>{calls.push('integrate');}});await ready;
 expect(calls).toEqual(['module','paths','integrate','phase','open']);expect(context.entryReady).toBe(true);
});
test('original exterior geometry must complete before entry, without waiting for optional interiors',async()=>{
 const app=read('playable-3d/app.js');const body=app.slice(app.indexOf('async function prepareEntry(){'),app.indexOf('function prepareNextTask(')).replace(/import\(['"]\.\/environment\.js\?v=[^'"]+['"]\)/g,'loadEnvironment()');
 let exteriors=0,releaseExterior;const exterior=new Promise(resolve=>releaseExterior=resolve);const context={entryReady:false,entryAvatarPriority:null,entryPreparing:false,entryGeometryReady:false,entryDrawSubmitted:false,entryFailure:false,canvas:{dataset:{}},performance:{now:()=>2},mode:'town',entryLoad:null,environmentReady:false,entryEnvironmentModule:null,phase:'flourishing',campusNotice(){},loadEnvironment:()=>Promise.resolve({integrateEnvironment:async()=>{}}),worlds:{loadEntry:()=>Promise.resolve(),phase(){},openCampus(){},loadMuralTexture:()=>Promise.resolve(),loadBuildingExteriors(){exteriors++;return exterior;}},showMarketExteriorSigns(){},clock:{getElapsedTime:()=>1},$:()=>({hidden:false}),startSurfaceDetail(){},updateCamera(){},waitForVisibleEntryFrame:async()=>{},updateEntryLoading(){},setTimeout:fn=>fn()};
 vm.createContext(context);vm.runInContext(body,context);const ready=context.prepareEntry();await Promise.resolve();expect(exteriors).toBe(1);expect(context.entryReady).toBe(false);releaseExterior();await ready;expect(context.entryReady).toBe(true);
});
test('entry frame barrier waits for a completed Town draw and keeps its first submission target',async()=>{
 const queued=[];let painted=0,finished=false;
 const context={entrySceneFrame:4,frameGate:{completedFrame:4,ready:()=>true},requestAnimationFrame:fn=>queued.push(fn),afterFirstPaint:async()=>painted++};
 const app=read('playable-3d/app.js'),source=app.slice(app.indexOf('async function waitForVisibleEntryFrame(){'),app.indexOf('async function prepareEntry(){'));
 const wait=vm.runInNewContext(source+';waitForVisibleEntryFrame;',context),ready=wait().then(()=>finished=true);
 context.frameGate.completedFrame=100;queued.shift()();await Promise.resolve();expect(finished).toBe(false); // Other scenes do not qualify.
 context.frameGate.completedFrame=4;context.entrySceneFrame=5;queued.shift()();await Promise.resolve();expect(finished).toBe(false);
 context.entrySceneFrame=6;context.frameGate.completedFrame=5;queued.shift()();await ready;expect(finished).toBe(true);expect(painted).toBe(1);
});

test('required geometry starts while avatar priority is pending; readiness waits for both',async()=>{
 let releaseAvatar;const avatar=new Promise(resolve=>releaseAvatar=resolve),calls=[];
 const context={entryReady:false,entryAvatarPriority:avatar,entryPreparing:false,entryGeometryReady:false,entryDrawSubmitted:false,entryFailure:false,canvas:{dataset:{}},performance:{now:()=>2},mode:'town',entryLoad:null,environmentReady:false,entryEnvironmentModule:null,phase:'flourishing',campusNotice(){},loadEnvironment:()=>Promise.resolve({integrateEnvironment:async()=>calls.push('integrate')}),waitForPriorityAsset:p=>p,worlds:{loadMuralTexture:()=>Promise.resolve(),loadBuildingExteriors:async()=>calls.push('exteriors'),loadEntry:async()=>calls.push('paths'),phase(){},openCampus(){}},showMarketExteriorSigns(){},clock:{getElapsedTime:()=>1},$:()=>({hidden:false}),startSurfaceDetail(){},updateCamera(){},waitForVisibleEntryFrame:async()=>{},updateEntryLoading(){}};
 const app=read('playable-3d/app.js'),body=app.slice(app.indexOf('async function prepareEntry(){'),app.indexOf('function prepareNextTask(')).replace(/import\(['"]\.\/environment\.js\?v=[^'"]+['"]\)/g,'loadEnvironment()');
 vm.createContext(context);vm.runInContext(body,context);const ready=context.prepareEntry();await Promise.resolve();expect(calls).toEqual(['exteriors','paths']);expect(context.entryPreparing).toBe(true);expect(context.entryReady).toBe(false);releaseAvatar();await ready;expect(calls).toContain('integrate');expect(context.entryGeometryReady).toBe(true);expect(context.entryReady).toBe(true);expect(context.entryPreparing).toBe(false);
});
