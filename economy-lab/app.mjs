import {MILESTONES} from './exploration.mjs?v=exploration-20260924';
import {mountWork} from './work-ui.mjs?v=activity-library-1';
import {KEY,CATALOG,LESSONS,empty,project,transact} from './economy.mjs?v=exploration-20260924';
const $=id=>document.getElementById(id),money=n=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:0}).format(n/100);
const reviewMode=new URLSearchParams(location.search).get('review')==='1';
let doc=empty(),lastRaw=null,blocked=false,persistent=!reviewMode,draw=()=>{};
try{lastRaw=reviewMode?null:localStorage.getItem(KEY);if(lastRaw){doc=JSON.parse(lastRaw);project(doc);}}catch(e){if(lastRaw){blocked=true;$('message').textContent='Practice save needs attention. It has been preserved. Reset explicitly to begin again.';}else persistent=false;doc=empty();}
function status(){$('storage').textContent=reviewMode?'REVIEW MODE · Temporary test world. Your saved Economy Lab is untouched.':blocked?'Saved data preserved; transactions blocked until reset.':persistent?'Practice world saved on this browser only. No student records are used.':'Browser storage is unavailable. Economy changes are blocked; use review mode for a temporary demonstration.';}
function render(){const focusKey=document.activeElement?.dataset.key;const s=project(doc);$('metrics').replaceChildren();for(const [label,n]of [['Available',s.cash],['Savings',s.savings],['Gross earned',s.gross],['Exploration bonuses',s.explorationRewards],['Tax paid',s.tax],['Class fund · simulated',s.community],['Purchases & trial costs',s.spent]]){const div=document.createElement('div');div.className='metric';const span=document.createElement('span');span.textContent=label;const strong=document.createElement('strong');strong.textContent=money(n);div.append(span,strong);$('metrics').append(div);}
 $('outcomes').replaceChildren();for(const [label,value]of [['Scenario wellbeing',s.wellbeing+'/100'],['Practice insights',String(s.insight)],['Paid checkpoints',s.completed.length+'/3']]){const d=document.createElement('div');d.className='metric';const t=document.createElement('span');t.textContent=label;const v=document.createElement('strong');v.textContent=value;d.append(t,v);$('outcomes').append(d);}for(const b of document.querySelectorAll('[data-choice]')){b.disabled=blocked||(!reviewMode&&!persistent)||s.choices.includes(b.dataset.choice)||(b.dataset.choice==='reflect-failure'&&!s.choices.includes('experiment'))||(b.dataset.choice==='retry'&&!s.choices.includes('reflect-failure'));b.onclick=()=>act({type:'choice',choice:b.dataset.choice});}
 $('lessons').replaceChildren();for(const [id,label]of [['investigate','Investigate a changing job'],['adapt','Choose an adaptation'],['reflect','Reflect on the trade-off']]){const row=document.createElement('div');row.className='row';const span=document.createElement('span');span.textContent=label;const b=document.createElement('button');b.dataset.key='lesson-'+id;b.textContent=s.completed.includes(id)?'Reward recorded':'Earn $500';b.disabled=blocked||(!reviewMode&&!persistent)||s.completed.includes(id);b.onclick=()=>act({type:'complete',checkpoint:id});row.append(span,b);$('lessons').append(row);}
 $('shop').replaceChildren();for(const [item,name]of [['study-desk','Study desk'],['laptop-upgrade','Laptop upgrade'],['wellbeing-pack','Wellbeing pack']]){const row=document.createElement('div');row.className='row';const label=document.createElement('span');label.textContent=name;const b=document.createElement('button');b.dataset.key='shop-'+item;b.textContent=s.owned.includes(item)?'Placed':money(CATALOG[item]);b.disabled=blocked||(!reviewMode&&!persistent)||s.owned.includes(item)||s.cash<CATALOG[item];b.onclick=()=>act({type:'buy',item});row.append(label,b);$('shop').append(row);}
 renderHistory(s);for(const b of document.querySelectorAll('[data-action]')){const a=b.dataset.action;b.disabled=blocked||(!reviewMode&&!persistent)||(a==='withdraw'?s.savings<30000:s.cash<(a==='save'?30000:10000));}status();draw(s);renderPlayer(s);if(focusKey){const focus=document.querySelector('[data-key="'+focusKey+'"]');if(focus&&!focus.disabled)focus.focus();else panel.querySelector('[data-panel][aria-pressed="true"]')?.focus();}}
