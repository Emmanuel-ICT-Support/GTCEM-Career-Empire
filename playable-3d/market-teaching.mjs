import {INITIATIVE_BEHAVIOURS,INITIATIVE_ACTIONS} from './market-initiative.mjs?v=initiative-arcade-20261014';
import {describePlan} from './night-market-agency.js?v=initiative-arcade-20261014';

export const MARKET_BEHAVIOUR_EXAMPLES=Object.freeze([
 'Before the next group arrives, notice that the collection bags may run out and alert Mara. Checking whether supplies are already arranged avoids making an assumption; Mara controls purchasing.',
 'Compare how customers use ordering and collection. Suggest a clearer sign or a suitable collection position, try it within the agreed boundaries, and check packing as well as customer access.',
 'Tell Mara what you noticed and explain the information behind your suggestion. Listen to the crew’s reasons and discuss a small trial instead of silently taking over.',
 'Ask Sam what support would be useful and check your current priorities. Sorting empty bags together can help; food handling and payments stay with the trained crew.',
 'Ask Mara for supervised order-number checking and the training it needs. Finish or hand over your current task first. Ask about missing orders; do not take on payments or food substitutions.'
]);
export const TRANSFER_CASE=Object.freeze({
 text:'In a bike workshop, a new colleague is struggling with a heavy box. You are not trained to lift it and your own job is about to begin. What is a thoughtful first step?',
 choices:[
  {id:'alone',text:'Lift it alone and reorganise the store without asking',feedback:'Acting quickly is not enough. Untrained lifting can hurt someone, and changing a workplace without agreement can create another problem. Ask what help is needed, check priorities and seek a safe method or trained support.'},
  {id:'support',text:'Ask what support is needed, check priorities and seek a safe method or trained help',feedback:'This is a useful, bounded first step. Helping fellow workers can include asking and coordinating safe support. Raising the concern early can also show being proactive and vocalising your opinions. It does not mean doing an unsafe lift yourself.'},
  {id:'takeover',text:'Take over the colleague’s work to prove you deserve more responsibility',feedback:'Seeking more responsibilities includes asking for training, agreement and a manageable workload. Taking over can overload you or undermine the colleague. Offer suitable support and agree priorities first.'},
  {id:'unsure',text:'I’m not sure yet — help me reason it through',feedback:'Start with what you notice, then ask what support is needed. Check your priorities and involve someone trained in a safe method. Initiative can mean seeking support before acting; it does not require having every answer immediately.'}
 ]
});
export function recordedTrial(state){
 const trial=state.trials?.at(-1);
 if(!trial)return null;
 return {number:state.trials.length,plan:describePlan(trial.plan),facts:[...trial.outcome.facts],inspected:trial.inspected===true,information:[['Customer conversation',state.listened],['Queue observation',state.observed],['Sam’s workflow',state.learned]].map(([label,used])=>label+': '+(used?'opened':'not opened')),actions:(state.initiativeEvidence||[]).filter(e=>Object.hasOwn(INITIATIVE_ACTIONS,e.action)).map(e=>({action:e.action,text:INITIATIVE_ACTIONS[e.action].action,support:e.support}))};
}
export function behaviourConnection(state,index){
 const actions=(state.initiativeEvidence||[]).filter(e=>INITIATIVE_ACTIONS[e.action]?.behaviour===index);
 if(!actions.length)return {status:'Illustrated here · no specific action recorded',detail:'This market example shows the behaviour. Reading it does not mean you practised it. Use your own actions and explanation to justify a connection.'};
 return {status:'Recorded simulation practice · not verified competence',detail:actions.map(e=>INITIATIVE_ACTIONS[e.action].action+' '+(e.support==='with-hint'?'This action followed a hint.':'You selected this opportunity in the simulation.')).join(' ')};
}
export function transferFeedback(id){return TRANSFER_CASE.choices.find(c=>c.id===id)?.feedback||null;}

