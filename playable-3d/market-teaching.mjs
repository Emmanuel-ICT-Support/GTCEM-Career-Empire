import {INITIATIVE_BEHAVIOURS,INITIATIVE_ACTIONS} from './market-initiative.mjs?v=mara-language-20261102';
import {describePlan} from './night-market-agency.js?v=initiative-arcade-20261014';

export const MARKET_BEHAVIOUR_EXAMPLES=Object.freeze([
 'Before the next group arrives, notice that the collection bags may run out and alert Mara. Checking whether supplies are already arranged avoids making an assumption; Mara controls purchasing.',
 'Compare how customers use ordering and collection. Suggest a clearer sign or a suitable collection position, try it within the agreed boundaries, and check packing as well as customer access.',
 'Tell Mara what you noticed and explain the information behind your suggestion. Listen to the crew’s reasons and discuss a small trial instead of silently taking over.',
 'Ask Sam what support would be useful and check your current priorities. Sorting empty bags together can help; food handling and payments stay with the trained crew.',
 'Ask Mara for supervised order-number checking and the training it needs. Finish or hand over your current task first. Ask about missing orders; do not take on payments or food substitutions.'
]);
export const MARKET_BEHAVIOUR_CHECKS=Object.freeze([
 {prompt:'Why does the packaging example show being proactive?',reason:'It anticipates a likely shortage and raises it before work is disrupted.',other:'It means buying supplies yourself without checking.',feedback:'Anticipating a need and alerting Mara early is being proactive. Checking existing arrangements avoids an assumption, and purchasing stays with the person authorised to do it.'},
 {prompt:'Why does comparing the sign or collection position show identifying ways to improve current work practices?',reason:'It investigates a possible improvement and checks the effect on the whole job.',other:'Any change is an improvement if the collection queue looks shorter.',feedback:'An improvement needs a reason and a check of its effect. Customer access may improve while packing slows down. Compare both and respect why the current practice exists.'},
 {prompt:'Why does discussing the suggestion with Mara show vocalising your opinions?',reason:'It shares an informed idea constructively and listens to the crew’s reasons.',other:'It means insisting on your idea or changing the roles without agreement.',feedback:'Vocalising your opinions involves constructive ideas, feedback or suggestions. Explain the information behind the idea and listen to other views; speaking most forcefully or taking over is not the aim.'},
 {prompt:'Why does sorting empty bags with Sam show helping fellow workers?',reason:'It offers useful support, checks priorities and stays within safe roles.',other:'It means doing Sam’s tasks for him, including jobs you have not been trained for.',feedback:'Helping fellow workers responds to support that is actually useful. Agree priorities and safe methods; helping does not require taking over food handling or other work beyond your training.'},
 {prompt:'Why does asking for supervised order-number training show seeking more responsibilities?',reason:'It asks for a suitable new task, training and agreed limits.',other:'It means taking charge of payments immediately to prove you can do more.',feedback:'Seeking more responsibilities includes asking for suitable tasks or training. Agree limits and workload with Mara first. Untrained payment handling or too much responsibility too soon can cause mistakes and stress.'}
]);
export function behaviourCheckFeedback(index,choice){const item=MARKET_BEHAVIOUR_CHECKS[index];return item&&['reason','other','unsure'].includes(choice)?(choice==='unsure'?'Consider this explanation: ':choice==='other'?'Compare the boundary: ':'That explanation connects the example: ')+item.feedback:null;}
export const TRANSFER_CASE=Object.freeze({
 text:'In a bike workshop, a new colleague is struggling with a heavy box. You are not trained to lift it and your own job is about to begin. What is a thoughtful first step?',
 choices:[
  {id:'alone',text:'Lift it alone and reorganise the store without asking',feedback:'Acting quickly is not enough. Untrained lifting can hurt someone, and changing a workplace without agreement can create another problem. Ask what help is needed, check priorities and seek a safe method or trained support.'},
  {id:'support',text:'Ask what support is needed, check priorities and seek a safe method or trained help',feedback:'That’s a useful first step. Helping fellow workers can include asking and coordinating safe support. Raising the concern early can also show being proactive and vocalising your opinions. It does not mean doing an unsafe lift yourself.'},
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
 if(!actions.length)return {status:'Example · you haven’t tried this action yet',detail:'This is an example. Which of your own actions could show this way of taking initiative?'};
 return {status:'You tried this in the game',detail:actions.map(e=>INITIATIVE_ACTIONS[e.action].action+' '+(e.support==='with-hint'?'This action followed a hint.':'You selected this opportunity in the simulation.')).join(' ')};
}
export function transferFeedback(id){return TRANSFER_CASE.choices.find(c=>c.id===id)?.feedback||null;}

// Presentation only: no score, timer, new saved event or competence award.
export function createMarketTeaching({show,dialog,state,complete,onMissingTrial,close,resources=()=>[]}){
 let step=0,signature='',answer=null,checks={};
 const insert=node=>dialog.querySelector('.market-choices').before(node);
 function card(title,body,className=''){const item=document.createElement('section');item.className='market-teaching-card '+className;const heading=document.createElement('h3'),copy=document.createElement('p');heading.textContent=title;copy.textContent=body;item.append(heading,copy);return item;}
 function decorate(stage,{previous=false}={}){
  dialog.classList.add('market-teaching');dialog.dataset.marketTeachingStage=stage;
  const primary=dialog.querySelector('.market-choices button');if(primary){primary.classList.add('market-teaching-primary');primary.dataset.teachingPrimary='true';}
  const items=resources();if(items.length||previous){const optional=document.createElement('details');optional.className='market-teaching-resources';const summary=document.createElement('summary');summary.textContent='Optional help & resources';optional.append(summary);if(previous){const back=document.createElement('button');back.textContent='Previous part';back.onclick=()=>{step=Math.max(0,step-1);render();};optional.append(back);}for(const [label,action]of items){const button=document.createElement('button');button.textContent=label;button.onclick=action;optional.append(button);}dialog.querySelector('.market-choices').after(optional);}
  const heading=dialog.querySelector('h2');heading.tabIndex=-1;heading.focus({preventScroll:true});dialog.scrollTop=0;
 }
 dialog.addEventListener('keydown',event=>{if(!dialog.classList.contains('market-teaching')||event.key!=='Tab')return;const items=[...dialog.querySelectorAll('button,a,input,summary,[tabindex]')].filter(e=>!e.disabled&&e.tabIndex>=0&&e.getClientRects().length);if(!items.length)return;const first=items[0],last=items.at(-1);if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog.querySelector('h2'))){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
 function next(){step++;render();}
 function render(){
  const s=state(),record=recordedTrial(s);if(!record?.inspected)return onMissingTrial();
  if(step===0){
   show('Let’s look at your shift',`Trial ${record.number}: ${record.plan}`, [['How did I show initiative?',next]],'Your trial tells a story. What helped, and what still needs work?');
   insert(card('What the customer group did',record.facts.join(' ')));
   insert(card('What you checked',record.information.join(' · ')));
   insert(card('Other ways you helped',record.actions.length?record.actions.map(e=>e.text+' '+(e.support==='with-hint'?'Supported after a hint.':'Selected in the simulation.')).join(' '):'You tried the queue setup. The examples next will show other ways to take initiative too.'));
   decorate('record');return;
  }
  if(step>=1&&step<=5){
   const index=step-1,b=INITIATIVE_BEHAVIOURS[index],connection=behaviourConnection(s,index);
   const check=checks[index]||{choice:null,reviewed:false},question=MARKET_BEHAVIOUR_CHECKS[index];
   show(b.term,b.meaning,[[check.reviewed?(step<5?'Next behaviour':'See a worked example'):'Check this example',check.reviewed?next:()=>{if(check.choice){check.reviewed=true;checks[index]=check;render();}},!check.reviewed&&!check.choice]],`Example ${step} of 5 · These ways can overlap. Think about what you did and why.`);
   insert(card('At the Sunday Market',MARKET_BEHAVIOUR_EXAMPLES[index]));insert(card(connection.status,connection.detail,'market-evidence-status'));insert(card('Keep in mind',b.boundary));
   if(check.reviewed){const feedback=card('Let’s compare',behaviourCheckFeedback(index,check.choice));feedback.setAttribute('role','status');insert(feedback);}
   else {const field=document.createElement('fieldset');field.className='market-transfer-options';const legend=document.createElement('legend');legend.textContent=question.prompt;field.append(legend);for(const [value,text]of [['reason',question.reason],['other',question.other],['unsure','I’m not sure yet — show an explanation']]){const label=document.createElement('label'),input=document.createElement('input'),copy=document.createElement('span');input.type='radio';input.name='market-behaviour-check';input.value=value;input.checked=check.choice===value;input.onchange=()=>{check.choice=value;checks[index]=check;dialog.querySelector('[data-teaching-primary]').disabled=false;};copy.textContent=text;label.append(input,copy);field.append(label);}insert(field);}
   decorate('behaviour-'+step,{previous:true});return;
  }
  if(step===6){
   show('Before the next rush','Imagine there are two collection bags left and six orders on the way. What could you do?',[['Try a different workplace',next]],'Asking for support can come before taking action. Use information, agreement and a check of what happened to explain a useful first step.');
   const examples=[['What is happening?','Two bags remain; six orders are expected. The crew may run short.'],['What information or support is needed?','Ask Mara what is already arranged. She controls purchasing and can check the spare supplies.'],['What is a useful, agreed response?','Agree a safe contribution, such as helping sort empty bags within your role.'],['What should be checked afterwards?','Check that the crew has what it needs and that the walkway remains clear.']];
   insert(card('Why initiative can matter','Useful initiative may bring greater autonomy or recognition, improve work efficiency, and support employment or advancement opportunities. These are possible benefits, not automatic rewards. A change can also create costs for colleagues, so check what happened.'));
   const grid=document.createElement('div');grid.className='market-worked-guide';for(const [title,text]of examples)grid.append(card(title,text));insert(grid);const context=document.createElement('details');context.className='market-teaching-resources';const label=document.createElement('summary'),source=document.createElement('a');label.textContent='Curriculum connection';source.href='https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0008/1262159/Careers-and-Employability-General-Year-12-Syllabus-for-teaching-from-2027.PDF#page=13';source.target='_blank';source.rel='noopener';source.textContent='2027 Year 12 syllabus · Unit 3 Enterprising behaviours · printed page 9';context.append(label,source);insert(context);decorate('worked',{previous:true});return;
  }
  if(step===7){
   show('Try another workplace',TRANSFER_CASE.text,[['Check my thinking',()=>{if(answer)next();},!answer]],'Pick a first step. Unsure? You can ask for help. We’ll talk through every choice.');
   const field=document.createElement('fieldset');field.className='market-transfer-options';const legend=document.createElement('legend');legend.textContent='What would you do first?';field.append(legend);
   for(const item of TRANSFER_CASE.choices){const label=document.createElement('label'),input=document.createElement('input'),text=document.createElement('span');input.type='radio';input.name='market-transfer';input.value=item.id;input.checked=answer===item.id;input.onchange=()=>{answer=item.id;dialog.querySelector('[data-teaching-primary]').disabled=false;};text.textContent=item.text;label.append(input,text);field.append(label);}insert(field);decorate('application',{previous:true});return;
  }
  show('Let’s compare',transferFeedback(answer),[['Finish my review',complete]],'Initiative can start with a small, useful step. Check what’s needed, agree what you can do, and ask for support.');decorate('feedback',{previous:true});
 }
 function debrief({restart=false}={}){const r=recordedTrial(state());const key=JSON.stringify(r);if(restart||key!==signature){signature=key;step=0;answer=null;checks={};}render();}
 return {debrief,snapshot:()=>({stage:dialog.dataset.marketTeachingStage||null,step,answer,answerSaved:false})};
}
