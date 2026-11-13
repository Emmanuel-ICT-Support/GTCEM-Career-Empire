export const INITIATIVE_SUBSKILLS = Object.freeze([
  { id:'being-proactive', title:'Being proactive', description:'Anticipate a useful task or problem and take an appropriate first step.', learningId:'ce.term.initiative.act', curriculumId:'CEM12-U3-EB-02.d1' },
  { id:'improving-work-practices', title:'Identifying ways to improve current work practices', description:'Suggest safer, clearer or more efficient ways to work.', learningId:'ce.term.initiative.improve', curriculumId:'CEM12-U3-EB-02.d2' },
  { id:'vocalising-opinions', title:'Vocalising your opinions', description:'Share informed ideas or concerns constructively and listen to others.', learningId:'ce.term.initiative.speak', curriculumId:'CEM12-U3-EB-02.d3' },
  { id:'helping-fellow-workers', title:'Helping fellow workers', description:'Offer useful support while checking team priorities and safe methods.', learningId:'ce.term.initiative.support', curriculumId:'CEM12-U3-EB-02.d4' },
  { id:'seeking-more-responsibilities', title:'Seeking more responsibilities', description:'Ask for appropriate new duties, training and agreed support.', learningId:'ce.term.initiative.step-up', curriculumId:'CEM12-U3-EB-02.d5' }
]);
export function addInitiativeCategory(data) {
  if (!Array.isArray(data?.categories)) throw new Error('Missing skills categories');
  if (data.categories.some(x=>x.id==='initiative')) throw new Error('Initiative already exists; reconcile current category first');
  return {...data,categories:[...data.categories,{id:'initiative',title:'Initiative',description:'Take a proactive approach to work tasks, challenges and unexpected events, within your role, training and safety limits.',iconLabel:'Initiative',logoPath:'../Assets/employability-logos/initiative/initiative.png',curriculumIds:['CEM12-U3-EB-01','CEM12-U3-EB-02','CEM12-U3-EB-03'],subskills:INITIATIVE_SUBSKILLS.map((s,i)=>({...s,logoPath:`../Assets/employability-logos/initiative/${s.id}.png`}))}]};
}
export function buildMarketPortfolioUrl(dashboardUrl, marketUrl) {
  const market=new URL(marketUrl); const url=new URL(dashboardUrl,market);
  if (!['http:','https:'].includes(url.protocol)||url.origin!==market.origin||!url.pathname.endsWith('/dashboards/student.html')) throw new Error('Use the same-origin Career Empire student dashboard');
  // No names, learner IDs, action claims, text, rewards or arbitrary return URLs cross in the link.
  url.search='';url.hash='';url.searchParams.set('portfolio','initiative');url.searchParams.set('context','gameplay');url.searchParams.set('from','markets');
  return url.href;
}
export function resolveInitiativeLaunch({search='',studentLogin=null,moduleStatuses={},categories=[],draftOpen=false}={}) {
  const params=new URLSearchParams(search);
  if(params.get('portfolio')!=='initiative')return {status:'ignored'};
  if(!studentLogin?.id&&!studentLogin?.preview)return {status:'blocked',reason:'Sign in as a student before opening your portfolio.'};
  if(moduleStatuses['employability-skills']!=='active'||moduleStatuses.initiative!=='active')return {status:'blocked',reason:'Your teacher has not enabled both Initiative and the Employability Skills Portfolio.'};
  if(!categories.some(x=>x.id==='initiative'))return {status:'blocked',reason:'Initiative portfolio content is unavailable. Return to the Market and try again later.'};
  if(draftOpen)return {status:'blocked',reason:'Your current STAR draft is still open. Finish or close it before starting an Initiative reflection.'};
  return {status:'ready',skillId:'initiative',skillTitle:'Initiative',contextId:'gameplay',selectedSkillIds:['initiative'],selectedSubskillIds:[],source:'markets',notice:'Reflect on your own Market experience. Choose only the behaviours your actions support; opening this builder is not evidence of completion.'};
}
export function getMarketReturnUrl(dashboardUrl) {
  const url=new URL(dashboardUrl); if(!['http:','https:'].includes(url.protocol)||!url.pathname.endsWith('/dashboards/student.html'))throw new Error('Invalid Career Empire dashboard route');
  return new URL('../playable-3d/',url).href;
}
export function getPublicMarketReturnUrl(dashboardUrl){
 const url=new URL(getMarketReturnUrl(dashboardUrl));
 url.searchParams.set('experience','sunday-markets');url.searchParams.set('marketReturn','1');
 return url.href;
}
export function resumeOpenMarket(view){
 try{
  const opener=view.opener;if(!opener||opener.closed)return false;
  const current=new URL(view.location.href),target=new URL(opener.location.href);
  if(target.origin!==current.origin||target.pathname!==new URL(getMarketReturnUrl(current.href)).pathname)return false;
  if(typeof opener.CareerEmpireReturnToMarket!=='function'||opener.CareerEmpireReturnToMarket()!==true)return false;
  opener.focus();return true;
 }catch{return false;}
}
export function resolvePublicInitiativeLaunch(search='') {
  return new URLSearchParams(search).get('publicInitiative')==='1'
    ? {status:'ready',skillId:'initiative',skillTitle:'Initiative',contextId:'gameplay',selectedSkillIds:['initiative'],selectedSubskillIds:[],anonymous:true}
    : {status:'ignored'};
}
export function makeAnonymousEntry(state) {
  if(!state||!state.responses)throw Error('Missing reflection');
  const contextId=state.contextId??'gameplay';if(!PUBLIC_INITIATIVE_CONTEXTS.includes(contextId))throw Error('Choose a supported experience context');
  const allowed=new Set(INITIATIVE_SUBSKILLS.map(s=>`initiative:${s.id}`));
  return {skillId:'initiative',skillTitle:'Initiative',skillIds:['initiative'],contextId,experienceDate:String(state.experienceDate||''),subskillTags:(state.selectedSubskillIds||[]).filter(id=>allowed.has(id)).map(id=>({skillId:'initiative',subskillId:id.split(':')[1]})),responses:Object.fromEntries(['situation','task','actions','results','nextSteps'].map(k=>[k,String(state.responses[k]||'')])),status:'anonymous self-reflection; not submitted or assessed'};
}
export function buildPublicMarketPortfolioUrl(dashboardUrl,marketUrl) {
  const url=new URL(buildMarketPortfolioUrl(dashboardUrl,marketUrl));url.searchParams.set('publicInitiative','1');return url.href;
}