// Presentation only: no score, timer, new saved event or competence award.
export function createMarketTeaching({show,dialog,state,startShift,complete,onMissingTrial,close,introImage=()=>null,resources=()=>[]}){
 let step=0,signature='',answer=null;
 const insert=node=>dialog.querySelector('.market-choices').before(node);
 function card(title,body,className=''){const item=document.createElement('section');item.className='market-teaching-card '+className;const heading=document.createElement('h3'),copy=document.createElement('p');heading.textContent=title;copy.textContent=body;item.append(heading,copy);return item;}
 function decorate(stage,{previous=false}={}){
  dialog.classList.add('market-teaching');dialog.dataset.marketTeachingStage=stage;
  const primary=dialog.querySelector('.market-choices button');if(primary){primary.classList.add('market-teaching-primary');primary.dataset.teachingPrimary='true';}
  const items=resources();if(items.length||previous){const optional=document.createElement('details');optional.className='market-teaching-resources';const summary=document.createElement('summary');summary.textContent='Optional help & resources';optional.append(summary);if(previous){const back=document.createElement('button');back.textContent='Previous part';back.onclick=()=>{step=Math.max(0,step-1);render();};optional.append(back);}for(const [label,action]of items){const button=document.createElement('button');button.textContent=label;button.onclick=action;optional.append(button);}dialog.querySelector('.market-choices').after(optional);}
  const heading=dialog.querySelector('h2');heading.tabIndex=-1;heading.focus({preventScroll:true});dialog.scrollTop=0;
 }
 dialog.addEventListener('keydown',event=>{if(!dialog.classList.contains('market-teaching')||event.key!=='Tab')return;const items=[...dialog.querySelectorAll('button,a,input,summary,[tabindex]')].filter(e=>!e.disabled&&e.tabIndex>=0&&e.getClientRects().length);if(!items.length)return;const first=items[0],last=items.at(-1);if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog.querySelector('h2'))){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
 function intro(){
  show('Meet the Juniper crew','Initiative means noticing what needs doing and taking a thoughtful first step, without waiting to be told every move. Mara needs help making ordering and collection work smoothly.',[[state().accepted?'Continue my shift':'Start my shift',startShift]],'Your agreed job: try an arrangement, observe the result and explain what you found. Fictional pay stays $20 gross − $2 community tax = $18 plus a crew pass. Help, retries and mixed results do not reduce it.');
  const picture=introImage();if(picture){const image=document.createElement('img');image.className='market-intro-image';image.src=picture;image.alt='Mara and Sam at Juniper Kitchen, the workplace for your shift';insert(image);}
  insert(card('Two customer routes','Phone orders are already paid: customers collect them. Walk-up customers order and pay at the counter.','market-route-summary'));
  insert(card('Your bounded attempt','Look around, ask the customer or Sam, or test the current arrangement first. You may try the provided sign and collection settings. There is no timer or required first failure.'));
  insert(card('Stay within your role','Keep the emergency walkway clear. Do not handle payments, substitute food or do untrained lifting. Ask Mara about unfamiliar tasks, training and responsibility.'));
  decorate('intro');
 }
 function next(){step++;render();}
 function render(){
  const s=state(),record=recordedTrial(s);if(!record?.inspected)return onMissingTrial();
  if(step===0){
   show('Your shift: what you actually tried',`Trial ${record.number}: ${record.plan}`, [['Connect this to initiative',next]],'These are recorded simulation actions and observations, not a grade or proof of workplace competence. A mixed or unresolved result is useful to report honestly.');
   insert(card('What the customer group did',record.facts.join(' ')));
   insert(card('Information you opened',record.information.join(' · ')));
   insert(card('Specific initiative actions recorded',record.actions.length?record.actions.map(e=>e.text+' '+(e.support==='with-hint'?'Supported after a hint.':'Selected in the simulation.')).join(' '):'No optional initiative-action vignette was recorded. Your arrangement and result review are recorded above; we do not infer all five behaviours from them.'));
   decorate('record');return;
  }
  if(step>=1&&step<=5){
   const index=step-1,b=INITIATIVE_BEHAVIOURS[index],connection=behaviourConnection(s,index);
   show(b.term,b.meaning,[[step<5?'Next behaviour':'See a worked example',next]],`Curriculum example ${step} of 5 · These ways can overlap. They are not tasks to perform in sequence; a connection needs action evidence and explanation.`);
   insert(card('At the Sunday Market',MARKET_BEHAVIOUR_EXAMPLES[index]));insert(card(connection.status,connection.detail,'market-evidence-status'));insert(card('Check the boundary',b.boundary));decorate('behaviour-'+step,{previous:true});return;
  }
  if(step===6){
   show('A worked example: reason before acting','Illustrated example: before the next group, two collection bags remain for six expected orders. This is a model to learn from, not a record of your own actions.',[['Try a different workplace',next]],'Asking for support can come before taking action. Use information, agreement and a check of what happened to explain a useful first step.');
   const examples=[['What is happening?','Two bags remain; six orders are expected. The crew may run short.'],['What information or support is needed?','Ask Mara what is already arranged. She controls purchasing and can check the spare supplies.'],['What is a useful, agreed response?','Agree a safe contribution, such as helping sort empty bags within your role.'],['What should be checked afterwards?','Check that the crew has what it needs and that the walkway remains clear.']];
   insert(card('Why initiative can matter','Useful initiative may bring greater autonomy or recognition, improve work efficiency, and support employment or advancement opportunities. These are possible benefits, not automatic rewards. A change can also create costs for colleagues, so check what happened.'));
   const grid=document.createElement('div');grid.className='market-worked-guide';for(const [title,text]of examples)grid.append(card(title,text));insert(grid);const context=document.createElement('details');context.className='market-teaching-resources';const label=document.createElement('summary'),source=document.createElement('a');label.textContent='Curriculum connection';source.href='https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0008/1262159/Careers-and-Employability-General-Year-12-Syllabus-for-teaching-from-2027.PDF#page=13';source.target='_blank';source.rel='noopener';source.textContent='2027 Year 12 syllabus · Unit 3 Enterprising behaviours · printed page 9';context.append(label,source);insert(context);decorate('worked',{previous:true});return;
  }
  if(step===7){
   show('Try another workplace',TRANSFER_CASE.text,[['Check my thinking',()=>{if(answer)next();},!answer]],'Choose a first step, including “I’m not sure yet” if useful. Every response receives an explanation. This practice answer is not saved or graded and does not change your agreed pay.');
   const field=document.createElement('fieldset');field.className='market-transfer-options';const legend=document.createElement('legend');legend.textContent='What would you do first?';field.append(legend);
   for(const item of TRANSFER_CASE.choices){const label=document.createElement('label'),input=document.createElement('input'),text=document.createElement('span');input.type='radio';input.name='market-transfer';input.value=item.id;input.checked=answer===item.id;input.onchange=()=>{answer=item.id;dialog.querySelector('[data-teaching-primary]').disabled=false;};text.textContent=item.text;label.append(input,text);field.append(label);}insert(field);decorate('application',{previous:true});return;
  }
  show('Compare your reasoning',transferFeedback(answer),[['Finish my learning review',complete]],'Keep the connection: initiative includes a constructive first step, suitable boundaries and support. Naming an example or reading feedback does not certify independent workplace competence. Your agreed wages are unchanged.');decorate('feedback',{previous:true});
 }
 function debrief({restart=false}={}){const r=recordedTrial(state());const key=JSON.stringify(r);if(restart||key!==signature){signature=key;step=0;answer=null;}render();}
 return {intro,debrief,snapshot:()=>({stage:dialog.dataset.marketTeachingStage||null,step,answer,answerSaved:false})};
}