const withEconomyLock=task=>navigator.locks?navigator.locks.request('ce-economy-lab-write',task):Promise.resolve().then(task);
async function act(event){try{await withEconomyLock(()=>{const before=project(doc);if(blocked)throw Error('The existing save needs attention. It has not been changed.');const next=transact(doc,{...event,id:crypto.randomUUID()});if(!reviewMode){if(!persistent)throw Error('Browser storage is unavailable. Nothing was charged or awarded.');if(localStorage.getItem(KEY)!==lastRaw)throw Error('Another tab changed the economy. Reload before continuing.');const raw=JSON.stringify(next);localStorage.setItem(KEY,raw);lastRaw=raw;}doc=next;render();showReceipt(before,project(doc));$('message').textContent=project(doc).log.at(-1).description+'. '+(reviewMode?'Review session only.':'Saved.');});}catch(e){$('message').textContent='Not saved: '+e.message;const notice=$('panel-receipt');notice.textContent='Not saved: '+e.message;notice.hidden=false;clearTimeout(receiptTimer);}}
for(const b of document.querySelectorAll('[data-action]'))b.onclick=()=>{const a=b.dataset.action;act(a==='save'||a==='withdraw'?{type:a,amount:30000}:{type:'donate',cause:a,amount:10000});};
$('reset').onclick=()=>$('reset-dialog').showModal();
$('cancel-reset').onclick=()=>$('reset-dialog').close();
$('confirm-reset').onclick=async()=>{try{await withEconomyLock(()=>{if(!reviewMode){if(localStorage.getItem(KEY)!==lastRaw)throw Error('Another tab changed the economy. Reload before resetting.');localStorage.removeItem(KEY);}persistent=!reviewMode;lastRaw=null;doc=empty();blocked=false;render();$('receipt').hidden=true;$('panel-receipt').hidden=true;$('reset-dialog').close();$('message').textContent='Economy reset to $1,000. My work and other saved profiles are untouched.';});}catch(e){$('reset-dialog').querySelector('p').textContent='Nothing reset: '+e.message;}};
window.addEventListener('storage',e=>{if(!reviewMode&&(e.key===KEY||e.key===null)){try{const raw=localStorage.getItem(KEY),next=raw?JSON.parse(raw):empty();project(next);lastRaw=raw;doc=next;blocked=false;render();$('message').textContent='Your latest world progress and balance are shown.';}catch{blocked=true;status();$('message').textContent='Saved economy needs attention. Nothing overwritten.';}}});
let currentView='overview',receiptTimer;
const views={overview:{title:'YOUR PRACTICE WORLD',description:'Earn, make room for what matters, and see your world change.',panel:'overview',action:'Explore my choices'},home:{title:'HOME BASE / MAKE IT YOURS',description:'A desk, a laptop, a green corner. Purchases have a place.',panel:'shop',action:'Make room for something new'},community:{title:'OUR CLASS WORLD / SIMULATED',description:'Class investments will change the playable world and its work opportunities. This is a local simulation.',panel:'impact',action:'See the local fund'}};
const panel=$('player-panel');
function selectPanel(name){
 for(const id of ['overview','play','earn','shop','impact','money','progress','work'])$('panel-'+id).hidden=!(id===name);
 for(const b of document.querySelectorAll('[data-panel]'))b.setAttribute('aria-pressed',String(b.dataset.panel===name));
 panel.querySelector('.panel-content').scrollTop=0;
}
function openPanel(name='overview'){selectPanel(name);panel.hidden=false;$('home-world').hidden=true;document.body.classList.remove('at-home');window.scrollTo(0,0);}
$('open-player').onclick=()=>openPanel();$('wallet-button').onclick=()=>openPanel('money');$('savings-button').onclick=()=>openPanel('money');$('wellbeing-button').onclick=()=>openPanel('progress');
$('visit-home').onclick=()=>visitHome();
for(const b of document.querySelectorAll('[data-panel]'))b.onclick=()=>selectPanel(b.dataset.panel);
for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>{currentView=b.dataset.view;for(const n of document.querySelectorAll('[data-view]'))n.setAttribute('aria-pressed',String(n===b));draw.focus?.(currentView);renderPlayer(project(doc));};
$('world-action').onclick=()=>openPanel(views[currentView].panel);
window.addEventListener('keydown',e=>{if(e.code==='KeyJ'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.repeat&&!['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)&&!document.querySelector('dialog[open]:not(#player-panel)')){e.preventDefault();openPanel();}});
function renderHistory(s){
 $('history').replaceChildren();
 if(!s.log.length){const li=document.createElement('li');li.textContent='Opening practice balance · $1,000. Your next choice starts the story.';$('history').append(li);}
 for(const [index,e]of [...s.log].reverse().entries()){
  const li=document.createElement('li'),title=document.createElement('strong'),body=document.createElement('div'),meta=document.createElement('small');
  title.textContent=`#${s.log.length-index} · ${e.cashDelta>0?'+':''}${money(e.cashDelta)} available`;
  body.textContent=e.description+(e.type==='donate'&&e.cause==='global'?' · Historical demo entry; global features are now deferred.':'');
  meta.textContent=`After: ${money(e.cashAfter)} available · ${money(e.savingsAfter)} saved${e.taxDelta?' · '+money(e.taxDelta)+' tax':''}`;
  li.append(title,body,meta);$('history').append(li);
 }
}
function renderPlayer(s){
 $('hud-cash').textContent=blocked?'—':money(s.cash);$('hud-savings').textContent=blocked?'—':money(s.savings);$('hud-wellbeing').textContent=s.wellbeing+' / 100';
 const view=views[currentView];$('world-location').textContent=view.title;$('view-description').textContent=view.description;$('world-action').textContent=view.action+' →';
 const lines=currentView==='home'?[s.effects.desk?'Study desk placed.':'Space for your first desk.',s.effects.laptop?'Laptop installed.':'Laptop has its own stand if needed.',s.effects.wellbeing?'Your green corner is growing.':'Learning is always accessible without buying.']:currentView==='community'?[`Simulated class fund ${money(s.community)} · includes ${money(s.tax)} tax.`,s.effects.lamp?'The community lamp is funded.':`Lamp: ${money(Math.max(0,15000-s.community))} to go.`,s.effects.garden?'Community planting is funded.':`Planting: ${money(Math.max(0,30000-s.community))} to go.`]:['Choose a view to explore what your money changes.',s.owned.length?`${s.owned.length} owned item${s.owned.length===1?'':'s'} placed at Home Base.`:'Your home base is ready for its first purchase.'];
 $('overview-money').textContent=blocked?'—':money(s.cash);$('overview-savings').textContent=blocked?'—':money(s.savings);renderDashboard(s);renderTracker(s);$('consequences').textContent=blocked?'Your saved practice needs attention. Open My life for details; transactions are paused.':lines.join(' ');
 $('owned-items').replaceChildren();
 for(const text of [s.effects.desk?'Study desk · placed at Home Base':null,s.effects.laptop?'Laptop · installed at Home Base':null,s.effects.wellbeing?'Green corner · planted at Home Base':null].filter(Boolean)){const p=document.createElement('p');p.textContent=text;$('owned-items').append(p);}
 if(!$('owned-items').children.length)$('owned-items').textContent='Your story is just starting. Earn, save or choose your first item.';
}
function showReceipt(before,after){
 const e=after.log.at(-1);if(!e)return;
 const box=$('receipt');box.replaceChildren();
 const tag=document.createElement('span');tag.className='eyebrow';tag.textContent=persistent?'CHOICE SAVED':'TEMPORARY PRACTICE';
 const amount=document.createElement('strong');amount.textContent=e.cashDelta?`${e.cashDelta>0?'+':''}${money(e.cashDelta)} available`:'A different kind of progress';
 const detail=document.createElement('p');detail.textContent=e.description;
 const result=document.createElement('p');const changes=[];
 for(const [key,label] of [['desk','Desk placed at Home Base'],['laptop','Laptop installed'],['wellbeing','Green corner planted'],['lamp','Community lamp funded'],['garden','Community planting funded']])if(!before.effects[key]&&after.effects[key])changes.push(label);
 if(e.savingsDelta)changes.push(`${money(after.savings)} now saved`);
 result.textContent=changes.join(' · ')||`Available ${money(after.cash)} · Saved ${money(after.savings)}`;
 box.append(tag,amount,detail,result);box.hidden=false;$('panel-receipt').replaceChildren(...[tag,amount,detail,result].map(n=>n.cloneNode(true)));$('panel-receipt').hidden=false;clearTimeout(receiptTimer);receiptTimer=setTimeout(()=>{box.hidden=true;$('panel-receipt').hidden=true;},10000);
 // Receipts remain visible inside the open player panel as well as over the world.
 $('message').textContent=e.description+'. '+result.textContent;
}

let scenePromise=null;
async function visitHome(){panel.hidden=true;$('home-world').hidden=false;document.body.classList.add('at-home');window.scrollTo(0,0);if(!scenePromise)scenePromise=import('./scene.mjs?v=dashboard-20260924').then(async({createScene})=>{draw=await createScene($('scene'));draw(project(doc));}).catch(()=>{$('scene').textContent='3D Home Base is unavailable. Your money, belongings and saved work are still accessible through My life.';});await scenePromise;currentView='home';for(const button of document.querySelectorAll('[data-view]'))button.setAttribute('aria-pressed',String(button.dataset.view===currentView));if(!panel.hidden)return;draw.focus?.('home');renderPlayer(project(doc));}
function renderDashboard(s){
 $('next-step-title').textContent='Get to know your world';$('next-step-detail').textContent='Explore buildings, the shop, Avatar Studio, markets and EST Prep—or take a quiet moment in the chapel. Open Progress for a short getting-started guide.';const goal=s.community<15000?15000:30000;$('overview-project-title').textContent=s.community<15000?'Shared lighting':s.community<30000?'Shared planting':'Demo projects funded';$('overview-project-detail').textContent=blocked?'Saved fund needs attention.':`${money(Math.min(s.community,goal))} / ${money(goal)} · Simulated class fund`;$('overview-project-progress').max=goal;$('overview-project-progress').value=blocked?0:Math.min(s.community,goal);
}
const catalogue=[['study-desk','Focused Study Desk','study-desk.png'],['laptop-upgrade','Laptop Upgrade','laptop-upgrade.png'],['wellbeing-pack','Wellbeing Pack','wellbeing-pack.png']];
function renderTracker(s){
 $('belongings-gallery').replaceChildren();
 for(const [id,name,file] of catalogue){if(!s.owned.includes(id))continue;const card=document.createElement('article');card.className='belonging';const image=document.createElement('img');image.src='assets/'+file;image.alt=name+' illustration';const title=document.createElement('strong');title.textContent=name;const detail=document.createElement('p');detail.textContent=money(CATALOG[id])+' · Owned · Placed at Home Base';card.append(image,title,detail);$('belongings-gallery').append(card);}
 if(!s.owned.length)$('belongings-gallery').textContent='Your purchases will appear here. You do not need to own anything to access learning.';
 $('progress-list').replaceChildren();
 for(const [milestone,title,description] of [
 ['building','Do you know your way around?','Explore the playable world and try entering a building. Find how to return to the world afterwards.'],
 ['shop','Have you visited the shop?','Find the shop in the Career Workshop and browse what is available. You do not need to buy anything.'],
 ['studio','Have you explored the Avatar Studio?','Open the Avatar Studio and check out the ways you can personalise your character.'],
 ['chapel','Take some time out in the chapel','Visit the chapel when you feel like a quiet moment. Pause, look around and take your time.'],
 ['oval','Head to the oval for a people surprise','Take a look around the oval and see who you discover.'],
 ['market','Have you been to the markets yet?','Visit the markets and meet Mara. Find out what is happening and what you can help with.'],
 ['est','Can you access EST Prep?','Find Enter EST Prep in the world’s destination controls and open the module. You do not need to complete it for this first look.']
 ]){const card=document.createElement('article');card.className='card';const heading=document.createElement('h3');heading.textContent=(s.explored.includes(milestone)?'✓ ':'')+title;const reward=document.createElement('p');reward.className='note';reward.textContent=s.explored.includes(milestone)?MILESTONES[milestone]+' badge earned · $100 received':'First visit · '+MILESTONES[milestone]+' badge + $100';card.append(reward);const descriptionNode=document.createElement('p');descriptionNode.textContent=description;card.append(heading,descriptionNode);$('progress-list').append(card);}
 $('class-projects').replaceChildren();for(const [label,target] of [['Shared lighting',15000],['Shared planting',30000]]){const card=document.createElement('div');card.className='project-goal';const text=document.createElement('p');text.textContent=label+' · '+money(Math.min(s.community,target))+' / '+money(target)+(s.community>=target?' · Funded in this demo':'');const progress=document.createElement('progress');progress.max=target;progress.value=Math.min(s.community,target);progress.setAttribute('aria-label',label+' simulated funding');card.append(text,progress);$('class-projects').append(card);}
}
for(const b of document.querySelectorAll('[data-open]'))b.onclick=()=>openPanel(b.dataset.open);
const workLibrary=mountWork({review:reviewMode,onChange:state=>{const active=state.entries.filter(x=>!x.archived);const latest=[...active].sort((a,b)=>Date.parse(b.revisions.at(-1).at)-Date.parse(a.revisions.at(-1).at))[0]?.revisions.at(-1);$('recent-work-title').textContent=latest?.title||'Your activity records, together.';$('recent-work-detail').textContent=latest?`Last saved ${new Date(latest.at).toLocaleString()} · ${latest.status==='finished'?'Finished by you':'Draft'}. Open the saved record to review it.`:'Save your market case note from the activity to review it here.';$('continue-work').textContent=latest?'Review my work →':'View my work →';$('progress-work-summary').textContent=`My work: ${active.filter(x=>x.revisions.at(-1).status==='finished').length} marked finished by you · ${active.filter(x=>x.revisions.at(-1).status==='draft').length} drafts. These labels do not award money, badges or assessment credit.`;}});
$('continue-work').onclick=()=>{workLibrary.resumeLatest();openPanel('work');};
if(reviewMode){document.querySelector('.practice-tag').textContent='REVIEW MODE';$('scene-hint').textContent='Temporary review world · Your saved Economy Lab is untouched';}
selectPanel(document.querySelector('[data-panel][aria-pressed="true"]')?.dataset.panel||'overview');

render();
$('tracker-loading').hidden=true;$('visit-home').disabled=false;
// Home Base loads only when requested; saved-work access does not depend on 3D.