export const PUBLIC_INITIATIVE_CONTEXTS=Object.freeze(['school','workplace','community','gameplay']);
const PUBLIC_INITIATIVE_EXAMPLES=Object.freeze({
 school:{situation:['During a fictional school group project, I noticed that no one had checked our equipment list.'],task:['My agreed role was to check the equipment and tell the group what was missing before we started.'],actions:['I checked the list, explained the gap and offered to make a checklist after asking the group and teacher.'],results:['In this fictional example, the checklist helped the group find a missing item. I would check whether it also created extra work.'],nextSteps:['Next time, I would agree who checks the list and ask the group whether the checklist was useful.']},
 workplace:{situation:['During a fictional work shift, I noticed the shared supplies were running low before a busy period.'],task:['My role was to check the supply level and report it to my supervisor, within my training and responsibilities.'],actions:['I checked the stock, told my supervisor and asked whether I could help prepare the agreed supplies safely.'],results:['In this fictional example, the team had the agreed supplies ready. I would check the actual result and any feedback rather than assume it worked.'],nextSteps:['Next time, I would agree a check time with my supervisor and review whether it reduced interruptions.']},
 community:{situation:['At a fictional community event, I noticed that a sign was difficult for arriving visitors to see.'],task:['My volunteer role was to help visitors while keeping the entrance and accessible path clear.'],actions:['I explained the problem to the event lead and offered to test a clearer sign position with their approval.'],results:['In this fictional example, visitors found the entrance more easily. I would also check that the sign did not block access.'],nextSteps:['Next time, I would ask visitors and the event lead what still needed to improve.']},
 gameplay:{situation:["In a fictional Sunday Markets run, I noticed that Mara's collection queue was blocking the stall entrance."],task:["My agreed task was to help keep access clear while following Mara's stall layout and role limits."],actions:['I noticed the blockage, explained it to Mara and asked to try a clearer queue marker before making a change.'],results:['In this fictional Market example, the entrance became clearer. I would check the observed result and whether another stall was affected.'],nextSteps:['On my next Market visit, I would compare the queue before and after the trial and ask Mara what still needed work.']}
});
export function contextExamples(contextId,stepKey,fallback=[]){return PUBLIC_INITIATIVE_EXAMPLES[contextId]?.[stepKey]||fallback;}

