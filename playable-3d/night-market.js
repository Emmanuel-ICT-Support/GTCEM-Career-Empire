import * as THREE from 'three';
import {createPracticeStore,VALUES,BADGES,MARKET_SHOP} from './night-market-state.js?v=market-lawns-20260924';
import {PLAN_OPTIONS,NOTE_FIELDS,describePlan,evaluatePlan,caseNoteText} from './night-market-agency.js?v=market-lawns-20260924';
import {marketCharacters} from './market-characters.js?v=market-lawns-20260924';
import {marketSurroundings} from './market-surroundings.js?v=market-lawns-20260924';
const money=n=>'$'+(n/100).toFixed(2);
// Campus materials and locally optimised NPCs; practice state remains independent.
export function createNightMarket({storage,onPause,onClose,onExit,campusPalette,campusGrass}){
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
 function changeLabel(sprite,text){
  if(sprite.userData.text===text)return;sprite.userData.text=text;const c=sprite.userData.labelCanvas,ctx=c.getContext('2d');ctx.fillStyle='#183b3b';ctx.fillRect(0,0,768,192);ctx.strokeStyle='#bfa878';ctx.lineWidth=7;ctx.strokeRect(4,4,760,184);ctx.font='bold 40px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fcf0d5';ctx.fillText(text,384,96,718);sprite.material.map.needsUpdate=true;
 }
 function npc(x,z,colour,id,facing=Math.PI){const g=new THREE.Group();g.position.set(x,0,z);box(.45,.72,.28,0,1.08,0,colour,g);orb(.22,0,1.67,0,'#c99575',g);for(const side of [-1,1]){box(.16,.65,.19,side*.13,.41,0,'#263d46',g);box(.13,.58,.16,side*.31,1.05,0,colour,g);}scene.add(g);cast.register(g,id||['customer-a','customer-b','customer-c','customer-d','customer-e'][visitor++%5],{facing});return g;}
 function stall(x,z){obstacles.push({x,z,w:4.1,d:1.65});}
 marketSurroundings(scene,obstacles,campusPalette,campusGrass);
 stall(0,-5);stall(-8,0);
 npc(-.5,-5.85,'#e8c56a','mara',0);label('MARA',-.5,2.08,-5.85,1.15);
 const helper=npc(1.1,-5.8,'#68b5ae','sam',0);const helperLabel=label('SAM / JUNIPER CREW',1.1,2.3,-5.8,1.8);
 for(const [x,z]of [[-2,-1],[-3,1],[-2,2.5]])customers.push(npc(x,z,'#a1a7c4'));
 const trialBags=Array.from({length:6},(_,i)=>box(.22,.25,.22,-1.3+(i%3)*.3,1.18,-5+Math.floor(i/3)*.3,'#d7b977'));
 const extraCustomers=[npc(-3,3.5,'#a1a7c4'),npc(-1,2,'#c9b17c'),npc(-1,3.5,'#c9b17c')];
 const trialBoard=label('JUNIPER / PLAN & TRY',4.2,2.25,-2.8,2.7);
 box(1.3,.8,.65,4.2,.4,-2.8,'#387f7b');box(1.45,.1,.8,4.2,.85,-2.8,'#dbc7a2');box(.55,.025,.4,4.2,.915,-2.7,'#fff1cc');obstacles.push({x:4.2,z:-2.8,w:1.45,d:.8});
 const customerLabel=label('02 / WAITING CUSTOMER',-2,2.5,-1,2.4);
 const collection=new THREE.Group();scene.add(collection);collection.position.set(2.8,0,-4.4);
 box(1.25,.85,.7,0,.425,0,'#387f7b',collection);box(1.45,.1,.85,0,.9,0,'#dbc7a2',collection);
 for(const x of [-.35,0,.35]){box(.23,.3,.2,x,1.1,0,'#d7b977',collection);box(.1,.07,.02,x,1.28,0,'#977346',collection);}
 const collectionObstacle={x:2.8,z:-4.4,w:1.45,d:.85};obstacles.push(collectionObstacle);
 const collectionLabel=label('JUNIPER / COLLECT HERE',2.8,1.65,-4.4,2.5);
 const sign=new THREE.Group();box(.09,1.5,.09,0,.75,0,'#d2b983',sign);box(1.2,.45,.10,0,1.35,0,'#f9db85',sign);scene.add(sign);
 const signText=label('PICK UP HERE  >',0,1.5,0,1.6);sign.visible=false;signText.visible=false;
 // Keep the complete stage cluster together when changing its placement.
 const beforeStage=new Set(scene.children),stageObstacleStart=obstacles.length;
 // A small stage, not a concert production. All forms remain replaceable.
 obstacles.push({x:0,z:-11,w:5,d:3.5});


 const crewRibbon=label('CREW / YOUR FIRST GIG',4,2.3,-10,2.6);
 const celebrationLights=[-2,-1,1,2].map((x,i)=>orb(.18,x,3,-10,['#e8b96e','#77d6cd','#e8b96e','#77d6cd'][i],scene,true));
 const ticket=box(.65,.035,.32,-6.6,.7,7,'#edcb80');
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
 const stageBreakLabel=label('FREE / STAGE BREAK',-5,2.1,-8,3);
 const stageBench=box(2,.45,.7,-5,.23,-8.8,'#b4a17d');obstacles.push({x:-5,z:-8.8,w:2,d:.7});
 // Juniper is centred at (0,-5); the stage now faces the same entrance from its right.
 for(const child of scene.children)if(!beforeStage.has(child)&&child!==ticket){child.position.x+=8;child.position.z+=6;}
 for(const obstacle of obstacles.slice(stageObstacleStart)){obstacle.x+=8;obstacle.z+=6;}
 crewRibbon.position.set(9.3,2.3,-2.8);thanks.position.set(8,3.9,-4.8);
 audience.forEach((p,i)=>p.position.set(6.3+i*.9,0,-1.8-(i%2)*.3));
 stageBench.position.set(6.5,.23,1);stageBreakLabel.position.set(6.5,2.1,1);
 Object.assign(obstacles.at(-1),{x:6.5,z:1});

 box(1,1.3,.55,7,.65,6,'#38716b');label('05 / SAVE & CONTRIBUTE',7,2.2,6,3.5);obstacles.push({x:7,z:6,w:1,d:.55});
 box(2,.65,1,-7,.33,7,'#b7a784');label('YOUR MARKET SHELF',-7,1.75,7,3.5);obstacles.push({x:-7,z:7,w:2,d:1});
 const keepsake=new THREE.Group();box(.3,.5,.3,0,.3,0,'#efc36b',keepsake);orb(.14,0,.65,0,'#ffdf98',keepsake,true);keepsake.position.set(-7,.68,7);scene.add(keepsake);
 const plant=new THREE.Group();scene.add(plant);plant.position.set(-7.5,.68,7);box(.27,.25,.27,0,.125,0,'#ba8159',plant);box(.04,.42,.04,0,.4,0,'#4b7855',plant);for(const x of [-.12,.12])orb(.15,x,.52,0,'#79a767',plant);plant.visible=false;
 const savingsTokens=[];for(let i=0;i<3;i++)savingsTokens.push(box(.25,.09,.25,6.7+i*.3,1.37,6,'#f4ce80'));
 for(const x of [-10,10])for(let z=-12;z<=10;z+=5.5){box(.13,4,.13,x,2,z,'#8d8971');orb(.14,x,3.85,z,'#ffe0a1',scene,true);}
 for(let i=0;i<17;i++){const x=-10+i*1.25,y=3.9-.6*Math.sin(Math.PI*i/16);orb(.085,x,y,4,'#ffdd93',scene,true);}

 for(const x of [5.5,8.5]){box(.09,2.5,.09,x,1.25,7,'#b39a77');lanterns.push(orb(.2,x,2.5,7,'#ffd578',scene,true));}

 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('./night-market.css?v=market-lawns-20260924',import.meta.url).href;document.head.append(css);
 const hud=document.createElement('section');hud.id='market-hud';hud.hidden=true;hud.setAttribute('aria-label','Live Music and Sunday Markets practice');
 hud.innerHTML='<details id="market-card"><summary>Your first gig <span aria-hidden="true">⌄</span></summary><div class="market-card-details"><div class="market-kicker">SUNDAY MARKET / LOCAL PRACTICE</div><h2>Your first gig</h2><div class="market-balance" id="market-balance"></div><div class="market-tools"><button id="market-journal">Journal & map</button><button id="market-exit">Return to campus</button></div><p class="market-status" id="market-status" role="status"></p></div></details><p id="market-objective" aria-live="polite"></p><button id="market-replay" hidden>Start a fresh shift…</button>';
 document.getElementById('experience').append(hud);
 const dialog=document.createElement('dialog');dialog.id='market-dialog';dialog.setAttribute('aria-labelledby','market-dialog-title');document.body.append(dialog);
 let visible=false,customerProgress=0,previousSolution=store.state.solution,lastAnnounced='',music=null,watching=0,testing=0,noteDraft=null;
 const announce=text=>{lastAnnounced=text;hud.querySelector('#market-status').textContent=text;};
 function close(){onClose();dialog.close();}
 // Reset synchronously: a deferred close event must not erase fresh movement input.
 dialog.addEventListener('close',()=>document.getElementById('scene').focus());
 dialog.addEventListener('cancel',onClose);
 function show(title,body,choices=[],extra=''){
  onPause();dialog.replaceChildren();const eyebrow=document.createElement('div');eyebrow.className='market-kicker';eyebrow.textContent='SUNDAY MARKETS / PRACTICE';dialog.append(eyebrow);
  const h=document.createElement('h2');h.id='market-dialog-title';h.textContent=title;dialog.append(h);
  const p=document.createElement('p');p.className='market-body';p.textContent=body;dialog.append(p);
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
 function agencyMara(){
  const s=store.state;
  if(!s.accepted)return show('Your first gig / make service work','“Hi, I’m Mara. This is my stall, Juniper Kitchen — we sell freshly made rice bowls.\n\nIt’s a really busy day, and Sam and I are struggling to keep up. The queue is getting longer and feels disorganised. People aren’t sure where to order or collect their food.\n\nCustomers who ordered on their phones have already paid. They can show us their order at the collection counter to pick up their food.\n\nWalk-up customers need to come to the ordering counter to order and pay.\n\nSam is currently helping me pack the food into takeaway bags and get orders ready.\n\nCan you help us make ordering and collecting food easier? Have a look around, ask us questions and tell me what you think we could change. Then we’ll watch the next group of customers to see how your idea works.\n\nNot sure where to start? There’s a short thinking guide in your journal. Use it whenever you need.”',[
   ['Show me the thinking guide',thinkingGuide],
   ['Take the shift',()=>{if(commit('accept','Your goal: make service smoother. Investigate or sketch an arrangement — you choose.'))close();else journal();}]
  ],'Agreed work: try an arrangement, check what happened and hand over what you found. $20 gross − $2 community tax = $18 plus a crew pass. A mixed result, help or retries do not reduce your pay.');
  if(s.paid)return show('Your shift is paid','Your experiment is part of the record, including anything that did not work. You can revisit your case note and use your crew pass.',[['My first gig / case note',caseNote],['Connect this to Initiative',consolidation]]);
  if(!s.shared)return show('What would you like to try?',`Mara: “We can test your idea within this stall. What is your current arrangement?” ${describePlan(s.plan)}.`,[
   ['Explain this arrangement to Mara',()=>{if(commit('share-plan','Idea shared. You can try and revise arrangements within the agreed boundaries.'))show('Let’s find out','Mara: “Go ahead. Try it, watch the customers and tell me what happens. You can adjust within those boundaries without asking me again.”',[['Back to the market',close]],'The Juniper work bench is beside the right-hand end of the stall. Sam, the customer and the observation point are optional sources of information.');else journal();}],
   ['I want to think or investigate first',close]
  ],'Choose an arrangement at the setup station, or test the existing setup as a baseline. There is more than one workable approach.');
  if(!s.trials.length)return show('You have room to experiment','Mara: “Use the setup station to try your arrangement. You can ask questions, watch first, or test what we already have.”', [['My first gig / case note',caseNote]]);
  if(!s.reviewed)return trialResults();
  return consolidation();
 }
 function agencySetup(){
  const s=store.state;
  if(!s.accepted)return show('Stall setup','Speak to Mara about the role and workplace boundaries first.');
  if(s.paid)return show('Shift handed over','Your trial arrangements are saved in your case note. You can revise your reflection choices or start another practice from the journal.',[['My first gig / case note',caseNote]]);
  if(testing>0)return show('The next customers are arriving','Return to the world to watch it finish. Changes can wait until you have seen the result.');
  show('Design an arrangement','Choose a combination to try. You can test the current setup, find out more first, or change one thing at a time.',[], 'Changes cost nothing. Sam can do one role at a time. All collection locations here keep the emergency walkway open.');
  const form=document.createElement('div');form.className='market-form';const selects={};
  for(const [key,options]of Object.entries(PLAN_OPTIONS)){
   const label=document.createElement('label');label.textContent={sign:'Sign wording',position:'Sign position',collection:'Collection location',helper:'Sam’s role'}[key];
   const select=document.createElement('select');select.id='plan-'+key;select.setAttribute('aria-label',label.textContent);
   for(const [value,text]of Object.entries(options)){const option=document.createElement('option');option.value=value;option.textContent=text;select.append(option);}select.value=s.plan[key];selects[key]=select;label.append(select);form.append(label);
  }
  const actions=dialog.querySelector('.market-choices');actions.before(form);
  const save=document.createElement('button');save.textContent='Set this arrangement';save.onclick=()=>{
   const plan=Object.fromEntries(Object.entries(selects).map(([k,v])=>[k,v.value]));
   if(JSON.stringify(plan)===JSON.stringify(store.state.plan)){close();return;}
   if(commit({type:'plan',plan},'Arrangement set in the world. You can investigate or test it.')){customerProgress=0;close();}else journal();
  };actions.append(save);
  const run=document.createElement('button');run.textContent=s.shared?'Try it with the next customers':'Share your idea with Mara first';run.disabled=!s.shared||s.tested||s.trials.length>=12;
  run.onclick=()=>{const changed=Object.entries(selects).some(([k,v])=>v.value!==store.state.plan[k]);if(changed){const note=document.createElement('p');note.setAttribute('role','status');note.textContent='Set your changed arrangement before trying it with customers.';form.append(note);return;}testing=.01;customerProgress=0;close();announce('Six customers arriving. Watch what happens.');};actions.append(run);
  if(s.trials.length){const results=document.createElement('button');results.textContent='Compare my trial results';results.onclick=trialResults;actions.append(results);}
  if(s.trials.length>=12){const note=document.createElement('p');note.textContent='You have tried twelve groups of customers. Review what happened and hand over to Mara for your full wages.';form.append(note);}
  selects.sign.focus();
 }
 function trialResults(){
  const s=store.state,t=s.trials.at(-1);if(!t)return agencySetup();
  show(`Trial ${s.trials.length} / what happened`,t.outcome.facts.join(' '),[
   [t.inspected?'Result already recorded':'Record that I checked this result',()=>{if(commit('inspect-trial','Result checked. Decide what you want to change, investigate or hand over.'))trialResults();else journal();},t.inspected],
   ['Compare all trials / reflect',caseNote],
   ['Return to investigate or revise',close],
   ['Hand over to Mara',consolidation,!t.inspected]
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
 function observe(){
  const s=store.state;
  if(!s.accepted)return show('Watch the queue','Take a shift with Mara first. You can explore freely.');
  if(s.observed)return show('Your observation','Phone customers join the ordering queue, even though their food is already waiting at collection. The people ahead block their view of the counter.');
  show('Watch a group of customers','Watch where customers go and what they can see. The observation is also described in text afterwards.',[['Watch the queue',()=>{watching=0.01;close();announce('Watching: phone customers are joining the ordering queue…');}]]);
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
  show(s.encore?'Your first-gig memory':'Your crew pass',s.encore?'Your ticket stub is on your shelf and in your journal. Come back to this spot whenever you like.':'Mara: “You helped make today work. This spot is for you.” Use your pass for a crew shout-out, the band and a small cheering crowd. Your ticket becomes a keepsake afterwards. Music is optional; you can replay the moment for free.',[
   [s.encore?'Replay crew celebration':'Use my crew pass',()=>{if(s.encore||commit('encore','Crew pass used. Your ticket is on the shelf and in your journal.')){celebrationTime=18;close();announce('The band dedicates this moment to the Juniper crew. Thank you for your work!');}else journal();}],
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
 function shop(){const s=store.state;if(s.revision>=2)return show('Little Finds / choose a keepsake',`Wallet ${money(s.wallet)}. An optional little something for your market shelf. Keep your earnings if you prefer.`,[
 ...Object.entries(MARKET_SHOP).map(([id,item])=>{const owned=s.purchases.includes(id)||(id==='lantern'&&s.keepsake);return [owned?item.name+' · owned':'Buy '+item.name+' · '+money(item.price),()=>{commit({type:'purchase',item:id},item.name+' added to your shelf.');shop();},owned||!s.paid||s.wallet<item.price];}),
 ['Keep my money',close]
 ],'Practice prices. Purchases appear on your shelf near the entrance. They do not improve skill scores or wellbeing. Your crew pass is earned separately.');show('Little Finds / market lantern',s.keepsake?'Your lantern is on your market shelf near the entrance. It will be here when you return.':'A little amber lantern to remember your market visit. Buying it puts it on your shelf near the entrance.',[
  [s.keepsake?'Already on your shelf':'Buy lantern · $6',()=>{commit('buy','Your lantern is now on your market shelf.');shop();},s.keepsake||!s.paid||s.wallet<VALUES.keepsake]
 ],store.error||`Wallet ${money(s.wallet)}. This is a practice purchase. Owning it does not increase learning, wellbeing or portfolio scores.`);}
 function bank(){const s=store.state;show('A little for later',`Wallet ${money(s.wallet)} · Savings ${money(s.savings)}. Your first shift contributed ${money(s.tax)} in fictional community tax. Optional donations: ${money(s.donated)}.`,[
  ['Move $5 into savings',()=>{commit('save','Saved $5. Your total money has not changed.');bank();},s.wallet<VALUES.save],
  ['Move $5 back to my wallet',()=>{commit('withdraw','Moved $5 back to your wallet.');bank();},s.savings<VALUES.save],
  ['Contribute $2 to the second lantern',()=>{commit('donate','Your optional contribution lights a second community lantern.');bank();},!s.paid||s.donated>0||s.wallet<VALUES.donation]
 ],store.error||'A local practice fund, not a real class total. Saving is reversible. Giving is optional; it does not award a skill badge.');}
 function stage(){const s=store.state;show('The Late Shift / sound check',s.rested?'A small pause, and somewhere to belong. You can stay as long as you like.':'Sam waves from across the market. You have time to stop, listen and take a breath.',[
  [s.rested?'Break remembered':'Take a free break',()=>{commit('rest','A good pause. No money or skill points needed.');stage();},s.rested],
  [music?'Stop rehearsal tune':'Play rehearsal tune',()=>{if(music)stopMusic();else startMusic();stage();}]
 ],'A temporary original synth loop stands in for the band. Sound is optional. Nothing gets worse while you are away.');}
 function stopMusic(){if(music){clearInterval(music.timer);music.ctx.close();music=null;}}
 function startMusic(){try{const ctx=new (window.AudioContext||window.webkitAudioContext)(),notes=[220,261.63,329.63,293.66,261.63,196,220,0];let n=0;const play=()=>{const f=notes[n++%notes.length];if(!f)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,ctx.currentTime);g.gain.linearRampToValueAtTime(.035,ctx.currentTime+.025);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.45);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.5);};ctx.resume();play();music={ctx,timer:setInterval(play,500)};}catch{announce('Sound is unavailable. The market remains playable.');}}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMusic();});
 const restartPractice=()=>show('Start a fresh market visit?','This clears only this market practice: shift, money, badges, lantern and crew pass. Your character, outfit, portfolio and the original shop are untouched.',[['Yes, restart this practice',()=>{if(store.reset()){customerProgress=0;watching=0;testing=0;noteDraft=null;sync();announce('Fresh practice started. Meet Mara at Juniper Kitchen.');close();}else journal();}]]);
 function journal(){
  const s=store.state,badges=s.badges.map(b=>BADGES[b].join(': ')).join(' ');
  show('Your market journal',`${s.paid?'First shift complete.':s.accepted?'Shift in progress.':'A first opportunity is waiting.'} Wallet ${money(s.wallet)} · Savings ${money(s.savings)}. ${s.rested?'You took a free break.':''} ${s.encore?'Ticket stub: MY FIRST GIG — Juniper Kitchen crew.':s.pass?'Crew pass: ready to use beside the stage.':''} ${badges||'Game badges will describe the skills you practise.'}`,[
   ['Where do I go?',()=>show('Around the market','Walk forward to Mara at 01 / Juniper Kitchen. The waiting customer is on the left of the path; Sam works at Juniper Kitchen. The observation spot is left of the entrance path; the Juniper work bench is beside the right-hand end of the stall. The concert stage is to the right of Juniper Kitchen; the crew-pass spot is at its front-right corner. Little Finds is to the left. Save & Contribute and your market shelf are near the entrance. The free stage-break bench is in front of the concert stage.',[], 'Use WASD / arrow keys or the movement controls. Drag to look. Walk close, then press E or tap the interaction button. All activities are untimed.')],
   ['My first gig / case note',caseNote,s.revision!==3],
   ['Optional thinking guide',thinkingGuide],
   ['Initiative / reference sheet',initiativeSheet],
   ['Restart this practice…',restartPractice]
  ],store.error||(reviewMode?'Fresh review: progress lasts until reload and never changes your saved market. Game badges are practice only.':'One anonymous practice save in this browser, shared by its local characters. Game badges are not portfolio evidence or résumé claims. No student login.'));
 }
 hud.querySelector('#market-replay').onclick=restartPractice;hud.querySelector('#market-journal').onclick=journal;hud.querySelector('#market-exit').onclick=onExit;
 function sync(){
  const s=store.state;hud.querySelector('#market-objective').textContent=!s.accepted?'Start: meet Mara at Juniper Kitchen.':s.revision===1?'Earlier practice saved. Continue it, or start a fresh revised shift.':!s.proposal?`Investigate: customer ${s.listened?'✓':'—'} · queue ${s.observed?'✓':'—'} · Sam’s workflow ${s.learned?'✓':'—'}. Then propose an idea to Mara.`:!s.placed?(s.proposal==='helper'?'Agree Sam’s role, then visit the setup station.':'Place your sign at the Juniper work bench beside the stall.'):!s.solution?(s.tested?'Trial: customers missed the counter sign. Revise at the setup station.':'Try it with the next customers at the setup station.'):!s.reviewed?'Check the result: speak to the customer at collection.':!s.paid?'Return to Mara for your wages and crew pass.':!s.encore?'Shift complete! Use your crew pass at the front-right corner of the stage.':'First gig complete. Ticket saved in your journal. Enjoy the market.';
  if(s.revision===3)hud.querySelector('#market-objective').textContent=!s.accepted?'Start: meet Mara at Juniper Kitchen.':s.paid?'Shift complete. Your case note and crew pass are in the journal.':testing>0?'The next customers are arriving. Watch what happens.':s.trials.length?'Your goal: make service smoother. Compare results, investigate, revise or hand over to Mara.':'Your goal: make service smoother. Investigate or design an arrangement — you choose.';
  hud.querySelector('#market-replay').hidden=!s.paid;if(reviewMode)hud.querySelector('.market-kicker').textContent='FRESH REVIEW / NOT SAVED';
  hud.querySelector('#market-balance').textContent=`Wallet ${money(s.wallet)} · Saved ${money(s.savings)} · ${s.badges.length} game badges`;
  sign.visible=signText.visible=s.placed==='place-counter'||s.placed==='place-path'||s.attempted||s.solution==='sign';const good=s.placed==='place-path'||s.solution==='sign';sign.position.set(good?2.4:0,good?0:1,good?-1.8:-5);signText.position.set(sign.position.x,sign.position.y+1.45,sign.position.z+.08);
  crewRibbon.visible=s.pass;ticket.visible=s.encore;plant.visible=s.purchases.includes("plant");thanks.visible=s.encore;audience.forEach(p=>p.visible=s.encore);celebrationLights.forEach(m=>m.visible=s.encore);stageGlow.visible=s.rested||s.encore;customerLabel.visible=!s.solution;keepsake.visible=s.keepsake;lanterns[0].visible=s.tax>0;lanterns[1].visible=s.donated>0;savingsTokens.forEach((m,i)=>m.visible=s.savings>i*500);
  helper.position.set(s.placed==='assign-helper'||s.solution==='helper'?1.5:1.1,0,s.placed==='assign-helper'||s.solution==='helper'?-2.3:-5.8);
  trialBags.forEach((m,i)=>m.visible=s.revision===3&&i<(s.trials.at(-1)?.outcome.packed??6));extraCustomers.forEach(m=>m.visible=s.revision===3);trialBoard.visible=s.revision===3;
  if(s.revision===3){
   const p=s.plan,approach=p.position==='approach';sign.visible=signText.visible=p.sign!=='none';sign.position.set(approach?2.4:0,approach?0:1,approach?-1.8:-5);signText.position.set(sign.position.x,sign.position.y+1.45,sign.position.z+.08);changeLabel(signText,PLAN_OPTIONS.sign[p.sign]);
   collection.position.x=p.collection==='front'?0:2.8;collection.position.z=p.collection==='front'?-3.6:-4.4;
   helper.position.set(p.helper==='greet'?1.5:p.helper==='collect'?collection.position.x:1.1,0,p.helper==='greet'?-1.6:p.helper==='collect'?collection.position.z-.8:-5.8);
   const last=s.trials.at(-1);changeLabel(trialBoard,last?`GROUP ${s.trials.length} / ${last.outcome.pickup}/4 PICKUP · ${last.outcome.packed}/6 READY`:'TRY • WATCH • RETHINK');
  }
  collectionLabel.position.set(collection.position.x,1.65,collection.position.z);collectionObstacle.x=collection.position.x;collectionObstacle.z=collection.position.z;const samRole=s.revision===3?s.plan.helper:(s.solution==='helper'?'greet':'packing');changeLabel(helperLabel,'SAM / '+{packing:'PACKING',greet:'GREETING',collect:'COLLECTION'}[samRole]);helperLabel.position.set(helper.position.x,2.05,helper.position.z+(samRole==='packing'?2:samRole==='collect'?1.5:.3));
  if(previousSolution!==s.solution){customerProgress=0;previousSolution=s.solution;}
  if(store.error)announce(store.error);
 }
 label('OBSERVE THE QUEUE',-3,1.7,4,2.1);label('JUNIPER / WORK BENCH',4.2,1.35,-2.65,2.3);
 const spots=[{x:-3,z:4,label:'Observe the queue',action:observe},{x:4.2,z:-1.8,label:'Set up & test',action:setup},{x:9,z:-1.8,label:'Use crew pass',action:crew},{x:0,z:-3.6,label:'Talk to Mara',action:mara},{x:-2,z:-.2,label:'Talk to the waiting customer',action:customer},{x:1.5,z:-3.3,label:'Ask Sam',action:sam},{x:-6,z:1.2,label:'Browse Little Finds',action:shop},{x:6.5,z:4.7,label:'Save & contribute',action:bank},{x:6.5,z:2.4,label:'Take a stage break',action:stage},{x:-7,z:5.7,label:'My market shelf',action:()=>show('A place for your story',[store.state.encore?'Your earned first-gig ticket stub.':'',store.state.keepsake?'Your purchased amber lantern.':'',store.state.purchases.includes('plant')?'Your purchased little green plant.':''].filter(Boolean).join(' ')||'Your shelf is ready for a keepsake. You do not need to buy anything to belong here.')}];
 sync();if(store.state.solution)customerProgress=1;
 return {
  scene,spawn:new THREE.Vector3(0,0,7.5),isOpen:()=>dialog.open,
  setVisible(value){visible=value;hud.hidden=!value;document.getElementById('experience').classList.toggle('in-market',value);if(!value){watching=0;testing=0;close();stopMusic();}else{cast.start();store.reload();sync();announce(store.error||lastAnnounced||(store.state.paid?'Resuming a completed practice shift.':'Walk close to Mara, then press E or tap Talk to Mara.'));}},
  interaction(p){if(dialog.open)return null;const current=store.state;const spot=spots.map(s=>s.action===customer&&current.revision!==3&&current.solution?{...s,x:2.8,z:-2}:s.action===sam&&current.revision===3?{...s,x:current.plan.helper==='greet'?1.5:current.plan.helper==='collect'?collection.position.x:1.5,z:current.plan.helper==='greet'?-1.6:current.plan.helper==='collect'?collection.position.z+.9:-3.3}:s.action===sam&&(current.placed==='assign-helper'||current.solution==='helper')?{...s,x:1.5,z:-2.3}:s).map(s=>({...s,distance:Math.hypot(s.x-p.x,s.z-p.z)})).sort((a,b)=>a.distance-b.distance)[0];return spot.distance<2.25?spot:null;},
  move(p,delta){const next={x:p.x,y:0,z:p.z},valid=(x,z)=>Math.abs(x)<11.4&&z>-12.7&&z<11.7&&!obstacles.some(o=>Math.abs(x-o.x)<o.w/2+.3&&Math.abs(z-o.z)<o.d/2+.3);if(valid(p.x+delta.x,p.z))next.x+=delta.x;if(valid(next.x,p.z+delta.z))next.z+=delta.z;return next;},
  update(dt,t,camera){if(!visible)return;for(const {sprite,width}of labels){const factor=Math.min(1,camera.position.distanceTo(sprite.position)/12);sprite.scale.set(width*factor,width*factor/4,1);}const s=store.state;
   if(!dialog.open&&watching>0){watching+=dt;if(watching>=4){watching=0;if(commit('observe','Queue clue: phone customers join ordering; the counter is hidden behind people.'))show('What you observed','Phone customers waited in the ordering queue while their bags sat at collection. From behind the queue, the counter is hard to see.');}}
   if(!dialog.open&&testing>0){testing+=dt;customerProgress=Math.min(1,testing/4);if(testing>=5){testing=0;if(s.revision===3){if(commit('run-trial','This group has finished. What do you notice in the results?'))trialResults();}else if(commit('test',s.placed==='place-counter'?'Customers still cannot see the sign. Revise and try again.':'Customers found collection. Ask them what helped.'))show('Trial result',store.state.solution?'The customers reached collection without joining the ordering queue. Check with the customer to review the result.':'The sign was hidden behind the queue. Customers still joined ordering. Change the position at the setup station and try again — no pay lost.');}}
   if(s.solution||(s.revision===3&&s.trials.length))customerProgress=Math.min(1,customerProgress+dt*.28);customers.forEach((g,i)=>{const start=[[-2,-1],[-3,1],[-2,2.5]][i];const progress=(s.solution||(testing>0&&s.placed!=='place-counter'))?Math.max(0,Math.min(1,customerProgress*1.4-i*.18)):0;g.position.x=THREE.MathUtils.lerp(start[0],2.8,progress);g.position.z=THREE.MathUtils.lerp(start[1],-3.3+i*.75,progress)+(watching>0?Math.sin(watching*.8+i)*.35:0);});if(s.revision===3){const outcome=testing>0?evaluatePlan(s.plan):(s.tested?s.trials.at(-1)?.outcome:null);const moving=testing>0||Boolean(outcome);[...customers,...extraCustomers].forEach((g,i)=>{
    const start={x:i<4?-2-(i%2)*.9:-.6,z:1+(i<4?Math.floor(i/2):i-4)*1.3};const reached=outcome&&(i<4?i<outcome.pickup:i-4<outcome.ordering);const dest=reached?(i<4?{x:s.plan.collection==='front'?.4:3.05,z:(s.plan.collection==='front'?-2.6:-3.1)+i*.8}:{x:-1.25,z:(s.plan.collection==='front'?-2.5:-3.5)+(i-4)*.9}):{x:-2-(i%2)*.9,z:-.4+Math.floor(i/2)*1.05};
    const progress=moving?Math.min(1,Math.max(0,customerProgress*1.4-i*.08)):0;g.position.set(THREE.MathUtils.lerp(start.x,dest.x,progress),0,THREE.MathUtils.lerp(start.z,dest.z,progress));
   });}
   celebrationTime=Math.max(0,celebrationTime-dt);changeLabel(thanks,celebrationTime>0?'THIS ONE IS FOR THE JUNIPER CREW!':'YOUR FIRST GIG / CREW MEMORY');const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;band.forEach((p,i)=>p.rotation.z=reduced?0:Math.sin(t*2+i)*.035);audience.forEach((p,i)=>{p.rotation.z=!reduced&&celebrationTime>0?Math.sin(t*3+i)*.07:0;});
   cast.update(dt,reduced);
   performer.rotation.z=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.sin(t*2)*.03;},
  journal,caseNote,snapshot:()=>({visuals:cast.snapshot(),practice:true,...store.state,storageError:store.error})
 };
}
