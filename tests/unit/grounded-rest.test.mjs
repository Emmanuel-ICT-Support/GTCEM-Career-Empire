import {beforeAll,test,expect} from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
import RAPIER from '../../playable-3d/vendor/rapier/rapier.mjs';
const source=fs.readFileSync(new URL('../../playable-3d/world.js',import.meta.url),'utf8');
const move=source.slice(source.indexOf('    move(inside,delta){'),source.indexOf('    protectCamera(')).trim().replace(/,$/,'');
beforeAll(async()=>{await RAPIER.init();});
function harness(){
 const world=new RAPIER.World({x:0,y:-9.81,z:0});world.createCollider(RAPIER.ColliderDesc.cuboid(60,.1,60).setTranslation(6,-.1,-20));world.createCollider(RAPIER.ColliderDesc.trimesh(new Float32Array([-20,.06,30,20,.06,30,20,.06,-30,-20,.06,-30]),new Uint32Array([0,1,2,0,2,3])));
 const body=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(-7,.9,17));
 const collider=world.createCollider(RAPIER.ColliderDesc.capsule(.56,.20),body),controller=world.createCharacterController(.025);controller.enableAutostep(.52,.16,true);controller.enableSnapToGround(.38);controller.setSlideEnabled(true);
 const physics={world,body,collider,controller,verticalVelocity:0};const teleport=source.slice(source.indexOf('    teleport(inside,x,z,feetY){'),source.indexOf('    teleport(inside,x,z,feetY){')+source.slice(source.indexOf('    teleport(inside,x,z,feetY){')).indexOf('\n')).trim().replace(/,$/,'');const api=vm.runInNewContext('({'+move+','+teleport+'})',{physical:()=>physics,arrivalOnly:false,Math});
 return {world,body,controller,teleport:(x,z,y)=>api.teleport(false,x,z,y),move:delta=>api.move(false,delta)};
}
test('grounded rest holds an exact stable physical pose after walking, allowing idle shadow reuse',()=>{const h=harness();try{for(let i=0;i<100;i++)h.move({x:0,z:-2.8/60});for(let i=0;i<60;i++)h.move({x:0,z:0});const rest=h.move({x:0,z:0});expect(h.controller.computedGrounded()).toBe(true);for(let i=0;i<120;i++)expect(h.move({x:0,z:0})).toEqual(rest);}finally{h.world.free();}});
test('rest does not stop an airborne player falling onto the ground',()=>{const h=harness();try{h.body.setTranslation({x:-7,y:4,z:17},true);h.body.setNextKinematicTranslation({x:-7,y:4,z:17});h.world.step();const first=h.move({x:0,z:0});for(let i=0;i<120;i++)h.move({x:0,z:0});const landed=h.move({x:0,z:0});expect(landed.y).toBeLessThan(first.y-2);expect(h.controller.computedGrounded()).toBe(true);}finally{h.world.free();}});
test('walking resumes from grounded rest and collision still blocks a wall',()=>{const h=harness();try{h.world.createCollider(RAPIER.ColliderDesc.cuboid(2,2,.1).setTranslation(-7,2,15));for(let i=0;i<60;i++)h.move({x:0,z:0});const rest=h.move({x:0,z:0});let end;for(let i=0;i<120;i++)end=h.move({x:0,z:-2.8/60});expect(rest.z-end.z).toBeGreaterThan(1);expect(end.z).toBeGreaterThan(15.2);}finally{h.world.free();}});

test('teleport clears grounded rest so a raised arrival still falls and settles',()=>{const h=harness();try{for(let i=0;i<120;i++)h.move({x:0,z:0});h.teleport(-7,17,4);const first=h.move({x:0,z:0});for(let i=0;i<120;i++)h.move({x:0,z:0});expect(h.move({x:0,z:0}).y).toBeLessThan(first.y-2);expect(h.controller.computedGrounded()).toBe(true);}finally{h.world.free();}});