// Fictional writing models, shared by the normal portfolio and anonymous views.
// They never populate responses, award evidence or claim that an event occurred.
const PORTFOLIO_MODELS = {
  communication: {
    situations: ['a school group needed clear task instructions', 'a customer needed an explanation during a work shift', 'new volunteers needed directions at a community event', 'customers needed clearer ordering and collection directions in a Market trial'],
    task: 'explain the agreed information clearly and check that the other person understood',
    actions: 'I listened, used plain language, adjusted the explanation and asked the person to repeat the next step',
    results: 'the person could explain the next step accurately',
    review: 'ask which part was unclear and improve that explanation'
  },
  'digital-literacy': {
    situations: ['a school group needed a reliable source for a shared research file', 'a work task required checking information in an agreed digital file', 'a community event needed accurate information for a digital notice', 'a Market trial needed a careful comparison of its fictional digital records'],
    task: 'use reliable information and handle the agreed digital file safely',
    actions: 'I checked the source and date, compared the information and checked access before updating the agreed file',
    results: 'the group could trace the information to its source and use the correct version',
    review: 'check the information again when its source or purpose changes'
  },
  teamwork: {
    situations: ['a school group needed to coordinate a joint task', 'a work team needed to share agreed tasks during a busy period', 'a volunteer team needed to coordinate event setup', "Mara's fictional Market crew needed to coordinate the stall trial"],
    task: 'complete my agreed role and support the team without taking over someone else\'s responsibility',
    actions: 'I checked the team plan, listened to others, completed my part and asked where appropriate help was needed',
    results: 'the team completed its agreed parts and could explain who was responsible for each task',
    review: 'ask the team what helped and agree how to handle the next shared task'
  },
  'time-management': {
    situations: ['several school tasks had overlapping deadlines', 'a work shift had several agreed tasks to finish', 'a community event needed preparation before its opening time', 'a fictional Market trial had several setup tasks to organise'],
    task: 'prioritise the agreed tasks and make a realistic plan before the deadline',
    actions: 'I compared deadlines and dependencies, estimated task times, used a checklist and reviewed the plan when priorities changed',
    results: 'the priority tasks were completed within the agreed time while lower priorities were reviewed',
    review: 'compare estimated and actual time and allow more checking time in the next plan'
  },
  'critical-thinking': {
    situations: ['a school group needed to judge a claim in its research', 'a work team needed to compare two proposed changes', 'a community group needed to compare event options fairly', 'a fictional Market trial produced results that needed careful interpretation'],
    task: 'evaluate the available evidence before recommending an option',
    actions: 'I compared sources, separated observations from assumptions, checked an alternative explanation and explained the limits',
    results: 'the group could see why the evidence supported one option and which uncertainty remained',
    review: 'seek missing evidence and reconsider the recommendation if the facts change'
  },
  'problem-solving': {
    situations: ['a school task could not proceed because a resource was missing', 'a work queue had a repeated bottleneck', 'a community event had an equipment problem', 'ordering and collection became mixed up during a fictional Market trial'],
    task: 'identify the problem and test a safe solution within my agreed role',
    actions: 'I asked questions, identified a likely cause, compared possible solutions and agreed a small safe trial',
    results: 'the trial reduced the observed problem, while the group checked for unwanted effects',
    review: 'compare the result with the starting problem and adjust the solution if needed'
  }
};
export function employabilityContextExamples(skillId, contextId, stepKey, fallback = []) {
  if (skillId === 'initiative') return contextExamples(contextId, stepKey, fallback);
  const model = PORTFOLIO_MODELS[skillId], index = PUBLIC_INITIATIVE_CONTEXTS.indexOf(contextId);
  if (!model || index < 0) return fallback;
  const examples = {
    situation: `In a fictional ${contextId === 'gameplay' ? 'gameplay' : contextId} example, ${model.situations[index]}.`,
    task: `My agreed task was to ${model.task}.`, actions: `${model.actions}.`,
    results: `In this fictional example, ${model.results}. I would check actual observations rather than assume success.`,
    nextSteps: `Next time, I would ${model.review}.`
  };
  return examples[stepKey] ? [examples[stepKey]] : fallback;
}
