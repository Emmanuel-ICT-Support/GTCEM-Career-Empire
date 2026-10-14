// Bounded workplace simulation. Outcomes are reproducible, not an assessment score.
export const DEFAULT_PLAN=Object.freeze({sign:'none',position:'counter',collection:'side',helper:'packing'});
export const PLAN_OPTIONS=Object.freeze({
 sign:{none:'No sign',orders:'Order here',pickup:'Phone orders → collection',both:'Order at counter • phone pickup →'},
 position:{counter:'On the counter',approach:'Beside the approach path'},
 collection:{side:'At the side of the stall',front:'At the front of the stall'},
 helper:{packing:'Sam packs orders',greet:'Sam greets arriving customers',collect:'Sam hands out collection orders'}
});
export const NOTE_FIELDS=Object.freeze({noticed:'I noticed…',informed:'I found out / used…',tried:'I tried…',result:'The result was / I changed…',people:'Who I involved…',transfer:'In another workplace, I could…'});
export function validPlan(p){return p&&typeof p==='object'&&Object.keys(p).length===4&&Object.entries(PLAN_OPTIONS).every(([k,options])=>Object.hasOwn(options,p[k]));}
export function describePlan(p){return Object.entries(PLAN_OPTIONS).map(([k,options])=>options[p[k]]).join(' · ');}
export function evaluatePlan(p){
 const visible=p.position==='approach',pickupSign=visible&&['pickup','both'].includes(p.sign);
 const directed=p.helper==='greet'||pickupSign;
 const pickup=directed?4:p.helper==='collect'?3:p.collection==='front'?2:0;
 const ordering=p.collection==='front'?1:2;
 const packed=p.helper==='packing'?6:p.helper==='collect'?5:4;
 const facts=[`${pickup} of 4 phone customers found collection without joining the ordering queue.`,`${ordering} of 2 walk-up customers reached the ordering counter without a collection queue in their way.`,`${packed} of 6 bags were ready by the time this group finished.`];
 if(p.sign!=='none'&&!visible)facts.push('From behind the queue, customers could not read the counter sign.');
 if(visible&&p.sign==='orders')facts.push('The sign told people where to order; phone customers had already paid.');
 if(p.collection==='front')facts.push('Collection customers and walk-up customers met at the same counter space.');
 if(p.helper!=='packing')facts.push('Mara packed alone while Sam worked with customers.');
 return {pickup,ordering,packed,effective:pickup>=3&&ordering===2&&packed>=5,facts};
}
export function caseNoteText(s){
 const lines=['MY FIRST GIG — SUNDAY MARKETS','Simulated game practice. Not verified workplace or portfolio evidence.','', 'GAME RECORD (automatically recorded)',`Customer conversation: ${s.listened?'visited':'not used'}; queue observation: ${s.observed?'used':'not used'}; Sam’s guide: ${s.learned?'used':'not used'}.`];
 s.trials.forEach((t,i)=>lines.push(`\nTrial ${i+1}: ${describePlan(t.plan)}`,t.outcome.facts.join(' '),`Result reviewed: ${t.inspected?'yes':'not yet'}.`));
 lines.push('', 'MY EXPLANATION (guided choices or earlier saved writing; not assessed)');
 for(const [key,label]of Object.entries(NOTE_FIELDS))lines.push(label,s.caseNote[key]||'[Not selected yet]','');
 lines.push('LEARNING CONNECTION','Initiative: noticing opportunities, suggesting improvements and communicating respectfully. Problem solving: trying an idea, examining evidence and deciding what to do next.','Wages recognise the agreed work; explanations are not automatically graded.');
 return lines.join('\n');
}
