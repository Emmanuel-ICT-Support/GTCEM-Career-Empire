import {validPlan} from './night-market-agency.js?v=market-lawns-20260924';
export function arrangementChoices(values){return Object.fromEntries(['sign','position','collection','helper'].map(key=>[key,values[key]]));}
export function canTryArrangement(state,plan){return validPlan(plan)&&state.accepted&&!state.paid&&state.trials.length<12&&(!state.tested||Object.keys(plan).some(key=>plan[key]!==state.plan[key]));}
export function applyArrangement(store,plan){if(!validPlan(plan))return false;if(Object.keys(plan).every(key=>plan[key]===store.state.plan[key]))return true;return store.dispatch({type:'plan',plan});}
export const showSignPosition=plan=>plan.sign!=='none';
