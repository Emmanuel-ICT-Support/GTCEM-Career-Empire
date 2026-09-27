import {test,expect} from '@playwright/test';
test('moving suit uses current-pose shadows instead of stale silhouettes',async({page})=>{
 await page.route('**/suit-harness',r=>r.fulfill({contentType:'text/html',body:'<base href="/playable-3d/"><script type="importmap">{"imports":{"three":"/playable-3d/vendor/three/build/three.module.js","three/addons/":"/playable-3d/vendor/three/examples/jsm/"}}</script>'}));
 await page.goto('/suit-harness');
 const results=await page.evaluate(async()=>{
  const T=await import('three');const {loadCharacterKit,createCharacter}=await import('/playable-3d/characters.js');const {normaliseProfile}=await import('/playable-3d/profiles.js');
  const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(400,500);document.body.append(renderer.domElement);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
  const scene=new T.Scene();scene.background=new T.Color('#d7e8dc');scene.add(new T.HemisphereLight(0xffffff,0x777777,2));const sun=new T.DirectionalLight(0xffe0ac,3.5);sun.position.set(-18,24,24);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-36,right:36,top:38,bottom:-32,far:110});sun.shadow.normalBias=.035;scene.add(sun);
  const camera=new T.PerspectiveCamera(35,.8,.1,100);camera.position.set(0,1.2,3.7);camera.lookAt(0,.9,0);
  const gl=renderer.getContext();const read=()=>{const a=new Uint8Array(400*500*4);gl.readPixels(0,0,400,500,gl.RGBA,gl.UNSIGNED_BYTE,a);return a;};const diff=(a,b)=>{let changed=0,total=0;for(let y=80;y<350;y++)for(let x=100;x<300;x++){const k=(y*400+x)*4;let d=0;for(let j=0;j<3;j++)d+=Math.abs(a[k+j]-b[k+j]);if(d>15)changed++;total+=d;}return {changedPixels:changed,meanChannelDifference:total/(270*200*3)};};const out=[];
  for(const body of ['schoolboy','pantstest']){
   await loadCharacterKit(body);const actor=createCharacter(normaliseProfile({id:'flicker',body,outer:'none',workTop:'none',hairStyle:'none',shoeStyle:'none'}));scene.add(actor.model);actor.setWalking(true);actor.update(.3);
   renderer.shadowMap.needsUpdate=true;renderer.render(scene,camera);
   actor.update(5/60);actor.model.position.x+=2.8*5/60;camera.position.x+=2.8*5/60;camera.lookAt(actor.model.position.x,.9,0);
   renderer.shadowMap.needsUpdate=false;renderer.render(scene,camera);const stale=read();const before=renderer.domElement.toDataURL();
   actor.model.traverse(n=>{if(n.isSkinnedMesh)n.skeleton.update();});renderer.render(scene,camera);const shadowOnly=read();
   renderer.shadowMap.needsUpdate=true;renderer.render(scene,camera);const fresh=read();const after=renderer.domElement.toDataURL();
   renderer.shadowMap.needsUpdate=true;renderer.render(scene,camera);const repeated=read();out.push({body,stale:diff(stale,fresh),shadowOnly:diff(shadowOnly,fresh),fresh:diff(fresh,repeated),before,after});actor.dispose();camera.position.x=0;
  }return out;
 });
 const fs=await import('node:fs');fs.mkdirSync('evidence/movement',{recursive:true});for(const r of results){fs.writeFileSync(`evidence/movement/${r.body}-stale-shadow.png`,Buffer.from(r.before.split(',')[1],'base64'));fs.writeFileSync(`evidence/movement/${r.body}-fresh-shadow.png`,Buffer.from(r.after.split(',')[1],'base64'));expect(r.stale.changedPixels).toBeGreaterThan(100);expect(r.fresh.changedPixels).toBe(0);delete r.before;delete r.after;}console.log('SUIT_SHADOW',JSON.stringify(results));
});

for(const width of [1280,390])test(`playable suit shadows follow every walking frame at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:844});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/playable-3d/app.js*',async r=>{const response=await r.fetch();const source=(await response.text()).replace('renderer.render(scene,camera);frames++;',`window.__suitFrames?.push({shadow:renderer.shadowMap.needsUpdate,weight:actor.clips.walk?.getEffectiveWeight()||0,time:performance.now(),position:actor.model.position.toArray(),yaw:actor.model.rotation.y,changed:playerShadowChanged,quality:document.querySelector('#quality').value});renderer.render(scene,camera);frames++;`);await r.fulfill({response,body:source+'\nwindow.__suitFrames=[];'});});
 await page.goto('/playable-3d/?review=1',{waitUntil:'domcontentloaded'});await page.locator('#helper-picker [data-continue]').click();await page.waitForFunction(()=>{const d=JSON.parse(document.querySelector('#diagnostics').dataset.state||'{}');return d.entryReady&&!d.avatarFallback;},null,{timeout:90000});
 // End input inside the page: tracing/screenshot latency must not extend a walk
 // into distant-campus loading and change the scene under this bounded check.
 await page.evaluate(()=>{window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyW'}));setTimeout(()=>window.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyW'})),1300);});
 await page.waitForFunction(()=>window.__suitFrames.some(f=>f.weight>.01));
 await page.waitForFunction(()=>window.__suitFrames.slice(-10).some(f=>f.weight===0&&!f.shadow),null,{timeout:10000});
 await page.screenshot({path:`evidence/movement/suit-walking-${width}.png`});
 const frames=await page.evaluate(()=>window.__suitFrames);const moving=frames.filter(f=>f.weight>.01);expect(moving.length).toBeGreaterThan(5);expect(moving.every(f=>f.shadow)).toBe(true);expect(frames.slice(-10).some(f=>!f.shadow)).toBe(true);expect(errors).toEqual([]);console.log('SUIT_PLAYABLE',JSON.stringify({width,movingFrames:moving.length,staleMovingFrames:moving.filter(f=>!f.shadow).length}));
});
