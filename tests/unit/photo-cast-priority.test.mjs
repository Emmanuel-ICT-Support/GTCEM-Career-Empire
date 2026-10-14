import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const app=readFileSync(new URL('../../playable-3d/app.js',import.meta.url),'utf8');
const body=app.slice(app.indexOf('function loadTeachers('),app.indexOf('function greetTeacher(')).replace(/import\([^)]+\)/g,'loadTeacherModule()');
test('concurrent cast preparation shares one asset operation and never duplicates an existing teacher',async()=>{
 let release,modules=0;const configs=[{id:'middleton',name:'Mr Middleton'},{id:'psandodakis',name:'Mr Psandodakis'}],calls=[];
 const moduleReady=new Promise(resolve=>release=resolve),context={Promise,teachers:[],teacherLoading:false,teacherAttempted:false,teacherLoad:null,teacherModuleFailure:null,teacherModuleRequest:0,teacherFailures:new Map(),performance:{now:()=>0},worlds:{},discoveryReview:true,discovery:{reduced:()=>false},console:{warn(){}},loadTeacherModule:()=>{modules++;return moduleReady;}};
 const load=vm.runInNewContext(body+';loadTeachers;',context);const first=load();expect(load()).toBe(first);expect(context.teacherLoading).toBe(true);
 release({TEACHERS:configs,createTeacherNPC:async(_,config)=>{calls.push(config.id);return {id:config.id};}});await first;await load();
 expect(context.teachers.map(n=>n.id)).toEqual(['middleton','psandodakis']);expect(calls).toEqual(['middleton','psandodakis']);expect(modules).toBe(1);expect(context.teacherLoading).toBe(false);
});
test('a partial cast failure retries only the missing teacher on the next explicit request',async()=>{
 let failed=true;const calls=[],context={Promise,teachers:[],teacherLoading:false,teacherAttempted:false,teacherLoad:null,teacherModuleFailure:null,teacherModuleRequest:0,teacherFailures:new Map(),performance:{now:()=>0},worlds:{},discoveryReview:true,discovery:{reduced:()=>false},console:{warn(){}},loadTeacherModule:async()=>({TEACHERS:[{id:'middleton'},{id:'psandodakis'}],createTeacherNPC:async(_,config)=>{calls.push(config.id);if(config.id==='middleton'&&failed)throw Error('offline');return {id:config.id};}})};
 const load=vm.runInNewContext(body+';loadTeachers;',context);await load();failed=false;await load({explicit:true});expect(calls).toEqual(['middleton','psandodakis','middleton']);expect(new Set(context.teachers.map(n=>n.id))).toEqual(new Set(['middleton','psandodakis']));
});
test('automatic retries back off and stop after three attempts; an explicit request can recover',async()=>{
 let now=0,offline=true,calls=0;const context={Promise,teachers:[{id:'psandodakis'}],teacherLoading:false,teacherAttempted:false,teacherLoad:null,teacherModuleFailure:null,teacherModuleRequest:0,teacherFailures:new Map(),performance:{now:()=>now},worlds:{},discoveryReview:true,discovery:{reduced:()=>false},console:{warn(){}},loadTeacherModule:async()=>({TEACHERS:[{id:'middleton'},{id:'psandodakis'}],createTeacherNPC:async(_,config)=>{calls++;if(offline)throw Error('offline');return {id:config.id};}})};
 const load=vm.runInNewContext(body+';loadTeachers;',context);await load();await load();expect(calls).toBe(1);now=2000;await load();expect(calls).toBe(2);now=6000;await load();expect(calls).toBe(3);now=100000;await load();expect(calls).toBe(3);offline=false;await load({explicit:true});expect(calls).toBe(4);expect(context.teachers).toHaveLength(2);expect(context.teacherFailures.size).toBe(0);
});
test('loading waits for discovery assignment and can start while the photo UI pauses movement',()=>{
 const updateBody=app.slice(app.indexOf('function updateTeacherLoading(){'),app.indexOf('function loadTeachers('));let calls=0;
 const context={mode:'town',document:{hidden:false},discoveryReview:true,discovery:undefined,actor:{model:{position:{x:-4,z:-57}}},teachers:[],teacherLoading:false,teacherAttempted:false,teacherModuleFailure:null,teacherModuleRequest:0,teacherFailures:new Map(),performance:{now:()=>0},loadTeachers:()=>calls++};
 const update=vm.runInNewContext(updateBody+';updateTeacherLoading;',context);update();expect(calls).toBe(0);context.discovery={revealed:()=>true,snapshot:()=>({step:4}),open:()=>true};update();expect(calls).toBe(1);
});
