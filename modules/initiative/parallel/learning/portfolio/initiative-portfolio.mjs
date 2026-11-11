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
export function resolvePublicInitiativeLaunch(search='') {
  return new URLSearchParams(search).get('publicInitiative')==='1'
    ? {status:'ready',skillId:'initiative',skillTitle:'Initiative',contextId:'gameplay',selectedSkillIds:['initiative'],selectedSubskillIds:[],anonymous:true}
    : {status:'ignored'};
}
export function makeAnonymousEntry(state) {
  if(!state||!state.responses)throw Error('Missing reflection');
  const allowed=new Set(INITIATIVE_SUBSKILLS.map(s=>`initiative:${s.id}`));
  return {skillId:'initiative',skillTitle:'Initiative',skillIds:['initiative'],contextId:'gameplay',experienceDate:String(state.experienceDate||''),subskillTags:(state.selectedSubskillIds||[]).filter(id=>allowed.has(id)).map(id=>({skillId:'initiative',subskillId:id.split(':')[1]})),responses:Object.fromEntries(['situation','task','actions','results','nextSteps'].map(k=>[k,String(state.responses[k]||'')])),status:'anonymous self-reflection; not submitted or assessed'};
}
export function buildPublicMarketPortfolioUrl(dashboardUrl,marketUrl) {
  const url=new URL(buildMarketPortfolioUrl(dashboardUrl,marketUrl));url.searchParams.set('publicInitiative','1');return url.href;
}
