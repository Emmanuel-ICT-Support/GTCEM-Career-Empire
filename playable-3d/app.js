import {createGpuFrameGate,createTextureUploadQueue} from './frame-budget.mjs?v=frame-upload-budget-20261012';
import {renderQuality,rendererName} from './render-quality.mjs?v=frame-upload-budget-20261012';
import {waitForPriorityAsset,canClearDetailWarning} from './startup-assets.mjs?v=detail-recovery-20261012';
import {createExplorationTools} from './exploration-tools.mjs?v=photo-review-20261012';
import {WHOLE_AVATARS} from './whole-avatar-catalog.mjs?v=named-students-20261011';
import {createTasterIntro} from './intro-taster.mjs?v=default-exploration-20261011';
import {revealLayout,preparePortrait,prepareCastPortrait} from './reveal-layout.mjs';
import {keepOutdoorClearance,keepChapelClearance} from './camera-clearance.mjs?v=default-exploration-20261011';
import {createDiscovery} from './discovery-opening.js?v=photo-review-20261012';
import {createLocomotion, STEP, turnTowards} from './locomotion.js?v=travel-20260927';
import {createHelperPicker} from './helper-picker.js?v=options-companion-20261012';
import {createExplorer} from '../economy-lab/exploration.mjs?v=navigation-20261012';
import {createFlyover} from './flyover.js?v=student-usability-20260924';
import {configurePhoneAssets} from './phone-assets.js?v=phone-load-20260917';
import {ECC_HOME} from './ecc-preview/landmark-layout.js?v=exterior2';
import {createJoystick} from './joystick.js?v=1';
import {afterFirstPaint} from './deferred-textures.js?v=frame-upload-budget-20261012';
import {CHAPEL} from './chapel.js?v=opt2-20260914';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createWorlds,sign} from './world.js?v=frame-upload-budget-20261012';
import {LEGACY,EST,CAREERS} from './destinations.js?v=demo-20260914';
import {loadCharacterKit,loadProfileKit,createCharacter,createFallbackCharacter,isSimpleBody} from './characters.js?v=named-students-20261011';
import {loadProfiles,saveProfiles,normaliseProfile,OPTIONS,SKIN,PHASES} from './profiles.js?v=named-students-20261011';

