import {integrateEnvironment} from './environment.js?v=combined1';
import {CHAPEL} from './chapel.js?v=chapel1';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createWorlds} from './world.js?v=est-release41';
import {LEGACY,EST} from './destinations.js?v=ecc1';
import {loadCharacterKit,hasCharacterKit,createCharacter,isSimpleBody} from './characters.js?v=20260910-schoolboy1';
import {loadProfiles,saveProfiles,normaliseProfile,OPTIONS,SKIN,PHASES} from './profiles.js?v=20260909-jackettest1';

const $=id=>document.getElementById(id),canvas=$('scene');
const icons=()=>window.lucide?.createIcons();
const state=loadProfiles(localStorage);
let worlds,renderer,camera,studio,orbit,actor,preview,mode='town',phase='flourishing',draft,editorTab='identity';
let undo=[],redo=[],pendingLeave=null,previewWalking=false,portrait=false,aerial=false,yaw=0,interaction=null;
let toastTimer,drag=null,lastTime=0,accumulator=0,metricsTime=0,frames=0,viewport={width:1,height:1};
let tapMovement=null,watchingEST=false;
let moduleObserver=null,moduleTimer=null;
const keys=new Set(),clock=new THREE.Clock(),lookAt=new THREE.Vector3(),desiredCamera=new THREE.Vector3();
const active=()=>state.profiles.find(p=>p.id===state.activeId);
const copy=value=>structuredClone(value);
const isMobile=()=>window.innerWidth<=620;
const space=()=>mode==='chapel'?'chapel':mode==='interior';
const activeScene=()=>mode==='chapel'?worlds.chapel:mode==='interior'?worlds.interior:worlds.town;
const dirty=()=>mode==='studio' && JSON.stringify(draft)!==JSON.stringify(active());
const bodyName=body=>OPTIONS.body.find(([id])=>id===body)?.[1] || 'avatar';
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
  activeScene().add(actor.model);populateProfiles();
}
async function updatePreview(){
  const request=++previewRequest;
  $('undo').disabled=!undo.length;$('redo').disabled=!redo.length;
  $('save-avatar').disabled=true;
  if(!hasCharacterKit(draft.body)){
    $('edit-state').textContent=`Preparing ${bodyName(draft.body)}…`;
    try{await loadCharacterKit(draft.body);}catch{if(request===previewRequest&&mode==='studio')$('edit-state').textContent='This avatar could not load. Select it again to retry.';return;}
    if(request!==previewRequest||mode!=='studio')return;
  }
  const rotation=preview?.model.rotation.y || 0;
  preview?.dispose();preview=createCharacter(draft);preview.model.rotation.y=rotation;studio.add(preview.model);preview.setWalking(previewWalking);
  $('studio-caption').textContent=draft.name;$('edit-state').textContent=dirty()?'Unsaved':'Saved';$('undo').disabled=!undo.length;$('redo').disabled=!redo.length;$('save-avatar').disabled=false;
}
async function warmAvatarChoices(){
  // Prepare the alternate choices after the town is ready, one at a time, so
  // the first visit to Avatar Studio feels immediate without delaying entry.
  for(const body of ['shirt','a','b']){
    try{await loadCharacterKit(body);}catch{ /* The picker can retry a failed choice. */ }
    await new Promise(resolve=>requestAnimationFrame(resolve));
  }
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
      const note=document.createElement('p');note.className='hint';note.textContent=draft.body==='schoolboy'?'School-student test model. Face, skin and hair controls are not available yet.':draft.body==='shirt'?'Shirt avatar test model. Face, skin and hair controls are not available yet.':'Base reference avatar. Face, skin and hair controls are not available yet.';root.append(note);
    }else{
      root.append(field('Face','face','select',OPTIONS.face));
      const skin=document.createElement('div');skin.className='field';const label=document.createElement('span');label.textContent='Skin tone';skin.append(label);
      const swatches=document.createElement('div');swatches.className='swatches';swatches.setAttribute('role','group');swatches.setAttribute('aria-label','Skin tone');
      for(const [key,hex] of Object.entries(SKIN)){const b=document.createElement('button');b.className='swatch';b.style.backgroundColor=hex;b.classList.toggle('active',draft.skin===key);b.title=key[0].toUpperCase()+key.slice(1);b.setAttribute('aria-label',`${b.title} skin tone`);b.setAttribute('aria-pressed',draft.skin===key);b.addEventListener('click',()=>{changeDraft(p=>p.skin=key);renderEditor();});swatches.append(b);}
      skin.append(swatches);root.append(skin,optionWithColour('Hair','hair'));
      const eye=document.createElement('label');eye.className='binary-field';eye.append('Eye colour',colour('Eye colour','eye'));root.append(eye);
    }
  }else if(editorTab==='style'){
    if(draft.body==='jackettest'){
      root.append(field('Jacket','outer','select',[['blazer','Navy blazer'],['none','Off - inspect fit']]));
      const note=document.createElement('p');note.className='hint';note.textContent='Dressing test. Jacket-off reveals missing body areas. Walking preview uses a simple test cycle.';root.append(note);
    }else if(simple){
      const note=document.createElement('p');note.className='hint';note.textContent=draft.body==='schoolboy'?'This school-student model uses its own uniform and styling.':draft.body==='shirt'?'This test model includes a white shirt, short teal tie and black shorts.':'This is the normal reference avatar.';root.append(note);
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
  if(watchingEST)closeESTVideo();worlds?.estVideo.pause();hallRequest++;previewRequest++;keys.clear();tapMovement=null;document.querySelectorAll('.movement button').forEach(b=>b.classList.remove('pressed'));drag=null;mode=next;$('experience').classList.toggle('in-chapel',next==='chapel');
  const inStudio=next==='studio';$('arrival-mission').hidden=inStudio||next==='interior'||next==='chapel';$('est-watch').hidden=true;
  for(const id of ['world-heading','world-tools','destination-bar','movement','world-footer'])$(id).hidden=inStudio;
  for(const id of ['studio-heading','studio-panel','studio-view-tools'])$(id).hidden=!inStudio;
  $('interact').hidden=true;interaction=null;
  $('town-view').classList.toggle('active',!inStudio);$('town-view').setAttribute('aria-pressed',!inStudio);
  $('studio-view').classList.toggle('active',inStudio);$('studio-view').setAttribute('aria-pressed',inStudio);
  orbit.enabled=inStudio;canvas.setAttribute('aria-label',inStudio?'Interactive 3D character':next==='chapel'?'Interactive ECC Chapel':next==='interior'?'Interactive EST Prep hall':'Interactive 3D town');
  if(inStudio){draft=copy(active());undo=[];redo=[];editorTab='identity';previewWalking=false;portrait=false;$('pose-avatar').setAttribute('aria-pressed','false');$('portrait-view').setAttribute('aria-pressed','false');updatePreview();renderEditor();resetStudioCamera();}
  else{preview?.dispose();preview=null;activeScene().add(actor.model);actor.model.position.copy(worlds.position(space()));yaw=0;aerial=false;$('aerial').setAttribute('aria-pressed','false');setLocation(next==='chapel'?'ECC Chapel':next==='interior'?'EST Prep':'Arrival Gardens');updateCamera(1,true);}
  resize();
}
function setLocation(title){$('location-title').textContent=title;$('district-label').textContent=mode==='chapel'?'A PLACE TO PAUSE':mode==='interior'?'THE LEARNING HALL':'CAREER EMPIRE · YOUR FIRST DAY';$('location-subtitle').textContent=mode==='chapel'?'Quiet reflection / Take your time':mode==='interior'?'CORE / TERM / VTCS / BOSS':'Arrival Gardens / Avatar Studio';}
function leaveStudio(callback){if(dirty()){pendingLeave=callback;$('leave-dialog').showModal();}else callback();}
function saveDraft(){if(!hasCharacterKit(draft.body)){toast('Wait for the selected body to load before saving.');return false;}state.profiles=state.profiles.map(p=>p.id===state.activeId?normaliseProfile(draft):p);const ok=persist();if(ok){try{localStorage.setItem('ce-arrival-complete-'+state.activeId,'1');}catch{}}updateActor();$('edit-state').textContent=ok?'Saved':'Not saved';return ok;}
function openStudio(){if(mode==='studio')return;setMode('studio');}
let enteringHall=false;
async function enterHall(){
  if(enteringHall)return;enteringHall=true;
  const request=++hallRequest;toast('Opening EST Prep...');
  try{await worlds.ensureInterior();}catch{enteringHall=false;if(request===hallRequest)toast('EST Prep could not load. Choose Enter EST Prep to retry.');return;}
  enteringHall=false;
  if(request!==hallRequest||mode!=='town')return;
  worlds.teleport(true,0,5.0);actor.model.rotation.y=Math.PI;setMode('interior');worlds.estVideo.prepare().catch(()=>{});toast('Choose Play EST video on the wall whenever you are ready.');
}
async function enterChapel(){const request=++hallRequest;toast('Opening the Chapel...');try{await worlds.ensureChapel();}catch{if(request===hallRequest)toast('Chapel could not load. Try entering again.');return;}if(request!==hallRequest||mode!=='town')return;worlds.teleport('chapel',...CHAPEL.entry);setMode('chapel');}
function leaveChapel(){setMode('town');worlds.teleport(false,CHAPEL.x,CHAPEL.z);actor.model.position.copy(worlds.position(false));yaw=1.1;clearTimeout(toastTimer);$('toast').hidden=true;updateCamera(1,true);}
function closeESTVideo(){documentRequest++;if(document.fullscreenElement)document.exitFullscreen?.();$('est-document-frame').replaceChildren();$('est-video-dialog').close();watchingEST=false;worlds.estVideo.pause();$('est-video-controls').hidden=true;keys.clear();tapMovement=null;canvas.focus();}
function showESTFilm(){documentRequest++; $('est-documents').hidden=true;$('est-document-frame').hidden=true;$('est-document-frame').replaceChildren();$('est-source-title').hidden=true;worlds.estVideo.video.hidden=false;$('est-film-controls').hidden=false; }
function watchESTVideo(){watchingEST=true;$('est-video-zoom').value='1';$('est-media-slot').classList.remove('zoomed');const media=worlds.estVideo.video;media.hidden=false;media.controls=true;$('est-media-slot').append(media);showESTFilm();$('est-video-dialog').showModal();$('interact').hidden=true;$('est-watch').hidden=true;interaction=null;clearTimeout(toastTimer);$('toast').hidden=true;keys.clear();tapMovement=null;actor.setWalking(false);$('est-video-controls').hidden=false;$('est-video-play').textContent='Play';$('est-video-status').textContent='Loading the video for smooth playback and seeking…';worlds.estVideo.play().catch(()=>{$('est-video-status').textContent='Video could not load. Choose Play to retry.';});}
const estDocuments={
 core:{title:'CORE — EST Content',file:'2026-CEMGT-EST-Unit-3-Content.pdf'},
 term:{title:'TERM — Glossary of Terms',file:'Glossary of Terms.pdf'},
 vtcs:{title:'VTCS — Words used in the formulation of questions',file:'Glossary-of-key-words-used-in-the-formulation-of-questions_.pdf'}
};
let documentRequest=0,documentPages;
async function openESTDocument(key){const request=++documentRequest,doc=estDocuments[key];worlds.estVideo.pause();worlds.estVideo.video.hidden=true;$('est-film-controls').hidden=true;$('est-documents').hidden=false;$('est-source-title').hidden=false;$('est-source-title').textContent=doc.title;const url='../Assets/EST%20Preparation/EST%20-%20Knowledge%20reactor/'+encodeURIComponent(doc.file);const frame=$('est-document-frame');frame.hidden=false;frame.textContent='Loading document pages…';$('est-media-slot').classList.remove('zoomed');$('est-document-zoom').value='1';frame.style.setProperty('--document-zoom',1);$('est-document-link').hidden=false;$('est-document-link').href=url;$('est-document-link').textContent='Open original '+doc.title+' PDF ↗';document.querySelectorAll('[data-est-document]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.estDocument===key));$('est-video-status').textContent='Choose CORE, TERM or VTCS above. Scroll through every page; use Document zoom to enlarge the text.';
 try{documentPages??=fetch('./assets/est-documents/pages.json').then(r=>{if(!r.ok)throw Error('Document pages unavailable');return r.json();});const pages=(await documentPages)[key];if(request!==documentRequest)return;frame.replaceChildren();for(const [index,src] of pages.entries()){const figure=document.createElement('figure'),image=document.createElement('img'),caption=document.createElement('figcaption');image.src=src;image.alt=doc.title+' — page '+(index+1);image.loading=index?'lazy':'eager';caption.textContent='Page '+(index+1)+' of '+pages.length;figure.append(image,caption);frame.append(figure);}frame.scrollTo(0,0);}catch{documentPages=null;if(request===documentRequest)frame.textContent='The document pages could not load. Choose the document again, or open the original PDF above.';}}

function positionESTPlayButton(){const button=$('est-watch');if(mode!=='interior'||watchingEST){button.hidden=true;return;}const point=worlds.estVideo.screen.getWorldPosition(new THREE.Vector3()).project(camera);button.hidden=point.z<0||point.z>1||Math.abs(point.x)>.9||Math.abs(point.y)>.85;if(!button.hidden){button.style.left=((point.x+1)*.5*viewport.width)+'px';button.style.top=((1-point.y)*.5*viewport.height)+'px';}}

function reflect(){keys.clear();tapMovement=null;$('reflection-dialog').showModal();$('close-reflection').focus();}
function returnTown(){if(mode==='studio')leaveStudio(()=>setMode('town'));else if(mode==='chapel')leaveChapel();else if(mode==='interior')destination('est');else setMode('town');}
function destination(which){if(which==='chapel'){const go=()=>{setMode('town');enterChapel();};if(mode==='studio')leaveStudio(go);else go();return;}const go=()=>{setMode('town');worlds.teleport(false,which==='est'?EST.x:-3.2,which==='est'?EST.z:-1.7);actor.model.position.copy(worlds.position(false));actor.model.rotation.y=which==='est'?0:Math.PI;yaw=which==='est'?EST.yaw:1;setLocation(which==='est'?'EST Prep':'Home Base');updateCamera(1,true);};if(mode==='studio')leaveStudio(go);else go();}
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
  if(watchingEST){const viewingDistance=Math.max(7.9,6.8/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect));desiredCamera.set(0,3.3,-6.48+viewingDistance);lookAt.set(0,3.3,-6.48);camera.position.lerp(desiredCamera,snap?1:1-Math.exp(-dt*7));camera.lookAt(lookAt);return;}
  if(aerial){if(mode==='chapel'){desiredCamera.set(7,5,8);lookAt.set(0,1,-3);}else if(mode==='interior'){desiredCamera.set(8,12,13);lookAt.set(0,0,0);}else{desiredCamera.set(-63,77,91);lookAt.set(-23,0,18);}}
  else if(mode==='town'){
    // Keep head-to-foot framing steady through the Studio approach and camera turns.
    const distance=6.4;
    desiredCamera.set(p.x+Math.sin(yaw)*distance,p.y+3.1,p.z+Math.cos(yaw)*distance);
    lookAt.set(p.x-Math.sin(yaw)*.6,p.y+1.25,p.z-Math.cos(yaw)*.6);
  }else{
    const distance=mode==='chapel'?2.7:4.2;
    desiredCamera.set(p.x+Math.sin(yaw)*distance,p.y+(mode==='interior'?3:2.75),p.z+Math.cos(yaw)*distance);
    lookAt.set(p.x-Math.sin(yaw)*(mode==='chapel'?5:1.1),p.y+(mode==='chapel'?2.3:1.55),p.z-Math.cos(yaw)*(mode==='chapel'?5:1.1));
  }
  if(mode==='chapel'){desiredCamera.x=THREE.MathUtils.clamp(desiredCamera.x,-8.1,8.1);desiredCamera.z=THREE.MathUtils.clamp(desiredCamera.z,-8.05,8.05);}
  camera.position.lerp(desiredCamera,snap?1:1-Math.exp(-dt*7));camera.lookAt(lookAt);
}
function updateMission(){
 if(mode!=='town')return;
 let done=false;try{done=localStorage.getItem('ce-arrival-complete-'+state.activeId)==='1';}catch{}
 const distance=Math.hypot(actor.model.position.x+12.4,actor.model.position.z-5);
 const near=distance<2.2;
 const title=done?'Your first step is saved':near?'Make this your future':'Find your place';
 const detail=done?'Your character is ready. Explore the gardens or continue to EST Prep.':near?'Open Avatar Studio. Choose your look, explore Future, then Save & return.':`Follow the shaded walk, then turn left to Avatar Studio · ${Math.ceil(distance)} m`;
 if($('mission-title').textContent!==title)$('mission-title').textContent=title;
 if($('mission-detail').textContent!==detail)$('mission-detail').textContent=detail;
 $('mission-bar').style.width=done?'100%':near?'65%':`${Math.max(15,60-distance*3)}%`;
 $('arrival-mission').classList.toggle('complete',done);
}
function updateInteraction(){
  if(mode==='studio'||watchingEST||(!$('module-overlay').hidden||$('reflection-dialog').open)){$('interact').hidden=true;interaction=null;return;}
  const p=actor.model.position;
  if(mode==='town'){
    const approaching=Math.hypot(p.x-EST.x,p.z-EST.doorZ)<7;
    if(approaching&&!nearHall)worlds.ensureInterior().catch(()=>{});
    nearHall=approaching;
    if(Math.hypot(p.x-EST.x,p.z-EST.doorZ)<1.1&&keys.size&&!enteringHall){enterHall();return;}
    if(Math.hypot(p.x-EST.x,p.z-EST.doorZ)<2.2)interaction={label:'Enter EST Prep',action:enterHall};
    else if(p.x>-13.6 && p.x<-10.8 && Math.abs(p.z-5)<1.45)interaction={label:'Open Avatar Studio',action:openStudio};
    else if(Math.hypot(p.x-CHAPEL.x,p.z-CHAPEL.z)<1.9)interaction={label:'Enter Chapel',action:enterChapel};
    else if(Math.hypot(p.x-LEGACY.x,p.z-LEGACY.z)<2.7)interaction={label:'Open Original Career Empire ↗',action:()=>window.open(LEGACY.url,'_blank','noopener,noreferrer')};
    else interaction=null;
  }else if(mode==='chapel'){
    interaction=p.z>6.1?{label:'Return to campus',action:leaveChapel}:{label:'Pause and reflect',action:reflect};
  }else{
    const nearest=worlds.stations.map(s=>({...s,distance:Math.hypot(p.x-s.x,p.z-s.z)})).sort((a,b)=>a.distance-b.distance)[0];
    if(nearest.distance<2.25)interaction={label:`Open ${nearest.name}`,action:()=>openModule(nearest.name,nearest.id)};
    else if(Math.abs(p.x)<2.1&&p.z<2.8)interaction={label:'Watch EST Lab briefing',action:watchESTVideo};
    else if(p.z>4.2)interaction={label:'Return to campus',action:()=>destination('est')};
    else interaction={label:'Open EST Prep',action:()=>openModule('Learning labs')};
  }
  $('interact').hidden=!interaction;if(interaction)$('interact').querySelector('span').textContent=interaction.label;
}
function openModule(name,stage){
  if(watchingEST)closeESTVideo();worlds.estVideo.pause();keys.clear();tapMovement=null;actor.setWalking(false);$('module-name').textContent=name;$('module-overlay').hidden=false;$('experience').inert=true;
  const frame=$('module-frame');
  frame.onload=()=>{
    if(!stage)return;
    // The existing module publishes this API. Wait for its asynchronous lab track to finish rendering.
    const launch=()=>{const doc=frame.contentDocument,api=frame.contentWindow?.ESTPrep;if(!doc?.querySelector('[onclick*="ESTPrep.openStage"]')||!api?.openStage)return false;moduleObserver?.disconnect();clearTimeout(moduleTimer);api.openStage(stage);return true;};
    if(launch())return;moduleObserver=new MutationObserver(launch);moduleObserver.observe(frame.contentDocument.body,{childList:true,subtree:true});moduleTimer=setTimeout(()=>{moduleObserver?.disconnect();$('module-name').textContent=`${name} / choose a lab below`;},15000);
  };
  frame.src=new URL('../modules/est-prep/index.html',import.meta.url).href;$('close-module').focus();
}
function closeModule(){moduleObserver?.disconnect();clearTimeout(moduleTimer);$('module-overlay').hidden=true;$('experience').inert=false;$('module-frame').onload=null;$('module-frame').removeAttribute('src');canvas.focus();}
function phaseChange(name){if(!Object.hasOwn(PHASES,name))return;phase=name;worlds.phase(name);$('phase').value=name;}
function qualityChange(){const q=$('quality').value;renderer.setPixelRatio(q==='low'?1:q==='high'?Math.min(devicePixelRatio,2):Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=q!=='low';resize();}
function bindEvents(){
  $('est-video-close').addEventListener('click',closeESTVideo);
  $('est-watch').addEventListener('click',watchESTVideo);
  $('est-video-dialog').addEventListener('cancel',e=>{e.preventDefault();closeESTVideo();});
  $('est-video-zoom').addEventListener('change',()=>{const slot=$('est-media-slot'),zoom=Number($('est-video-zoom').value);slot.classList.toggle('zoomed',zoom>1);slot.style.setProperty('--video-zoom',zoom);slot.scrollTo(0,0);});
  $('est-video-fullscreen').addEventListener('click',()=>{if($('est-video-dialog').requestFullscreen)$('est-video-dialog').requestFullscreen().catch(()=>toast('Use the video fullscreen control.'));else worlds.estVideo.video.webkitEnterFullscreen?.();});
  $('est-source-open').addEventListener('click',()=>openESTDocument('core'));
  $('est-document-zoom').addEventListener('change',()=>{$('est-document-frame').style.setProperty('--document-zoom',$('est-document-zoom').value);});
  document.querySelectorAll('[data-est-document]').forEach(button=>button.addEventListener('click',()=>openESTDocument(button.dataset.estDocument)));
  $('est-briefing-open').addEventListener('click',()=>{showESTFilm();$('est-video-status').textContent='Video paused. Choose Play to continue.';});
  $('est-video-play').addEventListener('click',()=>{const v=worlds.estVideo.video;if(v.paused)worlds.estVideo.play().catch(()=>toast('Video could not play. Try Play again.'));else worlds.estVideo.pause();});
  $('est-video-restart').addEventListener('click',()=>{worlds.estVideo.restart().catch(()=>toast('Video could not restart. Try again.'));});
  $('est-video-sound').addEventListener('click',()=>{const v=worlds.estVideo.video;v.muted=!v.muted;$('est-video-sound').textContent=v.muted?'Unmute':'Mute';});
  worlds.estVideo.video.addEventListener('play',()=>{$('est-video-play').textContent='Pause';$('est-video-status').textContent='';});
  worlds.estVideo.video.addEventListener('pause',()=>{$('est-video-play').textContent='Play';});
  worlds.estVideo.video.addEventListener('ended',()=>{$('est-video-status').textContent='Briefing complete. Replay or return to the hall.';});
  worlds.estVideo.video.addEventListener('error',()=>{$('est-video-status').textContent='The briefing could not load. Try Play again.';});
  $('close-reflection').addEventListener('click',()=>$('reflection-dialog').close());
  $('reflection-dialog').addEventListener('close',()=>{keys.clear();canvas.focus();});
  $('town-view').addEventListener('click',returnTown);$('studio-view').addEventListener('click',openStudio);
  $('home-destination').addEventListener('click',()=>destination('home'));$('est-destination').addEventListener('click',()=>{const go=()=>{setMode('town');enterHall();};if(mode==='studio')leaveStudio(go);else go();});$('chapel-destination').addEventListener('click',()=>destination('chapel'));
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
  window.addEventListener('keydown',e=>{if(watchingEST){if(e.code==='Escape')closeESTVideo();return;}if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)||$('leave-dialog').open||(!$('module-overlay').hidden||$('reflection-dialog').open))return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();keys.add(e.code);}if(e.code==='KeyE')interaction?.action();});
  window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{keys.clear();accumulator=0;});window.addEventListener('resize',resize);
  window.addEventListener('beforeunload',e=>{if(dirty()){e.preventDefault();e.returnValue='';}});
  document.querySelectorAll('[data-key]').forEach(b=>{let pressedAt=0;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);pressedAt=performance.now();keys.add(b.dataset.key);b.classList.add('pressed');});const release=e=>{if(e.type==='pointerup'&&performance.now()-pressedAt<180)tapMovement={key:b.dataset.key,until:performance.now()+220};keys.delete(b.dataset.key);b.classList.remove('pressed');};b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release);});
  canvas.addEventListener('pointerdown',e=>{canvas.focus();if(mode==='studio')return;drag={x:e.clientX,yaw};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(drag && mode!=='studio')yaw=drag.yaw-(e.clientX-drag.x)*.006;});canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
}
function animate(){
  requestAnimationFrame(animate);const now=clock.getElapsedTime(),dt=Math.min(now-lastTime,.08);lastTime=now;
  if(mode!=='studio'&&!watchingEST&&$('module-overlay').hidden&&!$('reflection-dialog').open){
    if(tapMovement){if(performance.now()<tapMovement.until)keys.add(tapMovement.key);else{keys.delete(tapMovement.key);tapMovement=null;}}
    let x=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),z=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0);
    const length=Math.hypot(x,z);if(length){x/=length;z/=length;}
    const speed=keys.has('ShiftLeft')||keys.has('ShiftRight')?4.6:2.8;
    const dx=(x*Math.cos(yaw)+z*Math.sin(yaw))*speed,dz=(-x*Math.sin(yaw)+z*Math.cos(yaw))*speed;
    accumulator=Math.min(accumulator+dt,.1);let travelled=0;
    while(accumulator>=1/60){const previous=actor.model.position.clone();const next=worlds.move(space(),{x:dx/60,z:dz/60});actor.model.position.set(next.x,next.y,next.z);travelled+=Math.hypot(next.x-previous.x,next.z-previous.z);accumulator-=1/60;}
    actor.setWalking(Boolean(length && travelled>.001));if(length){const target=Math.atan2(dx,dz),difference=Math.atan2(Math.sin(target-actor.model.rotation.y),Math.cos(target-actor.model.rotation.y));actor.model.rotation.y+=difference*Math.min(1,dt*12);}
    actor.update(dt);worlds.update(now,camera);updateInteraction();updateMission();
  }else if(mode==='studio')preview?.update(dt);
  updateCamera(dt);positionESTPlayButton();renderer.setViewport(0,0,viewport.width,viewport.height);renderer.setScissorTest(false);renderer.clear();
  let scene=mode==='studio'?studio:activeScene();
  if(mode==='studio'){const mobile=isMobile();renderer.setViewport(0,mobile?viewport.height*.43:0,mobile?viewport.width:viewport.width-(viewport.width>900?364:316),mobile?viewport.height*.57:viewport.height);}
  renderer.toneMappingExposure=mode==='town'?1:1.03;renderer.render(scene,camera);frames++;
  if(now-metricsTime>1){
    const gl=renderer.getContext(),pixels=new Uint8Array(4*24*24),colours=new Set();
    for(const x of [.25,.40,.6])for(const y of [.25,.45,.7]){gl.readPixels(Math.floor(gl.drawingBufferWidth*x),Math.floor(gl.drawingBufferHeight*y),24,24,gl.RGBA,gl.UNSIGNED_BYTE,pixels);for(let i=0;i<pixels.length;i+=4)colours.add(`${pixels[i]>>2},${pixels[i+1]>>2},${pixels[i+2]>>2}`);}
    const data={scenery:worlds.scenery,mode,phase,profileId:state.activeId,position:actor.model.position.toArray().map(n=>+n.toFixed(3)),fps:Math.round(frames/(now-metricsTime)),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,pixelColours:colours.size,animations:Object.keys(actor.clips),visibleMeshes:0};
    (mode==='studio'?preview?.model:actor.model)?.traverse(o=>{if(o.isMesh&&o.visible)data.visibleMeshes++;});
    $('diagnostics').value=JSON.stringify(data);$('diagnostics').dataset.state=JSON.stringify(data);canvas.dataset.rendered='true';frames=0;metricsTime=now;
  }
}
async function boot(){
  try{
    icons();renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.localClippingEnabled=true;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.03;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.autoClear=false;
    camera=new THREE.PerspectiveCamera(55,1,.08,220);orbit=new OrbitControls(camera,canvas);orbit.enableDamping=true;orbit.enablePan=false;orbit.enabled=false;
    const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();const environment=pmrem.fromScene(room,.04);room.dispose();pmrem.dispose();
    $('loading-message').textContent='Loading your character and learning district...';
    [worlds]=await Promise.all([createWorlds(message=>$('loading-message').textContent=message),loadCharacterKit(active().body)]);
    $('loading-message').textContent='Preparing your first view...';worlds.town.environment=environment.texture;worlds.town.environmentIntensity=.28;worlds.interior.environment=environment.texture;worlds.interior.environmentIntensity=.55;worlds.chapel.environment=environment.texture;worlds.chapel.environmentIntensity=.35;
    studio=new THREE.Scene();studio.background=new THREE.Color(0xd8e3d5);studio.fog=new THREE.Fog(0xd8e3d5,4,12);studio.environment=environment.texture;studio.environmentIntensity=.4;
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:0xd8e3d5,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.005;ground.receiveShadow=true;studio.add(ground);
    studio.add(new THREE.HemisphereLight(0xf5faf4,0x7a8f72,2.1));const key=new THREE.DirectionalLight(0xfff3dc,3.4);key.position.set(-3,5,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=4;key.shadow.camera.bottom=-2;key.shadow.normalBias=.015;studio.add(key);
    const rim=new THREE.DirectionalLight(0xcfe9f1,1.4);rim.position.set(3,3,-2);studio.add(rim);
    $('loading-message').textContent='Opening the complete campus and both outer buildings...';await worlds.loadScenery();if(worlds.scenery.status!=='ready')throw new Error('Campus buildings could not load. Reload to retry.');
    await integrateEnvironment(worlds);
    worlds.teleport(false,-7,23.3);phase='flourishing';$('phase').value='flourishing';worlds.phase('flourishing');updateActor();bindEvents();resize();setMode('town');yaw=0;updateCamera(1,true);$('loading').hidden=true;icons();animate();
    // All campus destinations are loaded before the interactive scene is revealed.
    // Let the new player reach a stable town first. Choices then prepare in
    // the background before they are likely to open Avatar Studio.
    setTimeout(warmAvatarChoices,5000);
  }catch(error){console.error(error);$('loading-message').textContent=`The 3D district could not open. Reload to retry. ${error.message}`;$('loading').querySelector('progress').hidden=true;$('fallback-link').hidden=false;}
}
boot();
