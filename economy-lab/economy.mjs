export const KEY='career-empire-economy-lab-v1';
export const CATALOG=Object.freeze({'study-desk':90000,'laptop-upgrade':160000,'wellbeing-pack':50000});
export const LESSONS=Object.freeze({investigate:50000,adapt:50000,reflect:50000});
export function empty(){return {schemaVersion:1,scenario:'practice-20260923',events:[]};}
export function project(doc){
 if(doc?.schemaVersion!==1||doc.scenario!=='practice-20260923'||!Array.isArray(doc.events)||doc.events.length>2000)throw Error('Unsupported or damaged practice save. Reset explicitly to start again.');
 const s={cash:100000,savings:0,gross:0,tax:0,community:0,global:0,spent:0,wellbeing:70,insight:0,choices:[],owned:[],completed:[],explored:[],explorationRewards:0,ids:[],log:[]};
 for(const e of doc.events){
  if(!e||typeof e.id!=='string'||!e.id||s.ids.includes(e.id))throw Error('Invalid or repeated transaction ID.');
  const amount=e.amount;
  const positive=()=>{if(!Number.isSafeInteger(amount)||amount<=0||amount>10000000)throw Error('Use a positive whole-cent amount.');};
  const spend=n=>{if(s.cash<n)throw Error('Not enough available practice money.');s.cash-=n;};
  const beforeCash=s.cash,beforeSavings=s.savings,beforeTax=s.tax;
  let description='';
  switch(e.type){
   case 'exploration':{if(!['building','shop','studio','chapel','market','est','oval'].includes(e.milestone)||s.explored.includes(e.milestone))throw Error('Unknown or already rewarded exploration');s.explored.push(e.milestone);s.explorationRewards+=10000;s.cash+=10000;description=`First exploration: ${e.milestone} · badge earned · $100 bonus (provisional)`;break;}
   case 'complete':{const gross=LESSONS[e.checkpoint];if(!Object.hasOwn(LESSONS,e.checkpoint)||s.completed.includes(e.checkpoint))throw Error('This checkpoint has already been rewarded or is unknown.');const tax=Math.round(gross*.1);s.gross+=gross;s.tax+=tax;s.community+=tax;s.cash+=gross-tax;s.completed.push(e.checkpoint);description=`${e.checkpoint}: earned $500 · tax $50 · received $450`;break;}
   case 'choice':{
    if(!['experiment','overwork','recover','reflect-failure','retry'].includes(e.choice)||s.choices.includes(e.choice))throw Error('This scenario choice is unknown or already recorded.');
    if(e.choice==='experiment'){spend(10000);s.spent+=10000;s.wellbeing-=5;description='Trial failed: spent $100; wellbeing -5. No completion or mastery awarded. Reflection is available';}
    if(e.choice==='overwork'){s.gross+=80000;s.tax+=8000;s.community+=8000;s.cash+=72000;s.wellbeing-=20;description='Extra shift: gross $800, tax $80, received $720; wellbeing -20. No learning progress awarded';}
    if(e.choice==='recover'){s.wellbeing=Math.min(100,s.wellbeing+15);description='Recovery time: wellbeing +15, no money or module progress';}
    if(e.choice==='reflect-failure'){if(!s.choices.includes('experiment'))throw Error('Try the experiment before reflecting on its outcome.');s.insight+=1;description='Failure reflected on: one practice insight recorded. No cash, completion or assessed mastery awarded';}
    if(e.choice==='retry'){if(!s.choices.includes('reflect-failure'))throw Error('Reflect before the supported retry.');description='Supported retry: changed the trial design using feedback; the demonstration planter now works. No cash or assessed mastery awarded';}
    s.choices.push(e.choice);break;
   }
   case 'buy':{if(!Object.hasOwn(CATALOG,e.item)||s.owned.includes(e.item))throw Error('Unknown item or already owned.');const cost=CATALOG[e.item];spend(cost);s.spent+=cost;s.owned.push(e.item);description=`Bought ${e.item}`;break;}
   case 'save':positive();spend(amount);s.savings+=amount;description='Moved money into savings';break;
   case 'withdraw':positive();if(s.savings<amount)throw Error('Not enough savings.');s.savings-=amount;s.cash+=amount;description='Moved savings back to available money';break;
   case 'donate':positive();if(!['community','global'].includes(e.cause))throw Error('Unknown cause.');spend(amount);s[e.cause]+=amount;description=`Voluntary ${e.cause} contribution`;break;
   default:throw Error('Unknown transaction.');
  }
  s.ids.push(e.id);s.log.push({...e,description,cashDelta:s.cash-beforeCash,savingsDelta:s.savings-beforeSavings,taxDelta:s.tax-beforeTax,cashAfter:s.cash,savingsAfter:s.savings});
 }
 return {...s,effects:{desk:s.owned.includes('study-desk'),laptop:s.owned.includes('laptop-upgrade'),wellbeing:s.owned.includes('wellbeing-pack'),lamp:s.community>=15000,garden:s.community>=30000,globalKits:Math.min(4,Math.floor(s.global/10000)),savingGoal:s.savings>=30000,portfolio:s.completed.length}};
}
export function transact(doc,event){const current=project(doc);if(current.ids.includes(event.id))return doc;const next={...doc,events:[...doc.events,event]};project(next);return next;}