const $=id=>document.getElementById(id),canvas=$('scene');
// Pixel readback synchronises the GPU. Reserve it for explicit visual diagnostics.
const sharpRatio=Math.min(devicePixelRatio,1.5);
const pixelDiagnostics=new URLSearchParams(location.search).get('diagnostics')==='pixels';
const joystick=createJoystick($('movement'));
const icons=()=>window.lucide?.createIcons();
const entryParams=new URLSearchParams(location.search);
const isolatedDiscovery=entryParams.get('review')==='1'&&entryParams.get('discovery')==='1';
const discoveryReview=entryParams.get('mode')!=='full'&&!entryParams.has('experience')&&!entryParams.has('outfit')&&!entryParams.has('view');
const reviewProfiles={getItem:()=>null,setItem:()=>{}};
const gameSession=window.CareerEmpireGameRun;
const gameStorage=gameSession?.storage||localStorage;
const state=loadProfiles(isolatedDiscovery?reviewProfiles:gameStorage);
let discovery=null,intro=null,explorationTools=null,revealCameraStart=null;
let frameGate,surfaceUploads;
let worlds,renderer,camera,studio,orbit,actor,preview,mode='town',phase='flourishing',draft,editorTab='identity';
let wardrobeSection='pants';
let nightMarket=null;
let echo=null;
const locomotion=createLocomotion();
let renderMotion=null;
const helperPicker=createHelperPicker({storage:gameStorage,guest:gameSession?.isGuest,profile:()=>state.activeId,onOpen:()=>{closeExplorationOptions(false);echo?.close();if(actor)resetNavigationInput();},onClose:()=>{resetNavigationInput();canvas.focus({preventScroll:true});},onChange:(helper,persistent)=>{if(discovery?.snapshot().souvenir){companionOffered=true;gameStorage.setItem('ce-companion-offered','1');}applySelectedCompanion(helper);if(!persistent&&actor)toast('Your guidance preference is selected for this tab. Browser storage is unavailable.');}});
document.getElementById('choose-helper').onclick=()=>helperPicker.choose(true);
document.getElementById('guidance-help').onclick=()=>{if(echo)echo.showHelp();else toast('Guidance is preparing. Try again in a moment.');};
let shadowScene=null,shadowTime=-Infinity,shadowActor=null,shadowActorYaw=0;
const shadowActorPosition=new THREE.Vector3();
function echoAction(action){if(action==='studio')openStudio();else if(action==='market')openMarket();else visitResources();}
async function visitResources(){await setMode('town');worlds.teleport(false,-7,23.3);actor.model.position.copy(worlds.position(false));yaw=0;aerial=false;setLocation('Course Documents · Arrival Gardens');updateCamera(1,true);echo?.showResources();}
let echoLoad=null;
async function loadEcho(){
 if(echo)return echo;if(echoLoad)return echoLoad;
 echoLoad=import('./echo-guide.js?v=options-companion-20261012').then(m=>{echo=m.createEchoGuide({storage:gameStorage,scene:worlds.town,physics:worlds.townPhysics.world,canvas,profile:()=>state.activeId,helper:()=>helperPicker.selected(),onPause:()=>{resetNavigationInput();actor.setWalking(false);},onAction:echoAction,review:new URLSearchParams(location.search).get('echo-review')==='1'});if(mode==='market')echo.markMarketVisited();return echo;}).finally(()=>{echoLoad=null;});return echoLoad;
}
async function applySelectedCompanion(helper=helperPicker.selected()){
 const isCreature=Boolean(helper.model);if(!echo&&!isCreature)return;
 const status=$('companion-status');if(status){status.hidden=false;status.textContent=isCreature?'Loading '+helper.name+'…':'Companion removed.';}
 try{const guide=await loadEcho();await guide.selectHelper(helper);if(helperPicker.selected().id!==helper.id)return;if(status){status.textContent=guide.snapshot().helperStatus==='failed'?helper.name+' could not load. Echo is available instead. Choose this companion again to retry.':isCreature?helper.name+' is ready beside you.':'Companion removed.';}}
 catch(error){if(status){status.hidden=false;status.textContent='Companion could not load. Your game is ready. Open Optional companion to retry.';}console.warn('Companion unavailable; game remains playable.',error);}
}
const marketRequested=new URLSearchParams(location.search).get('experience') && ['night-market','sunday-markets'].includes(new URLSearchParams(location.search).get('experience'));
const marketDialogOpen=()=>Boolean(nightMarket?.isOpen());
let undo=[],redo=[],pendingLeave=null,previewWalking=false,portrait=false,aerial=false,yaw=0,interaction=null;
let chapelTilt=0,flyover;
function resetNavigationInput(){renderMotion=null;locomotion.reset();keys.clear();joystick.reset();tapMovement=null;drag=null;accumulator=0;document.querySelectorAll('.movement .pressed').forEach(b=>b.classList.remove('pressed'));}
function explorationMenuOpen(){return Boolean(document.querySelector('#exploration-options')?.open||document.querySelector('#whole-character-choice')?.open||explorationTools?.open());}
function canFlyover(){return !intro?.open()&&!discovery?.open()&&!echo?.open()&&mode==='town'&&campusReady&&!enteringHall&&!enteringCareers&&!studioLoadPending&&!feedbackOpen()&&!watchingEST&&$('module-overlay').hidden&&!$('reflection-dialog').open&&!$('leave-dialog').open;}
let studioLoadPending=false;
const explorationReview=new URLSearchParams(location.search).get('market-review')==='1'||new URLSearchParams(location.search).get('review')==='1';
const explore=createExplorer({storage:{getItem:k=>gameStorage.getItem(k),setItem:(k,v)=>gameStorage.setItem(k,v)},review:explorationReview,lock:fn=>navigator.locks?navigator.locks.request('ce-economy-lab-write',fn):Promise.resolve().then(fn),notify:message=>toast(message)});
let introWarmTime=-Infinity;
let toastTimer,drag=null,lastTime=0,accumulator=0,metricsTime=0,frames=0,viewport={width:1,height:1};
let tapMovement=null,watchingEST=false;
const teachers=[];
let teacherLoading=false,teacherAttempted=false,ovalVisitRecorded=false;
const teacherRay=new THREE.Raycaster(),teacherPointer=new THREE.Vector2();
function updateTeacherLoading(){
 if(mode!=='town'||document.hidden||(discoveryReview&&!discovery?.revealed()))return;
 const p=actor.model.position,near=Math.hypot(p.x+4,p.z+54)<28;
 if(!near){teacherAttempted=false;return;}
 if(teachers.length&&teachers.some(n=>n.near(p,7))&&!ovalVisitRecorded){ovalVisitRecorded=true;explore('oval').then(ok=>{if(!ok)ovalVisitRecorded=false;});}
 if(teachers.length===2||teacherLoading||teacherAttempted)return;
 teacherLoading=true;teacherAttempted=true;
 import('./teacher-npc.js?v=teacher-revisit-20261012').then(async m=>{
  // Stagger decode/upload work and isolate each optional NPC's failure.
  for(const config of m.TEACHERS)if(!teachers.some(n=>n.id===config.id)){
   try{teachers.push(await m.createTeacherNPC(worlds,discoveryReview?{...config,spawn:{x:config.id==='middleton'?-6.2:-1.8,z:-54.6},fixed:true,reduced:discovery?.reduced()}:config));}
   catch(error){console.warn(config.name+' could not load; return to the oval to retry.',error);}
  }
 }).catch(error=>console.warn('Teachers unavailable; return to the oval to retry.',error)).finally(()=>teacherLoading=false);
}
function greetTeacher(npc){if(mode==='town'&&npc?.root?.visible&&npc.react(actor.model.position))toast('Hello, '+npc.name+'!');}
function tapTeacher(event){
 if(mode!=='town'||feedbackOpen()||watchingEST||!$('module-overlay').hidden||$('reflection-dialog').open)return;
 if(echo?.tap(event,camera))return;
 const r=canvas.getBoundingClientRect();teacherPointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);teacherRay.setFromCamera(teacherPointer,camera);
 const candidates=teachers.filter(n=>n.root.visible&&n.near(actor.model.position,7));
 const hits=candidates.flatMap(n=>teacherRay.intersectObject(n.root,true).map(hit=>({npc:n,hit}))).sort((a,b)=>a.hit.distance-b.hit.distance);
 if(!hits.length)return;
 const {npc,hit}=hits[0];
 const visible=o=>{for(let n=o;n;n=n.parent)if(!n.visible)return false;return true;};
 const blocker=teacherRay.intersectObjects(worlds.town.children.filter(o=>o!==actor.model&&o!==npc.root),true).find(h=>h.object.isMesh&&visible(h.object)&&h.distance<hit.distance-.05);
 if(!blocker)greetTeacher(npc);
}
let moduleObserver=null,moduleTimer=null;
const keys=new Set(),clock=new THREE.Clock(),lookAt=new THREE.Vector3(),desiredCamera=new THREE.Vector3();
const active=()=>state.profiles.find(p=>p.id===state.activeId);
const copy=value=>structuredClone(value);
let headerHeight=88;
const isMobile=()=>window.innerWidth<=620;
const space=()=>mode==='chapel'?'chapel':mode==='interior'||mode==='careers';
const feedbackOpen=()=>Boolean(document.querySelector('dialog.ce-feedback-backdrop[open]'));
const activeScene=()=>mode==='market'?nightMarket.scene:mode==='careers'?worlds.careers:mode==='chapel'?worlds.chapel:mode==='interior'?worlds.interior:worlds.town;
const dirty=()=>mode==='studio' && JSON.stringify(draft)!==JSON.stringify(active());
const bodyName=body=>OPTIONS.body.find(([id])=>id===body)?.[1] || 'avatar';
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4300);}
function persist(){try{saveProfiles(isolatedDiscovery?reviewProfiles:gameStorage,state);return true;}catch{toast('Your browser could not save this character. Keep this tab open.');return false;}}
function populateProfiles(){$('profile').replaceChildren(...state.profiles.map(p=>new Option(p.name,p.id)));$('profile').value=state.activeId;$('character-caption').textContent=active().name;}
let actorRequest=0,previewRequest=0,hallRequest=0,nearHall=false,nearCareers=false;
async function updateActor(ready){
  const request=++actorRequest,profile=copy(active());
  $('retry-saved-avatar').hidden=true;
  try{
    if(ready){if(!await ready)throw new Error('Avatar unavailable');}else await loadProfileKit(profile);
    if(request!==actorRequest)return;
    // Construct before disposing the current actor, so a bad optional model
    // cannot remove the player's working fallback or interrupt navigation.
    const replacement=createCharacter(profile);
    const position=actor.model.position.clone(),rotation=actor.model.rotation.y;
    actor.dispose();actor=replacement;actor.model.position.copy(position);actor.model.rotation.y=rotation;
    activeScene().add(actor.model);populateProfiles();
  }catch{
    if(request!==actorRequest)return;
    $('retry-saved-avatar').hidden=false;
    toast('Your saved avatar could not load. You can keep exploring. Use Retry saved avatar beside your profile to try again.');
  }
}
async function updatePreview(){
  const request=++previewRequest,profile=copy(draft);
  const current=()=>request===previewRequest&&mode==='studio';
  const show=()=>{
    if(!current())return;
    // Keep the working preview until its replacement has been constructed.
    const replacement=createCharacter(profile);
    replacement.model.rotation.y=preview?.model.rotation.y||0;
    preview?.dispose();preview=replacement;studio.add(preview.model);
    preview.setWalking(previewWalking);$('studio-caption').textContent=profile.name;
    canvas.dataset.previewBody=profile.body;
  };
  if(!preview){preview=createFallbackCharacter();studio.add(preview.model);preview.setWalking(previewWalking);}
  $('undo').disabled=!undo.length;$('redo').disabled=!redo.length;
  $('save-avatar').disabled=true;$('retry-outfit').hidden=true;
  $('edit-state').textContent='Loading avatar…';
  try{
    await loadProfileKit(profile,()=>{
      show();
      if(current())$('edit-state').textContent='Avatar ready · loading selected clothing…';
    });
    if(!current())return;
    show();$('edit-state').textContent=dirty()?'Unsaved':'Saved';
    $('save-avatar').disabled=false;
  }catch{
    if(current()){
      $('edit-state').textContent='Outfit could not load completely. Retry or choose another option.';
      $('retry-outfit').hidden=false;
    }
  }
}
$('retry-outfit').addEventListener('click',updatePreview);

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
function wardrobeCategoryCards(){
  const nav=document.createElement('div');nav.className='wardrobe-categories';nav.setAttribute('role','group');nav.setAttribute('aria-label','Clothing sections');
  for(const [key,title,thumb] of [['tops','Tops','top-'+(draft.workTop==='none'?'scrubs':draft.workTop)],['pants','Pants','pants-'+draft.pantsStyle],['hair','Hair','hair-'+(draft.hairStyle==='none'?'sweep':draft.hairStyle)],['shoes','Shoes','shoes-'+(draft.shoeStyle==='none'?'trainers':draft.shoeStyle)]]){
    const b=document.createElement('button');b.type='button';b.className='wardrobe-category';b.dataset.section=key;b.setAttribute('aria-label',title);b.setAttribute('aria-pressed',wardrobeSection===key);
    const img=document.createElement('img');img.src='./wardrobe-thumbnails/'+thumb+'.png?v=hair-shoes-20260921';img.alt='';img.width=62;img.height=68;
    const text=document.createElement('span');text.textContent=title;b.append(img,text);
    b.addEventListener('click',()=>{wardrobeSection=key;renderEditor();document.querySelector('[data-section="'+key+'"]').focus({preventScroll:true});});nav.append(b);
  }
  return nav;
}
function garmentCards(section){
  const grid=document.createElement('div');grid.className='garment-grid';grid.setAttribute('role','group');grid.setAttribute('aria-label',({tops:'Choose a top',pants:'Choose pants',hair:'Choose hair',shoes:'Choose shoes'})[section]);
  const options=({tops:OPTIONS.workTop,pants:[...OPTIONS.pantsStyle,['none','No pants']],hair:OPTIONS.hairStyle,shoes:OPTIONS.shoeStyle})[section];
  for(const [key,title] of options){
    const selected=section==='hair'?draft.hairStyle===key:section==='shoes'?draft.shoeStyle===key:section==='tops'?draft.workTop===key:(key==='none'?draft.outer==='none':draft.outer!=='none'&&draft.pantsStyle===key);
    const b=document.createElement('button');b.type='button';b.className='garment-card';b.dataset.garment=section+'-'+key;b.setAttribute('aria-label',title);b.setAttribute('aria-pressed',selected);
    if(key==='none'){b.classList.add('is-empty');const empty=document.createElement('span');empty.className='garment-empty';empty.innerHTML='<i data-lucide="minus"></i>';b.append(empty);}
    else{const img=document.createElement('img');img.src='./wardrobe-thumbnails/'+({tops:'top-',pants:'pants-',hair:'hair-',shoes:'shoes-'})[section]+key+'.png?v=hair-shoes-20260921';img.alt='';img.width=120;img.height=132;img.loading='lazy';b.append(img);}
    const label=document.createElement('span');label.textContent=title;b.append(label);
    b.addEventListener('click',()=>{if(selected){updatePreview();return;}changeDraft(p=>{if(section==='hair')p.hairStyle=key;else if(section==='shoes')p.shoeStyle=key;else if(section==='tops'){p.workTop=key;if(key!=='none')p.topColour=p.topColours[key];}else if(key==='none')p.outer='none';else{p.pantsStyle=key;p.outer='blazer';}});document.querySelector('[data-garment="'+section+'-'+key+'"]').focus({preventScroll:true});});grid.append(b);
  }
  return grid;
}
function accessoryColourControls(section){
  const isHair=section==='hair',style=draft[isHair?'hairStyle':'shoeStyle'],field=isHair?'hairColours':'shoeColours',title=isHair?'Hair':'Shoe';
  const controls=document.createElement('div');controls.className='field-row';controls.hidden=style==='none';if(style==='none')return controls;
  const label=document.createElement('label');label.className='field';label.style.flex='1';const caption=document.createElement('span');caption.textContent=title+' hex colour';
  const hex=document.createElement('input');hex.type='text';hex.value=draft[field][style];hex.maxLength=7;hex.spellcheck=false;hex.setAttribute('aria-label',title+' hex colour');
  const error=document.createElement('small');error.setAttribute('role','status');error.style.color='#a32d25';
  const apply=()=>{const value=hex.value.trim().replace(/^#?/,'#').toUpperCase();if(!/^#[0-9A-F]{6}$/.test(value)){hex.setAttribute('aria-invalid','true');error.textContent='Use six hex digits, for example #543321.';return;}hex.removeAttribute('aria-invalid');error.textContent='';hex.value=value;if(value!==draft[field][style])changeDraft(p=>{p[field][style]=value;});};
  hex.addEventListener('change',apply);hex.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();apply();}});
  const picker=document.createElement('input');picker.type='color';picker.className='colour-input';picker.value=draft[field][style];picker.setAttribute('aria-label',title+' colour');picker.addEventListener('change',()=>changeDraft(p=>{p[field][style]=picker.value.toUpperCase();}));
  label.append(caption,hex,error);controls.append(label,picker);return controls;
}
function renderEditor(){
  const root=$('editor-fields');root.replaceChildren();
  document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('active',b.dataset.tab===editorTab);b.setAttribute('aria-pressed',b.dataset.tab===editorTab);});
  const simple=isSimpleBody(draft.body);
  if(editorTab==='identity'){
    const choices=WHOLE_AVATARS.map(({id,name})=>[id,name]);
    if(!choices.some(([id])=>id===draft.body))choices.unshift([draft.body,'Current: '+bodyName(draft.body)+' (test)']);
    root.append(field('Name','name'),field('Character','body','select',choices));
    const tests=document.createElement('details');
    const summary=document.createElement('summary');summary.textContent='Test characters';tests.append(summary);
    tests.addEventListener('toggle',async()=>{
      if(!tests.open || tests.dataset.loaded)return;
      tests.dataset.loaded='loading';
      try{const {TEST_AVATARS}=await import('./test-avatar-catalog.mjs?v=named-students-20261011');
        if(!tests.isConnected)return;
        tests.append(field('Test character','body','select',TEST_AVATARS));tests.dataset.loaded='ready';
      }catch{delete tests.dataset.loaded;const note=document.createElement('p');note.textContent='Could not load test choices. Close and reopen to retry.';tests.append(note);}
    });root.append(tests);
    if(simple){
      const note=document.createElement('p');note.className='hint';note.textContent=WHOLE_AVATARS.some(item=>item.id===draft.body)?'This whole character keeps their own appearance and animations.':draft.body==='pantstest'?'Choose clothes, hair, shoes and their colours in Style.':draft.body==='schoolboy'?'School-student test model. Face, skin and hair controls are not available yet.':draft.body==='shirt'?'Shirt avatar test model. Face, skin and hair controls are not available yet.':'Base reference avatar. Face, skin and hair controls are not available yet.';root.append(note);
    }else{
      root.append(field('Face','face','select',OPTIONS.face));
      const skin=document.createElement('div');skin.className='field';const label=document.createElement('span');label.textContent='Skin tone';skin.append(label);
      const swatches=document.createElement('div');swatches.className='swatches';swatches.setAttribute('role','group');swatches.setAttribute('aria-label','Skin tone');
      for(const [key,hex] of Object.entries(SKIN)){const b=document.createElement('button');b.className='swatch';b.style.backgroundColor=hex;b.classList.toggle('active',draft.skin===key);b.title=key[0].toUpperCase()+key.slice(1);b.setAttribute('aria-label',`${b.title} skin tone`);b.setAttribute('aria-pressed',draft.skin===key);b.addEventListener('click',()=>{changeDraft(p=>p.skin=key);renderEditor();});swatches.append(b);}
      skin.append(swatches);root.append(skin,optionWithColour('Hair','hair'));
      const eye=document.createElement('label');eye.className='binary-field';eye.append('Eye colour',colour('Eye colour','eye'));root.append(eye);
    }
  }else if(editorTab==='style'){
    if(draft.body==='pantstest'){
      root.append(wardrobeCategoryCards());
      if(['hair','shoes'].includes(wardrobeSection)){root.append(garmentCards(wardrobeSection),accessoryColourControls(wardrobeSection));}
      if(wardrobeSection==='tops'){
      root.append(garmentCards('tops'));
      const controls=document.createElement('div');controls.className='field-row';controls.hidden=draft.workTop==='none';
      const picker=document.createElement('input');picker.type='color';picker.className='colour-input';picker.value=draft.topColour;picker.setAttribute('aria-label','Top colour');picker.title='Top colour';
      picker.addEventListener('change',()=>changeDraft(p=>{p.topColour=picker.value.toUpperCase();p.topColours[p.workTop==='none'?'scrubs':p.workTop]=p.topColour;}));
      const label=document.createElement('label');label.className='field';label.style.flex='1';const title=document.createElement('span');title.textContent='Top hex colour';
      const hex=document.createElement('input');hex.type='text';hex.value=draft.topColour;hex.maxLength=7;hex.spellcheck=false;hex.setAttribute('aria-label','Top hex colour');
      const error=document.createElement('small');error.setAttribute('role','status');error.style.color='#a32d25';
      const applyHex=()=>{const value=hex.value.trim().replace(/^#?/,'#').toUpperCase();if(!/^#[0-9A-F]{6}$/.test(value)){hex.setAttribute('aria-invalid','true');error.textContent='Use six hex digits, for example #397D88.';return;}if(value===draft.topColour){hex.value=value;hex.removeAttribute('aria-invalid');error.textContent='';return;}changeDraft(p=>{p.topColour=value;p.topColours[p.workTop==='none'?'scrubs':p.workTop]=value;});};
      hex.addEventListener('change',applyHex);hex.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();applyHex();}});
      label.append(title,hex,error);controls.append(label,picker);root.append(controls);
      }
      if(wardrobeSection==='pants'){
      root.append(garmentCards('pants'));
      const controls=document.createElement('div');controls.className='field-row';
      const picker=document.createElement('input');picker.type='color';picker.className='colour-input';picker.value=draft.pantsColours[draft.pantsStyle];picker.setAttribute('aria-label','Pants colour');picker.title='Pants colour';
      picker.addEventListener('change',()=>changeDraft(p=>{p.pantsColours[p.pantsStyle]=picker.value.toUpperCase();}));
      const label=document.createElement('label');label.className='field';label.style.flex='1';const title=document.createElement('span');title.textContent='Hex colour';
      const hex=document.createElement('input');hex.type='text';hex.value=draft.pantsColours[draft.pantsStyle];hex.maxLength=7;hex.spellcheck=false;hex.setAttribute('aria-label','Pants hex colour');
      const error=document.createElement('small');error.setAttribute('role','status');error.style.color='#a32d25';
      const applyHex=()=>{const value=hex.value.trim().replace(/^#?/,'#').toUpperCase();if(!/^#[0-9A-F]{6}$/.test(value)){hex.setAttribute('aria-invalid','true');error.textContent='Use six hex digits, for example #397D88.';return;}if(value===draft.pantsColours[draft.pantsStyle]){hex.value=value;hex.removeAttribute('aria-invalid');error.textContent='';return;}changeDraft(p=>{p.pantsColours[p.pantsStyle]=value;});};
      hex.addEventListener('change',applyHex);hex.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();applyHex();}});
      label.append(title,hex,error);controls.append(label,picker);root.append(controls);
      }
      const note=document.createElement('p');note.className='hint';note.textContent='Each style remembers its colour. Save to keep your choices.';root.append(note);
    }else if(draft.body==='jackettest'){
      root.append(field('Jacket','outer','select',[['blazer','Navy blazer'],['none','Off - inspect fit']]));
      const note=document.createElement('p');note.className='hint';note.textContent='Dressing test. Jacket-off reveals missing body areas. Walking preview uses a simple test cycle.';root.append(note);
    }else if(simple){
      const note=document.createElement('p');note.className='hint';note.textContent=WHOLE_AVATARS.some(item=>item.id===draft.body)?'This character comes with their own outfit.':draft.body==='pantstest'?'The pants stay on for this walking test. Changing clothes is not available for this outfit yet.':draft.body==='schoolboy'?'This school-student model uses its own uniform and styling.':draft.body==='shirt'?'This test model includes a white shirt, short teal tie and black shorts.':'This is the normal reference avatar.';root.append(note);
    }else{
      root.append(optionWithColour('Top','top'),optionWithColour('Bottom','bottom'),optionWithColour('Outer layer','outer'));
      const jumper=document.createElement('label');jumper.className='binary-field';const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=draft.jumper;checkbox.addEventListener('change',()=>changeDraft(p=>p.jumper=checkbox.checked));jumper.append(checkbox,'Knit jumper');root.append(jumper);
      const knit=document.createElement('label');knit.className='binary-field';knit.append('Jumper colour',colour('Jumper colour','jumper'));root.append(knit);
      root.append(field('Accessory','accessory','select',OPTIONS.accessory));const shoes=document.createElement('label');shoes.className='binary-field';shoes.append('Shoe colour',colour('Shoe colour','shoes'));root.append(shoes);
    }
  }else root.append(field('Future occupation','occupation','textarea'),field('Training pathway','training','textarea'),field('A strength I bring','strength','textarea'));
  icons();
}
let studioLoad,modeRequest=0,campusLoad,campusReady=false,environmentReady=false;
function campusNotice(message,failed=false){
  $('campus-progress').hidden=campusReady;
  $('campus-progress-message').textContent=message;
  $('campus-retry').hidden=!failed;
}
function showMarketExteriorSigns(){if(worlds.town.getObjectByName('Market exterior signs'))return;const group=new THREE.Group();group.name='Market exterior signs';const marketSign=sign('LIVE MUSIC & SUNDAY MARKETS',5);marketSign.position.set(43,2.1,-23.1);marketSign.scale.y=.5;group.add(marketSign);const invitation=sign('Food, music — a few stallholders could use a hand',5);invitation.position.set(43,1.45,-23.1);invitation.scale.y=.5;group.add(invitation);worlds.town.add(group);}
async function ensureCampus(){
  if(campusReady)return;
  if(campusLoad)return campusLoad;
  campusNotice('Preparing the next outdoor places. Start with the envelope and Chapel.');worlds.scenery.status='loading';
  campusLoad=(async()=>{
    THREE.Cache.enabled=true;
    try{
      await prepareEntry();
      const results=await Promise.allSettled([worlds.loadScenery()]);
      const failure=results.find(result=>result.status==='rejected');if(failure)throw failure.reason;
      await new Promise(resolve=>setTimeout(resolve,0));
      if(!environmentReady){
        const {integrateEnvironment}=await import('./environment.js?v=entry-environment-20261012');
        const before=new Set(worlds.town.children);
        try{await integrateEnvironment(worlds);worlds.syncWalkingSurfaces();environmentReady=true;}
        catch(error){for(const child of [...worlds.town.children])if(!before.has(child))child.removeFromParent();throw error;}
      }
      worlds.phase(phase);worlds.openCampus();campusReady=true;worlds.scenery.status='ready';showMarketExteriorSigns();
      worlds.scenery.errors=[];canvas.dataset.campusReadyMs=String(Math.round(performance.now()));
      campusNotice('Campus ready');startSurfaceDetail();if(detailFailed)detailNotice();
    }catch(error){
      worlds.scenery.status='fallback';campusNotice('Some outdoor detail could not load. The envelope and Chapel route remain available; retry for later places.',true);
      throw error;
    }finally{THREE.Cache.clear();THREE.Cache.enabled=false;campusLoad=null;}
  })();
  return campusLoad;
}
// Opening assets finish before any speculative next-task work. Destination
// actions still own navigation; prefetch never changes progress or opens a UI.
let entryLoad,entryReady=false,entryReadyAt=0,preparing=false,prepared=new Set(),lastPreparation=0;
let detailLoad,detailFailed=false;
function detailNotice(){
 $('campus-progress').hidden=false;
 $('campus-progress-message').textContent='Some surface detail is still loading. You can keep exploring; Retry will request missing surfaces again.';
 $('campus-retry').hidden=false;
}
function startSurfaceDetail(){
 if(detailLoad)return detailLoad;
 detailFailed=false;
 detailLoad=worlds.loadDetailTextures().then(()=>{if(canClearDetailWarning({entryReady,campusReady,campusLoading:campusLoad,pending:worlds.pendingSurfaceDetails,campusFailed:worlds.scenery.status==='fallback'}))$('campus-progress').hidden=true;}).catch(()=>{detailFailed=true;detailNotice();}).finally(()=>{detailLoad=null;if(!detailFailed&&worlds.pendingSurfaceDetails>0)startSurfaceDetail();});
 return detailLoad;
}

