import {test,expect} from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
import {createEchoStore,taskDone} from '../../playable-3d/echo-state.js';
import {renderQuality} from '../../playable-3d/render-quality.mjs';

const app=fs.readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');
const body=(name,next)=>app.slice(app.indexOf('function '+name+'('),app.indexOf('\nfunction '+next+'('));

test('successful Save records the actual avatar task before entry or another world frame is ready',()=>{
 const storage=new Map(),guide=createEchoStore({getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)});
 guide.write('student',{step:6,status:'reading',skippedTasks:[5]});
 const elements={'save-avatar':{disabled:false},'edit-state':{}},state={activeId:'student',profiles:[{id:'student',body:'antonio'},{id:'other',body:'ceris'}]};
 let saved=true,actorUpdates=0;
 const c=vm.createContext({state,draft:{id:'student',body:'amy'},normaliseProfile:p=>({...p}),persist:()=>saved,gameStorage:{setItem:(k,v)=>storage.set(k,v)},echo:{guidance:options=>{if(options.avatarSaved)guide.write('student',{...guide.read('student'),avatarSaved:true});}},$:id=>elements[id],updateActor:()=>actorUpdates++,toast:()=>{},entryReady:false});
 vm.runInContext(body('saveDraft','openStudio'),c);
 expect(c.saveDraft()).toBe(true);expect(taskDone(guide.read('student'),5)).toBe(true);expect(storage.get('ce-arrival-complete-student')).toBe('1');expect(state.profiles[1].body).toBe('ceris');expect(actorUpdates).toBe(1);
 guide.write('student',{...guide.read('student'),avatarSaved:false});saved=false;
 expect(c.saveDraft()).toBe(false);expect(taskDone(guide.read('student'),5)).toBe(false);
 elements['save-avatar'].disabled=true;saved=true;expect(c.saveDraft()).toBe(false);expect(taskDone(guide.read('student'),5)).toBe(false);
});

test('manual quality and returning to Auto apply their renderer policy immediately, without a world frame',()=>{
 for(const backend of ['ANGLE Apple M3 Metal','ANGLE Vulkan SwiftShader Device']){
  let ratio=1,resizes=0;const select={value:'high'},renderer={setPixelRatio:v=>ratio=v,shadowMap:{enabled:false}};
  const c=vm.createContext({$:()=>select,renderer,renderBackend:backend,devicePixelRatio:2,renderQuality,resize:()=>resizes++});
  vm.runInContext(body('qualityChange','bindEvents'),c);
  for(const value of ['low','high','auto']){select.value=value;c.qualityChange();const expected=renderQuality(backend,value,2);expect(ratio).toBe(expected.pixelRatio);expect(renderer.shadowMap.enabled).toBe(expected.shadows);}
  expect(resizes).toBe(3);
 }
});
