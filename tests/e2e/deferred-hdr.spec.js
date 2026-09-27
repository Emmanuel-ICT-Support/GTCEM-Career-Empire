import {test,expect} from './campus-fixtures.js';
test('entry reflection placeholder compiles before its original HDR arrives',async({page})=>{
 const errors=[];page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
 await page.route('**/reflection-test',route=>route.fulfill({contentType:'text/html',body:'<script type="importmap">{"imports":{"three":"/playable-3d/vendor/three/build/three.module.js"}}</script><canvas></canvas>'}));
 await page.goto('/reflection-test');
 const result=await page.evaluate(async()=>{
  const T=await import('three');const {createDeferredTextures}=await import('/playable-3d/deferred-textures.js');
  const deferred=createDeferredTextures();let downloads=0;
  const environment=await deferred.load({loadAsync:async()=>{downloads++;return new T.DataTexture(new Uint16Array(64*32*4).fill(15360),64,32,T.RGBAFormat,T.HalfFloatType);}},'original.hdr',{hdr:true});
  environment.mapping=T.EquirectangularReflectionMapping;
  const renderer=new T.WebGLRenderer({canvas:document.querySelector('canvas')});renderer.setSize(128,128);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(45,1,.1,20);camera.position.z=3;
  const material=new T.MeshStandardMaterial({envMap:environment});scene.add(new T.Mesh(new T.SphereGeometry(.6,12,8),material));renderer.render(scene,camera);
  const before={downloads,width:environment.image.width,height:environment.image.height};
  await deferred.start();renderer.render(scene,camera);
  const after={downloads,sameTexture:material.envMap===environment};renderer.dispose();return {before,after};
 });
 expect(errors).toEqual([]);expect(result.before.downloads).toBe(0);expect(result.after).toEqual({downloads:1,sameTexture:true});
});
