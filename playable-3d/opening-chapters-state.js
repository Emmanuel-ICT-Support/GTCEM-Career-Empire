// Authored fictional rehearsal data. No real labour-market claims or learner records.
export const SOURCES=[
 {id:'feed',title:'Town feed: “No more people needed?”',date:'Fictional Year 1, Week 2',place:'Location not stated',author:'Account selling an automation course',evidence:'A 20-second clip of one ordering kiosk; no staffing data.',claim:'“Ordering machines mean every food-service job is disappearing.”',limit:'One task at one stall cannot establish a trend across an industry.'},
 {id:'report',title:'Regional employment bulletin',date:'Fictional Year 1, Week 1',place:'The wider fictional region',author:'Regional labour-market research team',evidence:'Survey of 80 employers: food-service employment changed from 1,000 to 1,080 over three years. Forecast is a range, not a promise.',claim:'Jobs grew overall while ordering, logistics and customer-support tasks changed.',limit:'Regional growth does not guarantee a vacancy at this market or remove entry requirements.'},
 {id:'mara',title:'Mara’s roster and order record',date:'This fictional market week',place:'Juniper Kitchen only',author:'Mara, stall owner',evidence:'Six staff shifts both before and after phone ordering. Two shifts now include collection support. Phone orders rose from 10 to 24 in the sample.',claim:'The stall reorganised work; it has not removed a staff shift in this example.',limit:'A small local example cannot tell us whether the whole industry is growing.'},
 {id:'archive',title:'Archived overseas vacancy forecast',date:'Eight fictional years earlier',place:'Another country',author:'A former industry association report',evidence:'An old forecast for a different region; methods are summarised, but no current follow-up is supplied.',claim:'Fast expansion was expected in that place at that time.',limit:'Check date, geography and whether a forecast actually happened before applying it here.'}
];
export const PATHWAYS=[
 {id:'repair',title:'Repair & reuse',jobs:[100,120],detail:'Strong growth in this fictional sample; two advertised openings are 40 km away and require training. Growth can create options; distance, competition and qualification costs remain.'},
 {id:'events',title:'Community events',jobs:[100,103],detail:'Average growth in this fictional sample; a nearby supervised assistant opening matches current availability. Modest growth can still include suitable vacancies; event hours vary.'},
 {id:'print',title:'Print services',jobs:[100,90],detail:'Negative growth in this fictional sample; one local vacancy replaces a retiring worker. Fewer total jobs does not mean no openings, but future options may be narrower.'}
];
export const SHIFTS=[
 {id:'technology',title:'Phone orders surge',trend:'Impactful technology',event:'The market trials more advance orders. Some counter work moves to checking digital orders and coordinating collection.',needs:[2,2,1],roles:['Customer support','Order systems','Access & outreach'],effects:'Work environment: digital and physical queues overlap. Employment: this example reallocates duties; it does not establish fewer jobs. Emerging tasks: order support. Declining task: repeatedly entering prepaid orders.'},
 {id:'climate',title:'Plan for hotter market days',trend:'Climate change',event:'The fictional town is planning for a pattern of hotter seasons. A single hot day alone would not establish that long-term pattern.',needs:[1,2,2],roles:['Customer support','Shade & cool storage','Access & outreach'],effects:'Work environment: heat-aware scheduling and cool storage. Employment: earlier or split shifts may be considered. Emerging work: cooling and adaptation support. Outdoor operating hours may contract. These are possibilities, not forecasts.'},
 {id:'demography',title:'A changing community',trend:'Demographic shifts',event:'The fictional town has more older residents and new arrivals. Ask about individual needs; age or background does not tell you what someone can do.',needs:[2,1,2],roles:['Customer support','Order systems','Access & outreach'],effects:'Work environment: clearer wayfinding and multiple ordering routes. Employment: demand for customer assistance may change. Emerging tasks: accessible service design. Do not assume a group cannot use technology.'},
 {id:'economy',title:'Suppliers change direction',trend:'Economic power shifts',event:'Production and investment move towards a new trading region in this fictional longer-term scenario. Some imported stock has a different lead time. A late delivery alone is not evidence of a global power shift.',needs:[1,3,1],roles:['Customer support','Stock coordination','Access & outreach'],effects:'Work environment: changed suppliers and lead times. Employment: coordination skills may become more useful. Some import-related tasks may grow while other contracts shrink. Local choices sit within wider economic forces.'}
];
export function evaluateAllocation(shiftId,values){
 const scenario=SHIFTS.find(s=>s.id===shiftId);if(!scenario)throw Error('Unknown scenario');
 if(!Array.isArray(values)||values.length!==3||values.some(n=>!Number.isInteger(n)||n<0||n>6))return {valid:false,message:'Use whole work blocks from 0 to 6.'};
 const total=values.reduce((a,b)=>a+b,0);if(total>6)return {valid:false,message:`You allocated ${total} blocks; this rehearsal has 6. Move a block before testing.`};
 const gaps=scenario.needs.map((n,i)=>Math.max(0,n-values[i]));
 return {valid:true,total,spare:6-total,gaps,ready:gaps.every(n=>n===0),served:Math.min(6,Math.floor(6*Math.min(...values.map((n,i)=>n/scenario.needs[i])))),message:gaps.some(Boolean)?'A bottleneck remains. Check each role and move support where it is needed.':'Essential tasks are covered in this model. Spare capacity and extra support can be used in different ways.'};
}
export const ADS=[
 {id:'service',title:'Community service assistant',location:'Sunday Market, local',qualification:'No formal qualification required; supervised induction provided.',criteria:['customer','team'],method:'online',deadline:3,description:'Guide customers and coordinate with the collection team. Saturday practice shift available.'},
 {id:'stock',title:'Stock and setup assistant',location:'Community venue, local',qualification:'No formal qualification required; equipment training provided before use.',criteria:['planning','team'],method:'written',deadline:4,description:'Check deliveries and plan stock locations with a supervisor. Sunday practice shift available.'}
];
export const EVIDENCE=[
 {id:'customer',title:'Clarified a collection problem',text:'Alex asked a waiting customer where they expected to collect, then placed clearer information before the queue split. In the trial, four phone customers found collection.',criterion:'customer'},
 {id:'team',title:'Coordinated a helper role',text:'Alex checked Sam’s packing role before proposing a change. They tested the arrangement together and discussed the trade-off between packing and collection.',criterion:'team'},
 {id:'planning',title:'Replanned resources',text:'In a fictional rehearsal, Alex checked three work needs, moved available work blocks and reviewed the resulting bottleneck before trying again.',criterion:'planning'},
 {id:'generic',title:'“I am perfect at every job”',text:'A confident statement with no example, action or result.',criterion:null}
];
export const RESPONSE_PARTS={
 situation:[['queue','Phone-order customers were joining the ordering queue.'],['vague','I am always good with people.']],
 action:[['acted','I checked the collection process with Sam, placed clearer information and tested it with the next group.'],['others','The team somehow made things better.']],
 outcome:[['observed','In that trial, four phone customers found collection; we still had to check packing capacity.'],['claim','I guarantee every future customer will be happy.']]
};
export function reviewApplication(adId,{evidence=[],method,day,response={}}){
 const ad=ADS.find(a=>a.id===adId);if(!ad)throw Error('Unknown opportunity');
 const selected=new Set(evidence.filter(id=>EVIDENCE.some(e=>e.id===id)));
 const missing=ad.criteria.filter(id=>!selected.has(id));
 const checks={evidence:missing.length===0,method:method===ad.method,deadline:Number.isInteger(day)&&day>=1&&day<=ad.deadline,response:response.situation==='queue'&&response.action==='acted'&&response.outcome==='observed'};
 return {checks,missing,ready:Object.values(checks).every(Boolean)};
}

// Formative interpretation check: distinguish the evidence from the claim.
export function reviewSourceInterpretation(id,{scope,kind}={}){
 const rules={feed:['stall','unsupported'],report:['region','observed'],mara:['stall','observed'],archive:['overseas','forecast']};
 const expected=rules[id];if(!expected)return {ok:false,feedback:'Choose an available source.'};
 if(scope!==expected[0])return {ok:false,feedback:'Check where the evidence comes from. A claim about every job is wider than a clip of one stall; a regional sample is wider than Mara’s roster.'};
 if(kind!==expected[1])return {ok:false,feedback:'Separate what was observed, what was forecast and what is asserted without enough evidence. An old forecast is not a verified current result.'};
 return {ok:true,feedback:SOURCES.find(s=>s.id===id).limit+' Keep this limit when using the source in a recommendation.'};
}