async function prepareEntry(){
 if(entryReady)return;
 if(entryLoad)return entryLoad;
 campusNotice('Preparing the outdoor path to the envelope and Chapel…');
 const environmentModule=environmentReady?null:import('./environment.js?v=entry-environment-20261012');environmentModule?.catch(()=>{});
 // Begin the original exterior-only buildings after avatar priority, alongside paths.
 // They never gate entry or load interiors and no northward travel is required.
 setTimeout(()=>worlds.loadBuildingExteriors().then(()=>{if(entryReady)startSurfaceDetail();}).catch(()=>{}),0);
 entryLoad=worlds.loadEntry().then(async()=>{if(!environmentReady){const {integrateEnvironment}=await environmentModule;await integrateEnvironment(worlds,{entryOnly:true});worlds.phase(phase);}entryReady=true;showMarketExteriorSigns();entryReadyAt=clock.getElapsedTime();worlds.openCampus();$('campus-progress').hidden=true;startSurfaceDetail();}).catch(error=>{campusNotice('Arrival detail could not load. You can continue or retry.',true);throw error;}).finally(()=>{entryLoad=null;});
 return entryLoad;
}
function prepareNextTask(now){
 if(document.hidden||discoveryReview||!entryReady||preparing||now-lastPreparation<2)return;
 lastPreparation=now;
 const next=echo?.nextPreparation();
 const profileId=state.activeId;
 const key=profileId+':'+active().body+':'+next;
 if(!next||prepared.has(key))return;
 preparing=true;
 const job=next==='studio'?Promise.all([import('./studio.js?v=lazy-20260917'),loadCharacterKit(active().body)])
  :next==='market'?import('./night-market.js?v=market-arrangement-20261012').then(()=>import('./market-characters.js?v=market-admin-20261012')).then(m=>m.prepareMarketCharacters(()=>!document.hidden&&state.activeId===profileId&&echo?.nextPreparation()==='market'))
  :((mode==='town'&&now-entryReadyAt>15)||(mode==='market'&&nightMarket?.snapshot().visuals.ready===nightMarket?.snapshot().visuals.total))?ensureCampus():null;
 if(!job){preparing=false;return;}
 Promise.resolve(job).then(result=>{if(result!==false)prepared.add(key);}).catch(error=>{prepared.add(key);console.warn('Next activity will retry when opened',error);}).finally(()=>{preparing=false;lastPreparation=clock.getElapsedTime();});
}
function openCampusInBackground(){ensureCampus().catch(error=>console.warn('Campus detail can be retried',error));}
async function setMode(next){
  flyover?.exit();
  const request=++modeRequest;
  if(next==='town'&&!entryReady&&canvas.dataset.firstFrameMs)prepareEntry().catch(()=>{});
  if(next==='studio'){
    toast('Avatar Studio is getting ready. The studio is still setting things up. Explore Career Empire and pop back in a few minutes.');
    try{
      studioLoad ||= import('./studio.js?v=lazy-20260917').then(({createStudio})=>{
        ({studio,orbit}=createStudio(camera,canvas,{texture:worlds.town.environment}));
      }).catch(error=>{studioLoad=null;throw error;});
      studioLoadPending=true;await Promise.all([studioLoad,loadCharacterKit(active().body).catch(()=>null)]);studioLoadPending=false;
      if(request!==modeRequest)return false;
      clearTimeout(toastTimer);$('toast').hidden=true;
    }catch{studioLoadPending=false;if(request===modeRequest)toast('Avatar Studio is getting ready. The studio is still setting things up. Explore Career Empire and pop back in a few minutes.');return false;}
  }
  if(watchingEST)closeESTVideo();worlds?.estVideo.pause();hallRequest++;previewRequest++;resetNavigationInput();actor?.setWalking(false);document.querySelectorAll('.movement button').forEach(b=>b.classList.remove('pressed'));drag=null;mode=next;$('guidance-help').hidden=next!=='town';$('experience').classList.toggle('in-chapel',next==='chapel');
  nightMarket?.setVisible(next==='market');
  echo?.close();if(next==='market')echo?.markMarketVisited();
  const inStudio=next==='studio';$('experience').classList.toggle('in-studio',inStudio);$('arrival-mission').hidden=inStudio||next==='interior'||next==='careers'||next==='chapel';$('est-watch').hidden=true;
  for(const id of ['world-heading','world-tools','movement','world-footer'])$(id).hidden=inStudio;
  for(const id of ['studio-heading','studio-panel','studio-view-tools'])$(id).hidden=!inStudio;
  $('interact').hidden=true;interaction=null;$('aerial').setAttribute('aria-label',next==='chapel'?'Chapel overview':'Aerial view');
  $('town-view').classList.toggle('active',!inStudio&&next!=='market');$('town-view').setAttribute('aria-pressed',!inStudio&&next!=='market');
  $('night-market-entry')?.setAttribute('aria-pressed',next==='market');
  $('studio-view').classList.toggle('active',inStudio);$('studio-view').setAttribute('aria-pressed',inStudio);
  if(orbit)orbit.enabled=inStudio;canvas.setAttribute('aria-label',inStudio?'Interactive 3D character':next==='market'?'Interactive Live Music and Sunday Markets practice':next==='careers'?'Interactive Careers Advice Centre':next==='chapel'?'Interactive ECC Chapel':next==='interior'?'Interactive EST Prep hall':'Interactive 3D town');
  if(inStudio){draft=copy(active());undo=[];redo=[];editorTab='identity';previewWalking=false;portrait=false;$('pose-avatar').setAttribute('aria-pressed','false');$('portrait-view').setAttribute('aria-pressed','false');updatePreview();renderEditor();resetStudioCamera();}
  else{preview?.dispose();preview=null;activeScene().add(actor.model);actor.model.position.copy(next==='market'?nightMarket.spawn:worlds.position(space()));if(next==='market')actor.model.rotation.y=Math.PI;yaw=0;chapelTilt=0;aerial=false;$('aerial').setAttribute('aria-pressed','false');setLocation(next==='careers'?'Careers Advice Centre':next==='chapel'?'ECC Chapel':next==='interior'?'EST Prep':'Arrival Gardens');updateCamera(1,true);}
  resize();
  if(['interior','careers'].includes(next))await explore('building');
  if(['studio','market'].includes(next))await explore(next);
  return true;
}
function setLocation(title){$('location-title').textContent=title;$('district-label').textContent=mode==='careers'?'EXPLORE YOUR FUTURE':mode==='chapel'?'A PLACE TO PAUSE':mode==='interior'?'THE LEARNING HALL':'CAREER EMPIRE · YOUR FIRST DAY';$('location-subtitle').textContent=mode==='careers'?'Shop on your left · My Life desk on your right':mode==='chapel'?'Quiet reflection · Drag down to look up':mode==='interior'?'CORE / TERM / VTCS / BOSS':title==='Market Courtyard'?'Live Music & Sunday Markets':title==='Home Base'?'ECC welcome / Chapel / Campus paths':'Arrival Gardens / Avatar Studio';}
function leaveStudio(callback){if(dirty()){pendingLeave=callback;$('leave-dialog').showModal();}else callback();}
function saveDraft(){if($('save-avatar').disabled){toast('Wait for the selected outfit to load before saving.');return false;}state.profiles=state.profiles.map(p=>p.id===state.activeId?normaliseProfile(draft):p);const ok=persist();if(ok){try{gameStorage.setItem('ce-arrival-complete-'+state.activeId,'1');}catch{}}updateActor();$('edit-state').textContent=ok?'Saved':'Not saved';return ok;}
function openStudio(){if(mode==='studio')return;setMode('studio');}
let enteringHall=false,enteringCareers=false;
async function enterHall(){
  if(discoveryReview&&!discovery?.snapshot().chapelVisited){toast('Start with the envelope and Chapel. Other interiors open after that checkpoint.');return;}
  if(enteringHall)return;enteringHall=true;
  const request=++hallRequest;toast('Opening EST Prep...');
  try{await worlds.ensureInterior();}catch{enteringHall=false;if(request===hallRequest)toast('EST Prep could not load. Choose Enter EST Prep to retry.');return;}
  enteringHall=false;
  if(request!==hallRequest||mode!=='town')return;
  worlds.teleport(true,0,5.0);actor.model.rotation.y=Math.PI;setMode('interior');worlds.estVideo.prepare().catch(()=>{});toast('Choose Play EST video on the wall whenever you are ready.');
}
async function enterCareers(){
  if(discoveryReview&&!discovery?.snapshot().chapelVisited){toast('Start with the envelope and Chapel. Other interiors open after that checkpoint.');return;}
  if(enteringCareers)return;enteringCareers=true;
  const request=++hallRequest;toast('Opening Careers Advice Centre...');
  try{await worlds.ensureCareers();}catch{enteringCareers=false;if(request===hallRequest)toast('Careers could not load. Please try again.');return;}
  enteringCareers=false;
  if(request!==hallRequest||mode!=='town')return;
  worlds.teleport(true,0,5);setMode('careers');
}
async function enterChapel(){const request=++hallRequest;toast('Opening the Chapel...');try{await worlds.ensureChapel();if(!worlds.chapel.userData.reflectionProbe){const target=new THREE.WebGLCubeRenderTarget(128,{type:THREE.HalfFloatType});const probe=new THREE.CubeCamera(.1,35,target);probe.position.set(0,2.2,-2);probe.update(renderer,worlds.chapel);worlds.chapel.environment=target.texture;worlds.chapel.environmentIntensity=.45;worlds.chapel.userData.reflectionProbe=target;}}catch{if(request===hallRequest)toast('Chapel could not load. Try entering again.');return;}if(request!==hallRequest||mode!=='town')return;worlds.teleport('chapel',...CHAPEL.entry);chapelRevealElapsed=0;setMode('chapel');}
function leaveChapel(){const nextClue=discoveryReview;setMode('town');worlds.teleport(false,...(entryReady?[CHAPEL.x,CHAPEL.z]:[-7,23.3]));actor.model.position.copy(worlds.position(false));yaw=1.1;clearTimeout(toastTimer);$('toast').hidden=true;updateCamera(1,true);if(nextClue)discovery?.chapelCheckpoint(true);openCampusInBackground();}
function closeESTVideo(){documentRequest++;if(document.fullscreenElement)document.exitFullscreen?.();$('est-document-frame').replaceChildren();$('est-video-dialog').close();watchingEST=false;worlds.estVideo.pause();$('est-video-controls').hidden=true;keys.clear();joystick.reset();tapMovement=null;canvas.focus();}
function showESTFilm(){documentRequest++; $('est-documents').hidden=true;$('est-document-frame').hidden=true;$('est-document-frame').replaceChildren();$('est-source-title').hidden=true;worlds.estVideo.video.hidden=false;$('est-film-controls').hidden=false; }
function watchESTVideo(){watchingEST=true;$('est-video-zoom').value='1';$('est-media-slot').classList.remove('zoomed');const media=worlds.estVideo.video;media.hidden=false;media.controls=true;$('est-media-slot').append(media);showESTFilm();$('est-video-dialog').showModal();$('interact').hidden=true;$('est-watch').hidden=true;interaction=null;clearTimeout(toastTimer);$('toast').hidden=true;keys.clear();joystick.reset();tapMovement=null;actor.setWalking(false);$('est-video-controls').hidden=false;$('est-video-play').textContent='Play';$('est-video-status').textContent='Loading the video for smooth playback and seeking…';worlds.estVideo.play().catch(()=>{$('est-video-status').textContent='Video could not load. Choose Play to retry.';});}
const estDocuments={
 core:{title:'CORE — EST Content',file:'2026-CEMGT-EST-Unit-3-Content.pdf'},
 term:{title:'TERM — Glossary of Terms',file:'Glossary of Terms.pdf'},
 vtcs:{title:'VTCS — Words used in the formulation of questions',file:'Glossary-of-key-words-used-in-the-formulation-of-questions_.pdf'}
};
let documentRequest=0,documentPages;
async function openESTDocument(key){const request=++documentRequest,doc=estDocuments[key];worlds.estVideo.pause();worlds.estVideo.video.hidden=true;$('est-film-controls').hidden=true;$('est-documents').hidden=false;$('est-source-title').hidden=false;$('est-source-title').textContent=doc.title;const url='../Assets/EST%20Preparation/EST%20-%20Knowledge%20reactor/'+encodeURIComponent(doc.file);const frame=$('est-document-frame');frame.hidden=false;frame.textContent='Loading document pages…';$('est-media-slot').classList.remove('zoomed');$('est-document-zoom').value='1';frame.style.setProperty('--document-zoom',1);$('est-document-link').hidden=false;$('est-document-link').href=url;$('est-document-link').textContent='Open original '+doc.title+' PDF ↗';document.querySelectorAll('[data-est-document]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.estDocument===key));$('est-video-status').textContent='Choose CORE, TERM or VTCS above. Scroll through every page; use Document zoom to enlarge the text.';
 try{documentPages??=fetch('./assets/est-documents/pages.json').then(r=>{if(!r.ok)throw Error('Document pages unavailable');return r.json();});const pages=(await documentPages)[key];if(request!==documentRequest)return;frame.replaceChildren();for(const [index,src] of pages.entries()){const figure=document.createElement('figure'),image=document.createElement('img'),caption=document.createElement('figcaption');image.src=src;image.alt=doc.title+' — page '+(index+1);image.loading=index?'lazy':'eager';caption.textContent='Page '+(index+1)+' of '+pages.length;figure.append(image,caption);frame.append(figure);}frame.scrollTo(0,0);}catch{documentPages=null;if(request===documentRequest)frame.textContent='The document pages could not load. Choose the document again, or open the original PDF above.';}}

function positionESTPlayButton(){const button=$('est-watch');if(mode!=='interior'||watchingEST){button.hidden=true;return;}const point=worlds.estVideo.screen.getWorldPosition(new THREE.Vector3()).project(camera);button.hidden=point.z<0||point.z>1||Math.abs(point.x)>.9||Math.abs(point.y)>.85;if(!button.hidden){button.style.left=((point.x+1)*.5*viewport.width)+'px';button.style.top=((1-point.y)*.5*viewport.height)+'px';}}

function reflect(){keys.clear();joystick.reset();tapMovement=null;$('reflection-dialog').showModal();$('close-reflection').focus();}
let marketOpening=false,marketLeaving=false,marketTravelCooldownUntil=0;
// Capture only the already-loaded market scene; no campus or video assets.
function marketBriefingImage(beat){
 const views=[{from:[1,2.4,-.8],at:[0,1.5,-5.4]},{from:[-4,3.2,4],at:[.2,.9,-3.2]},{from:[6.7,2.2,.2],at:[3,.6,-3.7]},{from:[0,4,8],at:[0,1,-2]},{from:[4.7,2.2,-.3],at:[2.8,.9,-4.4]},{from:[1,2.4,-.8],at:[0,1,-5.4]}];
 const v=views[beat],shot=camera.clone();shot.aspect=16/9;shot.position.set(...v.from);shot.lookAt(...v.at);shot.updateProjectionMatrix();
 const size=renderer.getSize(new THREE.Vector2()),ratio=renderer.getPixelRatio(),shown=actor.model.visible;
 try{actor.model.visible=false;renderer.setPixelRatio(1);renderer.setSize(768,432,false);renderer.render(nightMarket.scene,shot);return canvas.toDataURL('image/jpeg',.82);}
 finally{actor.model.visible=shown;renderer.setPixelRatio(ratio);renderer.setSize(size.x,size.y,false);renderer.render(activeScene(),camera);}
}
async function openMarket(){
 if(marketOpening)return;marketOpening=true;
 try{if(!nightMarket){const {createNightMarket}=await import('./night-market.js?v=market-arrangement-20261012');nightMarket=createNightMarket({onTravel:point=>{resetNavigationInput();actor.model.position.set(point.x,point.y,point.z);actor.model.rotation.y=Math.PI;actor.setWalking(false);setLocation(point.x<-12?'Markets Administration':'Sunday Market');yaw=point.yaw??0;aerial=false;$('aerial').setAttribute('aria-pressed','false');updateCamera(1,true);},captureBriefing:marketBriefingImage,campusGrass:worlds.campusGrass,campusPalette:worlds.campusPalette,storage:gameStorage,onPause:()=>{resetNavigationInput();actor.setWalking(false);},onClose:()=>{resetNavigationInput();canvas.focus();},onExit:returnTown});nightMarket.scene.environment=worlds.town.environment;nightMarket.scene.environmentIntensity=.3;}await setMode('market');}
 catch(error){console.warn('Market unavailable',error);toast('The market could not open. Campus activities remain available.');}finally{marketOpening=false;}
}
async function leaveMarketByGate(){
 if(marketLeaving||mode!=='market')return;marketLeaving=true;resetNavigationInput();actor.setWalking(false);
 try{await ensureCampus();if(mode!=='market')return;await setMode('town');worlds.teleport(false,43,-17.8);actor.model.position.copy(worlds.position(false));actor.model.rotation.y=0;yaw=Math.PI;marketTravelCooldownUntil=performance.now()+1200;updateCamera(1,true);setLocation('Outside Sunday Markets');canvas.focus();}
 catch{toast('Campus scenery is still preparing. Walk back through the gate to retry, or use Return to campus.');}
 finally{marketLeaving=false;}
}
function returnTown(){if(mode==='market'){leaveMarketByGate();}else if(mode==='studio')leaveStudio(()=>setMode('town'));else if(mode==='chapel')leaveChapel();else if(mode==='careers')destination('careers');else if(mode==='interior')destination('est');else setMode('town');}
function destination(which){if(which==='chapel'){const go=()=>{setMode('town');enterChapel();};if(mode==='studio')leaveStudio(go);else go();return;}const go=async()=>{await setMode('town');if(which==='home'&&!campusReady){const request=modeRequest;try{await ensureCampus();}catch{return;}if(request!==modeRequest||mode!=='town')return;}if(!campusReady){worlds.teleport(false,-7,23.3);actor.model.position.copy(worlds.position(false));updateCamera(1,true);return;}worlds.teleport(false,which==='careers'?CAREERS.x:which==='est'?EST.x:ECC_HOME.x,which==='careers'?CAREERS.z:which==='est'?EST.z:ECC_HOME.z);actor.model.position.copy(worlds.position(false));actor.model.rotation.y=which==='est'?0:Math.PI;yaw=which==='careers'?CAREERS.yaw:which==='est'?EST.yaw:ECC_HOME.yaw;setLocation(which==='careers'?CAREERS.name:which==='est'?'EST Prep':'Home Base');updateCamera(1,true);};if(mode==='studio')leaveStudio(go);else go();}
async function campusSpot(x,z,heading,angle=0){
  const go=async()=>{await setMode('town');const request=modeRequest;
    try{await ensureCampus();}catch{return;}
    if(request!==modeRequest||mode!=='town')return;
    worlds.teleport(false,x,z);actor.model.position.copy(worlds.position(false));yaw=angle;
    setLocation(heading);updateCamera(1,true);
  };
  if(mode==='studio')leaveStudio(go);else await go();
}
function resetStudioCamera(){const distance=isMobile()?4.25:4.0;camera.position.set(.12,portrait?1.63:1.3,portrait?1.8:distance);orbit.target.set(0,portrait?1.48:.95,0);orbit.minDistance=1.15;orbit.maxDistance=5.2;orbit.maxPolarAngle=Math.PI*.59;orbit.minPolarAngle=Math.PI*.28;orbit.update();}
let renderBackend='',lastRenderMs=0;
function applyRenderQuality(){
 const quality=renderQuality(renderBackend,$('quality').value,devicePixelRatio);let changed=false;
 if(renderer.getPixelRatio()!==quality.pixelRatio){renderer.setPixelRatio(quality.pixelRatio);resize();changed=true;}
 worlds.town.traverse(o=>{if(o.isDirectionalLight&&o.castShadow&&o.shadow.mapSize.x!==quality.shadowSize){o.shadow.mapSize.set(quality.shadowSize,quality.shadowSize);o.shadow.map?.dispose();o.shadow.map=null;o.shadow.needsUpdate=true;changed=true;}});
 return changed;
}
function resize(){
  if(!renderer)return;viewport={width:window.innerWidth,height:$('experience').clientHeight};renderer.setSize(viewport.width,viewport.height,false);
  const mobile=isMobile();const width=mode==='studio'&&!mobile?viewport.width-(viewport.width>900?364:316):viewport.width;
  const height=mode==='studio'?Math.max(1,viewport.height*(mobile?.57:1)-headerHeight):viewport.height;
  camera.aspect=width/height;camera.fov=mode==='studio'?36:mode==='chapel'?(mobile?78:72):mobile?62:55;camera.updateProjectionMatrix();
  if(mode==='studio')resetStudioCamera();
}
let chapelRevealElapsed=0;
function updateCamera(dt,snap=false){
  if(flyover?.active)return;
  if(mode==='studio'){orbit.update();return;}
  const p=actor.model.position;
  if(mode==='market'&&nightMarket?.observing){
    const distance=Math.max(8,6/camera.aspect);
    desiredCamera.set(.5,4.4+(distance-8)*.75,distance);lookAt.set(-.3,1,-1.5);
    camera.position.lerp(desiredCamera,snap?1:1-Math.exp(-dt*5));camera.lookAt(lookAt);return;
  }
  if(watchingEST){const viewingDistance=Math.max(7.9,6.8/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect));desiredCamera.set(0,3.3,-6.48+viewingDistance);lookAt.set(0,3.3,-6.48);camera.position.lerp(desiredCamera,snap?1:1-Math.exp(-dt*7));camera.lookAt(lookAt);return;}
  if(mode==='town'&&worlds.town.fog){worlds.town.fog.near=aerial?200:64;worlds.town.fog.far=aerial?320:175;}
  if(aerial){if(mode==='chapel'){desiredCamera.set(8.9,2.25,-1.4);lookAt.set(-1.5,3.7,1.1);}else if(mode==='market'){desiredCamera.set(13,18,19);lookAt.set(0,0,-2);}else if(mode==='interior'||mode==='careers'){desiredCamera.set(8,12,13);lookAt.set(0,0,0);}else{desiredCamera.set(-63,87,65);lookAt.set(-20,0,-12);}}
  else if(mode==='town'||mode==='market'){
    // Keep head-to-foot framing steady through the Studio approach and camera turns.
    const office=mode==='market'&&p.x<-12.8;const distance=office?5.2:6.4;
    desiredCamera.set(p.x+Math.sin(yaw)*distance,p.y+(office?5.4:3.1),p.z+Math.cos(yaw)*distance);
    lookAt.set(p.x-Math.sin(yaw)*.6,p.y+1.25,p.z-Math.cos(yaw)*.6);
  }else{
    const distance=mode==='chapel'?3.5:4.2;
    if(mode==='chapel')chapelRevealElapsed+=dt;
    const reveal=mode==='chapel'?(discovery?.reduced()?1:Math.min(1,chapelRevealElapsed/3)):1;
    desiredCamera.set(p.x+Math.sin(yaw)*distance,p.y+(mode==='interior'||mode==='careers'?3:1.95),p.z+Math.cos(yaw)*distance);
    lookAt.set(p.x-Math.sin(yaw)*(mode==='chapel'?5:1.1),p.y+(mode==='chapel'?1.6+1.3*reveal+chapelTilt:1.55),p.z-Math.cos(yaw)*(mode==='chapel'?5:1.1));
  }
  if(mode==='interior'||mode==='careers'){desiredCamera.x=THREE.MathUtils.clamp(desiredCamera.x,-6.65,6.65);desiredCamera.z=THREE.MathUtils.clamp(desiredCamera.z,-6.55,6.75);}
  if(mode==='chapel'){desiredCamera.x=THREE.MathUtils.clamp(desiredCamera.x,-10.5,10.5);desiredCamera.z=THREE.MathUtils.clamp(desiredCamera.z,-8.05,8.05);}
  if(discoveryReview&&!aerial&&(mode==='town'||mode==='chapel')){worlds.protectCamera(space(),p,desiredCamera);const view={position:desiredCamera};if(mode==='chapel')keepChapelClearance(THREE,worlds,p,view,yaw);else keepOutdoorClearance(THREE,worlds,p,view,yaw);}
  camera.position.lerp(desiredCamera,snap?1:1-Math.exp(-dt*7));
  // Resolve after smoothing too: an old camera position may be across a wall.
  if(!aerial&&mode!=='market'){
    worlds.protectCamera(space(),p,camera.position);if(discoveryReview&&mode==='town')keepOutdoorClearance(THREE,worlds,p,camera,yaw);if(discoveryReview&&mode==='chapel')keepChapelClearance(THREE,worlds,p,camera,yaw);
    if((mode==='interior'||mode==='careers')||(mode!=='chapel'&&camera.position.distanceTo(p)<3.5))lookAt.set(p.x,p.y+.9,p.z);
  }
  camera.lookAt(lookAt);
}
function updateMission(){
 if(discoveryReview){$('guidance-help').hidden=true;return;}
 $('guidance-help').textContent=helperPicker.selected().id==='journal'?'Journal':helperPicker.selected().id==='none'?'Help':'What next?';
 $('guidance-help').hidden=mode!=='town';
 if(mode!=='town')return;
 let done=false;try{done=gameStorage.getItem('ce-arrival-complete-'+state.activeId)==='1';}catch{}
 const distance=Math.hypot(actor.model.position.x+12.4,actor.model.position.z-5);
 const guidance=echo?.guidance({avatarSaved:done,nearEcho:echo.near(actor.model.position),distance})||{title:'Your first day',detail:'Start with Careers and Employability Course Documents, then Avatar Studio and the Market Experience. Open guidance whenever you need your next step.',progress:0};
 if($('mission-title').textContent!==guidance.title){$('mission-title').textContent=guidance.title;$('mission-summary').textContent=guidance.title;}
 if($('mission-detail').textContent!==guidance.detail)$('mission-detail').textContent=guidance.detail;
 $('mission-bar').style.width=guidance.progress+'%';$('mission-bar').parentElement.setAttribute('aria-label','Orientation guidance; course documents still pending');
 $('arrival-mission').classList.remove('complete');
}
function updateInteraction(){
  if(echo?.open()||feedbackOpen()||marketDialogOpen()||mode==='studio'||watchingEST||(!$('module-overlay').hidden||$('reflection-dialog').open)){$('interact').hidden=true;interaction=null;return;}
  const p=actor.model.position;
  const discoveryInteraction=discovery?.interaction(mode,p);
  if(discoveryInteraction){interaction=discoveryInteraction;$('interact').querySelector('span').textContent=interaction.label;$('interact').hidden=false;return;}
  if(mode==='market')interaction=nightMarket.interaction(p);
  else if(mode==='town'){
    const limited=discoveryReview&&!discovery?.snapshot().chapelVisited;
    const approaching=!limited&&Math.hypot(p.x-EST.x,p.z-EST.doorZ)<7;
    if(approaching&&!nearHall)worlds.ensureInterior().catch(()=>{});
    nearHall=approaching;
    const approachingCareers=!limited&&Math.hypot(p.x-CAREERS.x,p.z-CAREERS.doorZ)<7;
    if(approachingCareers&&!nearCareers)worlds.ensureCareers().catch(()=>{});
    nearCareers=approachingCareers;
    if(!limited&&Math.hypot(p.x-EST.x,p.z-EST.doorZ)<1.1&&(keys.size||Math.hypot(joystick.x,joystick.z)>.1)&&!enteringHall){enterHall();return;}
    if(!limited&&Math.hypot(p.x-CAREERS.x,p.z-CAREERS.doorZ)<1.1&&(keys.size||Math.hypot(joystick.x,joystick.z)>.1)&&!enteringCareers){enterCareers();return;}
    if(!limited&&Math.hypot(p.x-EST.x,p.z-EST.doorZ)<2.2)interaction={label:'Enter EST Prep',action:enterHall};
    else if(!limited&&Math.hypot(p.x-CAREERS.x,p.z-CAREERS.doorZ)<2.2)interaction={label:'Enter Careers Advice Centre',action:enterCareers};
    else if(campusReady&&Math.hypot(p.x-43,p.z+22)<3.2)interaction={label:'Enter Live Music & Sunday Markets',action:openMarket};
    else if(echo?.resourcesNear(p)&&(!echo.near(p)||echo.resources.position.distanceToSquared(p)<echo.root.position.distanceToSquared(p)))interaction={label:'Inspect Course Documents',action:()=>echo.showResources()};
    else if(echo?.near(p))interaction={label:'Talk to '+helperPicker.selected().name,action:()=>echo.show()};
    else if(teachers.some(n=>n.root.visible&&n.near(p,5))){const npc=teachers.filter(n=>n.root.visible&&n.near(p,5)).sort((a,b)=>a.root.position.distanceToSquared(p)-b.root.position.distanceToSquared(p))[0];interaction={label:'Say hello to '+npc.name,action:()=>greetTeacher(npc)};}
    else if(p.x>-13.6 && p.x<-10.8 && Math.abs(p.z-5)<1.45)interaction={label:'Open Avatar Studio',action:openStudio};
    else if(Math.hypot(p.x-CHAPEL.x,p.z-CHAPEL.z)<1.9)interaction={label:'Enter Chapel',action:enterChapel};
    else if(Math.hypot(p.x-LEGACY.x,p.z-LEGACY.z)<2.7)interaction={label:'Open Original Career Empire ↗',action:()=>window.open(LEGACY.url,'_blank','noopener,noreferrer')};
    else interaction=null;
  }else if(mode==='careers'){
    interaction=Math.hypot(p.x-worlds.myLifeDesk.x,p.z-worlds.myLifeDesk.z)<2.6?{label:'Open My Life · progress, money & work',action:()=>navigateRunModule(explorationReview?'../economy-lab/?review=1':'../economy-lab/')}:Math.hypot(p.x-worlds.shopDesk.x,p.z-worlds.shopDesk.z)<2.6?{label:'Open shop demo · $100,000',action:()=>openModule('Shop demo',null,'../shop/index.html?demo=1')}:p.z>4.2?{label:'Return to campus',action:()=>destination('careers')}:null;
  }else if(mode==='chapel'){
    if(discoveryReview&&p.z>7.3&&(keys.size||Math.hypot(joystick.x,joystick.z)>.1)){leaveChapel();return;}
    interaction=discoveryReview?{label:'Return to campus',action:leaveChapel}:p.z>6.1?{label:'Return to campus',action:leaveChapel}:{label:'Pause and reflect',action:reflect};
  }else{
    const nearest=worlds.stations.map(s=>({...s,distance:Math.hypot(p.x-s.x,p.z-s.z)})).sort((a,b)=>a.distance-b.distance)[0];
    if(nearest.distance<2.25)interaction={label:`Open ${nearest.name}`,action:()=>openModule(nearest.name,nearest.id)};
    else if(Math.abs(p.x)<2.1&&p.z<2.8)interaction={label:'Watch EST Lab briefing',action:watchESTVideo};
    else if(p.z>4.2)interaction={label:'Return to campus',action:()=>destination('est')};
    else interaction={label:'Open EST Prep',action:()=>openModule('Learning labs')};
  }
  $('interact').hidden=!interaction;if(interaction)$('interact').querySelector('span').textContent=interaction.label;
}
function openModule(name,stage,url){
  if(watchingEST)closeESTVideo();worlds.estVideo.pause();keys.clear();joystick.reset();tapMovement=null;actor.setWalking(false);$('module-name').textContent=name;$('module-overlay').hidden=false;$('experience').inert=true;
  $('close-module').querySelector('span').textContent=url?'Return to Careers':'Return to hall';
  $('module-heading').textContent=url?'Careers Advice Centre':'EST Prep';$('module-overlay').setAttribute('aria-label',url?'Shop demonstration':'EST Prep activity');
  const frame=$('module-frame');frame.title=url?'Career Empire shop demo':'Existing EST Prep learning module';
  frame.onload=()=>{
    const readyVisit=()=>{try{const expected=new URL(url||'../modules/est-prep/index.html',import.meta.url).href;if(frame.contentWindow?.location.href!==expected||$('module-overlay').hidden)return false;const ready=url?frame.contentDocument?.querySelector('#shop-grid'):frame.contentWindow?.ESTPrep;if(!ready)return false;explore(url?'shop':'est');return true;}catch{return false;}};
    if(!stage){if(!readyVisit()){moduleObserver=new MutationObserver(()=>{if(readyVisit()){moduleObserver?.disconnect();clearTimeout(moduleTimer);}});if(frame.contentDocument?.body)moduleObserver.observe(frame.contentDocument.body,{childList:true,subtree:true});moduleTimer=setTimeout(()=>moduleObserver?.disconnect(),15000);}return;}
    readyVisit();
    // The existing module publishes this API. Wait for its asynchronous lab track to finish rendering.
    const launch=()=>{const doc=frame.contentDocument,api=frame.contentWindow?.ESTPrep;if(!doc?.querySelector('[onclick*="ESTPrep.openStage"]')||!api?.openStage)return false;moduleObserver?.disconnect();clearTimeout(moduleTimer);api.openStage(stage);return true;};
    if(launch())return;moduleObserver=new MutationObserver(launch);moduleObserver.observe(frame.contentDocument.body,{childList:true,subtree:true});moduleTimer=setTimeout(()=>{moduleObserver?.disconnect();$('module-name').textContent=`${name} / choose a lab below`;},15000);
  };
  frame.src=new URL(url||'../modules/est-prep/index.html',import.meta.url).href;$('close-module').focus();
}
function closeModule(){moduleObserver?.disconnect();clearTimeout(moduleTimer);$('module-overlay').hidden=true;$('experience').inert=false;$('module-frame').onload=null;$('module-frame').removeAttribute('src');canvas.focus();}
function phaseChange(name){if(!Object.hasOwn(PHASES,name))return;phase=name;worlds.phase(name);$('phase').value=name;}
function qualityChange(){const q=$('quality').value;renderer.setPixelRatio(q==='low'?Math.min(devicePixelRatio,1):q==='high'?Math.min(devicePixelRatio,2):sharpRatio);renderer.shadowMap.enabled=q!=='low';resize();}
function bindEvents(){
  document.addEventListener('visibilitychange',()=>{lastTime=clock.getElapsedTime();accumulator=0;frames=0;metricsTime=lastTime;if(document.hidden)resetNavigationInput();});
  const header=document.querySelector('.topbar');
  new ResizeObserver(()=>{const height=header.offsetHeight;document.documentElement.style.setProperty('--game-header-height',height+'px');if(headerHeight!==height){headerHeight=height;resize();}}).observe(header);
  const menus=[...header.querySelectorAll('details')];
  menus.forEach(menu=>menu.addEventListener('toggle',()=>{if(menu.open){for(const other of menus)if(other!==menu)other.open=false;$('arrival-mission').classList.remove('mobile-expanded');$('arrival-mission').querySelector('button').setAttribute('aria-expanded','false');}}));
  document.addEventListener('click',e=>{if(!header.contains(e.target))menus.forEach(menu=>menu.open=false);});
  header.addEventListener('keydown',e=>{if(e.key==='Escape')menus.forEach(menu=>menu.open=false);});
  $('destination-bar').addEventListener('click',e=>{if(e.target.closest('button')&&!e.target.closest('#arrival-mission')){$('destination-menu').open=false;canvas.focus();}});
  $('resources-destination').addEventListener('click',()=>mode==='studio'?leaveStudio(visitResources):visitResources());
  $('market-destination').addEventListener('click',()=>mode==='studio'?leaveStudio(openMarket):openMarket());
  $('oval-destination').addEventListener('click',()=>campusSpot(-4,-49.8,'Oval'));
  $('media-destination').addEventListener('click',()=>campusSpot(-4,-45,'English and Media',Math.PI));
  $('space-destination').addEventListener('click',()=>campusSpot(7,-53,'SPACE',-Math.PI/2));

  $('retry-saved-avatar').addEventListener('click',()=>updateActor());
  document.addEventListener('ce-feedback-open',()=>{flyover?.stop();keys.clear();joystick.reset();tapMovement=null;actor?.setWalking(false);worlds.estVideo.pause();});
  $('careers-destination').addEventListener('click',()=>{const go=()=>{setMode('town');enterCareers();};if(mode==='studio')leaveStudio(go);else go();});
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
  $('reflection-dialog').addEventListener('close',()=>{keys.clear();joystick.reset();canvas.focus();});
  $('town-view').addEventListener('click',returnTown);$('studio-view').addEventListener('click',openStudio);
  $('home-destination').addEventListener('click',()=>destination('home'));$('est-destination').addEventListener('click',()=>{const go=()=>{setMode('town');enterHall();};if(mode==='studio')leaveStudio(go);else go();});$('chapel-destination').addEventListener('click',()=>destination('chapel'));
  $('interact').addEventListener('click',()=>interaction?.action());$('phase').addEventListener('change',e=>phaseChange(e.target.value));$('quality').addEventListener('change',qualityChange);
  $('campus-retry').addEventListener('click',()=>{if(detailFailed)worlds.retryDetailTextures().then(()=>{detailFailed=worlds.failedSurfaceDetails>0;},()=>{detailFailed=true;detailNotice();});else if(!entryReady)prepareEntry().catch(()=>{});else openCampusInBackground();});
  $('aerial').addEventListener('click',async()=>{const request=modeRequest;if(mode==='town'&&!campusReady){try{await ensureCampus();}catch{return;}if(request!==modeRequest)return;}aerial=!aerial;$('aerial').setAttribute('aria-pressed',aerial);});$('recenter').addEventListener('click',()=>{yaw=0;chapelTilt=0;aerial=false;$('aerial').setAttribute('aria-pressed','false');updateCamera(1,true);});
  $('profile').addEventListener('change',()=>{const id=$('profile').value;$('profile').value=state.activeId;if(id===state.activeId){updateActor();return;}const change=()=>{state.activeId=id;persist();helperPicker.choose();updateActor();if(mode==='studio')setMode('studio');};if(mode==='studio')leaveStudio(change);else change();});
  $('new-profile').addEventListener('click',()=>{const add=()=>{if(state.profiles.length>=24){toast('This browser already has 24 characters.');return;}const p=normaliseProfile({id:crypto.randomUUID(),name:`Character ${state.profiles.length+1}`});state.profiles.push(p);state.activeId=p.id;persist();helperPicker.choose();updateActor();setMode('studio');};if(mode==='studio')leaveStudio(add);else add();});
  document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{editorTab=b.dataset.tab;renderEditor();}));
  $('save-avatar').addEventListener('click',()=>{if(saveDraft()){setMode('town');toast(`${active().name} saved in this browser`);}});
  $('undo').addEventListener('click',()=>{if(!undo.length)return;redo.push(copy(draft));draft=undo.pop();updatePreview();renderEditor();});$('redo').addEventListener('click',()=>{if(!redo.length)return;undo.push(copy(draft));draft=redo.pop();updatePreview();renderEditor();});
  $('keep-editing').addEventListener('click',()=>{$('leave-dialog').close();pendingLeave=null;});$('discard-changes').addEventListener('click',()=>{$('leave-dialog').close();pendingLeave?.();pendingLeave=null;});$('save-changes').addEventListener('click',()=>{if(saveDraft()){$('leave-dialog').close();pendingLeave?.();pendingLeave=null;}});
  $('turn-avatar').addEventListener('click',()=>{if(preview)preview.model.rotation.y+=Math.PI;});$('pose-avatar').addEventListener('click',()=>{previewWalking=!previewWalking;preview?.setWalking(previewWalking);$('pose-avatar').setAttribute('aria-pressed',previewWalking);});$('portrait-view').addEventListener('click',()=>{portrait=!portrait;$('portrait-view').setAttribute('aria-pressed',portrait);resetStudioCamera();});
  $('close-module').addEventListener('click',closeModule);
  window.addEventListener('keydown',e=>{if(explorationMenuOpen()||intro?.open()||discovery?.open()||helperPicker.open()||echo?.open()||feedbackOpen()||marketDialogOpen())return;if(flyover?.keydown(e))return;if(watchingEST){if(e.code==='Escape')closeESTVideo();return;}if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)||$('leave-dialog').open||(!$('module-overlay').hidden||$('reflection-dialog').open))return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();keys.add(e.code);}if(e.code==='KeyE')interaction?.action();});
  window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{resetNavigationInput();actor?.setWalking(false);flyover?.stop();});document.addEventListener('visibilitychange',()=>{flyover?.stop();resetNavigationInput();actor?.setWalking(false);lastTime=clock.getElapsedTime();});window.addEventListener('resize',resize);
  window.addEventListener('beforeunload',e=>{if(dirty()){e.preventDefault();e.returnValue='';}});
  document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('contextmenu',e=>e.preventDefault());b.addEventListener('dragstart',e=>e.preventDefault());b.addEventListener('selectstart',e=>e.preventDefault());let pressedAt=0;b.addEventListener('pointerdown',e=>{if(explorationMenuOpen()||intro?.open()||discovery?.open()||helperPicker.open()||echo?.open())return;e.preventDefault();b.setPointerCapture(e.pointerId);pressedAt=performance.now();keys.add(b.dataset.key);b.classList.add('pressed');});const release=e=>{if(b.classList.contains('pressed')&&e.type==='pointerup'&&performance.now()-pressedAt<180)tapMovement={key:b.dataset.key,until:performance.now()+220};keys.delete(b.dataset.key);b.classList.remove('pressed');};b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release);});
  canvas.addEventListener('pointerdown',e=>{if(explorationMenuOpen()||intro?.open()||discovery?.open()||helperPicker.open()||echo?.open())return;if(flyover?.pointerdown(e))return;canvas.focus();if(mode==='studio')return;drag={x:e.clientX,y:e.clientY,yaw,tilt:chapelTilt,moved:false};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(flyover?.pointermove(e))return;if(drag && mode!=='studio'){if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>6)drag.moved=true;yaw=drag.yaw-(e.clientX-drag.x)*.006;if(mode==='chapel')chapelTilt=THREE.MathUtils.clamp(drag.tilt+(e.clientY-drag.y)*.014,-1.6,4.5);}});canvas.addEventListener('pointerup',e=>{if(flyover?.active){flyover.pointerup(e);return;}if(drag&&!drag.moved)tapTeacher(e);drag=null;});canvas.addEventListener('pointercancel',()=>{drag=null;flyover?.pointerup();});canvas.addEventListener('lostpointercapture',()=>{drag=null;flyover?.pointerup();});
}
function animate(){
  if(detailFailed&&worlds?.pendingSurfaceDetails===0){detailFailed=false;if(canClearDetailWarning({entryReady,campusReady,campusLoading:campusLoad,pending:worlds.pendingSurfaceDetails,campusFailed:worlds.scenery.status==='fallback'}))$('campus-progress').hidden=true;}
  requestAnimationFrame(animate);const now=clock.getElapsedTime(),elapsed=now-lastTime,dt=Math.min(elapsed,.25);lastTime=now;
  // Upload arriving selected-avatar/surface assets before natural video handover.
  // Keep gameplay paused and bound the hidden-world GPU cadence to 2 fps.
  if(intro?.open()){if(now-introWarmTime<.5)return;introWarmTime=now;}
  // Background game tabs must not compete with the visible game for the GPU.
  if(document.hidden){accumulator=0;frames=0;metricsTime=now;return;}
  flyover?.refresh();
  if(flyover?.active){if(!document.hidden&&!feedbackOpen()){flyover.update(dt);worlds.update(now,camera);}}
  else if(!intro?.open()&&!discovery?.open()&&!document.hidden&&!feedbackOpen()&&!marketDialogOpen()&&mode!=='studio'&&!watchingEST&&$('module-overlay').hidden&&!$('reflection-dialog').open){
    if(tapMovement){if(performance.now()<tapMovement.until)keys.add(tapMovement.key);else{keys.delete(tapMovement.key);tapMovement=null;}}
    if(explorationMenuOpen()||discovery?.open()||helperPicker.open()||echo?.open())resetNavigationInput();
    let x=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),z=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0);
    x+=joystick.x;z+=joystick.z;
    const length=Math.hypot(x,z);if(length>1){x/=length;z/=length;}
    const running=keys.has('ShiftLeft')||keys.has('ShiftRight');
    // Interpolate rendering between physics poses, without feeding the visual
    // position back into collision or Market movement. External teleports reset it.
    if(!renderMotion||renderMotion.shown.distanceToSquared(actor.model.position)>1e-10){
      renderMotion={previous:actor.model.position.clone(),current:actor.model.position.clone(),shown:actor.model.position.clone()};
    }
    accumulator=Math.min(accumulator+dt,.25);let travelled=0,steps=0;
    while(accumulator>=STEP){
      const previous=renderMotion.current.clone();
      const delta=locomotion.step(x,z,yaw,running);
      if(mode==='town')for(const npc of teachers)npc.fixedUpdate(STEP,previous);
      const next=mode==='market'?nightMarket.move(previous,delta):worlds.move(space(),delta);
      renderMotion.previous.copy(previous);renderMotion.current.set(next.x,next.y,next.z);
      const movedX=next.x-previous.x,movedZ=next.z-previous.z;
      travelled+=Math.hypot(movedX,movedZ);
      actor.model.rotation.y=turnTowards(actor.model.rotation.y,movedX,movedZ,STEP);
      accumulator-=STEP;steps++;
    }
    actor.model.position.lerpVectors(renderMotion.previous,renderMotion.current,accumulator/STEP);
    renderMotion.shown.copy(actor.model.position);
    if(mode==='town'&&campusReady&&travelled>.001&&performance.now()>marketTravelCooldownUntil&&Math.hypot(actor.model.position.x-43,actor.model.position.z+22)<1.2)openMarket();
    // A render frame with no physics tick is not a stop. Never restart its walk.
    if(steps)actor.setWalking(travelled/(steps*STEP)>.03,travelled/(steps*STEP));
    if(mode==='town'){if(entryReady&&!campusReady&&actor.model.position.z<-14&&worlds.scenery.status==='pending')openCampusInBackground();updateTeacherLoading();for(const npc of teachers)npc.update(discovery?.reduced()?0:dt,actor.model.position);}actor.update(discovery?.reduced()?0:dt);prepareNextTask(now);worlds.update(now,camera);updateInteraction();updateMission();
  }else {renderMotion=null;locomotion.reset();accumulator=0;actor.setWalking(false);if(mode==='studio')preview?.update(dt);}
  if(mode==='market')nightMarket.update(dt,now,camera,actor.model.position);
  if(discoveryReview)for(const npc of teachers)npc.root.visible=Boolean(discovery?.revealed());
  if(!discovery?.cinematic())updateCamera(dt,discovery?.reduced());if(!intro?.open()){discovery?.update(mode,actor.model.position,dt);explorationTools?.update(dt,!discovery?.open()&&!explorationMenuOpen()&&!helperPicker.open()&&!echo?.open());}echo?.update(dt,actor.model.position,camera,mode!=='studio'&&!helperPicker.open()&&!aerial&&!flyover?.active&&!feedbackOpen()&&!watchingEST&&$('module-overlay').hidden&&!$('reflection-dialog').open,activeScene());positionESTPlayButton();if(!frameGate.ready())return;renderer.setViewport(0,0,viewport.width,viewport.height);renderer.setScissorTest(false);renderer.clear();
  let scene=mode==='studio'?studio:activeScene();
  if(mode==='studio'){const mobile=isMobile();renderer.setViewport(0,mobile?viewport.height*.43:0,mobile?viewport.width:viewport.width-(viewport.width>900?364:316),Math.max(1,viewport.height*(mobile?.57:1)-headerHeight));}
  renderer.toneMappingExposure=mode==='town'?1:1.03;
  // A moving/skinned player needs current-pose shadows every rendered frame.
  // Reusing a map also reuses the previous shadow-pass skeleton cache for one
  // frame in this Three build, making the suit jump as well as its self-shadow.
  const playerShadowChanged=shadowActor!==actor||shadowActorPosition.distanceToSquared(actor.model.position)>1e-10||shadowActorYaw!==actor.model.rotation.y||Boolean(actor.clips.walk?.enabled&&actor.clips.walk.getEffectiveWeight()>.0001);
  // Retain idle-world reuse and the original map resolution.
  const qualityChanged=applyRenderQuality();
  renderer.shadowMap.autoUpdate=false;
  renderer.shadowMap.needsUpdate=qualityChanged||playerShadowChanged||$('quality').value!=='auto'||shadowScene!==scene||now-shadowTime>=((mode!=='town'||keys.size||joystick.x||joystick.z||flyover?.active||teachers.length)?.1:.5);
  if(renderer.shadowMap.needsUpdate){shadowScene=scene;shadowTime=now;shadowActor=actor;shadowActorPosition.copy(actor.model.position);shadowActorYaw=actor.model.rotation.y;}
  // A bounded warm frame prevents first-use texture/shader work at video EOF.
  const renderStarted=performance.now();renderer.render(scene,camera);lastRenderMs=performance.now()-renderStarted;frameGate.submitted();if(intro?.open())canvas.dataset.introWarmFrameMs=String(Math.round(performance.now()));frames++;
  if(!canvas.dataset.firstFrameMs)canvas.dataset.firstFrameMs=String(Math.round(performance.now()));
  if(now-metricsTime>1){
    let pixelColours=null;
    if(pixelDiagnostics){
      const gl=renderer.getContext(),pixels=new Uint8Array(4*24*24),colours=new Set();
      for(const x of [.25,.40,.6])for(const y of [.25,.45,.7]){gl.readPixels(Math.floor(gl.drawingBufferWidth*x),Math.floor(gl.drawingBufferHeight*y),24,24,gl.RGBA,gl.UNSIGNED_BYTE,pixels);for(let i=0;i<pixels.length;i+=4)colours.add(`${pixels[i]>>2},${pixels[i+1]>>2},${pixels[i+2]>>2}`);}
      pixelColours=colours.size;
    }
    const data={guestRun:gameSession?.isGuest,runId:gameSession?.id,introShellMs:Number(document.documentElement.dataset.introShellMs)||null,entryReady,surfaceDetailPending:worlds.pendingSurfaceDetails,surfaceDetailFailed:detailFailed,preparingNextTask:preparing,renderRatio:renderer.getPixelRatio(),renderBackend,renderFrameMs:Math.round(lastRenderMs),discovery:discovery?.snapshot(),intro:intro?.snapshot(),echo:echo?.snapshot(),...(mode==='market'?{market:nightMarket.snapshot()}:{}),avatarFallback:Boolean(actor.model.userData.fallback),avatarBody:actor.profile?.body||null,campusReady,arrivalRestricted:worlds.arrivalOnly,teachers:teachers.map(n=>n.snapshot()),scenery:worlds.scenery,mode,phase,profileId:state.activeId,position:actor.model.position.toArray().map(n=>+n.toFixed(3)),fps:Math.round(frames/(now-metricsTime)),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,pixelColours,animations:Object.keys(actor.clips),visibleMeshes:0};
    (mode==='studio'?preview?.model:actor.model)?.traverse(o=>{if(o.isMesh&&o.visible)data.visibleMeshes++;});
    if(mode==='studio'&&draft?.body==='pantstest'){
      data.wardrobe={top:draft.workTop,pants:draft.outer==='none'?'none':draft.pantsStyle,topHex:draft.topColour,necklineVisible:false,visibleTops:[],hair:draft.hairStyle,shoes:draft.shoeStyle,hairHex:draft.hairColours[draft.hairStyle],shoeHex:draft.shoeColours[draft.shoeStyle],visibleHair:[],visibleShoes:[],bodyScale:preview?.model.children[0]?.scale.y};
      preview?.model.traverse(o=>{if(!o.isMesh||!o.visible)return;if(o.userData.clothingSlot==='necklineSkin')data.wardrobe.necklineVisible=true;for(const [slot,key]of [['hair','visibleHair'],['shoes','visibleShoes']])if(o.userData.clothingSlot===slot&&!data.wardrobe[key].includes(o.userData.itemStyle))data.wardrobe[key].push(o.userData.itemStyle);if(o.userData.clothingSlot==='workTop'&&!data.wardrobe.visibleTops.includes(o.userData.topStyle))data.wardrobe.visibleTops.push(o.userData.topStyle);});
    }
    $('diagnostics').value=JSON.stringify(data);$('diagnostics').dataset.state=JSON.stringify(data);canvas.dataset.rendered='true';frames=0;metricsTime=now;
  }
}

