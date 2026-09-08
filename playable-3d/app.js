import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createWorlds} from './world.js?v=startup-2';
import {loadCharacterKit,hasCharacterKit,createCharacter,isSimpleBody} from './characters.js?v=20260908-avatar';
import {loadProfiles,saveProfiles,normaliseProfile,OPTIONS,SKIN,PHASES} from './profiles.js';

const $=id=>document.getElementById(id),canvas=$('scene');
const icons=()=>window.lucide?.createIcons();
const state=loadProfiles(localStorage);
let worlds,renderer,camera,studio,orbit,actor,preview,mode='town',phase='flourishing',draft,editorTab='identity';
let undo=[],redo=[],pendingLeave=null,previewWalking=false,portrait=false,aerial=false,yaw=0,interaction=null;
let toastTimer,drag=null,lastTime=0,accumulator=0,metricsTime=0,frames=0,viewport={width:1,height:1};
let tapMovement=null;
let moduleObserver=null,moduleTimer=null;
const keys=new Set(),clock=new THREE.Clock(),lookAt=new THREE.Vector3(),desiredCamera=new THREE.Vector3();
const active=()=>state.profiles.find(p=>p.id===state.activeId);
const copy=value=>structuredClone(value);
const isMobile=()=>window.innerWidth<=620;
const dirty=()=>mode==='studio' && JSON.stringify(draft)!==JSON.stringify(active());
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4300);}
function persist(){try{saveProfiles(localStorage,state);return true;}catch{toast('Your browser could not save this character. Keep this tab open.');return false;}}
function populateProfiles(){$('profile').replaceChildren(...state.profiles.map(p=>new Option(p.name,p.id)));$('profile').value=state.activeId;$('character-caption').textContent=active().name;}
let actorRequest=0,previewRequest=0,hallRequest=0,nearHall=false;
async function updateActor(){
  const request=++actorRequest,profile=active();
  if(!hasCharacterKit(profile.body)){
    toast('Loading your character...');
    try{await loadCharacterKit(profile.body);}catch{toast('Character could not load. Select the profile again to retry.');return;}
    if(request!==actorRequest)return;
  }
  const position=actor?.model.position.clone() || worlds.position(false),rotation=actor?.model.rotation.y ?? Math.PI;
  actor?.dispose();actor=createCharacter(active());actor.model.position.copy(position);actor.model.rotation.y=rotation;
  (mode==='interior'?worlds.interior:worlds.town).add(actor.model);populateProfiles();
}
async function updatePreview(){
  const request=++previewRequest;
  $('undo').disabled=!undo.length;$('redo').disabled=!redo.length;
  if(!hasCharacterKit(draft.body)){
    $('edit-state').textContent='Loading body...';
    try{await loadCharacterKit(draft.body);}catch{if(request===previewRequest&&mode==='studio')$('edit-state').textContent='Body could not load. Select it again to retry.';return;}
    if(request!==previewRequest||mode!=='studio')return;
  }
  const rotation=preview?.model.rotation.y || 0;
  preview?.dispose();preview=createCharacter(draft);preview.model.rotation.y=rotation;studio.add(preview.model);preview.setWalking(previewWalking);
  $('studio-caption').textContent=draft.name;$('edit-state').textContent=dirty()?'Unsaved':'Saved';$('undo').disabled=!undo.length;$('redo').disabled=!redo.length;
}
function changeDraft(mutator){undo.push(copy(draft));if(undo.length>60)undo.shift();redo=[];mutator(draft);draft=normaliseProfile(draft);updatePreview();renderEditor();}
function field(label,key,type='text',rows){
  const wrapper=document.createElement('label');wrapper.className='field';
  const title=document.createElement('span');title.textContent=label;wrapper.append(title);
  let input;
  if(rows){input=document.createElement('select');for(const [value,name] of rows)input.add(new Option(name,value));input.value=draft[key];}
  else if(type==='textarea'){input=document.createElement('textarea');input.value=draft.future[key];input.maxLength=500;}
  else{input=document.createElement('input');input.type=type;input.value=draft[key];input.maxLength=36;}
  input.setAttribute('aria-label',label);
  input.addEventListener('change',()=>changeDraft(p=>{if(type==='textarea')p.future[key]=input.value;else p[key]=input.value;}));
  wrapper.append(input);return wrapper;
}
function colour(label,key){
  const input=document.createElement('input');input.type='color';input.className='colour-input';input.value=draft.colours[key];input.title=label;input.setAttribute('aria-label',label);
  input.addEventListener('change',()=>changeDraft(p=>p.colours[key]=input.value));return input;
}
function optionWithColour(label,key,colourKey=key){const row=document.createElement('div');row.className='field-row';row.append(field(label,key,'select',OPTIONS[key]),colour(`${label} colour`,colourKey));return row;}
function renderEditor(){
  const root=$('editor-fields');root.replaceChildren();
  document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('active',b.dataset.tab===editorTab);b.setAttribute('aria-pressed',b.dataset.tab===editorTab);});
  const simple=isSimpleBody(draft.body);
  if(editorTab==='identity'){
    root.append(field('Name','name'),field('Body','body','select',OPTIONS.body));
    if(simple){
      const note=document.createElement('p');note.className='hint';note.textContent='Tripo interim: school-safe wetsuit with baked hair. Face/skin/hair colours do not apply yet — switch to Body A/B for full wardrobe.';root.append(note);
    }else{
      root.append(field('Face','face','select',OPTIONS.face));
      const skin=document.createElement('div');skin.className='field';const label=document.createElement('span');label.textContent='Skin tone';skin.append(label);
      const swatches=document.createElement('div');swatches.className='swatches';swatches.setAttribute('role','group');swatches.setAttribute('aria-label','Skin tone');
      for(const [key,hex] of Object.entries(SKIN)){const b=document.createElement('button');b.className='swatch';b.style.backgroundColor=hex;b.classList.toggle('active',draft.skin===key);b.title=key[0].toUpperCase()+key.slice(1);b.setAttribute('aria-label',`${b.title} skin tone`);b.setAttribute('aria-pressed',draft.skin===key);b.addEventListener('click',()=>{changeDraft(p=>p.skin=key);renderEditor();});swatches.append(b);}
      skin.append(swatches);root.append(skin,optionWithColour('Hair','hair'));
      const eye=document.createElement('label');eye.className='binary-field';eye.append('Eye colour',colour('Eye colour','eye'));root.append(eye);
    }
  }else if(editorTab==='style'){
    if(simple){
      const note=document.createElement('p');note.className='hint';note.textContent='Wardrobe is baked into this Tripo mesh. Choose Body A or Body B to use modular clothes.';root.append(note);
    }else{
      root.append(optionWithColour('Top','top'),optionWithColour('Bottom','bottom'),optionWithColour('Outer layer','outer'));
      const jumper=document.createElement('label');jumper.className='binary-field';const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=draft.jumper;checkbox.addEventListener('change',()=>changeDraft(p=>p.jumper=checkbox.checked));jumper.append(checkbox,'Knit jumper');root.append(jumper);
      const knit=document.createElement('label');knit.className='binary-field';knit.append('Jumper colour',colour('Jumper colour','jumper'));root.append(knit);
      root.append(field('Accessory','accessory','select',OPTIONS.accessory));const shoes=document.createElement('label');shoes.className='binary-field';shoes.append('Shoe colour',colour('Shoe colour','shoes'));root.append(shoes);
    }
  }else root.append(field('Future occupation','occupation','textarea'),field('Training pathway','training','textarea'),field('A strength I bring','strength','textarea'));
  icons();
}
function setMode(next){
  hallRequest++;previewRequest++;keys.clear();tapMovement=null;document.querySelectorAll('.movement button').forEach(b=>b.classList.remove('pressed'));drag=null;mode=next;
  const inStudio=next==='studio';
  for(const id of ['world-heading','world-tools','destination-bar','movement','world-footer'])$(id).hidden=inStudio;
  for(const id of ['studio-heading','studio-panel','studio-view-tools'])$(id).hidden=!inStudio;
  $('interact').hidden=true;interaction=null;
  $('town-view').classList.toggle('active',!inStudio);$('town-view').setAttribute('aria-pressed',!inStudio);
  $('studio-view').classList.toggle('active',inStudio);$('studio-view').setAttribute('aria-pressed',inStudio);
  orbit.enabled=inStudio;canvas.setAttribute('aria-label',inStudio?'Interactive 3D character':next==='interior'?'Interactive EST Prep hall':'Interactive 3D town');
  if(inStudio){draft=copy(active());undo=[];redo=[];editorTab='identity';previewWalking=false;portrait=false;$('pose-avatar').setAttribute('aria-pressed','false');$('portrait-view').setAttribute('aria-pressed','false');updatePreview();renderEditor();resetStudioCamera();}
  else{preview?.dispose();preview=null;(next==='interior'?worlds.interior:worlds.town).add(actor.model);actor.model.position.copy(worlds.position(next==='interior'));yaw=0;aerial=false;$('aerial').setAttribute('aria-pressed','false');setLocation(next==='interior'?'EST Prep':'Town Square');updateCamera(1,true);}
  resize();
}
function setLocation(title){$('location-title').textContent=title;$('district-label').textContent=mode==='interior'?'THE LEARNING HALL':'THE LEARNING DISTRICT';$('location-subtitle').textContent=mode==='interior'?'CORE / TERM / VTCS / BOSS':'Home Base / EST Prep';}
function leaveStudio(callback){if(dirty()){pendingLeave=callback;$('leave-dialog').showModal();}else callback();}
function saveDraft(){if(!hasCharacterKit(draft.body)){toast('Wait for the selected body to load before saving.');return false;}state.profiles=state.profiles.map(p=>p.id===state.activeId?normaliseProfile(draft):p);const ok=persist();updateActor();$('edit-state').textContent=ok?'Saved':'Not saved';return ok;}
function openStudio(){if(mode==='studio')return;setMode('studio');}
async function enterHall(){
  const request=++hallRequest;toast('Opening EST Prep...');
  try{await worlds.ensureInterior();}catch{if(request===hallRequest)toast('EST Prep could not load. Choose Enter EST Prep to retry.');return;}
  if(request!==hallRequest||mode!=='town')return;
  worlds.teleport(true,0,5.0);actor.model.rotation.y=Math.PI;setMode('interior');
}
function returnTown(){if(mode==='studio')leaveStudio(()=>setMode('town'));else setMode('town');}
function destination(which){const go=()=>{setMode('town');worlds.teleport(false,which==='est'?0:-12.4,which==='est'?-8.35:5.0);actor.model.position.copy(worlds.position(false));actor.model.rotation.y=which==='est'?Math.PI:-Math.PI/2;yaw=which==='est'?0:Math.PI/2;setLocation(which==='est'?'EST Prep':'Home Base');updateCamera(1,true);};if(mode==='studio')leaveStudio(go);else go();}
function resetStudioCamera(){const distance=isMobile()?4.25:4.0;camera.position.set(.12,portrait?1.63:1.3,portrait?1.8:distance);orbit.target.set(0,portrait?1.48:.95,0);orbit.minDistance=1.15;orbit.maxDistance=5.2;orbit.maxPolarAngle=Math.PI*.59;orbit.minPolarAngle=Math.PI*.28;orbit.update();}
function resize(){
  if(!renderer)return;viewport={width:window.innerWidth,height:$('experience').clientHeight};renderer.setSize(viewport.width,viewport.height,false);
  const mobile=isMobile();const width=mode==='studio'&&!mobile?viewport.width-(viewport.width>900?364:316):viewport.width;
  const height=mode==='studio'&&mobile?viewport.height*.57:viewport.height;
  camera.aspect=width/height;camera.fov=mode==='studio'?36:mobile?62:55;camera.updateProjectionMatrix();
  if(mode==='studio')resetStudioCamera();
}
function updateCamera(dt,snap=false){
  if(mode==='studio'){orbit.update();return;}
  const p=actor.model.position;
  if(aerial){if(mode==='interior'){desiredCamera.set(8,12,13);lookAt.set(0,0,0);}else{desiredCamera.set(27,36,38);lookAt.set(-1,0,-3);}}
  else{const distance=mode==='interior'?4.2:6.0;desiredCamera.set(p.x+Math.sin(yaw)*distance,p.y+(mode==='interior'?3:3.25),p.z+Math.cos(yaw)*distance);lookAt.set(p.x-Math.sin(yaw)*1.1,p.y+(mode==='interior'?1.55:2.1),p.z-Math.cos(yaw)*1.1);}
  camera.position.lerp(desiredCamera,snap?1:1-Math.exp(-dt*7));camera.lookAt(lookAt);
}
function updateInteraction(){
  if(mode==='studio'||!$('module-overlay').hidden){$('interact').hidden=true;interaction=null;return;}
  const p=actor.model.position;
  if(mode==='town'){
    const approaching=Math.hypot(p.x,p.z+8.6)<7;
    if(approaching&&!nearHall)worlds.ensureInterior().catch(()=>{});
    nearHall=approaching;
    if(Math.hypot(p.x,p.z+8.6)<3.25)interaction={label:'Enter EST Prep',action:enterHall};
    else if(Math.hypot(p.x+12.6,p.z-5)<2.5)interaction={label:'Open Avatar Studio',action:openStudio};
    else interaction=null;
  }else{
    const nearest=worlds.stations.map(s=>({...s,distance:Math.hypot(p.x-s.x,p.z-s.z)})).sort((a,b)=>a.distance-b.distance)[0];
    if(nearest.distance<2.25)interaction={label:`Open ${nearest.name}`,action:()=>openModule(nearest.name,nearest.id)};
    else if(p.z>4.2)interaction={label:'Return to Town Square',action:()=>{worlds.teleport(false,0,-8.35);setMode('town');}};
    else interaction={label:'Open EST Prep',action:()=>openModule('Learning labs')};
  }
  $('interact').hidden=!interaction;if(interaction)$('interact').querySelector('span').textContent=interaction.label;
}
function openModule(name,stage){
  keys.clear();tapMovement=null;actor.setWalking(false);$('module-name').textContent=name;$('module-overlay').hidden=false;$('experience').inert=true;
  const frame=$('module-frame');
  frame.onload=()=>{
    if(!stage)return;
    // The existing module publishes this API. Wait for its asynchronous lab track to finish rendering.
    const launch=()=>{const doc=frame.contentDocument,api=frame.contentWindow?.ESTPrep;if(!doc?.querySelector('[onclick*="ESTPrep.openStage"]')||!api?.openStage)return false;moduleObserver?.disconnect();clearTimeout(moduleTimer);api.openStage(stage);return true;};
    if(launch())return;moduleObserver=new MutationObserver(launch);moduleObserver.observe(frame.contentDocument.body,{childList:true,subtree:true});moduleTimer=setTimeout(()=>{moduleObserver?.disconnect();$('module-name').textContent=`${name} / choose a lab below`;},15000);
  };
  frame.src='/existing/modules/est-prep/index.html';$('close-module').focus();
}
function closeModule(){moduleObserver?.disconnect();clearTimeout(moduleTimer);$('module-overlay').hidden=true;$('experience').inert=false;$('module-frame').onload=null;$('module-frame').removeAttribute('src');canvas.focus();}
function phaseChange(name){if(!Object.hasOwn(PHASES,name))return;phase=name;worlds.phase(name);$('phase').value=name;}
function qualityChange(){const q=$('quality').value;renderer.setPixelRatio(q==='low'?1:q==='high'?Math.min(devicePixelRatio,2):Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=q!=='low';resize();}
function bindEvents(){
  $('town-view').addEventListener('click',returnTown);$('studio-view').addEventListener('click',openStudio);
  $('home-destination').addEventListener('click',()=>destination('home'));$('est-destination').addEventListener('click',()=>destination('est'));
  $('interact').addEventListener('click',()=>interaction?.action());$('phase').addEventListener('change',e=>phaseChange(e.target.value));$('quality').addEventListener('change',qualityChange);
  $('aerial').addEventListener('click',()=>{aerial=!aerial;$('aerial').setAttribute('aria-pressed',aerial);});$('recenter').addEventListener('click',()=>{yaw=0;aerial=false;$('aerial').setAttribute('aria-pressed','false');updateCamera(1,true);});
  $('profile').addEventListener('change',()=>{const id=$('profile').value;$('profile').value=state.activeId;const change=()=>{state.activeId=id;persist();updateActor();if(mode==='studio')setMode('studio');};if(mode==='studio')leaveStudio(change);else change();});
  $('new-profile').addEventListener('click',()=>{const add=()=>{if(state.profiles.length>=24){toast('This browser already has 24 characters.');return;}const p=normaliseProfile({id:crypto.randomUUID(),name:`Character ${state.profiles.length+1}`});state.profiles.push(p);state.activeId=p.id;persist();updateActor();setMode('studio');};if(mode==='studio')leaveStudio(add);else add();});
  document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{editorTab=b.dataset.tab;renderEditor();}));
  $('save-avatar').addEventListener('click',()=>{if(saveDraft()){setMode('town');toast(`${active().name} saved in this browser`);}});
  $('undo').addEventListener('click',()=>{if(!undo.length)return;redo.push(copy(draft));draft=undo.pop();updatePreview();renderEditor();});$('redo').addEventListener('click',()=>{if(!redo.length)return;undo.push(copy(draft));draft=redo.pop();updatePreview();renderEditor();});
  $('keep-editing').addEventListener('click',()=>{$('leave-dialog').close();pendingLeave=null;});$('discard-changes').addEventListener('click',()=>{$('leave-dialog').close();pendingLeave?.();pendingLeave=null;});$('save-changes').addEventListener('click',()=>{if(saveDraft()){$('leave-dialog').close();pendingLeave?.();pendingLeave=null;}});
  $('turn-avatar').addEventListener('click',()=>{if(preview)preview.model.rotation.y+=Math.PI;});$('pose-avatar').addEventListener('click',()=>{previewWalking=!previewWalking;preview?.setWalking(previewWalking);$('pose-avatar').setAttribute('aria-pressed',previewWalking);});$('portrait-view').addEventListener('click',()=>{portrait=!portrait;$('portrait-view').setAttribute('aria-pressed',portrait);resetStudioCamera();});
  $('close-module').addEventListener('click',closeModule);
  window.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)||$('leave-dialog').open||!$('module-overlay').hidden)return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();keys.add(e.code);}if(e.code==='KeyE')interaction?.action();});
  window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{keys.clear();accumulator=0;});window.addEventListener('resize',resize);
  window.addEventListener('beforeunload',e=>{if(dirty()){e.preventDefault();e.returnValue='';}});
  document.querySelectorAll('[data-key]').forEach(b=>{let pressedAt=0;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);pressedAt=performance.now();keys.add(b.dataset.key);b.classList.add('pressed');});const release=e=>{if(e.type==='pointerup'&&performance.now()-pressedAt<180)tapMovement={key:b.dataset.key,until:performance.now()+220};keys.delete(b.dataset.key);b.classList.remove('pressed');};b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release);});
  canvas.addEventListener('pointerdown',e=>{canvas.focus();if(mode==='studio')return;drag={x:e.clientX,yaw};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(drag && mode!=='studio')yaw=drag.yaw-(e.clientX-drag.x)*.006;});canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
}
function animate(){
  requestAnimationFrame(animate);const now=clock.getElapsedTime(),dt=Math.min(now-lastTime,.08);lastTime=now;
  if(mode!=='studio'&&$('module-overlay').hidden){
    if(tapMovement){if(performance.now()<tapMovement.until)keys.add(tapMovement.key);else{keys.delete(tapMovement.key);tapMovement=null;}}
    let x=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),z=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0);
    const length=Math.hypot(x,z);if(length){x/=length;z/=length;}
    const speed=keys.has('ShiftLeft')||keys.has('ShiftRight')?4.6:2.8;
    const dx=(x*Math.cos(yaw)+z*Math.sin(yaw))*speed,dz=(-x*Math.sin(yaw)+z*Math.cos(yaw))*speed;
    accumulator=Math.min(accumulator+dt,.1);let travelled=0;
    while(accumulator>=1/60){const previous=actor.model.position.clone();const next=worlds.move(mode==='interior',{x:dx/60,z:dz/60});actor.model.position.set(next.x,next.y,next.z);travelled+=Math.hypot(next.x-previous.x,next.z-previous.z);accumulator-=1/60;}
    actor.setWalking(Boolean(length && travelled>.001));if(length){const target=Math.atan2(dx,dz),difference=Math.atan2(Math.sin(target-actor.model.rotation.y),Math.cos(target-actor.model.rotation.y));actor.model.rotation.y+=difference*Math.min(1,dt*12);}
    actor.update(dt);worlds.update(now);updateInteraction();
  }else if(mode==='studio')preview?.update(dt);
  updateCamera(dt);renderer.setViewport(0,0,viewport.width,viewport.height);renderer.setScissorTest(false);renderer.clear();
  let scene=mode==='studio'?studio:mode==='interior'?worlds.interior:worlds.town;
  if(mode==='studio'){const mobile=isMobile();renderer.setViewport(0,mobile?viewport.height*.43:0,mobile?viewport.width:viewport.width-(viewport.width>900?364:316),mobile?viewport.height*.57:viewport.height);}
  renderer.render(scene,camera);frames++;
  if(now-metricsTime>1){
    const gl=renderer.getContext(),pixels=new Uint8Array(4*24*24),colours=new Set();
    for(const x of [.25,.40,.6])for(const y of [.25,.45,.7]){gl.readPixels(Math.floor(gl.drawingBufferWidth*x),Math.floor(gl.drawingBufferHeight*y),24,24,gl.RGBA,gl.UNSIGNED_BYTE,pixels);for(let i=0;i<pixels.length;i+=4)colours.add(`${pixels[i]>>2},${pixels[i+1]>>2},${pixels[i+2]>>2}`);}
    const data={mode,phase,profileId:state.activeId,position:actor.model.position.toArray().map(n=>+n.toFixed(3)),fps:Math.round(frames/(now-metricsTime)),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,pixelColours:colours.size,animations:Object.keys(actor.clips),visibleMeshes:0};
    (mode==='studio'?preview?.model:actor.model)?.traverse(o=>{if(o.isMesh&&o.visible)data.visibleMeshes++;});
    $('diagnostics').value=JSON.stringify(data);$('diagnostics').dataset.state=JSON.stringify(data);canvas.dataset.rendered='true';frames=0;metricsTime=now;
  }
}
async function boot(){
  try{
    icons();renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.03;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.autoClear=false;
    camera=new THREE.PerspectiveCamera(55,1,.08,220);orbit=new OrbitControls(camera,canvas);orbit.enableDamping=true;orbit.enablePan=false;orbit.enabled=false;
    const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();const environment=pmrem.fromScene(room,.04);room.dispose();pmrem.dispose();
    $('loading-message').textContent='Loading your character and learning district...';
    [worlds]=await Promise.all([createWorlds(message=>$('loading-message').textContent=message),loadCharacterKit(active().body)]);
    $('loading-message').textContent='Preparing your first view...';worlds.town.environment=environment.texture;worlds.town.environmentIntensity=.28;worlds.interior.environment=environment.texture;worlds.interior.environmentIntensity=.55;
    studio=new THREE.Scene();studio.background=new THREE.Color(0xd8e3d5);studio.fog=new THREE.Fog(0xd8e3d5,4,12);studio.environment=environment.texture;studio.environmentIntensity=.4;
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:0xd8e3d5,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.005;ground.receiveShadow=true;studio.add(ground);
    studio.add(new THREE.HemisphereLight(0xf5faf4,0x7a8f72,2.1));const key=new THREE.DirectionalLight(0xfff3dc,3.4);key.position.set(-3,5,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=4;key.shadow.camera.bottom=-2;key.shadow.normalBias=.015;studio.add(key);
    const rim=new THREE.DirectionalLight(0xcfe9f1,1.4);rim.position.set(3,3,-2);studio.add(rim);
    worlds.teleport(false,2.55,17);phase='flourishing';$('phase').value='flourishing';worlds.phase('flourishing');updateActor();bindEvents();resize();setMode('town');$('loading').hidden=true;icons();animate();
  }catch(error){console.error(error);$('loading-message').textContent=`The 3D district could not open: ${error.message}`;$('loading').querySelector('progress').hidden=true;$('fallback-link').hidden=false;}
}
boot();
