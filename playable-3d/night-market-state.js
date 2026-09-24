import {DEFAULT_PLAN,NOTE_FIELDS,validPlan,evaluatePlan} from './night-market-agency.js?v=market-payoff-20260924';
// Local rehearsal only. This log never writes to profiles, the portfolio or accounts.
export const MARKET_KEY='ce-night-market-practice-v1';
export const VALUES=Object.freeze({gross:2000,tax:200,keepsake:600,save:500,donation:200});
export const MARKET_SHOP=Object.freeze({lantern:{name:'Amber lantern',price:600},plant:{name:'Little green plant',price:400}});
export const BADGES=Object.freeze({
 initiative:['Initiative','You proposed and tested a change to a workplace arrangement.'],
 problem:['Problem solving','You tested an idea and examined its consequences.'],
 listening:['Communication','You asked a customer what was unclear.'],
 clarity:['Problem solving','You made the collection point clear at the path.'],
 teamwork:['Teamwork','You agreed a useful role with a helper.'],
 adapting:['Adaptability','You changed your approach after customer feedback.']
});
export const freshState=()=>({revision:3,plan:{...DEFAULT_PLAN},trials:[],caseNote:{},shared:false,consolidated:false,observed:false,learned:false,proposal:null,placed:null,tested:false,reviewed:false,pass:false,encore:false,accepted:false,listened:false,attempted:false,solution:null,paid:false,wallet:0,savings:0,tax:0,donated:0,keepsake:false,purchases:[],rested:false,badges:[],events:[]});
export function applyEvent(previous,type){
 const s=structuredClone(previous),badge=id=>{if(!s.badges.includes(id))s.badges.push(id);};
 if(type?.type==='purchase'){
  const item=Object.hasOwn(MARKET_SHOP,type.item)?MARKET_SHOP[type.item]:null;if(s.revision<2||!item||!s.paid||s.wallet<item.price||s.purchases.includes(type.item)||(type.item==='lantern'&&s.keepsake)||s.events.length>=256)return previous;
  s.wallet-=item.price;s.purchases.push(type.item);if(type.item==='lantern')s.keepsake=true;s.events.push({type:'purchase',item:type.item});return s;
 }
 if(s.revision===3){
  const kind=typeof type==='string'?type:type?.type;
  if(['plan','share-plan','run-trial','inspect-trial','consolidate','case-note'].includes(kind)){
   if(!s.accepted&&kind!=='case-note')return previous;
   if(kind==='plan'){
    if(s.paid||!validPlan(type.plan)||JSON.stringify(s.plan)===JSON.stringify(type.plan))return previous;
    s.plan={...type.plan};s.tested=false;
   }else if(kind==='share-plan'){
    if(s.shared||s.paid)return previous;s.shared=true;
   }else if(kind==='run-trial'){
    if(s.paid||s.tested||s.trials.length>=12)return previous;
    const outcome=evaluatePlan(s.plan);s.trials.push({plan:{...s.plan},outcome,inspected:false});s.tested=true;s.reviewed=false;s.consolidated=false;s.solution=outcome.effective?'arrangement':null;if(!outcome.effective)s.attempted=true;
    if(Object.keys(DEFAULT_PLAN).some(k=>s.plan[k]!==DEFAULT_PLAN[k]))badge('initiative');
   }else if(kind==='inspect-trial'){
    const t=s.trials.at(-1);if(!t||t.inspected)return previous;t.inspected=true;s.reviewed=true;badge('problem');
    if(s.trials.length>1&&s.trials.slice(0,-1).some(t=>!t.outcome.effective))badge('adapting');
   }else if(kind==='consolidate'){
    if(!s.reviewed||s.consolidated)return previous;s.consolidated=true;
   }else{
    if(!type.fields||typeof type.fields!=='object'||Object.keys(type.fields).some(k=>!Object.hasOwn(NOTE_FIELDS,k)))return previous;
    if(Object.values(type.fields).some(v=>typeof v!=='string'||v.length>1200))return previous;
    if(JSON.stringify(s.caseNote)===JSON.stringify(type.fields))return previous;s.caseNote={...type.fields};
   }
   if(s.events.length>=256)return previous;s.events.push(structuredClone(type));return s;
  }
  if(['propose-sign','propose-helper','place-counter','place-path','assign-helper','test','review','sign-hidden','sign-clear','helper','buy'].includes(kind))return previous;
 }
 switch(type){
 case 'accept':if(s.accepted)return previous;s.accepted=true;break;
 case 'listen':if(!s.accepted||s.listened||s.paid)return previous;s.listened=true;if(s.revision===1)badge('listening');break;
 case 'observe':if(!s.accepted||s.observed||s.paid)return previous;s.observed=true;break;
 case 'learn':if(!s.accepted||s.learned||s.paid)return previous;s.learned=true;break;
 case 'propose-sign':case 'propose-helper':
  if(!s.listened||!s.observed||!s.learned||s.proposal||s.paid)return previous;
  s.proposal=type==='propose-sign'?'sign':'helper';break;
 case 'place-counter':case 'place-path':case 'assign-helper':
  if(!s.proposal||s.solution||s.paid)return previous;
  if(type==='assign-helper'&&s.proposal!=='helper'||type!=='assign-helper'&&s.proposal!=='sign')return previous;
  if(s.placed===type)return previous;s.placed=type;s.tested=false;break;
 case 'test':
  if(!s.placed||s.tested||s.solution)return previous;s.tested=true;
  if(s.placed==='place-counter')s.attempted=true;else s.solution=s.proposal;break;
 case 'review':
  if(!s.solution||!s.tested||s.reviewed)return previous;s.reviewed=true;badge('initiative');badge('problem');if(s.attempted)badge('adapting');break;
 case 'encore':if(!s.pass||s.encore)return previous;s.encore=true;break;
 case 'sign-hidden':if(s.revision===2)return previous;if(!s.accepted||s.solution||s.attempted)return previous;s.attempted=true;break;
 case 'sign-clear':if(s.revision===2)return previous;if(!s.accepted||s.solution)return previous;s.solution='sign';badge('clarity');if(s.attempted)badge('adapting');break;
 case 'helper':if(s.revision===2)return previous;if(!s.accepted||s.solution)return previous;s.solution='helper';badge('teamwork');if(s.attempted)badge('adapting');break;
 case 'pay':if(s.paid||(s.revision===3?(!s.reviewed||!s.consolidated):(!s.solution||(s.revision===2&&!s.reviewed))))return previous;s.paid=true;s.wallet+=VALUES.gross-VALUES.tax;s.tax=VALUES.tax;if(s.revision>=2)s.pass=true;break;
 case 'buy':if(!s.paid||s.keepsake||s.wallet<VALUES.keepsake)return previous;s.keepsake=true;s.wallet-=VALUES.keepsake;break;
 case 'save':if(!s.paid||s.wallet<VALUES.save)return previous;s.wallet-=VALUES.save;s.savings+=VALUES.save;break;
 case 'withdraw':if(s.savings<VALUES.save)return previous;s.savings-=VALUES.save;s.wallet+=VALUES.save;break;
 case 'donate':if(!s.paid||s.donated||s.wallet<VALUES.donation)return previous;s.wallet-=VALUES.donation;s.donated=VALUES.donation;break;
 case 'rest':if(s.rested)return previous;s.rested=true;break;
 default:return previous;
 }
 if(s.events.length>=256)return previous;
 s.events.push(type);return s;
}
export function decodeSave(raw){
 if(raw===null)return freshState();
 const data=JSON.parse(raw);
 if(![1,2,3].includes(data.version)||!Array.isArray(data.events)||data.events.length>256)throw Error('Unrecognised practice save');
 let s=freshState();s.revision=data.version;
 for(const type of data.events){const next=applyEvent(s,type);if(next===s)throw Error('Invalid practice event');s=next;}
 return s;
}
export function createPracticeStore(storage){
 let raw=null,state=freshState(),error='',locked=false;
 function load(){try{raw=storage.getItem(MARKET_KEY);state=decodeSave(raw);error='';locked=false;}catch{locked=true;error='This practice save could not be read. It has been kept untouched. Use the journal to restart this practice only.';}}
 load();
 return {
 get state(){return structuredClone(state);},get error(){return error;},get locked(){return locked;},
 dispatch(type){
  if(locked)return false;
  try{
   if(storage.getItem(MARKET_KEY)!==raw){load();error='The practice changed in another tab. Your latest save is loaded; try that choice again.';return false;}
   const next=applyEvent(state,type);if(next===state)return false;
   const encoded=JSON.stringify({version:next.revision,events:next.events});
   // Commit before showing any reward. A failed write cannot grant an unsaved payment.
   storage.setItem(MARKET_KEY,encoded);raw=encoded;state=next;error='';return true;
  }catch{error='Your browser could not save this choice. Nothing was charged or awarded. Free exploration is still available; enable browser storage to continue.';return false;}
 },
 reset(){try{storage.removeItem(MARKET_KEY);raw=null;state=freshState();locked=false;error='';return true;}catch{error='The practice could not be restarted because browser storage is unavailable.';return false;}},
 reload:load
 };
}
