// Convenience state only: local character IDs are not authenticated students.
export const ECHO_VERSION=2;
export const ECHO_STEPS=[
 ['Welcome to Year 12','Welcome to Year 12 Careers & Employability. I’m Echo — your guide to getting started.'],
 ['A different kind of year','This year, you’ll learn through experiences: explore, make choices, try things and see what happens.'],
 ['First · Course Documents','Open Careers and Employability Course Documents right here beside me. Inspect what you’ll learn and what the course expects of you.','resources','Inspect Course Documents'],
 ['Put learning into practice','AI and technology make information easier to find. The challenge is knowing what you need, checking what you find, and putting it into practice.\n\nHere, you’ll learn through experiences—and discover questions you hadn’t thought to ask.'],
 ['Meet your future self','Your avatar is your persona in this world. Look after them, develop their skills and imagine who they could become.'],
 ['Next · Your avatar','Visit Avatar Studio to create or develop your persona. Choose your look, explore your future self, then Save & return.','studio','Visit Avatar Studio'],
 ['Your experience matters','Bring your own experiences into your Career Portfolio entries. Explain what you tried, learned and could use again.'],
 ['Make room for fun','Be curious. Have a go. Ask for help and try again — you don’t need to get everything right first time.'],
 ['Make yourself at home','Explore the world at your own pace. Walk with WASD or the arrow controls; drag to look around. Places can help you find your way.'],
 ['Try the Market Experience','Meet the stallholders and try a small experience at Live Music & Sunday Markets. It’s a taste of what’s to come.','market','Find the Market Experience'],
 ['Your Year 12 journey begins','Your choices, experiences and reflections will shape the year. Revisit your avatar or Course Documents — and come back to me any time.'],
];
export function createEchoStore(storage,{review=false}={}){
 const memory=new Map();let persistent=!review;
 const key=id=>'ce-echo-v2:'+encodeURIComponent(id);
 function read(id){let raw;try{raw=memory.has(key(id))?memory.get(key(id)):(!review?storage?.getItem(key(id)):null);}catch{persistent=false;}
  memory.set(key(id),raw??null);
  try{const s=JSON.parse(raw);if(s?.version===ECHO_VERSION&&Number.isInteger(s.step)&&s.step>=0&&s.step<ECHO_STEPS.length&&['new','reading','skipped','seen'].includes(s.status))return {version:ECHO_VERSION,step:s.step,status:s.status,skippedTasks:Array.isArray(s.skippedTasks)?s.skippedTasks.filter(x=>[2,5,9].includes(x)):[],avatarSaved:s.avatarSaved===true,resourcesVisited:s.resourcesVisited===true,marketVisited:s.marketVisited===true};}catch{}
  return {version:ECHO_VERSION,step:0,status:'new',skippedTasks:[],avatarSaved:false,resourcesVisited:false,marketVisited:false};
 }
 function write(id,value){const previous=read(id);const s={version:ECHO_VERSION,skippedTasks:value.skippedTasks??previous.skippedTasks,avatarSaved:value.avatarSaved??previous.avatarSaved,resourcesVisited:value.resourcesVisited??previous.resourcesVisited,marketVisited:value.marketVisited??previous.marketVisited,step:Math.max(0,Math.min(ECHO_STEPS.length-1,value.step|0)),status:['reading','skipped','seen'].includes(value.status)?value.status:'reading'};const raw=JSON.stringify(s);memory.set(key(id),raw);if(!review)try{storage?.setItem(key(id),raw);if(!storage)persistent=false;}catch{persistent=false;}return s;}
 return {read,write,get persistent(){return persistent;}};
}

// Both the conversation and first-day card use this same orientation contract.
// Visiting a resource point is never evidence of reading unavailable documents.
export const TASK_STEPS=[2,5,9];
export function taskDone(state,step){return step===2?state.resourcesVisited:step===5?state.avatarSaved:step===9?state.marketVisited:false;}
export function resumeStep(state){return TASK_STEPS.includes(state.step)&&taskDone(state,state.step)?state.step+1:state.step;}
export function arrivalGuidance({state}){
 const step=resumeStep(state);
 if(state.status==='new')return {title:'Meet Echo',detail:'Click the little blue guide beside you, or press E. Explore or skip a task whenever you like.',progress:0};
 if(TASK_STEPS.includes(step))return {title:ECHO_STEPS[step][0],detail:ECHO_STEPS[step][1],progress:Math.round(step/11*75)};
 return {title:step===10?'Your Year 12 journey begins':'Your next step with Echo',detail:step===10?'Explore freely. Revisit skipped tasks through Places or Echo. Course documents remain pending until your teacher confirms them.':'Talk to Echo for your next short message, or explore freely. Course Documents is beside Echo at the front.',progress:Math.round(step/11*75)};
}
