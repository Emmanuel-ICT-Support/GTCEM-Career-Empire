import {discoverySaveCopy} from './discovery-handover.mjs';
import {drawStyledPortrait} from './photo-style.mjs?v=photo-review-20261012';
import {createProximityGate} from './proximity-gate.mjs?v=default-exploration-20261011';
import {revealLayout} from './reveal-layout.mjs';
import {KEY,normalise,advance,collectShot,reward,restart,chooseStyle,discoveryLocation,visitChapel,teachersRevealed,needsMuralClue} from './discovery-state.mjs?v=sequential-clues-20261012';
import {frameAt,moveFrame,cropSquare} from './scout-framing.mjs';
export const GIFT_CONTEXT='Start your Career Empire journey with a photo trail around campus. Reveal each clue, find the place, and capture discoveries for My Journey.';
const GIFT_CONTEXT_KEY='ce-discovery-gift-context-v1';
export function createDiscovery({THREE:T,worlds,canvas,position,mode,travel,capture,pause,reveal,explore,personalise,market,castReady,frameReveal,stageCast,releaseReveal,pathsReady=()=>true,muralReady=()=>true,onLocation=()=>{},beforeCapture=async()=>{},enterQuiet=()=>{},onParcel=()=>{},onPhotoFinish=()=>{},onDiscoveries=()=>{},helper=()=>({id:'none',model:null}),storage=localStorage,available=()=>true}){
 const proximity=createProximityGate();
 let development=0,photoReviewPending=false,photoHandoverBusy=false,giftContextVisible=false,giftContextSeen=false;try{giftContextSeen=storage.getItem(GIFT_CONTEXT_KEY)==='1';}catch{}
 let state;try{state=normalise(JSON.parse(storage.getItem(KEY)));}catch{state=normalise(null);}
 const restartURL=new URL(location.href);
 if(restartURL.searchParams.get('restartTrail')==='1'){state=restart(state);try{storage.setItem(KEY,JSON.stringify(state));}catch{}restartURL.searchParams.delete('restartTrail');history.replaceState(null,'',restartURL);}
 let persistent=storage?.persistent!==false,busy=false,revealStarted=false,hint=false,sequence=null,elapsed=0,sceneDismissed=false,castStartedAt=null,scoutPlace=null,shotBusy=false,captureBusy=false,lastPathsReady=pathsReady();
 const save=()=>{try{storage.setItem(KEY,JSON.stringify(state));persistent=storage?.persistent!==false;}catch{persistent=false;}onDiscoveries(state);paint();};
 document.body.classList.add('discovery-review');
 const style=document.createElement('link');style.rel='stylesheet';style.href='./discovery-opening.css?v=colourful-discovery-20261021';document.head.append(style);
 // The review route has no account or feedback endpoints. Existing learning paths remain optional.
 document.querySelectorAll('#new-profile,[data-feedback-trigger]').forEach(el=>el.hidden=true);
 document.querySelector('#profile').disabled=true;
 const panel=document.createElement('aside');panel.id='discovery';panel.setAttribute('aria-label','Picture trail');
 panel.innerHTML='<small>EXPLORE & TAKE PICTURES</small><p id="discovery-premise">Explore the world and take a few pictures along the way.</p><p id="discovery-controls">WASD / arrows · drag to look. Pictures open as you approach.</p><p id="discovery-response" role="status" aria-live="polite"></p><button id="discovery-open">Clue reminder</button><button id="discovery-help">Help</button><button id="discovery-skip">Skip trail</button><fieldset id="discovery-style" hidden><legend>Your picture style</legend><button id="film-mystery" aria-pressed="true">Mystery</button><button id="film-comedy" aria-pressed="false">Comedy</button></fieldset><button id="discovery-pose" hidden>Pose for the photo</button><button id="discovery-end-scene" hidden>Back to exploring</button><details id="discovery-next" hidden><summary>Next places</summary><button id="discovery-explore">Explore</button><button id="discovery-personalise">Personalise</button><button id="discovery-market">Market</button></details><details id="discovery-review-controls" hidden><summary>Review controls</summary><button id="discovery-return">Visit photo spot</button><button id="discovery-restart">Replay trail</button><button id="discovery-retake" hidden>Retake this photo</button></details><label class="discovery-still"><input id="discovery-still" type="checkbox"> Still view · less motion</label>';
 document.querySelector('#experience').append(panel);
 const dialog=document.createElement('dialog');dialog.id='discovery-dialog';dialog.setAttribute('aria-labelledby','discovery-title');dialog.innerHTML='<button id="discovery-close" aria-label="Close clue">×</button><small class="discovery-eyebrow">CAMPUS PHOTO TRAIL</small><section id="discovery-gift-context" hidden></section><h2 id="discovery-title" tabindex="-1"></h2><div id="discovery-celebration" role="status" hidden></div><img id="discovery-picture" alt=""><p id="discovery-picture-status" role="status" hidden></p><p id="discovery-copy"></p><div class="discovery-actions"><button id="discovery-continue">Go exploring</button></div><details id="discovery-help-options"><summary>Need help?</summary><p id="discovery-hint"></p><button id="discovery-clearer">Clearer hint</button><button id="discovery-assist">Take me there</button></details><div id="discovery-after" hidden><button id="discovery-poster">Save photo</button></div><details id="discovery-save-info"><summary>About saving My Journey</summary><p id="discovery-storage"></p></details>';
 document.body.append(dialog);
 const toy=document.createElement('section');toy.id='scout-toy';dialog.querySelector('#discovery-copy').after(toy);
 const $=id=>document.getElementById(id);
 $('discovery-picture').onerror=()=>{if($('discovery-picture').hidden)return;$('discovery-picture-status').hidden=false;$('discovery-picture-status').textContent='This picture hasn’t loaded. Need help can still take you to the place.';};$('discovery-picture').onload=()=>{$('discovery-picture-status').hidden=true;};
 $('discovery-still').checked=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const ovalClue={title:'Your next picture: the oval',image:'./discovery-assets/oval-clue.jpg',alt:'Oval grass facing the existing curved arts/media building.',copy:'Follow this picture to the oval for a photo together.',hint:'Follow the paths beyond the Chapel, then walk around the arts/media building onto the open oval. Face its curved glass side beside the far white oval line. No building entry is needed.',target:'oval'};
 const parcel=new T.Group();parcel.name='Discovery parcel';
 const paper=new T.MeshStandardMaterial({color:0xd9b77c,roughness:.85});
 const box=new T.Mesh(new T.BoxGeometry(.8,.58,.65),paper);box.position.y=.37;box.castShadow=true;parcel.add(box);
 for(const [w,h,d] of [[.13,.6,.67],[.82,.6,.1]]){const ribbon=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color:0x275750}));ribbon.position.y=.37;parcel.add(ribbon);}
 parcel.position.set(-7,.13,14.8);worlds.town.add(parcel);
 const cameraBody=new T.Mesh(new T.BoxGeometry(.38,.22,.15),new T.MeshStandardMaterial({color:0x18332f}));cameraBody.position.set(0,.95,0);parcel.add(cameraBody);
 const cameraLens=new T.Mesh(new T.CylinderGeometry(.08,.08,.12,16),new T.MeshStandardMaterial({color:0x85b6bd,metalness:.6,roughness:.25}));cameraLens.rotation.x=Math.PI/2;cameraLens.position.set(0,.95,.11);parcel.add(cameraLens);
 const marker=new T.Mesh(new T.TorusGeometry(.65,.035,8,40),new T.MeshBasicMaterial({color:0xffe2a1}));marker.rotation.x=-Math.PI/2;marker.position.set(-7,.14,14.8);worlds.town.add(marker);
 // Small warm halo near the mural detail. Static when reduced motion is selected.
 const muralSignal=new T.Mesh(new T.TorusGeometry(.22,.025,8,32),new T.MeshBasicMaterial({color:0xffd58c,side:T.DoubleSide}));muralSignal.position.set(7.04,1.82,-38.4);muralSignal.rotation.y=Math.PI/2;worlds.town.add(muralSignal);
 const worldPrints=new Map();
 function leaveWorldPrint(key,shot,animate=true){
  if(worldPrints.has(key))return;
  const ticket={pending:true};worldPrints.set(key,ticket);
  const img=new Image();img.onload=()=>{
   if(worldPrints.get(key)!==ticket)return;
   const c=document.createElement('canvas');c.width=256;c.height=320;const ctx=c.getContext('2d');
   ctx.fillStyle='#fff7df';ctx.fillRect(0,0,256,320);ctx.drawImage(img,16,16,224,224);
   ctx.fillStyle='#18332f';ctx.font='bold 20px sans-serif';ctx.fillText('YOUR PICTURE',16,274);ctx.font='15px sans-serif';ctx.fillText(shot.label,16,300,224);
   const group=new T.Group();group.name='Picture print · '+shot.label;
   const material=new T.MeshBasicMaterial({map:new T.CanvasTexture(c),side:T.DoubleSide});
   group.add(new T.Mesh(new T.PlaneGeometry(.72,.9),material));
   if(key==='mural'){group.position.set(7.09,1.65,-37.65);group.rotation.y=Math.PI/2;}
   else{group.position.set(-6.4,1.0,14.8);const stand=new T.Mesh(new T.BoxGeometry(.035,1,.035),new T.MeshStandardMaterial({color:0x18332f}));stand.position.set(0,-.6,-.04);group.add(stand);}
   group.visible=false;worlds.town.add(group);worldPrints.set(key,{group,material,time:animate?0:1});
  };img.onerror=()=>{if(worldPrints.get(key)===ticket)worldPrints.delete(key);};img.src=shot.image;
 }
 function rememberWorldShot(place,shot,animate){leaveWorldPrint('parcel',Object.values(state.shots)[0]||shot,animate);if(place==='mural')leaveWorldPrint('mural',shot,animate);}
 for(const [place,shot]of Object.entries(state.shots))rememberWorldShot(place,shot,false);
 let film=null;
 function filmAnchor(){const p=position();return mode()==='town'&&Math.hypot(p.x+4,p.z+57)<10?p:{x:-4,z:-57};}
 function filmSet(){if(film){film.position.set(...revealLayout(filmAnchor()).props);return;}film=new T.Group();film.name='Local film set · code props';const dark=new T.MeshStandardMaterial({color:0x182f39});const add=(w,h,d,x,y,z)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),dark);o.position.set(x,y,z);film.add(o);return o;};add(.55,.38,.35,0,1.45,0);add(.06,1.4,.06,0,.7,0);add(1.1,.05,.05,0,.04,0);const lens=new T.Mesh(new T.CylinderGeometry(.13,.13,.24,16),dark);lens.rotation.x=Math.PI/2;lens.position.set(0,1.45,-.25);film.add(lens);const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#142b35';ctx.fillRect(0,0,512,256);ctx.fillStyle='#fff8e5';ctx.font='bold 35px sans-serif';ctx.fillText('CAMPUS PICTURES',20,110);ctx.fillText('PHOTO TIME',20,180);for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#fff8e5':'#142b35';ctx.fillRect(i*64,0,64,40);}const board=new T.Mesh(new T.PlaneGeometry(1.5,.75),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),side:T.DoubleSide}));board.rotation.y=Math.PI;board.position.set(-5.9,1.35,0);film.add(board);film.position.set(...revealLayout(filmAnchor()).props);worlds.town.add(film);}
 function paint(){
  if(film)film.visible=state.step===4||sequence==='invite';
  parcel.visible=!state.skipped;marker.visible=state.step===0&&!state.skipped;cameraBody.visible=cameraLens.visible=state.step>0;

  muralSignal.visible=state.step>0&&!state.shots.mural&&!state.skipped;
  panel.dataset.step=state.step;$('discovery-next').hidden=state.step!==4;$('discovery-retake').hidden=state.step!==4;
  $('discovery-review-controls').hidden=false;$('discovery-help').hidden=state.step===4;panel.dataset.rewardCount=state.souvenir?'1':'0';
  $('discovery-open').textContent=state.step===4?'Your photos':state.skipped?'Resume exploring':state.step===0?'Clue reminder':'Camera & pictures';
  $('discovery-skip').hidden=state.skipped||state.step===4;
  if(!sequence)$('discovery-response').textContent=state.skipped?'Explore freely. Your camera will wait.':state.step===0?'A parcel waits farther down the path.':state.step===1?(state.developed?(pathsReady()?(state.destination==='chapel'?'Quiet place chosen. Visit or continue from the Chapel doorway.':'Colourful picture chosen. Find the orange detail on the mural.'):'Your picture is chosen. Paths are preparing; your clue will wait.'):'Visit the Chapel doorway first, then follow the mural picture. The mural shot opens the next picture.'):state.step===3?'Your next picture points to the oval.':!state.souvenir?'Take your final photo to complete the first experience.':'First experience complete. Your next experience is the Sunday Market.';
  $('discovery-pose').hidden=!(sequence==='invite'||(state.step===4&&!state.souvenir));$('discovery-style').hidden=!(sequence==='invite'||state.step===4);$('discovery-controls').hidden=state.step===4||Boolean(sequence);panel.querySelector('#discovery-style legend').textContent=state.souvenir?'Next photo style · retake to apply':'Your picture style';
  for(const style of ['mystery','comedy'])$('film-'+style).setAttribute('aria-pressed',String(state.style===style));
  $('discovery-storage').textContent=discoverySaveCopy({scope:storage?.persistent===false?'run':persistent?'browser':'tab'});
 }
 function resetDialogView(){dialog.scrollTop=0;dialog.scrollLeft=0;}
 function show(help=false){pause();hint=help;renderDialog();if(!dialog.open)dialog.showModal();resetDialogView();$('discovery-title').focus({preventScroll:true});}
 function renderDialog(){
  resetDialogView();dialog.classList.remove('scout-camera-dialog');dialog.dataset.panel='clue';$('discovery-help-options').hidden=false;$('discovery-help-options').open=hint;$('discovery-continue').hidden=false;$('discovery-celebration').hidden=true;$('discovery-picture-status').hidden=true;renderGiftContext();
  const final=state.step===4;$('discovery-continue').disabled=captureBusy;$('discovery-continue').textContent=final&&state.souvenir?'Continue':'Go exploring';$('discovery-picture').style.height='';dialog.classList.toggle('poster-payoff',final);$('discovery-close').hidden=!final;$('discovery-close').setAttribute('aria-label','Close clue');
  const clue=state.step===0?{title:'A parcel down the path',image:'./discovery-assets/parcel-clue.jpg',alt:'The wrapped parcel farther along the arrival path.',copy:'Walk up to the parcel to open your first picture clue.',hint:'WASD or arrows walk. Drag to look. E interacts. Assistance is optional.',target:'parcel'}:state.step===1?{title:'Your campus pictures',image:'./discovery-assets/chapel-clue.jpg',alt:'The real Chapel.',copy:'First, follow the picture to the Chapel. The next picture appears when you continue.',hint:'Pause inside if you like, or continue from the doorway. Then follow the next picture.',target:'chapel'}:ovalClue;
  $('discovery-title').textContent=final?(state.souvenir?'Congratulations!':'Your campus photo'):clue.title;
  $('discovery-picture').src=final?(state.souvenir||'./discovery-assets/oval-clue.jpg'):clue.image;
  $('discovery-picture').alt=final?'Your in-game cast portrait and chosen scout detail.':clue.alt;
  $('discovery-copy').textContent=final?(state.souvenir?'Take a look at your photo. It will stay here until you continue. Continue to celebrate your first experience and choose what to do next.':'Take your final photo to complete the first experience.'):clue.copy;
  $('discovery-hint').textContent=clue.hint;$('discovery-after').hidden=!final;
  for(const id of ['discovery-clearer','discovery-assist'])$(id).hidden=final;$('discovery-help-options').hidden=final;
  $('discovery-poster').disabled=!state.souvenir;let handover=$('discovery-market-handover');if(!handover){handover=document.createElement('button');handover.id='discovery-market-handover';handover.textContent='Next experience · Sunday Market';handover.onclick=()=>{dialog.close();market();};$('discovery-after').append(handover);}handover.hidden=!state.souvenir||photoReviewPending;let inspect=$('discovery-inspect');if(!inspect){inspect=document.createElement('button');inspect.id='discovery-inspect';inspect.textContent='Inspect full photo';inspect.onclick=()=>{const expanded=inspect.getAttribute('aria-pressed')==='true';inspect.setAttribute('aria-pressed',String(!expanded));inspect.textContent=expanded?'Inspect full photo':'Fit photo';$('discovery-picture').style.height=expanded?'':'auto';};$('discovery-after').append(inspect);}inspect.hidden=!state.souvenir;inspect.setAttribute('aria-pressed','false');inspect.textContent='Inspect full photo';
  toy.replaceChildren();$('discovery-picture').hidden=false;$('discovery-clearer').onclick=()=>{hint=true;renderDialog();};
  if(scoutPlace){renderCamera(scoutPlace);return;}
  if(state.step===1){if(state.developed)renderDestinationClue();else renderDevelop();}
  if(state.step===3&&state.shots.mural){const notice=$('discovery-celebration');notice.replaceChildren();const thumb=document.createElement('img');thumb.src=state.shots.mural.image;thumb.alt='Your captured mural detail';const text=document.createElement('span');text.textContent='Photo captured! Your mural discovery is in My Journey. Next stop: the oval.';notice.append(thumb,text);notice.hidden=false;}if(state.step===4)renderAlbum();
  resetDialogView();
 }
 function renderGiftContext(){const box=$('discovery-gift-context');box.replaceChildren();box.hidden=!giftContextVisible;if(!giftContextVisible)return;const h=helper();if(h.model){const portrait=document.createElement('img');portrait.src=h.portrait;portrait.alt='';const name=document.createElement('strong');name.textContent=h.name+' says';box.append(portrait,name);}else{const badge=document.createElement('strong');badge.textContent='A gift to start your journey';box.append(badge);}const text=document.createElement('p');text.textContent=GIFT_CONTEXT;box.append(text);}
 function renderDevelop(){
  dialog.dataset.panel='reveal';$('discovery-picture').hidden=true;$('discovery-title').textContent='Your first picture';$('discovery-copy').textContent='';
  toy.innerHTML='<div class="develop-pictures"><img src="./discovery-assets/chapel-clue.jpg" alt="Your first clue: the Chapel"></div><label class="develop-instruction" for="develop">Slide to reveal your first clue.</label><input id="develop" aria-label="Reveal your first picture" type="range" min="0" max="100" step="5" value="0"><p id="develop-response" role="status"></p>';
  const slider=$('develop');slider.value=development;
  const develop=()=>{development=Number(slider.value);toy.querySelector('.develop-pictures img').style.filter=`blur(${(100-development)/8}px) brightness(${.15+development*.0085})`;$('discovery-continue').disabled=development<100;$('develop-response').textContent=development===100?'Clue revealed · next stop, the Chapel.':'';};
  toy.querySelector('.develop-pictures img').onerror=()=>{$('discovery-picture-status').hidden=false;$('discovery-picture-status').textContent='This clue picture is unavailable. You can still reveal the clue and use Need help to reach the Chapel.';};slider.oninput=develop;develop();
 }
 function renderDestinationClue(){
  const chapel=!state.chapelVisited;
  $('discovery-title').textContent=chapel?'The quiet picture':'The colourful picture';
  $('discovery-picture').src=chapel?'./discovery-assets/chapel-clue.jpg':'./environment/assets/media-mural-sharp-v2-lossless.webp';
  $('discovery-picture').alt=chapel?'The real Chapel with tree panel and blue entrance.':'The actual blue school mural with orange circles.';
  $('discovery-copy').textContent=!pathsReady()?'Your picture is chosen. The paths are still preparing; your clue will wait.':chapel?'Find the Chapel doorway. You can go inside for a quiet look, or continue from the doorway. No photo is needed.':'Walk up to the mural to open your camera. Find a round orange detail.';
  $('discovery-hint').textContent=!pathsReady()?'You can explore Arrival Gardens while the full paths load. The loading notice will clear when they are ready.':(chapel?'Follow the Chapel picture beyond the gardens and enter its existing blue doorway. Entry is optional. Continue from the doorway for the mural clue.':'Walk around the arts/media building to its east end. Look for the orange detail beside the low side stair; no building entry.')+' WASD / arrows walk; drag to look; E interacts.';

 }
 function renderAlbum(){
  if(!Object.keys(state.shots).length)return;
  const album=document.createElement('div');album.className='scout-album';
  for(const shot of Object.values(state.shots)){const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption');img.src=shot.image;img.alt=shot.label;caption.textContent=shot.label;figure.append(img,caption);album.append(figure);}
  toy.append(album);
  if(!state.chapelVisited){const p=document.createElement('p');p.textContent='The Chapel remains an optional quiet place to visit.';toy.append(p);}
 }
 function renderCamera(place){
  if(place!=="mural")return;
  if(!state.chapelVisited){scoutPlace=null;quietDoor();return;}
  dialog.classList.remove('poster-payoff');dialog.classList.add('scout-camera-dialog');dialog.dataset.panel='camera';$('discovery-picture-status').hidden=true;$('discovery-hint').textContent='Choose a round orange detail. Click or tap to frame it, or use the keyboard controls below the camera. Then press Take photo.';$('discovery-after').hidden=true;
  $('discovery-picture').hidden=true;$('discovery-title').textContent=place==='mural'?'Find your orange frame':'A quiet location shot';
  $('discovery-copy').textContent=place==='mural'?'Click or tap an orange circle to frame it. Then press Take photo. This camera is part of the game.':'The envelope holds a location picture. Choose a round orange detail for your picture.';
  for(const id of ['discovery-clearer','discovery-assist'])$(id).hidden=true;
  toy.innerHTML='<div class="scout-phone"><div class="scout-phone-top"><span aria-hidden="true">●</span> CAMPUS CAMERA <small>IN-GAME ONLY</small></div><div class="scout-viewfinder" tabindex="0" role="group" aria-label="In-game camera viewfinder. Click or tap to frame; arrow keys adjust. Enter or Space takes a photo."><img alt=""><span class="scout-reticle" aria-hidden="true"></span><span class="scout-stamp" hidden>FRAME FOUND</span></div><div class="scout-camera-actions"><button id="scout-shutter" aria-label="Take photo"><span aria-hidden="true">●</span><span>Take photo</span></button></div></div><details class="scout-keyboard"><summary>Keyboard / frame controls</summary><p>Focus the viewfinder and use arrow keys to move the frame. Enter or Space takes the photo.</p><div class="scout-direction"><button data-direction="left" aria-label="Move frame left">←</button><button data-direction="up" aria-label="Move frame up">↑</button><button data-direction="down" aria-label="Move frame down">↓</button><button data-direction="right" aria-label="Move frame right">→</button></div></details><p id="scout-feedback" role="status" aria-live="polite"></p>';
  const view=toy.querySelector('.scout-viewfinder'),img=view.querySelector('img'),reticle=view.querySelector('.scout-reticle'),shutter=toy.querySelector('#scout-shutter'),feedback=toy.querySelector('#scout-feedback');
  let frame={x:.5,y:.5},selected='Door & blue',closed=false;
  img.dataset.pending='true';img.src=place==='mural'?'./environment/assets/media-mural-sharp-v2-lossless.webp':'./discovery-assets/chapel-clue.jpg';img.alt=place==='mural'?'Original school mural with orange circles, blue geometry and green ribbon.':'Existing Chapel architecture, for choosing a composition.';
  img.onload=()=>{delete img.dataset.pending;delete img.dataset.unavailable;};img.onerror=()=>{delete img.dataset.pending;img.dataset.unavailable='true';feedback.textContent='The mural picture hasn’t loaded yet. Your trail progress is safe. Try again when the artwork appears.';};
  const positionFrame=()=>{reticle.style.left=frame.x*100+'%';reticle.style.top=frame.y*100+'%';reticle.setAttribute('data-position',`${Math.round(frame.x*100)},${Math.round(frame.y*100)}`);};
  const move=(dx,dy)=>{frame=moveFrame(frame,dx,dy);positionFrame();feedback.textContent=`Frame: ${Math.round(frame.x*100)}% across, ${Math.round(frame.y*100)}% down.`;};
  positionFrame();view.onclick=e=>{if(closed)return;const r=img.getBoundingClientRect();frame=moveFrame({x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height},0,0);positionFrame();feedback.textContent='Frame set. Press Take photo when you are ready.';view.focus();};
  const directions={left:[-.035,0],right:[.035,0],up:[0,-.035],down:[0,.035]};
  toy.querySelectorAll('[data-direction]').forEach(b=>b.onclick=()=>{if(!closed)move(...directions[b.dataset.direction]);});
  view.onkeydown=e=>{const d=directions[e.key.replace('Arrow','').toLowerCase()];if(d){e.preventDefault();e.stopPropagation();if(!closed)move(...d);}if(e.key==='Enter'||e.code==='Space'){e.preventDefault();e.stopPropagation();shutter.click();}};
  if(place==='chapel'){const choices=document.createElement('div');choices.className='chapel-compositions';for(const [label,x,y]of [['Door & blue',.91,.55],['Tree & stone',.31,.5],['Roof & leaves',.45,.09]]){const b=document.createElement('button');b.textContent=label;b.onclick=()=>{if(closed)return;selected=label;frame={x,y};positionFrame();feedback.textContent=label+' framed.';};choices.append(b);}toy.prepend(choices);}
  shutter.onclick=()=>{
   if(closed||shotBusy)return;
   if(place==='mural'&&!muralReady()){feedback.textContent='The mural is still loading. Try again when its artwork is visible.';return;}
   if(!img.complete||!img.naturalWidth){feedback.textContent='The mural picture hasn’t loaded yet. Try again when it appears.';return;}
   const detail=place==='mural'?frameAt(frame.x,frame.y):{label:selected};
   if(!detail){feedback.textContent='That frame is all angles. Look for a round orange detail.';view.classList.remove('scout-miss');void view.offsetWidth;view.classList.add('scout-miss');return;}
   shotBusy=true;
   try{const c=document.createElement('canvas');c.width=c.height=240;const ctx=c.getContext('2d'),crop=cropSquare(img.naturalWidth,img.naturalHeight,frame.x,frame.y);ctx.drawImage(img,crop.sx,crop.sy,crop.side,crop.side,0,0,240,240);
    const next=collectShot(state,place,{label:detail.label,image:c.toDataURL('image/jpeg',.85)});
    if(next===state){feedback.textContent='That shot is already in your album.';return;}
    state=next;save();rememberWorldShot(place,state.shots[place],true);closed=true;view.classList.add('scout-success');if(place==='mural'){reticle.classList.add('scout-eyes');view.querySelector('.scout-stamp').textContent='MY GOOD SIDE!';}view.querySelector('.scout-stamp').hidden=false;shutter.disabled=true;feedback.textContent=place==='mural'?'CLICK. The orange circle has found its good side. Your next picture points to the oval.':'CLICK. A quiet frame, safely in your album. The next picture is ready.';
    scoutPlace=null;renderDialog();$('discovery-title').tabIndex=-1;$('discovery-title').focus({preventScroll:true});
   }catch{feedback.textContent='This picture could not be saved. Your camera is still here; try again.';}finally{shotBusy=false;}
  };
  resetDialogView();
  $('discovery-clearer').hidden=false;$('discovery-clearer').onclick=()=>{feedback.textContent=place==='mural'?'Three orange circles are possible shots: upper-left, high middle-right, and centre-right. Aim inside one.':'Choose any composition; each is a valid picture.';};
 }
 function cinematicUI(active){if(active&&panel.parentElement!==$('experience')){panel._home=panel.parentElement;$('experience').append(panel);}else if(!active&&panel._home)panel._home.append(panel);panel.dataset.cinematic=String(active);document.body.classList.toggle('discovery-cinematic',active);}
 function found(event){if(event==='parcel'&&!giftContextSeen){giftContextSeen=true;giftContextVisible=true;try{storage.setItem(GIFT_CONTEXT_KEY,'1');}catch{}}const next=advance(state,event);if(next===state)return;state=next;save();if(event==='parcel')onParcel();if(state.step===4){filmSet();revealStarted=true;sequence=null;cinematicUI(false);stageCast(1,0);$('discovery-pose').hidden=true;$('discovery-end-scene').hidden=true;}show();}
 $('discovery-open').onclick=()=>{scoutPlace=null;if(sequence)endScene();if(state.skipped){state={...state,skipped:false};save();}show();};
 $('discovery-help').onclick=()=>{scoutPlace=null;if(sequence)endScene();show(true);if(state.step===0)$('discovery-hint').textContent='Walk toward the parcel with WASD or arrows. It opens when you approach. Tab reaches every button. Escape closes this clue. Movement assistance jumps to the pictured place without collecting it. You may leave, return or skip at any time.';};
 function closeClue(){giftContextVisible=false;scoutPlace=null;dialog.close();explore();}
 $('discovery-close').onclick=closeClue;dialog.addEventListener('cancel',event=>{event.preventDefault();closeClue();});
 async function continuePhotoReview(){
  if(captureBusy||photoHandoverBusy)return;scoutPlace=null;if(state.step===1&&!state.developed){if(development<100)return;state={...state,developed:true};save();}giftContextVisible=false;
  if(photoReviewPending&&state.souvenir){
   photoHandoverBusy=true;$('discovery-continue').disabled=true;$('discovery-continue').textContent='Opening your next experience…';
   try{await onPhotoFinish();photoReviewPending=false;if(dialog.open){dialog.close();explore();}}
   catch{$('discovery-hint').textContent='Your photo is safe. Your next experience could not open; choose Continue to retry.';}
   finally{photoHandoverBusy=false;$('discovery-continue').disabled=false;$('discovery-continue').textContent='Continue';}
  }else{dialog.close();explore();}
 }
 $('discovery-continue').onclick=continuePhotoReview;
 $('discovery-clearer').onclick=()=>{hint=true;renderDialog();};
 $('discovery-skip').onclick=()=>{endScene();state={...state,skipped:true};save();dialog.close();explore();};
 $('discovery-assist').onclick=async()=>{if(busy)return;busy=true;$('discovery-assist').disabled=true;const target=state.step===0?'parcel':state.step===1?(state.chapelVisited?'mural':'chapel-door'):'oval';try{dialog.close();await travel(target);explore();}catch{$('discovery-response').textContent='That place could not load. Your clue is safe; try again.';}finally{busy=false;$('discovery-assist').disabled=false;}};
 $('discovery-return').onclick=async()=>{dialog.close();await travel('oval');};
 $('discovery-restart').onclick=()=>{endScene();revealStarted=false;sceneDismissed=false;scoutPlace=null;development=0;photoReviewPending=false;state=restart(state);save();for(const print of worldPrints.values())if(print.group){worlds.town.remove(print.group);print.group.traverse(o=>{if(o.isMesh){o.geometry.dispose();if(o.material!==print.material)o.material.dispose();}});print.material.map.dispose();print.material.dispose();}worldPrints.clear();dialog.close();travel('start');};
 $('discovery-retake').onclick=async()=>{if(busy)return;busy=true;$('discovery-retake').disabled=true;try{dialog.close();await travel('oval');filmSet();reveal();$('discovery-response').textContent='Return to the photo spot, then choose Retake this photo again once both teachers arrive.';if(castReady()){stageCast(1,0);makePoster(true);}show();}finally{busy=false;$('discovery-retake').disabled=false;}};
 $('discovery-poster').onclick=()=>{if(!state.souvenir)return;const a=document.createElement('a');a.download='Career-Empire-Unexpected-Arrival.png';a.href=state.souvenir;a.click();};
 for(const [id,fn]of [['discovery-explore',explore],['discovery-personalise',personalise],['discovery-market',market]])$(id).onclick=()=>{dialog.close();fn();};
 dialog.addEventListener('close',()=>{scoutPlace=null;pause();});
 function makePoster(retake=false){
  if(captureBusy||state.step!==4||(state.souvenir&&!retake))return;
  captureBusy=true;$('discovery-continue').disabled=true;const capturedState=state;
  if(!dialog.open)show();
  const fail=()=>{captureBusy=false;$('discovery-continue').disabled=false;$('discovery-response').textContent='Image capture unavailable. Your scout shots are safe; try again.';};
  try{
   const load=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});
   const cancelled=Symbol('cancelled');
   const frame=Promise.resolve(beforeCapture()).then(()=>{if(state.step!==4||state.skipped)throw cancelled;return capture();});
   Promise.all([frame.then(load),...Object.values(capturedState.shots).map(s=>load(s.image))]).then(images=>{
    // A replay/skip while rendering cannot award a stale completion.
    if(state.step!==4||state.skipped){captureBusy=false;return;}
    const c=document.createElement('canvas');c.width=900;c.height=1160;const x=c.getContext('2d');
    x.fillStyle=capturedState.style==='comedy'?'#5b2d49':'#142b35';x.fillRect(0,0,900,1160);drawStyledPortrait(x,images[0],capturedState.style);
    x.fillStyle='#fff4d8';x.font='bold 34px Georgia';x.fillText('CAREER EMPIRE',35,48);x.font='bold 42px Georgia';
    x.fillText(capturedState.style==='comedy'?'An Unexpected Close-up':'Your campus pictures',35,1082);x.font='22px sans-serif';x.fillText('TAKE 1 · your pictures, your campus',35,1127);
    Object.values(capturedState.shots).forEach((shot,i)=>{x.fillStyle='#fff4d8';x.fillRect(28+i*180,824,170,198);x.drawImage(images[i+1],33+i*180,829,160,160);x.fillStyle='#142b35';x.font='13px sans-serif';x.fillText(shot.label,35+i*180,1010,155);});
    const image=c.toDataURL('image/png');state=retake?{...state,souvenir:image}:reward(state,image);captureBusy=false;if(!retake)photoReviewPending=true;save();if(dialog.open){renderDialog();$('discovery-picture').tabIndex=0;$('discovery-picture').focus({preventScroll:true});}
   }).catch(error=>{if(error===cancelled)captureBusy=false;else fail();});
  }catch{fail();}
 }


 function chapelCheckpoint(present=true){const next=visitChapel(state),changed=next!==state;state=next;save();if(present&&needsMuralClue(state)){scoutPlace=null;show();}return changed;}
 function quietDoor(){
  giftContextVisible=false;pause();scoutPlace=null;renderDialog();toy.replaceChildren();dialog.dataset.panel='chapel';$('discovery-help-options').hidden=true;$('discovery-continue').hidden=true;$('discovery-close').hidden=false;$('discovery-close').setAttribute('aria-label','Close Chapel choices without continuing');$('discovery-picture').hidden=false;$('discovery-picture').src='./discovery-assets/chapel-clue.jpg';
  $('discovery-title').textContent='A place to pause';
  $('discovery-copy').textContent='Step inside for a quiet look, or continue from the doorway. You don’t need to go inside, respond or take a photo.';
  $('discovery-hint').textContent='You can continue from the doorway. No response or photograph is needed.';
  $('discovery-clearer').hidden=$('discovery-assist').hidden=true;
  const enter=document.createElement('button');enter.textContent='Step inside';enter.onclick=()=>{dialog.close();enterQuiet();};
  const next=document.createElement('button');next.textContent='Continue from doorway';next.className='discovery-choice-primary';next.onclick=()=>{chapelCheckpoint(false);renderDialog();$('discovery-title').focus({preventScroll:true});};toy.append(enter,next);
  if(!dialog.open)dialog.showModal();resetDialogView();
 }
 paint();if(state.step===4){filmSet();revealStarted=true;reveal();}
 function endScene(){cinematicUI(false);pause();releaseReveal();sceneDismissed=true;sequence=null;elapsed=0;$('discovery-pose').hidden=true;$('discovery-end-scene').hidden=true;paint();explore();}
 function startScene(){if(sequence)return;revealStarted=true;cinematicUI(true);pause();sequence='turn';elapsed=0;castStartedAt=null;reveal();$('discovery-style').hidden=true;$('discovery-response').textContent='Someone waves from across the oval…';$('discovery-end-scene').hidden=false;$('discovery-end-scene').focus();}
 $('discovery-end-scene').onclick=endScene;
 window.addEventListener('keydown',event=>{if(sequence&&event.code==='Escape'){event.preventDefault();endScene();}});
 $('discovery-pose').onclick=async()=>{
  if(busy||captureBusy)return;
  if(state.step===4&&!state.souvenir){
   busy=true;
   try{const p=position();if(mode()!=='town'||Math.hypot(p.x+4,p.z+57)>=10)await travel('oval');filmSet();reveal();
    if(!castReady()){$('discovery-response').textContent='The teachers are still arriving. Try the photo again in a moment.';return;}
    stageCast(1,0);makePoster();
   }finally{busy=false;}
   return;
  }
  if(sequence!=='invite'||!castReady())return;found('oval');makePoster();
 };
 for(const style of ['mystery','comedy'])$('film-'+style).onclick=()=>{if(captureBusy)return;state=chooseStyle(state,style);save();if(state.souvenir)$('discovery-response').textContent=(style==='mystery'?'Mystery':'Comedy')+' selected. Retake this photo to apply it.';if(sequence)$('discovery-pose').hidden=false;};
 paint();
 return {photo:()=>state.souvenir,showPhotoFinish:()=>show(),chapelCheckpoint,quietDoor,reduced:()=>$('discovery-still').checked,open:()=>dialog.open||Boolean(sequence)||busy||captureBusy,cinematic:()=>Boolean(sequence),preparingTravel:()=>busy&&!captureBusy,openDialog:()=>dialog.open,revealed:()=>teachersRevealed(state,revealStarted,sequence),interaction(m,p){if(dialog.open||sequence||state.skipped)return null;if(m==='town'&&Math.hypot(p.x+7,p.z-14.8)<1.8)return {label:state.step===0?'Open the picture parcel':'Your current picture clue',action:()=>{if(state.step===0)found('parcel');else show();}};if(state.step>=1&&m==='town'&&Math.hypot(p.x+3.15,p.z+8.8)<2.4)return {label:'Chapel · optional quiet visit',action:quietDoor};if(state.step>=1&&state.chapelVisited&&!state.shots.mural&&m==='town'&&Math.hypot(p.x-10.6,p.z+38.4)<4&&muralReady())return {label:'Frame an orange detail',action:()=>{if(!muralReady())return;scoutPlace='mural';show();}};return null;},update(m,p,dt){
 const ready=available()&&!dialog.open&&!sequence&&!busy&&!captureBusy;
 const parcelNear=proximity.sample('parcel',m==='town'?Math.hypot(p.x+7,p.z-14.8):Infinity,{enabled:ready&&!state.skipped});
 const chapelNear=proximity.sample('chapel-entry',m==='town'?Math.hypot(p.x+3.15,p.z+8.8):Infinity,{enter:1.15,leave:3.2,enabled:ready&&state.step>=1&&!state.skipped});
 const muralNear=proximity.sample('mural',m==='town'?Math.hypot(p.x-10.6,p.z+38.4):Infinity,{enter:3,leave:5,enabled:ready&&muralReady()&&state.step===1&&state.chapelVisited&&!state.shots.mural&&!state.skipped});
 if(parcelNear){if(state.step===0)found('parcel');else show();}else if(chapelNear){if(m==='town')quietDoor();}else if(muralNear){scoutPlace='mural';show();}
 if(!sequence){const label=discoveryLocation(m,p);if(label)onLocation(label);}const readyNow=pathsReady();if(readyNow!==lastPathsReady){lastPathsReady=readyNow;paint();}elapsed+=dt;const still=$('discovery-still').checked;for(const print of worldPrints.values()){if(!print.group)continue;print.group.visible=!dialog.open&&!state.skipped&&Object.keys(state.shots).length>0;if(print.group.visible){print.time=still?1:Math.min(1,print.time+dt);print.group.scale.setScalar(.8+.2*print.time);print.material.color.setScalar(1+.35*(1-print.time));}}document.body.classList.toggle('discovery-still',still);muralSignal.visible=state.step>0&&!state.shots.mural&&!state.skipped&&muralReady();muralSignal.scale.setScalar(still?1:1+Math.sin(elapsed*3)*.16);if(state.skipped)return;if(Math.hypot(p.x+4,p.z+57)>4)sceneDismissed=false;if(state.step===3&&!dialog.open&&!sceneDismissed&&m==='town'&&Math.hypot(p.x+4,p.z+57)<3&&!sequence)startScene();if(sequence){if(m!=='town'){endScene();return;}const turn=still?1:Math.min(1,elapsed/2.8);frameReveal(turn);if(!castReady()){stageCast(0,0);$('discovery-response').textContent='Someone is coming over…';return;}if(castStartedAt===null)castStartedAt=Math.max(elapsed,2.8);const approach=still?1:Math.max(0,Math.min(1,(elapsed-castStartedAt)/4));stageCast(approach,still?0:dt);if(approach===1&&sequence!=='invite'){sequence='invite';filmSet();film.visible=true;$('discovery-response').textContent='You brought '+Object.values(state.shots).map(s=>s.label.toLowerCase()).join(' and ')+'. We have the cast… and you are in this one! Choose a photo style if you like, then let’s pose.';$('discovery-pose').hidden=false;$('discovery-style').hidden=false;}else if(sequence!=='invite')$('discovery-response').textContent='The teachers walk over to meet you…';}},snapshot:()=>({...state,souvenir:!!state.souvenir,persistent,scene:sequence})};
}