function setupExplorationMenus(){
 const options=document.createElement('details');options.id='exploration-options';options.className='header-menu';options.innerHTML='<summary>Options</summary><div id="exploration-option-list"><p id="options-pause-note">Movement paused while Options is open.</p><button type="button" id="resume-options">Close options / Resume</button></div>';$('header-controls').append(options);
 const list=$('exploration-option-list');
 for(const selector of ['#destination-menu','#world-tools','#choose-helper','#my-life-link','.legacy-link']){const item=document.querySelector(selector);if(item){item.hidden=false;list.append(item);}}
 $('choose-helper').textContent='Optional companion';$('choose-helper').hidden=!discovery?.snapshot().souvenir;
 // Optional character editing keeps the quiet exploration entry.
 $('studio-view').hidden=true;
 const character=document.createElement('button');character.textContent='Character';character.onclick=openWholeCharacterChoice;list.append(character);
 const all=document.createElement('a');all.href='?mode=full';all.textContent='All campus activities';list.append(all);
 const trail=$('discovery');const more=document.createElement('details');more.id='exploration-trail-options';more.innerHTML='<summary>Picture trail</summary>';more.append(trail);trail.hidden=false;list.append(more);list.append($('discovery-still').closest('label'));
 const help=document.createElement('button');help.id='exploration-help';help.textContent='Help';help.onclick=()=>{options.open=false;explorationTools?.close();$('discovery-help').click();};$('header-controls').prepend(help);
 $('resume-options').onclick=()=>closeExplorationOptions();
 options.addEventListener('toggle',()=>{if(options.open){explorationTools?.close();resetNavigationInput();actor?.setWalking(false);}else if(document.activeElement===options.querySelector('summary')){resetNavigationInput();canvas.focus({preventScroll:true});}});
 document.addEventListener('keydown',event=>{if(options.open&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeExplorationOptions();}},true);
 let dismissalTarget=null;
 document.addEventListener('pointerdown',event=>{if(!options.open){dismissalTarget=null;return;}if(options.contains(event.target))return;const world=event.target===canvas||event.target.closest('.movement');closeExplorationOptions(Boolean(world));if(world){dismissalTarget=event.target;event.preventDefault();event.stopImmediatePropagation();}},true);
 document.addEventListener('click',event=>{if(dismissalTarget===event.target){dismissalTarget=null;event.preventDefault();event.stopImmediatePropagation();}},true);
 const status=document.createElement('p');status.id='companion-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.hidden=true;$('experience').append(status);
}
function closeExplorationOptions(focus=true){const options=$('exploration-options');if(options){options.open=false;options.querySelectorAll('details').forEach(menu=>menu.open=false);}resetNavigationInput();if(focus)canvas.focus({preventScroll:true});}
let companionOffered=gameStorage.getItem('ce-companion-offered')==='1';
async function offerCompanion(){if(companionOffered||!discovery?.snapshot().souvenir)return;companionOffered=true;gameStorage.setItem('ce-companion-offered','1');document.body.classList.add('guest-photo-finished');document.querySelector('#discovery-dialog')?.close();$('choose-helper').hidden=false;await helperPicker.choose(true);if(helperPicker.selected()?.model)await applySelectedCompanion();discovery.showPhotoFinish();}
function openWholeCharacterChoice(){
 const options=$('exploration-options');if(options)options.open=false;
 explorationTools?.close();resetNavigationInput();openStudio();
}

