import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../../playable-3d/vendor/three/build/three.module.js';
test('fixed oval teachers finish a greeting and greet again without wandering',async()=>{
 const model=new THREE.Group();model.add(new THREE.Mesh(new THREE.BoxGeometry(1,2,1),new THREE.MeshStandardMaterial()));
 const clips=['idle','walk','wave'].map(name=>new THREE.AnimationClip(name,1,[]));
 const descriptor=()=>({setTranslation(){return this;}}),RAPIER={RigidBodyDesc:{kinematicPositionBased:descriptor},ColliderDesc:{capsule:descriptor}};
 const source=readFileSync(new URL('../../playable-3d/teacher-npc.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replace(/export /g,'');
 const create=vm.runInNewContext(source+';createTeacherNPC;',{THREE,RAPIER,GLTFLoader:class{async parseAsync(){return {scene:model,animations:clips};}},downloadAvatar:async()=>new ArrayBuffer(0),location:{href:'https://game.test/playable-3d/'},URL});
 const controller={enableSnapToGround(){},setSlideEnabled(){}};const worlds={town:new THREE.Scene(),townPhysics:{world:{createRigidBody:()=>({}),createCollider:()=>({}),createCharacterController:()=>controller}}};
 const npc=await create(worlds,{id:'fixture',name:'Teacher',file:'fixture.glb',fixed:true,spawn:{x:-4,z:-54},reactions:['wave'],clips:{idle:/idle$/,walk:/walk$/,wave:/wave$/}});const p=new THREE.Vector3(-4,0,-53),position=npc.root.position.clone();expect(npc.react(p)).toBe(true);expect(npc.react(p)).toBe(false);npc.fixedUpdate(1.1,p);expect(npc.snapshot().state).toBe('idle');expect(npc.root.position.equals(position)).toBe(true);expect(npc.react(p)).toBe(true);expect(npc.snapshot().reactions).toBe(2);
});
