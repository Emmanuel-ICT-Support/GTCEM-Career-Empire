import {arrangementChoices,canTryArrangement,applyArrangement,showSignPosition} from './market-arrangement.mjs?v=market-arrangement-20261012';
import {inAdministration,nearestInteraction} from './administration-flow.js?v=market-admin-20261012';
import * as THREE from 'three';
import {JUNIPER,riceBowl,takeawayBag} from './market-food.js?v=market-student-playtest-20260924';
import {marketComplete,createPracticeStore,VALUES,BADGES,MARKET_SHOP} from './night-market-state.js?v=market-collection-20261012';
import {PLAN_OPTIONS,NOTE_FIELDS,describePlan,evaluatePlan,caseNoteText} from './night-market-agency.js?v=market-lawns-20260924';
import {marketCharacters} from './market-characters.js?v=market-admin-20261012';
import {marketSurroundings} from './market-surroundings.js?v=market-admin-20261012';
const money=n=>'$'+(n/100).toFixed(2);
// Campus materials and locally optimised NPCs; practice state remains independent.
export function createNightMarket({storage,onPause,onClose,onExit,onTravel=()=>{},campusPalette,campusGrass,captureBriefing}){
 const reviewMode=new URLSearchParams(location.search).get('market-review')==='1';
 const reviewData=new Map();
 if(reviewMode)storage={getItem:k=>reviewData.get(k)??null,setItem:(k,v)=>reviewData.set(k,v),removeItem:k=>reviewData.delete(k)};
 const store=createPracticeStore(storage),scene=new THREE.Scene();let celebrationTime=0;
 scene.background=new THREE.Color('#b9dce3');scene.fog=new THREE.Fog('#b9dce3',24,58);
 scene.add(new THREE.HemisphereLight('#e1f2ff','#98b697',1.15));
 const sun=new THREE.DirectionalLight('#ffdfb2',3.2);sun.position.set(-16,24,18);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-18,right:18,top:18,bottom:-18,near:1,far:70});sun.shadow.normalBias=.035;scene.add(sun);
 const mats=new Map(),obstacles=[],customers=[],lanterns=[],labels=[];
 const cast=marketCharacters();let visitor=0;
 const mat=(colour,glow=false)=>{const campusKey={'#80654c':'timber','#dbc7a2':'timber','#387f7b':'blue','#38716b':'blue','#b7a784':'stone','#b4a17d':'timber'}[colour];if(!glow&&campusPalette&&campusKey)return campusPalette[campusKey];const key=colour+glow;if(!mats.has(key))mats.set(key,new THREE.MeshStandardMaterial({color:colour,roughness:.85,...(glow?{emissive:colour,emissiveIntensity:.7}:{})}));return mats.get(key);};
 function box(w,h,d,x,y,z,c,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
 function orb(r,x,y,z,c,parent=scene,glow=false){const m=new THREE.Mesh(new THREE.SphereGeometry(r,12,8),mat(c,glow));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
 function label(text,x,y,z,width=3,colour='#fcf0d5'){
  const c=document.createElement('canvas');c.width=768;c.height=192;const ctx=c.getContext('2d');
  ctx.fillStyle='#183b3b';ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle='#bfa878';ctx.lineWidth=7;ctx.strokeRect(4,4,760,184);
  ctx.font='bold 46px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=colour;ctx.fillText(text,384,96,718);
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:texture}));s.position.set(x,y,z);s.scale.set(width,width/4,1);scene.add(s);labels.push({sprite:s,width});s.userData.labelCanvas=c;return s;
 }
 // Lettering sits flush on a solid campus-blue front panel, never billboards.
 function panel(text,x,y,z,w,h){
  const art=label(text,0,0,0);scene.remove(art);labels.splice(labels.findIndex(l=>l.sprite===art),1);
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:art.material.map,roughness:.85}));
  mesh.userData.labelCanvas=art.userData.labelCanvas;mesh.userData.panel=true;mesh.position.set(x,y,z);scene.add(mesh);art.material.dispose();changeLabel(mesh,text);return mesh;
 }
 function changeLabel(sprite,text){
  if(sprite.userData.text===text)return;sprite.userData.text=text;const c=sprite.userData.labelCanvas,ctx=c.getContext('2d');ctx.fillStyle=sprite.userData.panel?'#245779':'#183b3b';ctx.fillRect(0,0,768,192);ctx.strokeStyle='#bfa878';ctx.lineWidth=7;ctx.strokeRect(4,4,760,184);ctx.font=sprite.userData.panel?'bold 88px sans-serif':'bold 40px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fcf0d5';ctx.fillText(text,384,96,718);sprite.material.map.needsUpdate=true;
 }
 function npc(x,z,colour,id,facing=Math.PI){const g=new THREE.Group();g.position.set(x,0,z);box(.45,.72,.28,0,1.08,0,colour,g);orb(.22,0,1.67,0,'#c99575',g);for(const side of [-1,1]){box(.16,.65,.19,side*.13,.41,0,'#263d46',g);box(.13,.58,.16,side*.31,1.05,0,colour,g);}scene.add(g);cast.register(g,id||['customer-a','customer-b','customer-c','customer-d','customer-e'][visitor++%5],{facing});return g;}
 function stall(x,z){obstacles.push({x,z,w:4.1,d:1.65});}
 marketSurroundings(scene,obstacles,campusPalette,campusGrass);
 obstacles.push({x:JUNIPER.x,z:JUNIPER.z,w:JUNIPER.width,d:JUNIPER.depth});stall(-8,0);
 npc(-.65,JUNIPER.staffZ,'#e8c56a','mara',0);const maraLabel=label('MARA · START HERE',-.65,2.08,JUNIPER.staffZ,3);
 const helper=npc(1.1,JUNIPER.staffZ,'#68b5ae','sam',0);const helperLabel=label('SAM · MARKET CREW',1.1,2.3,-5.8,1.8);
 for(const [x,z]of [[-2,-1],[-3,1],[-2,2.5]])customers.push(npc(x,z,'#a1a7c4'));
 const trialBags=Array.from({length:6},(_,i)=>{const bowl=riceBowl();bowl.position.set(-1.5+(i%3)*.44,JUNIPER.top,-5.2+Math.floor(i/3)*.4);scene.add(bowl);return bowl;});
 const extraCustomers=[npc(-3,3.5,'#a1a7c4'),npc(-1,2,'#c9b17c'),npc(-1,3.5,'#c9b17c')];
 const observationLabels=[label('PHONE ORDER / ALREADY PAID',0,2.05,0,2.7),label('WALK-UP / ORDER & PAY',0,2.05,0,2.5),label('FOOD READY / COLLECT HERE',2.8,1.9,-4.4,2.8)];observationLabels.forEach(l=>l.visible=false);
 const trialBoard=panel('WORK BENCH',4.2,.43,-2.465,1.2,.42);
 box(1.3,.8,.65,4.2,.4,-2.8,'#387f7b');box(1.45,.1,.8,4.2,.85,-2.8,'#dbc7a2');box(.55,.025,.4,4.2,.915,-2.7,'#fff1cc');obstacles.push({x:4.2,z:-2.8,w:1.45,d:.8});
 const customerLabel=label('WAITING FOR A PHONE ORDER',-2,2.5,-1,2.4);
 const collection=new THREE.Group();scene.add(collection);collection.position.set(2.8,0,-4.4);
 box(1.25,.85,.7,0,.425,0,'#387f7b',collection);box(1.45,.1,.85,0,.9,0,'#dbc7a2',collection);
 for(const x of [-.35,0,.35]){const bag=takeawayBag();bag.position.set(x,.95,0);collection.add(bag);}
 const collectionObstacle={x:2.8,z:-4.4,w:1.45,d:.85};obstacles.push(collectionObstacle);
 const collectionLabel=panel('COLLECT HERE',0,.43,.356,1.15,.42);scene.remove(collectionLabel);collection.add(collectionLabel);
 const sign=new THREE.Group();sign.name='Juniper / movable collection sign';
 box(.09,1.5,.09,0,.75,0,'#80654c',sign);box(1.8,.55,.10,0,1.35,0,'#dbc7a2',sign);scene.add(sign);
 // Mount the text flush on the board: a camera-facing sprite cut through it.
 const signArt=label('PICK UP HERE  >',0,0,0,1.7);scene.remove(signArt);labels.splice(labels.findIndex(l=>l.sprite===signArt),1);
 const signText=new THREE.Mesh(new THREE.PlaneGeometry(1.7,.45),new THREE.MeshStandardMaterial({map:signArt.material.map,roughness:.85}));
 signText.userData.labelCanvas=signArt.userData.labelCanvas;signText.position.set(0,1.35,.056);sign.add(signText);
 const signBack=signText.clone();signBack.position.z=-.056;signBack.rotation.y=Math.PI;sign.add(signBack);signArt.material.dispose();sign.visible=false;
 // Keep the complete stage cluster together when changing its placement.
 const beforeStage=new Set(scene.children),stageObstacleStart=obstacles.length;
 // A small stage, not a concert production. All forms remain replaceable.
 obstacles.push({x:0,z:-11,w:5,d:3.5});


 const crewRibbon=label('CREW PASS',4,2.3,-10,2.6);
 const celebrationLights=[-2,-1,1,2].map((x,i)=>orb(.18,x,3,-10,['#e8b96e','#77d6cd','#e8b96e','#77d6cd'][i],scene,true));
 const ticket=box(.65,.035,.32,-7.25,1.12,.35,'#edcb80');
 const stageGlow=orb(.22,0,3.2,-11,'#ffdb87',scene,true);
 const performer=npc(0,-11,'#c9976b',undefined,0);performer.position.y=.5;
 const band=[npc(-1.3,-11,'#699d93',undefined,0),npc(1.3,-11,'#ac7890',undefined,0)];band.forEach(p=>p.position.y=.5);
 // Freestanding sound-check equipment; no props attached to idle character rigs.
 const keyboard=new THREE.Group();keyboard.name='Stage keyboard and X stand';keyboard.position.set(-1.3,.5,-10.45);scene.add(keyboard);
 box(1.12,.11,.38,0,.9,0,'#253237',keyboard);
 for(let i=0;i<21;i++)box(.047,.025,.24,-.5+i*.05,.97,.045,'#f1ede2',keyboard);
 for(let i=0;i<20;i++)if(![2,6].includes(i%7))box(.028,.035,.14,-.475+i*.05,1,-.005,'#182326',keyboard);
 for(const side of [-1,1]){const leg=box(.035,.91,.065,0,.44,0,'#344349',keyboard);leg.rotation.z=side*.58;box(.5,.035,.42,side*.22,.018,0,'#344349',keyboard);}
 box(.1,.018,.025,.41,.975,-.14,'#7badac',keyboard);
 function microphone(x){
  const stand=new THREE.Group();stand.name='Stage microphone stand';stand.position.set(x,.5,-10.5);scene.add(stand);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.15,.17,.035,16),mat('#253237'));base.position.y=.02;stand.add(base);
  box(.025,1.28,.025,0,.66,0,'#4c595d',stand);
  const boom=box(.025,.3,.025,0,1.34,-.08,'#4c595d',stand);boom.rotation.x=-.7;
  const capsule=orb(.045,0,1.45,-.18,'#848c8c',stand);capsule.scale.set(.75,.75,1.65);
 }
 microphone(0);microphone(1.3);
 const thanks=label('THANK YOU, JUNIPER CREW',2.5,3.9,-10.8,4.5);thanks.visible=false;
 const audience=[npc(-3.7,-6.8,'#8eacbb'),npc(-4.4,-6.2,'#c6aa75'),npc(-3.2,-7.3,'#aaa0bd')];audience.forEach(p=>p.visible=false);

 for(const x of [-2,2])box(.6,1,.6,x,1,-10.8,'#243537');
 const stageBreakLabel=label('FREE STAGE BREAK',-5,2.1,-8,3);
 const stageBench=box(2,.45,.7,-5,.23,-8.8,'#b4a17d');obstacles.push({x:-5,z:-8.8,w:2,d:.7});
 // Juniper is centred at (0,-5); the stage now faces the same entrance from its right.
 for(const child of scene.children)if(!beforeStage.has(child)&&child!==ticket){child.position.x+=8;child.position.z+=6;}
 for(const obstacle of obstacles.slice(stageObstacleStart)){obstacle.x+=8;obstacle.z+=6;}
 crewRibbon.position.set(9.3,2.3,-2.8);thanks.position.set(8,3.9,-4.8);
 audience.forEach((p,i)=>p.position.set(6.3+i*.9,0,-1.8-(i%2)*.3));
 stageBench.position.set(6.5,.23,1);stageBreakLabel.position.set(6.5,2.1,1);
 Object.assign(obstacles.at(-1),{x:6.5,z:1});

 const keepsake=new THREE.Group();box(.3,.5,.3,0,.3,0,'#efc36b',keepsake);orb(.14,0,.65,0,'#ffdf98',keepsake,true);keepsake.position.set(-8.7,1.08,.35);scene.add(keepsake);
 const plant=new THREE.Group();scene.add(plant);plant.position.set(-8,1.08,.35);box(.27,.25,.27,0,.125,0,'#ba8159',plant);box(.04,.42,.04,0,.4,0,'#4b7855',plant);for(const x of [-.12,.12])orb(.15,x,.52,0,'#79a767',plant);plant.visible=false;

 const trinkets={};
 const plane=new THREE.Group();plane.position.set(-7.6,1.14,-.1);scene.add(plane);for(const side of [-1,1]){const wing=new THREE.Mesh(new THREE.ConeGeometry(.13,.4,3),mat('#fff1cf'));wing.rotation.z=Math.PI/2;wing.rotation.x=side*.3;wing.position.x=side*.055;plane.add(wing);}trinkets.plane=plane;
 const compass=new THREE.Group();compass.position.set(-8.25,1.11,-.1);scene.add(compass);const dial=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.035,16),mat('#d5b769'));compass.add(dial);const needle=box(.025,.015,.2,0,.03,0,'#a74638',compass);needle.rotation.y=.5;trinkets.compass=compass;
 const duck=new THREE.Group();duck.position.set(-8.8,1.1,-.1);scene.add(duck);const body=orb(.12,0,.11,0,'#f5cd55',duck);body.scale.z=1.3;orb(.085,0,.25,.08,'#f5cd55',duck);box(.1,.035,.09,0,.24,.16,'#dc873f',duck);trinkets.duck=duck;
 for(const x of [-10,10])for(let z=-12;z<=10;z+=5.5){box(.13,4,.13,x,2,z,'#8d8971');orb(.14,x,3.85,z,'#ffe0a1',scene,true);}
 for(let i=0;i<17;i++){const x=-10+i*1.25,y=3.9-.6*Math.sin(Math.PI*i/16);orb(.085,x,y,4,'#ffdd93',scene,true);}

 for(const x of [5.5,8.5]){box(.09,2.5,.09,x,1.25,7,'#b39a77');lanterns.push(orb(.2,x,2.5,7,'#ffd578',scene,true));}

 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('./night-market.css?v=market-arrangement-20261012',import.meta.url).href;document.head.append(css);
 const hud=document.createElement('section');hud.id='market-hud';hud.hidden=true;hud.setAttribute('aria-label','Live Music and Sunday Markets practice');
 hud.innerHTML='<details id="market-card"><summary>Your first gig <span aria-hidden="true">⌄</span></summary><div class="market-card-details"><div class="market-kicker">SUNDAY MARKET / LOCAL PRACTICE</div><h2>Your first gig</h2><div class="market-balance" id="market-balance"></div><div class="market-tools"><button id="market-journal">Journal & map</button><button id="market-exit">Return to campus</button></div><p class="market-status" id="market-status" role="status"></p></div></details><p id="market-objective" aria-live="polite"></p><button id="market-test" hidden>Watch a test group</button><button id="market-replay" hidden>Start a fresh shift…</button>';
 document.getElementById('experience').append(hud);
 const dialog=document.createElement('dialog');dialog.id='market-dialog';dialog.setAttribute('aria-labelledby','market-dialog-title');document.body.append(dialog);
 let introTimer=null,introFrame=0,introPaused=false,exitArmed=false;
 let visible=false,customerProgress=0,previousSolution=store.state.solution,lastAnnounced='',music=null,watching=0,observationHold=false,testing=0,noteDraft=null;
 hud.querySelector('#market-test').onclick=()=>show('Test this arrangement',describePlan(store.state.plan),[['Start the test',beginTrial]],'Watch four phone customers and two walk-up customers. Results appear after the group finishes.');
 const announce=text=>{lastAnnounced=text;hud.querySelector('#market-status').textContent=text;};
 function close(){clearTimeout(introTimer);introTimer=null;const restore=observationHold;observationHold=false;if(restore)sync();onClose();dialog.close();}
 // Reset synchronously: a deferred close event must not erase fresh movement input.
 dialog.addEventListener('close',()=>document.getElementById('scene').focus());
 dialog.addEventListener('cancel',()=>{clearTimeout(introTimer);const restore=observationHold;observationHold=false;if(restore)sync();onClose();});
 function show(title,body,choices=[],extra=''){if(chapterPlayback)endPreview();
  clearTimeout(introTimer);introTimer=null;onPause();dialog.classList.remove('market-intro');dialog.replaceChildren();const eyebrow=document.createElement('div');eyebrow.className='market-kicker';eyebrow.textContent='SUNDAY MARKETS / PRACTICE';dialog.append(eyebrow);
  const h=document.createElement('h2');h.id='market-dialog-title';h.textContent=title;dialog.append(h);
  const p=document.createElement('p');p.className='market-body';p.textContent=body;dialog.append(p);if(title==='Mara’s roster and order record'){const figure=document.createElement('figure');figure.className='market-record-author';const portrait=document.createElement('img');portrait.src=new URL('./assets/community-cast-20260927/mara-portrait.png',import.meta.url).href;portrait.alt='Mara, Juniper Kitchen owner and record author';portrait.width=portrait.height=112;const caption=document.createElement('figcaption');caption.textContent='Mara · Juniper Kitchen';figure.append(portrait,caption);p.before(figure);}
  if(extra){const note=document.createElement('p');note.className='market-note';note.textContent=extra;dialog.append(note);}
  const actions=document.createElement('div');actions.className='market-choices';dialog.append(actions);
  for(const [text,action,disabled]of choices){const b=document.createElement('button');b.textContent=text;b.disabled=Boolean(disabled);b.onclick=action;actions.append(b);}
  const leave=document.createElement('button');leave.className='market-close';leave.textContent='Back to the market';leave.onclick=close;dialog.append(leave);
  if(!dialog.open)dialog.showModal();
  (actions.querySelector('button:not(:disabled)')||leave).focus();
 }
 function commit(type,success){const before=store.state.badges;const ok=store.dispatch(type);sync();if(ok){const gained=store.state.badges.filter(b=>!before.includes(b));announce(success+(gained.length?' · Game badge: '+gained.map(b=>BADGES[b][0]).join(', '):''));}else if(store.error)announce(store.error);return ok;}
 function mara(){
  const s=store.state;if(s.revision===3)return agencyMara();if(s.revision===2)return researchMara();
  if(!s.accepted)show('Mara: “You made it.”','“First market with phone preorders. Great for sales… but nobody knows where to collect. Want a short shift helping people find their food?”',[
   ['Take the shift',()=>{if(commit('accept','Shift started. Ask the waiting customer or try a collection sign.')){close();}else journal();}]
  ],'Fictional practice pay: $20 gross, $2 community tax, $18 to you. No timer. Asking for help and retrying do not reduce your pay. You can explore first.');
  else if(!s.solution)show('“Make collection clear.”','“The pickup point is at the right end of the counter. Talk to the waiting customer, try a sign here, or ask Sam to help. Watch what happens.”',[
   ['Try a sign on the counter',()=>{if(commit('sign-hidden','The sign is up, but the queue still cannot see it.')){show('“I still can’t see where to go.”','The customer is behind the queue. The counter sign is blocked. You can move it to the path or ask Sam to guide people.',[['Move the sign to the path',()=>solve('sign-clear')],['Go and ask Sam',close]]);}else journal();},s.attempted],
   ['Put a clear pickup sign beside the path',()=>solve('sign-clear')]
  ]);
  else if(!s.paid)show('“That’s working!”',s.solution==='helper'?'“Sam is guiding people to collection. You found a way to share the job.”':'“People can see the sign from the path. They know where to collect.”',[
   ['Finish the shift · receive $18',()=>{if(commit('pay','Paid once: $18 to your wallet; $2 to the local practice community fund.'))show('First shift, done.','Mara: “Thanks. Come back next time—these new ways of working will keep us on our toes.”',[
    ['Explore the market',close],['Open my journal',journal]
   ],'Practice receipt: $20 gross − $2 community tax = $18 net. The community lantern is now lit. Save, choose a small keepsake, or take a free stage break.');else journal();}]
  ]);
  else show('“Good to see you again.”','“Your first shift is already paid. Enjoy the market. Next time, we might need to rethink the whole menu.”',[['See my market journal',journal]],'This is the end of this playable opening. Future episodes are not built yet.');
 }
 const maraFrames=[
  ['Meet the Juniper crew','“I’m Mara. I own Juniper Kitchen, selling fresh rice bowls. It’s busy and the queue feels disorganised. Sam helps me pack.”'],
  ['Order or collect?','“Phone customers have paid: show your order at collection. Walk-up customers order and pay at the ordering counter.”'],
  ['Show initiative','“Notice what could work better. Look around, ask questions and try an idea. If Sam guides or serves customers, I pack alone.”'],
  ['Try, watch, share','“Watch the next group use your arrangement. What worked? What would you change? Your journal’s thinking guide is optional.”'],
  ['Your agreed job','Try an arrangement. Check the result. Share what you found. $20 gross − $2 community tax = $18 plus a crew pass. Help, retries and mixed results do not reduce your pay.']
 ];
 function maraIntro(){
  const draw=()=>{
   const [title,body]=maraFrames[introFrame];
   show(title,body,[[store.state.accepted?'Continue my shift':introFrame===4?'Let’s take a look':'Take the shift',()=>{if(store.state.accepted){close();return;}if(commit('accept','Make service smoother. Investigate or try an arrangement — you choose.'))close();else journal();}],['Thinking guide',thinkingGuide]],introFrame===4?'Fictional practice pay. No timer. You can explore first.':'Agreed job: try, check and hand over. $20 gross − $2 community tax = $18 plus a crew pass. Help, retries and mixed results keep full pay.');
   dialog.classList.add('market-intro');
   if(captureBriefing){const image=document.createElement('img');image.className='market-intro-image';image.alt=['Mara and Sam at Juniper Kitchen','Customers waiting between ordering and collection','Juniper work bench and collection counter','Customer flow through the market','Juniper Kitchen ready for your practice shift'][introFrame];image.src=captureBriefing(Math.min(introFrame,3));const visual=document.createElement('div');visual.className='market-intro-visual';visual.append(image);if(introFrame===1){visual.classList.add('market-intro-split');visual.replaceChildren();for(const [view,alt]of [[4,'Prepaid phone-order collection panel'],[5,'Walk-up ordering counter']]){const half=document.createElement('img');half.className='market-intro-image';half.alt=alt;half.src=captureBriefing(view);visual.append(half);}}if(introFrame===2){const focus=document.createElement('span');focus.className='market-notice-focus';focus.textContent='⌕';focus.setAttribute('aria-hidden','true');visual.append(focus);}if(introFrame===0){const crowd=document.createElement('img');crowd.className='market-lunch-rush';crowd.alt='A playful exaggerated crowd of hungry market customers with phones and rice bowls';crowd.src=new URL('./assets/market/lunch-rush.jpg',import.meta.url).href;visual.append(crowd);}dialog.querySelector('.market-body').before(visual);}
   const skills=document.createElement('p');skills.className='market-note';skills.textContent='Skills you’re practising: initiative · problem solving · working with others';dialog.querySelector('.market-body').after(skills);const captions=document.createElement('div');captions.className='market-beat-captions';for(const caption of [['Meet Mara. Meet Sam.','Lunch is getting busy.'],['Ordered online? Collect here.','Ordering now? Order and pay.','But where should everyone go?'],['Show initiative.','Look around. Ask questions. Try an improvement.'],['Observe → try → check','Watch the next group.'],['Your agreed job']][introFrame]){const line=document.createElement('span');line.textContent=caption;captions.append(line);}dialog.querySelector('.market-intro-visual')?.append(captions);
   const text=dialog.querySelector('.market-body');text.setAttribute('aria-live','polite');
   const controls=document.createElement('div');controls.className='market-intro-controls';
   const progress=document.createElement('span');progress.textContent=`${introFrame+1} of ${maraFrames.length}`;controls.append(progress);
   for(const [name,action]of [[introPaused?'Play':'Pause',()=>{introPaused=!introPaused;draw();}],['Next',()=>{introFrame=Math.min(introFrame+1,maraFrames.length-1);draw();}],['Skip intro',()=>{introFrame=maraFrames.length-1;draw();}],['Replay intro',()=>{introFrame=0;draw();}]]){const button=document.createElement('button');button.textContent=name;button.onclick=action;controls.append(button);}
   dialog.querySelector('.market-choices').before(controls);
   if(introFrame<maraFrames.length-1&&!introPaused&&!matchMedia('(prefers-reduced-motion: reduce)').matches)introTimer=setTimeout(()=>{if(dialog.open){introFrame++;draw();}},[6000,10000,9000,8000,6000][introFrame]);
  };introFrame=0;introPaused=false;draw();
 }
 function agencyMara(){
  const s=store.state;
  if(!s.accepted)return maraIntro();
  if(s.paid)return show('Your shift is paid','Your experiment is part of the record, including anything that did not work. You can revisit your case note and use your crew pass.',[['My first gig / case note',caseNote],['Connect this to Initiative',consolidation]]);
  if(!s.trials.length||!s.tested)return show('Try your arrangement','Mara: “Set your plan at the test bench, then go and watch the queue to see whether it improves things. Come back and talk it through with me afterwards.”',[['Back to the market',close]]);
  if(!s.reviewed)return trialResults();
  return consolidation();
 }
 function agencySetup(){
  const s=store.state;
  if(!s.accepted)return show('Stall setup','Speak to Mara about the role and workplace boundaries first.');
  if(s.paid)return show('Shift handed over','Your trial arrangements are saved in your case note. You can revise your reflection choices or start another practice from the journal.',[['My first gig / case note',caseNote]]);
  if(testing>0)return show('The next customers are arriving','Return to the world to watch it finish. Changes can wait until you have seen the result.');
  show('Try an idea for Juniper Kitchen','Start with the current setup below. Try it as it is, change one thing, or combine ideas. You can also investigate first.',[], 'Changes cost nothing. Sam can do one role at a time. All collection locations here keep the emergency walkway open.');
  const form=document.createElement('div');form.className='market-form';const selects={},rows={};
  for(const [key,options]of Object.entries(PLAN_OPTIONS)){
   const label=document.createElement('label');label.textContent={sign:'Sign wording',position:'Sign position',collection:'Where will customers collect?',helper:'What will Sam do?'}[key];
   const select=document.createElement('select');select.id='plan-'+key;select.setAttribute('aria-label',label.textContent);
   for(const [value,text]of Object.entries(options)){const option=document.createElement('option');option.value=value;option.textContent=text;select.append(option);}select.value=s.plan[key];selects[key]=select;rows[key]=label;label.append(select);form.append(label);
  }
  const actions=dialog.querySelector('.market-choices');actions.before(form);
  const preview=document.createElement('p');preview.className='market-arrangement-preview';preview.setAttribute('aria-live','polite');form.append(preview);
  const current=()=>arrangementChoices(Object.fromEntries(Object.entries(selects).map(([key,select])=>[key,select.value])));
  const apply=()=>{const changed=Object.keys(current()).some(key=>current()[key]!==store.state.plan[key]);if(!applyArrangement(store,current())){journal();return false;}if(changed)customerProgress=0;sync();return true;};
  const run=document.createElement('button');run.textContent='Try this with next customers';run.className='market-arrangement-primary';run.onclick=()=>{if(canTryArrangement(store.state,current())&&apply())beginTrial();};actions.append(run);
  const save=document.createElement('button');save.textContent='Apply setup · investigate first';save.className='market-arrangement-secondary';save.onclick=()=>{if(apply())planReady();};actions.append(save);
  function previewChoices(){const plan=current();rows.position.hidden=!showSignPosition(plan);preview.textContent='Your setup: '+[PLAN_OPTIONS.sign[plan.sign],...(showSignPosition(plan)?[PLAN_OPTIONS.position[plan.position]]:[]),PLAN_OPTIONS.collection[plan.collection],PLAN_OPTIONS.helper[plan.helper]].join(' · ');run.disabled=!canTryArrangement(store.state,plan);}
  Object.values(selects).forEach(select=>select.onchange=previewChoices);previewChoices();
  if(s.trials.length){const results=document.createElement('button');results.textContent='Compare my trial results';results.onclick=trialResults;actions.append(results);}
  if(s.trials.length>=12){const note=document.createElement('p');note.textContent='You have tried twelve groups of customers. Review what happened and hand over to Mara for your full wages.';form.append(note);}
  selects.sign.focus();
 }
 let arrangementReady=false;
 function planReady(){
  arrangementReady=true;
  show('Setup applied · customers have not started','Your setup is in the stall. You can speak to the customer or Sam, or inspect the queue before testing.',[],'When ready, choose Start the test at the queue or return to the workbench. Trials cost nothing.');
 }
 function beginTrial(){
  const s=store.state;if(!s.accepted||s.paid||s.tested||s.trials.length>=12||testing>0||watching>0)return;
  close();testing=.01;customerProgress=0;sync();announce('Test started: watch where the six customers go.');
 }
 function trialResults(){
  const s=store.state,t=s.trials.at(-1);if(!t)return agencySetup();
  show(`Trial ${s.trials.length} / what happened`,t.outcome.facts.join(' '),[
   [t.inspected?'Result already recorded':'Record that I checked this result',()=>{if(commit('inspect-trial','Result checked. Decide what you want to change, investigate or hand over.'))trialResults();else journal();},t.inspected],
   ['Compare all trials / reflect',caseNote],
   ['Return to investigate or revise',close],
   ['Go and talk it through with Mara',close,!t.inspected]
  ],'These are observations from this simulation, not a score. What do they suggest? You can finish with an unresolved issue and recommend a next step.');
 }
 function consolidation(){
  const s=store.state;if(!s.reviewed)return trialResults();
  const t=s.trials.at(-1);
  show('Name what you practised',`Mara: “You proposed an arrangement and checked what happened. That is practising initiative: noticing opportunities, improving work practices and speaking up respectfully. Comparing a trial with what you expected is problem solving.” ${t.outcome.effective?'This arrangement balanced customer access and packing in our trial.':'Your trial left a tradeoff to work on. Reporting that honestly is useful work too.'}`,[
   ['Keep this learning connection',()=>{if(!s.consolidated&& !commit('consolidate','Learning connection saved. Your reflection choices are optional.'))return journal();handover();}],
   ['Initiative / reference sheet',initiativeSheet],
   ['Review my case note',caseNote],
   ['Try another arrangement first',close]
  ],'Reflection choices do not affect your agreed pay. These game badges recognise practice, not verified workplace competence.');
 }
 function handover(){const s=store.state;
  show('Your experiment counts','Mara: “Thanks for trying it and checking the result. We can use what you found. Your agreed wages are ready.”',[
   ['Finish the shift · receive $18 and crew pass',()=>{if(commit('pay','Paid $18 after $2 community tax. Crew pass earned for the agreed work.'))show('First gig complete','Your wages and crew pass are yours. Your case note keeps the experiments and your own explanation together.',[['My first gig / case note',caseNote],['Explore the market',close]],'$20 gross − $2 community tax = $18 net. Reflection text is not graded and never changes your pay.');else journal();},s.paid],
   ['My first gig / case note',caseNote]
  ]);
 }
 function thinkingGuide(){
  show('A guide when you need it','Notice — What is happening? Who is affected?\n\nThink — What might explain it? What could you find out?\n\nAct — What small change could you try within the agreed boundaries?\n\nSupport — Who could help you, or who might need your help?\n\nReview — What changed? What would you keep or try differently?', [['Back to Mara',agencyMara],['My case note',caseNote]],'Use any prompt that helps. You can skip, revisit or reorder them. Opening this guide does not change pay or badges.');
 }
 function initiativeSheet(){
  show('Initiative / keep the connection','Initiative means taking constructive action: being proactive, identifying improvements to work practices, voicing ideas respectfully, helping fellow workers and seeking responsibilities.\n\nThink back to your trial: which behaviour did you practise? What did you do, how did you know or learn what to do, and who else was involved?', [['My case note',caseNote],['Optional thinking guide',thinkingGuide]],'Reference resource from EST Initiative. Reading it does not complete an assessment or certify workplace competence.');
  const link=document.createElement('a');link.href='../Assets/EST%20Preparation/initiative-one-page-summary.png';link.target='_blank';link.rel='noopener';link.textContent='Open original Initiative one-pager at full size';
  const img=document.createElement('img');img.src=link.href;img.alt='Initiative reference sheet: five workplace behaviours, examples, Notice Think Act Support Review, and a Situation Initiative Impact Skill answer builder.';img.style.cssText='width:100%;height:auto';
  const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent='View the original one-pager';details.append(summary,link,img);dialog.querySelector('.market-choices').before(details);
  const teacher=document.createElement('details');teacher.className='market-record';
  const teacherSummary=document.createElement('summary');teacherSummary.textContent='Teacher curriculum context';teacher.append(teacherSummary);
  const context=document.createElement('p');context.textContent='2027 Careers and Employability General Year 12: Unit 3 enterprising behaviours (printed p. 9); communication and teamwork (pp. 7, 11); questioning, alternatives and plan–implement–evaluate (pp. 8, 12). Revising a trial can support Unit 4 continuous improvement (p. 13). The activity supplies practice and reflection; assessment evidence needs teacher review. The fictional community tax is a game mechanic.';teacher.append(context);
  const source=document.createElement('a');source.href='https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0008/1262159/Careers-and-Employability-General-Year-12-Syllabus-for-teaching-from-2027.PDF';source.target='_blank';source.rel='noopener';source.textContent='Official 2027 Year 12 syllabus';teacher.append(source);dialog.append(teacher);

 }
 function caseNote(){
  const s=store.state;if(s.revision!==3)return journal();
  if(!noteDraft)noteDraft={...s.caseNote};
  show('My first gig / case note','Choose statements that fit your experience. You can leave any blank. The factual game record is separate; these choices are not proof of a skill.',[],reviewMode?'Simulated practice • fresh review. Save keeps this note for this visit only; download it before refreshing.':'Simulated practice • saved in this browser, shared by its local characters. Download a copy to keep. This is not verified portfolio evidence.');
  const actions=dialog.querySelector('.market-choices'),record=document.createElement('details');record.className='market-record';
  const heading=document.createElement('summary');heading.textContent=`Game record · ${s.trials.length} trial${s.trials.length===1?'':'s'}`;record.append(heading);
  const facts=document.createElement('pre');facts.textContent=caseNoteText({...s,caseNote:{}}).split('MY EXPLANATION')[0];record.append(facts);actions.before(record);
  const fields=document.createElement('div');fields.className='market-form';const inputs={};
  const choices={noticed:['Customers were unsure where to collect paid orders.','Ordering and collection were competing for space.','I am still working out what caused the problem.'],informed:['I asked Sam about the workflow.','I listened to the customer.','I compared the trial results.','I tried the existing setup first.'],tried:['I changed the sign wording or position.','I changed where collection happened.','I changed Sam’s role.','I tested the existing arrangement.'],result:['Collection became clearer.','The change helped some customers but created a tradeoff.','The problem remained; I would try another arrangement.','I need another trial to decide.'],people:['I discussed the arrangement with Mara.','I used Sam’s advice.','I listened to the customer and involved the crew.'],transfer:['Ask people what they need before making a change.','Try a small improvement and check the result.','Explain an idea respectfully and ask for support.','I would like more practice first.']};
  for(const [key,title]of Object.entries(NOTE_FIELDS)){const label=document.createElement('label');label.textContent=title;const input=document.createElement('select');input.id='note-'+key;input.setAttribute('aria-label',title);const empty=document.createElement('option');empty.value='';empty.textContent='Choose if useful — optional';input.append(empty);for(const text of choices[key]){const option=document.createElement('option');option.value=text;option.textContent=text;input.append(option);}const old=noteDraft[key]||'';if(old&&!choices[key].includes(old)){const previous=document.createElement('option');previous.value=old;previous.textContent='Keep earlier written reflection';input.append(previous);const preserved=document.createElement('p');preserved.textContent='Earlier reflection (read only): '+old;label.append(preserved);}input.value=old;input.onchange=()=>{noteDraft[key]=input.value;status.textContent='Unsaved choices — choose Save my case note.';};inputs[key]=input;label.append(input);fields.append(label);}actions.before(fields);
  const status=document.createElement('p');status.setAttribute('role','status');status.id='case-note-status';status.textContent='Optional guided reflection. No free-text entry. Earlier written reflections are preserved, and choices do not change your pay.';actions.before(status);
  const save=()=>{const values=Object.fromEntries(Object.entries(inputs).map(([k,v])=>[k,v.value]));const same=JSON.stringify(values)===JSON.stringify(store.state.caseNote);if(!same&&!commit({type:'case-note',fields:values},'Case note saved.')){status.textContent=store.error||'Could not save this note; your draft remains here.';return false;}noteDraft={...values};status.textContent=reviewMode?'Saved for this review visit. Download to keep after reload.':'Case note saved in this browser.';return true;};
  const saveButton=document.createElement('button');saveButton.textContent='Save my case note';saveButton.onclick=save;actions.append(saveButton);
  const download=document.createElement('button');download.textContent='Download my case note';download.onclick=()=>{if(!save())return;const url=URL.createObjectURL(new Blob([caseNoteText(store.state)],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='My-first-gig-case-note.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};actions.append(download);
  const send=document.createElement('button');send.textContent='Save to My work';send.onclick=()=>{if(!save())return;send.disabled=true;status.textContent='Opening My Life. Waiting for its save receipt…';const target=new URL('../economy-lab/',location.href);if(reviewMode)target.searchParams.set('review','1');target.searchParams.set('market-import','1');const receiver=window.open(target.href,'_blank');if(!receiver){send.disabled=false;status.textContent='Allow the My Life window to open, or download your case note.';return;}const token=crypto.randomUUID();let timer;const finish=message=>{clearTimeout(timer);window.removeEventListener('message',receive);send.disabled=false;status.textContent=message;};const receive=e=>{if(e.origin!==target.origin||e.source!==receiver)return;if(e.data?.type==='ce-work-ready')receiver.postMessage({type:'ce-market-work',token,review:reviewMode,body:caseNoteText(store.state),resource:new URL('../Assets/EST%20Preparation/initiative-one-page-summary.png',location.href).href},target.origin);if(e.data?.type==='ce-market-receipt'&&e.data.token===token)finish(e.data.ok?(reviewMode?'Opened in My work for this review only. Download there before closing.':'Saved in My work. Your earlier versions are retained.'):('Not saved to My work: '+e.data.error));};window.addEventListener('message',receive);timer=setTimeout(()=>finish('No save receipt received. Your case note is still here; check My Life or download a copy.'),20000);};actions.append(send);
  const reference=document.createElement('button');reference.textContent='Initiative / reference sheet';reference.onclick=initiativeSheet;actions.append(reference);
 }
 function researchMara(){
  const s=store.state;
  if(!s.accepted)return show('Your first gig','Mara: “Can you help with service today? Learn how we work, keep an eye on the customers, and tell me if something could work better.”',[
   ['Take the shift',()=>{if(commit('accept','Start by exploring the stall: customer, queue and Sam.'))close();else journal();}]
  ],'Agreed practice wages: $20 gross − $2 community tax = $18. Finish the shift for a crew pass to the stage-side celebration. No timer or penalty for asking for help.');
  if(!s.proposal)return show('What could work better?',`Mara: “What have you noticed? Find out why before changing our setup.” Clues: customer ${s.listened?'✓':'—'}, queue ${s.observed?'✓':'—'}, workflow ${s.learned?'✓':'—'}.`,[
   ['Propose: separate ordering and pickup with a visible sign',()=>propose('propose-sign'),!s.listened||!s.observed||!s.learned],
   ['Propose: a greeter separates the two queues',()=>propose('propose-helper'),!s.listened||!s.observed||!s.learned],
   ['A hint, please',()=>show('Three ways to investigate','Ask the waiting customer what they already did. Watch a group of customers in the queue at the observation spot near the entrance. Ask Sam how phone and walk-up orders work. Hints do not reduce badges or pay.')]
  ]);
  if(!s.reviewed)return show('Try your idea, then check it','Mara: “Yes, let’s test that. Keep the ordering counter open and the walkway clear. Come back when you have seen what helps.”',[],s.proposal==='sign'?'Use the setup station to the right of the path. Choose a sign position, then watch the next group of customers.':'Agree the collection role with Sam, then watch the next group of customers at the setup station.');
  if(!s.paid)return show('You made a difference',s.proposal==='sign'?'Mara: “You checked the workflow, spoke up, and tested a sign customers could actually see.”':'Mara: “You checked the workflow and gave Sam a clear role. Customers now know which queue they need.”',[
   ['Finish the shift · receive $18 and crew pass',()=>{if(commit('pay','Paid $18 after $2 community tax. Crew pass earned.'))show('Your first gig — earned','Your Initiative and Problem solving game badges remember what you did. Your crew pass is ready at the front-right corner of the stage.',[['Explore the market',close],['Open my journal',journal]],'$20 gross − $2 community tax = $18 net. The pass is an extra thank-you; your wages are yours to save, spend or give.');else journal();}]
  ]);
  show('Shift complete — enjoy your day','Your wages have already been paid. Take your crew pass to the stage-side spot, or enjoy the free music area.',[['Open my journal',journal]]);
 }
 function propose(type){if(commit(type,'Mara agreed to your proposal. Now set it up in the world.'))close();else journal();}
 function beginObservation(){
  close();watching=.01;observationHold=false;sync();
  announce('Opening queue: watch the labelled phone-order customer.');
 }
 function observe(){
  const s=store.state;
  if(!s.accepted)return show('Watch the queue','Take a shift with Mara first. You can explore freely.');
  if(testing>0)return show('A trial is running','Finish watching this trial before replaying the opening queue.');
  if(s.revision===3&&!s.paid&&!s.tested&&(s.events.some(e=>e.type==='plan')||arrangementReady))return show('Test this arrangement',describePlan(s.plan),[['Start the test',beginTrial],['Replay the opening queue',beginObservation]],'Watch whether your changes improve things, then talk it through with Mara.');
  show(s.observed?'Watch the opening queue again':'Watch a group of customers','Watch the labelled phone-order customer join the ordering queue while food waits at collection. This replays the opening problem, not your latest trial.',[[s.observed?'Watch again':'Watch the queue',beginObservation]]);
 }
 function setup(){
  const s=store.state;if(s.revision===3)return agencySetup();
  if(!s.proposal)return show('Stall setup station','Investigate first, then propose your improvement to Mara. This is where you will put the agreed plan into practice.');
  if(s.solution)return show('The new arrangement is working','Go to the collection customer and check why this worked before finishing with Mara.');
  const choices=s.proposal==='sign'?[
   ['Place the sign on the counter',()=>{if(commit('place-counter','Sign placed on the counter. Test its visibility.'))close();else journal();}],
   ['Place the sign beside the approach path',()=>{if(commit('place-path','Sign placed beside the approach path. Test its visibility.'))close();else journal();}]
  ]:[];
  choices.push(['Try it with the next customers',()=>{testing=0.01;customerProgress=0;close();announce('Trial running. Watch the customers…');},!s.placed||s.tested||testing>0]);
  show('Set up and test',s.tested?'The counter sign was hidden behind the queue. Try another position; there is no cost for revising.':s.proposal==='helper'?'Ask Sam to take the collection-guide role, then return here to test the arrangement.':'Choose where customers will see your sign before joining a queue. Then watch the next customers try your arrangement.',choices);
 }
 function checkResult(){
  const s=store.state;
  show('What made the difference?','Customer: “I found collection without joining the ordering queue this time.”',[
   ['People got the right information before choosing a queue',()=>{if(commit('review','Result checked: Initiative and Problem solving badges earned. Return to Mara.'))show('Your idea worked','You learned the workflow, proposed a change and checked its effect. Mara has your wages and crew pass.',[], 'Game practice only — these badges do not certify portfolio or résumé evidence.');else journal();},s.reviewed],
   ['We made the food faster',()=>show('Look at what changed','The kitchen worked at the same speed. What changed was how customers found their way. Ask the customer again when you are ready.')]
  ]);
 }
 function crew(){const s=store.state;
  if(!s.pass)return show('Stage-side crew spot','Finish the revised shift to earn a crew pass. The free stage break and music are open to everyone.');
  show(s.encore?'Your first-gig memory':'Your crew pass',s.encore?'Your ticket stub is in Stats → My collection and your journal. Come back to this spot whenever you like.':'Mara: “You helped make today work. This spot is for you.” Use your pass for a crew shout-out, the band and a small cheering crowd. Your ticket becomes a keepsake afterwards. Music is optional; you can replay the moment for free.',[
   [s.encore?'Replay crew celebration':'Use my crew pass',()=>{if(s.encore||commit('encore','Crew pass used. Your ticket is in Stats → My collection and your journal.')){celebrationTime=18;close();announce('The band dedicates this moment to the Juniper crew. Thank you for your work!');}else journal();}],
   [music?'Stop rehearsal tune':'Play rehearsal tune',()=>{if(music)stopMusic();else startMusic();crew();}]
  ],'A short prototype celebration with an original rehearsal tune. No extra payment or badge. Sound is optional.');
 }
 function solve(type){if(commit(type,type==='helper'?'Sam is guiding the queue. Watch customers reach collection.':'Customers can read the new sign. Watch them find collection.'))close();else journal();}
 function customer(){
  const s=store.state;
  if(s.revision===3&&s.trials.length)return trialResults();
  if(s.revision===2&&s.solution)return checkResult();
  if(!s.accepted)show('“Is this the pickup queue?”','The customer glances between their phone and the stall. Mara, at Juniper Kitchen, could use a hand.');
  else if(s.solution)show('“Got it—collection is over there.”','Your change gives the customer a clear next step.');
  else show('“I ordered on my phone…”','“Do I queue again, or is there somewhere else to collect?”',[
   ['Ask: “What information would help you?”',()=>{commit('listen','You checked what the customer needed.');show('The customer’s clue','“I have already ordered and paid on my phone. I joined this queue because I couldn’t tell where else to go.”',[],store.error||(s.revision===1?'Communication game badge: you asked and listened before responding.':'Clue recorded: the customer needs collection, not another order.'));}]
  ]);
 }
 function sam(){
  const s=store.state;
  if(s.revision===3&&s.accepted)return show('Sam / how we work','Phone orders are already paid and need collection. Walk-up customers need the ordering counter. I usually pack bags with Mara. If I greet or hand out orders instead, Mara packs alone. What would you like to find out?',[[s.learned?'Guide recorded':'Keep this in my research record',()=>{if(commit('learn','Sam’s workflow explanation recorded.'))close();else journal();},s.learned],['Open my case note',caseNote]],'This resource is optional. You can try an arrangement first and return with questions.');
  if(s.revision===2&&s.accepted)return show('Learn the stall workflow','Sam: “Walk-up customers order and pay at the counter. Phone customers already paid: their bags wait at the right-hand collection point. We must keep the counter and walkway clear.”',[
   [s.learned?'Workflow recorded':'Record the workflow clue',()=>{if(commit('learn','Workflow learned. Compare it with the customer and queue clues.'))close();else journal();},s.learned],
   ['Agree role: Sam guides phone customers to collection',()=>{if(commit('assign-helper','Sam is in position. Try it with the next customers at the setup station.'))close();else journal();},s.proposal!=='helper'||Boolean(s.placed)]
  ],'Ask questions and work with others. You do not have to solve everything alone.');
  if(!s.accepted)show('Sam / market crew','“Mara’s trying a new preorder system today. She’s looking for someone to help at the stall.”');
  else if(!s.solution)show('“We could split the job.”','“I can stand by the path and guide people to pickup. You check with Mara when the queue is moving.”',[
   ['Agree: Sam guides; I check the result',()=>solve('helper')]
  ],'Asking for help is a valid approach. You do not have to solve everything alone.');
  else show('“We’ve got a flow now.”','“Good work. Different approaches can get people where they need to go.”');
 }
 function shop(){const s=store.state;show('Little Finds / choose a keepsake',`Market wallet ${money(s.wallet)}. Optional small keepsakes, collected in Stats → My collection. Keep your earnings if you prefer.`,[
 ...Object.entries(MARKET_SHOP).map(([id,item])=>{const owned=s.purchases.includes(id)||(id==='lantern'&&s.keepsake);return [owned?item.name+' · owned':'Buy '+item.name+' · '+money(item.price),()=>{commit({type:'purchase',item:id},item.name+' added to My collection in Stats.');shop();},owned||s.wallet<item.price];}),
 ['Keep my money',close]
 ],'Practice prices. Each item can be bought once. Nothing here improves skill scores, wellbeing or job pay. Savings and giving are in Stats → Market money.');const display=document.createElement('div');display.className='little-finds-catalog';for(const [id,item]of Object.entries(MARKET_SHOP)){const card=document.createElement('p');card.textContent=({plane:'✈',compass:'◈',duck:'◉',plant:'♧',lantern:'◇'}[id])+' '+item.name+' · '+money(item.price)+' — '+item.description;display.append(card);}dialog.querySelector('.market-choices').before(display);}
 function stage(){const s=store.state;show('The Late Shift / sound check',s.rested?'A small pause, and somewhere to belong. You can stay as long as you like.':'Sam waves from across the market. You have time to stop, listen and take a breath.',[
  [s.rested?'Break remembered':'Take a free break',()=>{commit('rest','A good pause. No money or skill points needed.');stage();},s.rested],
  [music?'Stop rehearsal tune':'Play rehearsal tune',()=>{if(music)stopMusic();else startMusic();stage();}]
 ],'A temporary original synth loop stands in for the band. Sound is optional. Nothing gets worse while you are away.');}
 function stopMusic(){if(music){clearInterval(music.timer);music.ctx.close();music=null;}}
 function startMusic(){try{const ctx=new (window.AudioContext||window.webkitAudioContext)(),notes=[220,261.63,329.63,293.66,261.63,196,220,0];let n=0;const play=()=>{const f=notes[n++%notes.length];if(!f)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,ctx.currentTime);g.gain.linearRampToValueAtTime(.035,ctx.currentTime+.025);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.45);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.5);};ctx.resume();play();music={ctx,timer:setInterval(play,500)};}catch{announce('Sound is unavailable. The market remains playable.');}}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMusic();});
 const restartPractice=()=>show('Start a fresh market visit?','This clears only this market practice: shift, money, badges, lantern and crew pass. Your character, outfit, portfolio and the original shop are untouched.',[['Yes, restart this practice',()=>{if(store.reset()){customerProgress=0;watching=0;testing=0;noteDraft=null;sync();announce('Fresh practice started. Meet Mara at Juniper Kitchen.');close();}else journal();}]]);
 let openingChapters=null,chapterModule=null,chapterAttempts=0,chapterPlayback=null;
 let district=null,districtModule=null,districtAttempts=0,districtVisit=0,activeDistrict=false,receptionSeen=false,noraStarted=false,districtWeek=2,lastPlan=null,lastApplication=null;
 const districtRoute=document.createElement('button');districtRoute.id='market-district-route';districtRoute.textContent='Office / places';districtRoute.hidden=true;hud.append(districtRoute);
 const districtHelp=document.createElement('button');districtHelp.id='market-district-help';districtHelp.textContent='My next task';districtHelp.hidden=true;hud.append(districtHelp);districtHelp.onclick=()=>!receptionSeen?reception():!noraStarted&&districtWeek===2?goToNora():courtyardWelcome(districtWeek);
 function goToNora(){noraStarted=true;districtWeek=2;close();onTravel({x:-29,y:0,z:-2.8,yaw:.45});refreshOfficeGuidance();courtyardWelcome(2);}
 function reception(){receptionSeen=true;show('Reception / welcome','“Looking for your next paid gig? Start here. Nora is checking the headlines before we put opportunities on the board. Help her finish a supported review and earn a $5 research fee, then choose an opportunity to investigate. Her research office is at the back-left.”',[
  ['Meet Nora at her desk',goToNora],['I’ll walk there',()=>{close();refreshOfficeGuidance();}]
 ],'You can explore other offices later through Office / places.');}
 function refreshOfficeGuidance(){
  const summary=hud.querySelector('#market-card summary').firstChild,title=activeDistrict?'Markets Administration ':'Your first gig ';if(summary.textContent!==title)summary.textContent=title;
  for(const id of ['market-balance','market-status'])hud.querySelector('#'+id).hidden=activeDistrict;
  districtRoute.hidden=districtHelp.hidden=!activeDistrict;
  if(activeDistrict){const objective=courtyardObjective(),node=hud.querySelector('#market-objective');if(node.textContent!==objective)node.textContent=objective;hud.querySelector('#market-test').hidden=true;hud.querySelector('#market-replay').hidden=true;}
 }
 function courtyardObjective(){
  const progress=openingChapters?.snapshot();
  if(!receptionSeen)return 'Start at Reception. The receptionist will introduce your first task.';
  if(districtWeek===3)return progress?.tried.length?'Check the work-yard result, then revise a bottleneck or try another pressure.':'Help Dev: share six work blocks across the three stations, then test the plan.';
  if(districtWeek===4)return progress?.applicationReady?'Talk to the opportunities adviser about Alex’s examples.':'Read an advertised role at the opportunities desk, then choose relevant examples for Alex.';
  if(!noraStarted)return 'Meet Nora in the back-left research office. Use My next task for a shortcut.';
  if(!progress?.signal.posted&&!progress?.seenIds.includes('report'))return 'Help Nora check six headlines: choose My next task → Signal or Spin. No timer; investigate the sources afterwards.';
  return progress?.path?'Next: help Dev test a work plan in the service yard.':progress?.sourceIds.length>=2?'Review your two-source briefing with Nora.':progress?.seenIds.includes('report')?'Compare the regional bulletin with Mara’s shared record, available here.':'Help Nora: open the regional bulletin at her desk. What does it actually tell us?';
 }
 function courtyardWelcome(week=2){
  if(week===2){
   if(!receptionSeen){reception();return;}
   noraStarted=true;districtWeek=2;refreshOfficeGuidance();
   const progress=openingChapters?.snapshot(),seen=progress?.seenIds||[],briefingReady=(progress?.sourceIds.length||0)>=2;
   show('Nora / help me check a claim',briefingReady?'“You’ve chosen two sources. Let’s check what they support together before we choose a direction.”':seen.includes('report')?'“Now compare that bulletin with Mara’s record from Juniper Kitchen. I have her copy here. Do both sources tell us the same thing?”':'“I’m preparing our opportunities board. Some headlines promise jobs; others say they’re disappearing. Help me check six claims and review the explanations. The assignment pays $5 once, including time spent correcting mistakes. Then we’ll look at a real lead in our fictional market.”',[
    ['Play Signal or Spin? with Nora',()=>openChapters(2,'signal')],
    [briefingReady?'Review my two-source briefing':seen.includes('report')?'Compare Mara’s shared record':'Open the regional bulletin',()=>openChapters(2,briefingReady?'briefing':seen.includes('report')?'mara':'report')],
    ['How do I check a source?',()=>openChapters(2,undefined,'opportunities')]
   ],'Choose what the evidence supports. You can revise your view.');return;
  }
  districtWeek=week;announce('Nora checks the evidence; Dev runs the work yard; the opportunities office connects experience to an opportunity.');hud.querySelector('#market-objective').textContent=courtyardObjective();
  const intro=week===3?['Dev needs a hand','“Hey, could you help me get the market ready? Demand is changing and we only have six blocks of work time. Let’s work out where they’ll make a difference.”\n\nUse the three work stations to share the blocks, then test your plan at the work bench. The parcels show how many groups your plan can support. You can revise and try again.','Plan the work with Dev']:week===4?['An opportunity for Alex','The opportunities adviser has advertised a role. Help Alex, our fictional applicant, show how their experience fits.\n\nRead the role first, choose relevant examples and check how and when to apply. A ready application earns an invitation to explain the examples in a practice conversation.','Read the advertised roles']:['Nora / hey, we could use your help','“Welcome! The market team is hearing that machines will take every job. That’s a big claim. Could you help me find out what the evidence actually says before we choose our next step?”\n\nStart at the regional evidence desk in Nora’s research office. Mara, the food-stall owner you met at Juniper Kitchen, has already shared her roster and order record with me. You can open it here—no need to return to the market. Compare it with the regional evidence and bring me a two-source briefing. We’ll use it to weigh up opportunities—then you can help Dev get the work yard ready.','Start with Nora / check the evidence'];
  show(intro[0],intro[1],[[intro[2],()=>openChapters(week)],...(week===2?[["Open Mara’s shared record here",()=>openChapters(2,'mara')]]:[]),['Show my next step',()=>{close();announce(courtyardObjective());}],['Learn the idea first',()=>openChapters(week,undefined,week===2?'opportunities':week===3?'adaptation':'applications')],['Explore on my own',close]],'Walk with the movement controls; press E near a person or desk, or tap its prompt. My next task repeats this help. Places offers step-free shortcuts. Practice can be revised; it does not award a grade.');
 }
 districtRoute.onclick=()=>show('Markets Administration','Choose a place to walk towards, or use a step-free shortcut. You can also explore with the movement controls. These chapters remain optional.',[
 ['Research office / Nora',()=>visitDistrict(2)],['Operations / Dev’s service yard',()=>visitDistrict(3)],['Opportunities office',()=>visitDistrict(4)],['Return to Sunday Market',returnMarket]
 ]);
 function returnMarket(){districtVisit++;activeDistrict=false;districtRoute.hidden=true;districtHelp.hidden=true;close();onTravel({x:-8.7,y:0,z:4,yaw:Math.PI/2});sync();}
 let districtPreparing=null,districtRetryAt=0,lastOfficePosition=null;
 function prepareDistrict(){
  if(!marketComplete(store.state))return Promise.resolve();
  if(district)return Promise.resolve();
  if(districtPreparing)return districtPreparing;
  districtPreparing=(async()=>{
   districtModule ||= (districtAttempts++?import('./opening-district.js?v=not-quite-art-20260929&retry='+districtAttempts):import('./opening-district.js?v=not-quite-art-20260929')).catch(e=>{districtModule=null;throw e;});
   const {createOpeningDistrict}=await districtModule;
   if(!district){district=createOpeningDistrict({scene,obstacles,npc,palette:campusPalette,onInspect:id=>openChapters(2,id),onAllocate:()=>openChapters(3),onApply:()=>openChapters(4),onWork:index=>openingChapters?openingChapters.workStation(index):openChapters(3),onRun:()=>openingChapters?openingChapters.runShift():openChapters(3),onTalk:()=>openingChapters?openingChapters.talk():openChapters(4),onReturn:returnMarket,onWelcome:()=>{noraStarted=true;courtyardWelcome(2);},onReception:reception});if(openingChapters?.snapshot().signal.posted)district.postBulletin();if(!lastPlan&&openingChapters)lastPlan=openingChapters.plan();if(lastPlan)district.setPlan(...lastPlan);if(lastApplication!==null)district.setApplication(lastApplication);if(!gardener)gardener=npc(-9,5.3,'#b89d76','kenji',Math.PI/2);cast.start();}

  })().finally(()=>districtPreparing=null);return districtPreparing;
 }
 async function visitDistrict(week=2){
  if(!marketComplete(store.state))return mara();
  const visit=++districtVisit;
  show('Entering the administration centre…','The new places load only when you visit. Close this panel to stay here.');const title=dialog.querySelector('h2');
  try{
   await prepareDistrict();
   if(visit!==districtVisit||!dialog.open||dialog.querySelector('h2')!==title)return;
   activeDistrict=true;districtWeek=week;districtRoute.hidden=false;districtHelp.hidden=false;hud.querySelector('#market-card summary').firstChild.textContent='Markets Administration ';close();onTravel(week===3?{x:-20,y:0,z:.5,yaw:.45}:week===4?{x:-28,y:0,z:9.5,yaw:.65}:district.spawn);
   hud.querySelector('#market-objective').textContent=week===2?'Investigate: check a source, then compare it with Mara’s Juniper Kitchen roster and order record.':week===3?'Adapt: arrange work at the three stations, then test at the work bench.':'Apply: read the roles and meet the supervisor at the opportunity pavilion.';
   refreshOfficeGuidance();if(!receptionSeen||week===2)reception();else courtyardWelcome(week);
  }catch{if(visit===districtVisit&&dialog.open&&dialog.querySelector('h2')===title)show('Administration could not load','The market is still available. Retry or use the chapter panels.',[['Retry administration',()=>visitDistrict(week)],['Open chapters',()=>openChapters(week)]]);}
 }
 const stopPreview=document.createElement('button');stopPreview.id='market-preview-stop';stopPreview.textContent='End rehearsal';stopPreview.hidden=true;hud.append(stopPreview);
 const endPreview=()=>{chapterPlayback=null;stopPreview.hidden=true;sync();};stopPreview.onclick=endPreview;
 async function openChapters(week,sourceId,resourceId){
  if(!marketComplete(store.state)&&resourceId!=='initiative')return initiativeSheet();
  if(activeDistrict&&[2,3,4].includes(week))districtWeek=week;
  const route=()=>sourceId==='signal'?openingChapters.signal():resourceId==='library'?openingChapters.library():resourceId?openingChapters.resource(resourceId):sourceId==='briefing'?openingChapters.briefing():sourceId?openingChapters.inspect(sourceId):openingChapters.open(week);
  if(openingChapters){route();return;}
  show('Opening your next chapters…','The market stays available. You can close this panel while the next experience loads.');
  const loadingTitle=dialog.querySelector('h2');
  try{
   chapterModule ||= (chapterAttempts++ ? import('./opening-chapters.js?v=short-arrival-20260929&retry='+chapterAttempts) : import('./opening-chapters.js?v=short-arrival-20260929')).catch(error=>{chapterModule=null;throw error;});
   const {createOpeningChapters}=await chapterModule;
   openingChapters ||= createOpeningChapters({show,dialog,close,laterAvailable:()=>marketComplete(store.state),onResearchPay:()=>{if(store.state.researchPaid)return 'Your $5 research fee is already in this market practice; replay does not pay again.';if(!store.state.researchReviewed&&!commit('research-review','Research review complete.'))return store.error||'Review could not be saved. Retry claiming your fee.';return commit('research-fee','Research fee +$5.00 paid into your market wallet.')?'Research fee +$5.00 paid. Market wallet: '+money(store.state.wallet)+'.':store.error||'Payment not completed. Retry claiming your fee.';},onExplore:visitDistrict,onPlan:(...args)=>{lastPlan=args;district?.setPlan(...args);},onApplication:value=>{lastApplication=value;district?.setApplication(value);},onPreview:served=>{if(activeDistrict)returnMarket();else close();chapterPlayback={time:0,served};stopPreview.hidden=false;announce('Fictional rehearsal: watch which groups can be supported. End it at any time.');},onWorldEvent:({title,detail})=>{
    if(title==='BULLETIN CHECKED')district?.postBulletin();
    announce(title+' · '+detail);
   }});
   if(district&&!lastPlan){lastPlan=openingChapters.plan();district.setPlan(...lastPlan);}
   if(dialog.open&&dialog.querySelector('h2')===loadingTitle){route();}
  }catch{if(dialog.open&&dialog.querySelector('h2')===loadingTitle)show('Chapters could not load','Your market shift and saved progress are safe. Try again when the connection is ready.',[['Retry chapters',()=>openChapters(week,sourceId,resourceId)]]);}
 }
 function changingWorld(){
  show('Work is changing / notice one connection','Look at the phone orders, ready-to-collect bags and two kinds of queue. A change outside the stall has changed the work inside it. What would you like to investigate?',[
   ['Phone ordering → work at the stall',()=>show('A new way to order','Customers can order and pay before arriving. Mara and Sam now need to coordinate two streams: taking walk-up orders and packing phone orders for collection. Faster ordering can still create a collection bottleneck.',[
    ['Ask Sam about the workflow',sam],['Watch the opening queue',beginObservation],...(marketComplete(store.state)?[['What might change next?',nextWeek]]:[])
   ],'Change → possible impact on work. Technology can change tasks; it does not automatically remove the whole job.')],
   ['Try a what-if: fewer takeaway bags',()=>show('What if customers brought reusable bags?','Imagine more customers want less packaging. How might packing, hygiene checks and the collection space need to change? Look at the bags and collection counter, then discuss one possible effect with your teacher or a partner.',[
    ['Back to the clues',changingWorld],...(marketComplete(store.state)?[['What might change next?',nextWeek]]:[])
   ],'A fictional sustainability question, not a new simulated outcome. No answer is collected or scored.')],
   ...(marketComplete(store.state)?[['What might change next?',nextWeek]]:[])
  ],'Explore now or come back through Journal & map. This is a first encounter, not a megatrends assessment. Your pay is unchanged.');
 }
 function nextWeek(){
  if(!marketComplete(store.state))return mara();
  show('Next / follow the change','This week: I arrived. I contributed. I noticed work changing.\n\nNext, investigate a changing job: what is changing, who might be affected, and which information would help you check your first impression? Technology is one influence; climate, population, economies and customer habits can matter too.',[
   ['Continue / Weeks 2–4',()=>openChapters(2)],['Return to the clues',changingWorld],['Keep exploring',close]
  ],'Discuss one change → possible impact on work. There is no required written submission, extra badge or completion score here.');
 }
 function journal(){
  const s=store.state,badges=s.badges.map(b=>BADGES[b].join(': ')).join(' ');
  show('Your market journal',`${s.paid?'First shift complete.':s.accepted?'Shift in progress.':'A first opportunity is waiting.'} Wallet ${money(s.wallet)} · Savings ${money(s.savings)}. ${s.rested?'You took a free break.':''} ${s.encore?'Ticket stub: MY FIRST GIG — Juniper Kitchen crew.':s.pass?'Crew pass: ready to use beside the stage.':''} ${badges||'Game badges will describe the skills you practise.'}`,[
   ['Replay Mara’s welcome',maraIntro],
   ['Money & keepsakes in Stats',()=>{close();document.getElementById('exploration-stats-toggle')?.click();}],
   [s.paid?'Explore the administration centre':'Markets Administration · after the first gig',()=>s.paid?visitDistrict(2):show('Your next assignment','Finish your agreed first gig with Mara, then visit Reception through the west entrance. Nora checks evidence, Dev tests work plans, and the opportunities team helps Alex apply.',[['Keep exploring',close]])],
   ...(s.paid?[["Work is changing / explore the clues",changingWorld]]:[]),
   ['Where do I go?',()=>show('Around the market','Mara: Juniper Kitchen, ahead.\nCustomer and queue view: left of the entrance path.\nSam: Juniper crew. Work bench: right of the stall.\nStage: right of Juniper. Crew pass: front-right corner.\nLittle Finds: left. Savings and keepsakes: Stats.\nFree break: bench in front of the stage.',[], 'Use WASD / arrow keys or the movement controls. Drag to look. Walk close, then press E or tap the interaction button. All activities are untimed.')],
   ['My first gig / case note',caseNote,s.revision!==3],
   ['Optional thinking guide',thinkingGuide],
   ['Initiative / reference sheet',initiativeSheet],
   ['Restart this practice…',restartPractice]
  ],store.error||(reviewMode?'Fresh review: progress lasts until reload and never changes your saved market. Game badges are practice only.':'One anonymous practice save in this browser, shared by its local characters. Game badges are not portfolio evidence or résumé claims. No student login.'));
 }
 hud.querySelector('#market-replay').onclick=restartPractice;hud.querySelector('#market-journal').onclick=journal;hud.querySelector('#market-exit').onclick=onExit;
 function sync(){
  const s=store.state;hud.querySelector('#market-objective').textContent=!s.accepted?'Start: meet Mara at Juniper Kitchen.':s.revision===1?'Earlier practice saved. Continue it, or start a fresh revised shift.':!s.proposal?`Investigate: customer ${s.listened?'✓':'—'} · queue ${s.observed?'✓':'—'} · Sam’s workflow ${s.learned?'✓':'—'}. Then propose an idea to Mara.`:!s.placed?(s.proposal==='helper'?'Agree Sam’s role, then visit the setup station.':'Place your sign at the Juniper work bench beside the stall.'):!s.solution?(s.tested?'Trial: customers missed the counter sign. Revise at the setup station.':'Try it with the next customers at the setup station.'):!s.reviewed?'Check the result: speak to the customer at collection.':!s.paid?'Return to Mara for your wages and crew pass.':!s.encore?'Shift complete! Use your crew pass at the front-right corner of the stage.':'First gig complete. Ticket saved in your journal. Enjoy the market.';
  if(s.revision===3)hud.querySelector('#market-objective').textContent=!s.accepted?'Start: meet Mara at Juniper Kitchen.':s.paid?'Shift complete. Your case note and crew pass are in the journal.':testing>0?'The next customers are arriving. Watch what happens.':!s.tested?'Try an idea at the work bench, watch the queue, then share what you found with Mara.':'Group finished: check the results, then talk them through with Mara. You can also revise at the test bench.';
  hud.querySelector('#market-test').hidden=s.revision!==3||!s.accepted||s.paid||s.tested||s.trials.length>=12||testing>0||watching>0;
  hud.querySelector('#market-replay').hidden=!s.paid;if(reviewMode)hud.querySelector('.market-kicker').textContent='FRESH REVIEW / NOT SAVED';
  hud.querySelector('#market-balance').textContent=`Wallet ${money(s.wallet)} · Saved ${money(s.savings)} · ${s.badges.length} game badges`;
  sign.visible=signText.visible=s.placed==='place-counter'||s.placed==='place-path'||s.attempted||s.solution==='sign';const good=s.placed==='place-path'||s.solution==='sign';sign.position.set(good?2.4:0,good?0:1,good?-1.8:-5);
  crewRibbon.visible=s.pass;ticket.visible=s.encore;plant.visible=s.purchases.includes("plant");Object.entries(trinkets).forEach(([id,prop])=>prop.visible=s.purchases.includes(id));thanks.visible=s.encore;audience.forEach(p=>p.visible=s.encore);celebrationLights.forEach(m=>m.visible=s.encore);stageGlow.visible=s.rested||s.encore;customerLabel.visible=!s.solution;keepsake.visible=s.keepsake;lanterns[0].visible=s.tax>0;lanterns[1].visible=s.donated>0;
  helper.position.set(s.placed==='assign-helper'||s.solution==='helper'?1.5:1.1,0,s.placed==='assign-helper'||s.solution==='helper'?-2.3:JUNIPER.staffZ);
  trialBags.forEach((m,i)=>m.visible=s.revision===3&&i<(s.trials.at(-1)?.outcome.packed??6));extraCustomers.forEach(m=>m.visible=s.revision===3);trialBoard.visible=s.revision===3&&s.accepted;
  if(s.revision===3){
   const p=s.plan,approach=p.position==='approach';sign.visible=signText.visible=p.sign!=='none';sign.position.set(approach?2.4:0,approach?0:1,approach?-1.8:-5);changeLabel(signText,PLAN_OPTIONS.sign[p.sign]);
   collection.position.x=p.collection==='front'?0:2.8;collection.position.z=p.collection==='front'?-3.2:-4.4;
   helper.position.set(p.helper==='greet'?1.5:p.helper==='collect'?collection.position.x:1.1,0,p.helper==='greet'?-1.6:p.helper==='collect'?collection.position.z-.9:JUNIPER.staffZ);
   changeLabel(trialBoard,'WORK BENCH');
  }
  collectionObstacle.x=collection.position.x;collectionObstacle.z=collection.position.z;const samRole=s.revision===3?s.plan.helper:(s.solution==='helper'?'greet':'packing');changeLabel(helperLabel,'SAM · '+{packing:'PACKING',greet:'GREETING',collect:'COLLECTION'}[samRole]);helperLabel.position.set(helper.position.x,2.05,helper.position.z+(samRole==='packing'?2:samRole==='collect'?1.5:.3));
  if(previousSolution!==s.solution){customerProgress=0;previousSolution=s.solution;}
  refreshOfficeGuidance();if(store.error)announce(store.error);
 }
 const queueLabel=label('WATCH CUSTOMER FLOW',-3,1.7,4,2.1);
 let gardener=null;
 // Framed, open doorway marks the office entrance without blocking the route.
 const beforeEntrance=new Set(scene.children);
 for(const z of [2.4,5.6]){box(.35,3.3,.28,-12,1.65,z,'#e4e3dc');obstacles.push({x:-12,z,w:.35,d:.28});}
 box(.45,.5,3.5,-12,3.1,4,'#e4e3dc');
 function entrancePlaque(text,y,width,height){const sprite=label(text,0,0,0,width);scene.remove(sprite);labels.splice(labels.findIndex(item=>item.sprite===sprite),1);const plaque=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshStandardMaterial({map:sprite.material.map,roughness:.9,side:THREE.DoubleSide}));plaque.rotation.y=Math.PI/2;plaque.position.set(-11.74,y,4);scene.add(plaque);}
 entrancePlaque('MARKETS ADMINISTRATION',3.12,3.35,.42);
 entrancePlaque('RECEPTION',2.73,1.5,.25);
 const entranceExterior=scene.children.filter(child=>!beforeEntrance.has(child));
 const adminSpots=[{x:-9,z:5.3,radius:1.4,label:'Talk to Kenji / administration entrance',action:()=>show('Kenji / welcome','“Hi, I’m Kenji. I look after the community garden. Looking for the market team’s offices? This is Markets Administration. Reception will help you find Nora, Dev or the opportunities team.”',[['Take me to reception',()=>visitDistrict(2)],['Keep exploring',close]])},{x:-11.7,z:4,radius:1.2,label:'Enter the administration centre',action:()=>visitDistrict(2)}];
 const spots=[{x:-3,z:4,label:'Observe the queue',action:observe},{x:4.2,z:-1.8,label:'Set up & test',action:setup},{x:9,z:-1.8,label:'Use crew pass',action:crew},{x:0,z:-3.6,label:'Talk to Mara',action:mara},{x:-2,z:-.2,label:'Talk to the waiting customer',action:customer},{x:1.5,z:-3.3,label:'Ask Sam',action:sam},{x:-6,z:1.2,label:'Browse Little Finds',action:shop},{x:6.5,z:2.4,label:'Take a stage break',action:stage}];
 sync();if(store.state.solution)customerProgress=1;
 return {
  get observing(){return watching>0||observationHold||testing>0||Boolean(chapterPlayback);},
  scene,spawn:new THREE.Vector3(0,0,15),isOpen:()=>dialog.open,
  setVisible(value){exitArmed=false;visible=value;hud.hidden=!value;document.getElementById('experience').classList.toggle('in-market',value);if(!value){districtVisit++;activeDistrict=false;districtRoute.hidden=districtHelp.hidden=true;endPreview();clearTimeout(introTimer);watching=0;observationHold=false;testing=0;close();stopMusic();}else{cast.start();store.reload();sync();announce(store.error||lastAnnounced||(store.state.paid?'Resuming a completed practice shift.':'Walk close to Mara, then press E or tap Talk to Mara.'));}},
  interaction(p){if(dialog.open||watching>0||testing>0||chapterPlayback)return null;const current=store.state;const candidates=inAdministration(p.x,activeDistrict)?(district?.spots||[]):[...spots,...(marketComplete(current)?adminSpots:[])];return nearestInteraction(candidates.map(s=>s.action===customer&&current.revision!==3&&current.solution?{...s,x:2.8,z:-2}:s.action===sam&&current.revision===3?{...s,x:current.plan.helper==='greet'?1.5:current.plan.helper==='collect'?collection.position.x:1.5,z:current.plan.helper==='greet'?-1.6:current.plan.helper==='collect'?collection.position.z+.9:-3.3}:s.action===sam&&(current.placed==='assign-helper'||current.solution==='helper')?{...s,x:1.5,z:-2.3}:s),p);},
  move(p,delta){if(watching>0||testing>0||chapterPlayback)return {x:p.x,y:p.y,z:p.z};const next={x:p.x,y:0,z:p.z},valid=(x,z)=>((x>-11.4&&x<11.4&&z>-12.7&&z<18)||(marketComplete(store.state)&&district&&x>-34&&x<-12.8&&z>-12.5&&z<12.5)||(marketComplete(store.state)&&district&&x>=-12.8&&x<=-11.4&&z>2.7&&z<5.3))&&!obstacles.some(o=>o.enabled!==false&&Math.abs(x-o.x)<o.w/2+.3&&Math.abs(z-o.z)<o.d/2+.3);if(valid(p.x+delta.x,p.z))next.x+=delta.x;if(valid(next.x,p.z+delta.z))next.z+=delta.z;return next;},
  update(dt,t,camera,playerPosition){lastOfficePosition=playerPosition?.x??null;if(!visible)return;
   if(marketComplete(store.state)&&playerPosition&&playerPosition.x<-5&&!district&&!districtPreparing&&performance.now()>districtRetryAt){districtRetryAt=performance.now()+10000;prepareDistrict().catch(()=>announce('Administration is still loading. Use Enter to retry.'));}

   if(playerPosition&&district){const inside=inAdministration(playerPosition.x,activeDistrict);if(inside!==activeDistrict){activeDistrict=inside;if(!inside){sync();}else {refreshOfficeGuidance();if(!receptionSeen)reception();}}if(inside){if(!dialog.open&&playerPosition.z>4.4&&playerPosition.x<-23)districtWeek=4;else if(!dialog.open&&playerPosition.z<-3&&playerPosition.x<-23)districtWeek=2;else if(!dialog.open&&playerPosition.x>-23&&playerPosition.z<1)districtWeek=3;refreshOfficeGuidance();}}
   entranceExterior.forEach(part=>part.visible=marketComplete(store.state)&&!activeDistrict);if(gardener)gardener.visible=marketComplete(store.state)&&!activeDistrict;
if(playerPosition){if(playerPosition.z<10.4)exitArmed=true;if(exitArmed&&!dialog.open&&!watching&&!testing&&Math.abs(playerPosition.x)<4&&playerPosition.z>11.4){exitArmed=false;onExit();return;}}const focused=watching>0||observationHold||testing>0;for(const {sprite,width}of labels){const s=store.state;const isMara=sprite===maraLabel;const nearby=camera.position.distanceTo(sprite.position)<7;const relevant=sprite===customerLabel||sprite===helperLabel||sprite===queueLabel?s.accepted:sprite===crewRibbon?s.pass:sprite===stageBreakLabel?s.rested||s.paid:s.paid; sprite.material.visible=(!focused||observationLabels.includes(sprite))&&(isMara||observationLabels.includes(sprite)||relevant||nearby); const factor=Math.min(1,camera.position.distanceTo(sprite.position)/12);sprite.scale.set(width*factor,width*factor/4,1);}const s=store.state;collectionLabel.visible=s.accepted||camera.position.distanceTo(collection.position)<7;
   if(!dialog.open&&watching>0){
    watching+=dt;
    hud.querySelector('#market-objective').textContent=watching<3?'Opening queue: phone-order customers arrive — they have already paid.':watching<6?'They join the ordering queue instead of going to collection.':'Their food is ready at collection, but they are still waiting in the queue.';
    if(watching>=9){watching=0;observationHold=true;
     const recorded=s.observed||s.paid||commit('observe','Opening queue observed.');
     if(recorded)show('What you observed','Phone customers waited in the ordering queue while their bags sat at collection. From behind the queue, the counter is hard to see.',[['Watch again',beginObservation]]);
    }
   }
   if(!dialog.open&&testing>0){testing+=dt;customerProgress=Math.min(1,testing/(s.revision===3?7:4));if(s.revision===3)hud.querySelector('#market-objective').textContent=testing<3?'Test group: four phone customers and two walk-up customers are arriving.':testing<6?'Watch who reaches collection and who joins the ordering queue.':'The group is finishing. Check customer access and how many orders are ready.';if(testing>=(s.revision===3?9:5)){testing=0;if(s.revision===3){observationHold=false;if(commit('run-trial','This group has finished. What do you notice in the results?'))trialResults();}else if(commit('test',s.placed==='place-counter'?'Customers still cannot see the sign. Revise and try again.':'Customers found collection. Ask them what helped.'))show('Trial result',store.state.solution?'The customers reached collection without joining the ordering queue. Check with the customer to review the result.':'The sign was hidden behind the queue. Customers still joined ordering. Change the position at the setup station and try again — no pay lost.');}}
   if(s.solution||(s.revision===3&&s.trials.length))customerProgress=Math.min(1,customerProgress+dt*.28);customers.forEach((g,i)=>{const start=[[-2,-1],[-3,1],[-2,2.5]][i];const progress=(s.solution||(testing>0&&s.placed!=='place-counter'))?Math.max(0,Math.min(1,customerProgress*1.4-i*.18)):0;g.position.x=THREE.MathUtils.lerp(start[0],2.8,progress);g.position.z=THREE.MathUtils.lerp(start[1],-3.3+i*.75,progress)+(watching>0?Math.sin(watching*.8+i)*.35:0);});if(s.revision===3){const outcome=testing>0?evaluatePlan(s.plan):(s.tested?s.trials.at(-1)?.outcome:null);const moving=testing>0||Boolean(outcome);[...customers,...extraCustomers].forEach((g,i)=>{
    const start={x:i<4?-2-(i%2)*.9:-.6,z:1+(i<4?Math.floor(i/2):i-4)*1.3};const reached=outcome&&(i<4?i<outcome.pickup:i-4<outcome.ordering);const dest=reached?(i<4?{x:s.plan.collection==='front'?.4:3.05,z:(s.plan.collection==='front'?-2.6:-3.1)+i*.8}:{x:-1.25,z:(s.plan.collection==='front'?-2.5:-3.5)+(i-4)*.9}):{x:-2-(i%2)*.9,z:-.4+Math.floor(i/2)*1.05};
    const progress=moving?Math.min(1,Math.max(0,customerProgress*1.4-i*.08)):0;g.position.set(THREE.MathUtils.lerp(start.x,dest.x,progress),0,THREE.MathUtils.lerp(start.z,dest.z,progress));
   });}
   // Observation owns these transforms after the revision-specific trial loop.
   // Otherwise revision 3 immediately overwrites the movement with idle positions.
   const observing=watching>0||observationHold;
   observationLabels.forEach(l=>l.visible=observing||testing>0);
   if(observing){
    const elapsed=observationHold?9:watching;
    const queue=[...customers,...extraCustomers];
    queue.forEach((g,i)=>{
     const progress=THREE.MathUtils.clamp((elapsed-i*.45)/4.5,0,1);
     const start={x:i%2?-3.5:-1.2,z:3.8+Math.floor(i/2)*.8};
     const end={x:-1.45-(i%2)*.85,z:-2.2+Math.floor(i/2)*1.25};
     g.position.set(THREE.MathUtils.lerp(start.x,end.x,progress),0,THREE.MathUtils.lerp(start.z,end.z,progress));
    });
    observationLabels[0].position.set(customers[0].position.x-.55,3.05,customers[0].position.z);
    observationLabels[1].position.set(extraCustomers[1].position.x+.55,2.05,extraCustomers[1].position.z);
    observationLabels[2].position.set(collection.position.x,1.95,collection.position.z);
   }
   if(testing>0){
    observationLabels[0].position.set(customers[0].position.x-.55,3.05,customers[0].position.z);
    observationLabels[1].position.set(extraCustomers[1].position.x+.55,2.05,extraCustomers[1].position.z);
    observationLabels[2].position.set(collection.position.x,1.95,collection.position.z);
   }
   celebrationTime=Math.max(0,celebrationTime-dt);changeLabel(thanks,celebrationTime>0?'THIS ONE IS FOR THE JUNIPER CREW!':'YOUR FIRST GIG / CREW MEMORY');const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;band.forEach((p,i)=>p.rotation.z=reduced?0:Math.sin(t*2+i)*.035);audience.forEach((p,i)=>{p.rotation.z=!reduced&&celebrationTime>0?Math.sin(t*3+i)*.07:0;});
   if(chapterPlayback){
    chapterPlayback.time+=dt;
    const preview=chapterPlayback,progress=reduced?1:Math.min(1,preview.time/6);
    [...customers,...extraCustomers].forEach((g,i)=>{const startX=-2-(i%2)*.9,startZ=1+Math.floor(i/2)*1.3;g.position.set(THREE.MathUtils.lerp(startX,i<preview.served?3.1:startX,progress),0,THREE.MathUtils.lerp(startZ,i<preview.served?-2.7+i*.6:startZ,progress));});
    hud.querySelector('#market-objective').textContent=`REHEARSAL: ${preview.served}/6 groups supported. ${6-preview.served} groups still waiting. Your paid shift is unchanged.`;
    if(preview.time>=9)endPreview();
   }
   district?.update(dt,t,reduced,playerPosition);
   if(gardener)gardener.rotation.z=reduced?0:Math.sin(t*1.2)*.04;
   cast.update(dt,reduced);
   performer.rotation.z=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.sin(t*2)*.03;},
  journal,caseNote,openChapters,visitDistrict,refreshPractice:()=>{store.reload();sync();},marketMoney:()=>{store.reload();return {...store.state,error:store.error,locked:store.locked};},changeMoney:type=>{store.reload();const ok=['save','withdraw','donate'].includes(type)&&store.dispatch(type);sync();return {ok,error:store.error};},replayIntro:maraIntro,snapshot:()=>({officeFlow:{visible,active:activeDistrict,receptionSeen,week:districtWeek,playerX:lastOfficePosition},...(district?{district:district.snapshot()}:{}),chapters:openingChapters?.snapshot()||null,guidance:labels.filter(l=>l.sprite.visible&&l.sprite.material.visible).map(l=>l.sprite===maraLabel?'Mara':l.sprite===queueLabel?'Customer flow':l.sprite===customerLabel?'Waiting customer':l.sprite===helperLabel?'Sam':'Market activity'),observation:{running:watching>0,elapsed:watching,holding:observationHold,testing:testing>0},visuals:cast.snapshot(),practice:true,...store.state,storageError:store.error})
 };
}