async function boot(){
  if(!discoveryReview&&!gameSession?.isGuest)await helperPicker.choose();
  // On the normal exploration route, companions open only on request.
  const studioFirst=['wardrobe','scrubs','pants'].includes(new URLSearchParams(location.search).get('outfit'));
  // Share immutable startup downloads across the campus builders. Release the
  // temporary cache when construction finishes, so it cannot retain spare models.
  configurePhoneAssets();
  THREE.Cache.enabled=true;
  try{
    icons();renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(sharpRatio);renderBackend=rendererName(renderer);renderer.setPixelRatio(renderQuality(renderBackend,$('quality').value,devicePixelRatio).pixelRatio);renderer.localClippingEnabled=true;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.03;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.autoClear=false;
    frameGate=createGpuFrameGate(renderer,renderQuality(renderBackend,'auto',devicePixelRatio).software);
    surfaceUploads=createTextureUploadQueue({waitForFrame:()=>new Promise(resolve=>{const next=()=>requestAnimationFrame(()=>{if(document.hidden||!frameGate.ready())next();else resolve();});next();}),upload:texture=>renderer.initTexture(texture)});
    camera=new THREE.PerspectiveCamera(55,1,.08,220);
    const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();const environment=pmrem.fromScene(room,.04);room.dispose();pmrem.dispose();
    $('loading-message').textContent=studioFirst?'Opening your wardrobe…':'Loading your character and learning district...';
    const avatarReady=loadProfileKit(copy(active())).then(()=>true,()=>false);
    worlds=await createWorlds(message=>{$('loading-message').textContent=message;},()=>{detailFailed=true;detailNotice();},(hydrate,options)=>surfaceUploads.schedule(hydrate,options));applyRenderQuality();
    $('loading-message').textContent='Preparing your first view...';worlds.town.environment=environment.texture;worlds.town.environmentIntensity=.28;worlds.interior.environment=environment.texture;worlds.interior.environmentIntensity=.55;worlds.careers.environment=environment.texture;worlds.careers.environmentIntensity=.55;worlds.chapel.environment=environment.texture;worlds.chapel.environmentIntensity=.35;
    THREE.Cache.clear();THREE.Cache.enabled=false;
    worlds.teleport(false,-7,23.3);phase='flourishing';$('phase').value='flourishing';worlds.phase('flourishing');actor=createFallbackCharacter();actor.model.position.copy(worlds.position(false));worlds.town.add(actor.model);populateProfiles();updateActor(avatarReady);flyover=createFlyover({camera,keys,canvas,root:$('experience'),canEnter:canFlyover,resetInput:resetNavigationInput,fog:()=>worlds.town.fog});bindEvents();resize();
    await setMode('town');yaw=0;updateCamera(1,true);
    if(marketRequested)await openMarket();
    // A shareable, playable quality-review viewpoint; normal entry remains Arrival Gardens.
    const viewpoints={'discovery-mural':{p:[10.6,-38.4,Math.PI/2],name:'Mural detail'},'discovery-oval':{p:[-4,-57,Math.PI],name:'Oval · filming spot'},'teachers':{p:[-4,-49.8,0],name:'Meet your teachers · Oval'},'mr-middleton':{p:[-7,-50,0],name:'Mr Middleton · Oval'},'mr-psandodakis':{p:[-1,-50,0],name:'Mr Psandodakis · Oval'},'garden-pond':{p:[32,-10,Math.PI/2],name:'Garden pond'},'fountain-walk':{p:[-2.6,5.5,0],name:'Fountain walk'},'garden-benches':{p:[-5.8,-8,Math.PI/2],name:'Garden seating'},'chapel-exterior':{p:[-1.5,-4.5,.58],name:'Chapel exterior'},'ecc-courtyard':{p:[0,-2.8,0],name:'ECC Courtyard'},'avatar-studio':{p:[-8,5,Math.PI/2],name:'Avatar Studio'},'careers':{p:[-14,12,2.45],name:'Careers Advice Centre'},'est':{p:[16,9,Math.PI],name:'EST Prep'},'media':{p:[-4,-45,Math.PI],name:'English and Media'},'space':{p:[7,-53,-Math.PI/2],name:'SPACE'},'home-economics':{p:[43,-18,0],name:'Market Courtyard'}};
    const view=marketRequested?null:new URLSearchParams(location.search).get('view');
    const viewpoint=viewpoints[view];
    const completeView=Boolean(viewpoint||view==='chapel-interior');
    if(!completeView){
      $('loading').hidden=true;icons();animate();
      if(mode==='market')$('campus-progress').hidden=true;
      else if(!studioFirst)afterFirstPaint().then(()=>waitForPriorityAsset(avatarReady)).then(()=>prepareEntry().catch(()=>{}));
      else {
        $('campus-progress').hidden=true;
        setMode('studio').then(async opened=>{if(!opened){openCampusInBackground();return;}if(mode==='studio'){draft.body='pantstest';editorTab='style';renderEditor();updatePreview();}});
      }
    }else await ensureCampus();
    if(!marketRequested&&new URLSearchParams(location.search).get('view')==='chapel-interior')await enterChapel();
    if(viewpoint){worlds.teleport(false,viewpoint.p[0],viewpoint.p[1]);actor.model.position.copy(worlds.position(false));yaw=viewpoint.p[2];aerial=false;setLocation(viewpoint.name);updateCamera(1,true);}
    if(completeView){$('loading').hidden=true;icons();animate();}
    if(!discoveryReview)afterFirstPaint().then(loadEcho).catch(error=>console.warn('Guidance unavailable; game remains playable.',error));
    if(discoveryReview){
      discovery=createDiscovery({THREE,worlds,canvas,enterQuiet:enterChapel,storage:gameStorage,onPhotoFinish:offerCompanion, onParcel:()=>{explorationTools?.awardParcel();worlds.ensureChapel().catch(()=>{});},available:()=>!intro?.open()&&!helperPicker.open()&&!echo?.open()&&!explorationMenuOpen(),onLocation:label=>{if($('location-title').textContent!==label.title||$('location-subtitle').textContent!==label.subtitle){setLocation(label.title);$('location-subtitle').textContent=label.subtitle;}},beforeCapture:async()=>{resetNavigationInput();actor.setWalking(false);prepareCastPortrait(teachers,actor.model.position);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));prepareCastPortrait(teachers,actor.model.position);},pathsReady:()=>entryReady,position:()=>actor.model.position,mode:()=>mode,travel:async target=>{if(['start','parcel','chapel-door','chapel'].includes(target))await prepareEntry();else await ensureCampus();if(target==='chapel'){await enterChapel();return;}await setMode('town');const points={start:[-7,23.3,0],parcel:[-7,16.3,0],'chapel-door':[-3.15,-8.8,1.1],mural:[10.6,-38.4,Math.PI/2],oval:[-4,-57,Math.PI]};const v=points[target];worlds.teleport(false,v[0],v[1]);actor.model.position.copy(worlds.position(false));yaw=v[2];setLocation(target==='mural'?'Mural detail':target==='oval'?'Oval · filming spot':'Arrival Gardens');updateCamera(1,true);},capture:()=>{const oldSize=renderer.getSize(new THREE.Vector2()),oldRatio=renderer.getPixelRatio(),rotation=actor.model.rotation.y;const shot=camera.clone();shot.fov=50;shot.aspect=900/960;const layout=revealLayout(actor.model.position);shot.position.set(...layout.photoCamera);shot.lookAt(...layout.photoLook);shot.updateProjectionMatrix();preparePortrait(actor,layout);prepareCastPortrait(teachers,actor.model.position);shot.updateMatrixWorld(true);try{renderer.setPixelRatio(1);renderer.setSize(900,960,false);renderer.setViewport(0,0,900,960);renderer.clear();renderer.render(worlds.town,shot);return canvas.toDataURL('image/png');}finally{actor.model.rotation.y=rotation;renderer.setPixelRatio(oldRatio);renderer.setSize(oldSize.x,oldSize.y,false);renderer.setViewport(0,0,oldSize.x,oldSize.y);renderer.clear();renderer.render(activeScene(),camera);}},pause:()=>{resetNavigationInput();actor.setWalking(false);},releaseReveal:()=>{resetNavigationInput();actor.setWalking(false);if(mode==='town'){const p=actor.model.position;yaw=Math.atan2(camera.position.x-p.x,camera.position.z-p.z);aerial=false;updateCamera(1,true);}},reveal:()=>{revealCameraStart=camera.clone();if(mode==='town')setLocation('Oval · filming spot');updateTeacherLoading();},explore:()=>canvas.focus(),personalise:()=>openWholeCharacterChoice(),market:async()=>{await offerCompanion();await openMarket();},frameReveal:t=>{const p=actor.model.position,from=revealCameraStart||camera;const startYaw=Math.atan2(from.position.x-p.x,from.position.z-p.z);const delta=Math.atan2(Math.sin(Math.PI-startYaw),Math.cos(Math.PI-startYaw));const angle=startYaw+delta*t,initialDistance=Math.hypot(from.position.x-p.x,from.position.z-p.z),distance=THREE.MathUtils.lerp(initialDistance,6.4,t);camera.position.set(p.x+Math.sin(angle)*distance,THREE.MathUtils.lerp(from.position.y,2.5,t),p.z+Math.cos(angle)*distance);camera.lookAt(p.x,1.25,p.z+2.4*t);yaw=angle;if(t===1)actor.model.rotation.y=0;},stageCast:(t,dt)=>{const layout=revealLayout(actor.model.position);teachers.forEach(n=>n.stagePose(layout.teacherX(n.id),layout.teacherZ(t),t<1,t===1&&dt===0?.3:dt));},castReady:()=>teachers.length===2});
    }
    if(discoveryReview){
      setupExplorationMenus();if(discovery.snapshot().souvenir){document.body.classList.add('guest-photo-finished');if(companionOffered&&helperPicker.selected().model)afterFirstPaint().then(()=>applySelectedCompanion());}
      explorationTools=createExplorationTools({THREE,worlds,position:()=>actor.model.position,mode:()=>mode,state:()=>discovery.snapshot(),photo:()=>discovery.photo(),reviewPhoto:()=>discovery.showPhotoFinish(),review:isolatedDiscovery,storage:gameStorage,market:()=>nightMarket,notify:message=>toast(message),onOpen:()=>{const options=document.querySelector('#exploration-options');if(options)options.open=false;resetNavigationInput();},header:$('header-controls')});
      const introStorage=gameStorage;
      intro=window.CareerEmpireIntro?.intro||createTasterIntro({profile:state.activeId,storage:introStorage,onPause:()=>{resetNavigationInput();actor.setWalking(false);},onResume:()=>{resetNavigationInput();updateCamera(1,true);},focusTarget:canvas});
      if(window.CareerEmpireIntro){window.CareerEmpireIntro.bridge.pause=()=>{resetNavigationInput();actor.setWalking(false);};window.CareerEmpireIntro.bridge.resume=()=>{resetNavigationInput();updateCamera(1,true);};}
      const replay=$('replay-taster-intro');replay.hidden=false;replay.onclick=()=>{$('world-tools').open=false;intro.show();};
      if(!window.CareerEmpireIntro&&!new URLSearchParams(location.search).has('view'))intro.showIfDue(discovery.snapshot());
    }

    // Classic and direct activity entry still expose the shared money/collection controls.
    if(!explorationTools)explorationTools=createExplorationTools({THREE,worlds,position:()=>actor.model.position,mode:()=>mode,state:()=>({step:0,skipped:true,shots:{},chapelVisited:false}),review:isolatedDiscovery,storage:gameStorage,market:()=>nightMarket,notify:message=>toast(message),onOpen:()=>resetNavigationInput(),header:$('header-controls')});

    if(!helperPicker.store.persistent&&!discoveryReview)toast('Your guidance preference is selected for this tab. Browser storage is unavailable.');
    // Wardrobe entry defers campus detail until Town is selected.
    // Normal entry is playable in Arrival Gardens while distant detail streams.
    // Avatar alternatives load on selection through updatePreview/updateActor.
  }catch(error){THREE.Cache.clear();THREE.Cache.enabled=false;console.error(error);$('loading-message').textContent=`The 3D district could not open. Reload to retry. ${error.message}`;$('loading').querySelector('progress').hidden=true;$('fallback-link').hidden=false;const retry=$('avatar-retry');retry.textContent='Retry loading';retry.hidden=false;retry.onclick=()=>location.reload();}
}
function navigateRunModule(target){try{const url=new URL(target,location.href).href;location.assign(gameSession?.isGuest?gameSession.handoffURL(url):url);}catch{toast('This guest run could not move to the module. Keep this game open and try again.');}}
document.addEventListener('click',event=>{const link=event.target.closest('a[href]');if(gameSession?.isGuest&&link&&new URL(link.href).origin===location.origin&&(/\/economy-lab\//.test(link.href)||link.textContent==='All campus activities'))try{link.href=gameSession.handoffURL(link.href);}catch{event.preventDefault();toast('This guest run could not move to the module. Keep this game open and try again.');}});
boot();

if(explorationReview)$('my-life-link').href='../economy-lab/?review=1';
