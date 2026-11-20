// Presentation of existing authoritative match fields; no additional saved state.
export const restaurants = Object.freeze({A:{name:'Juniper Kitchen',short:'Juniper',colour:'#2acdb4'},B:{name:'Lantern Noodles',short:'Lantern',colour:'#efaa42'}});
export const staff = Object.freeze({
 EL:{name:'Owner',move:'One square in any direction',kit:'Service notebook'},
 CP:{name:'Chef',move:'One square diagonally',kit:'Chef whites and kitchen tools'},
 NS:{name:'Waiter',move:'One square straight',kit:'Order-taking device'},
 SD:{name:'Kitchen Hand',move:'One square forward; challenge diagonally forward',kit:'Prep basket and green apron'},
 RE:{name:'Cashier',move:'One square in any direction',kit:'Payment terminal and waist apron'},
 EC:{name:'Cleaner',move:'One square forward; challenge diagonally forward',kit:'Cleaning bucket and products'},
});
export const initiativeCards = Object.freeze([
 {title:'Ready for the lunch rush',behaviour:'Being proactive',prompt:'Both noodle bars are about to open for lunch. You notice your bar is almost out of takeaway bowls. No one has asked you to act. What would you do, and how could it help your team?',note:'Identify a need before the shortage, take a safe useful step within the role, check supplies or permission where needed, and explain how this could reduce delays.'},
 {title:'The right noodles, the right customer',behaviour:'Improving work practices',prompt:'Your noodle bar keeps mixing up takeaway orders at collection. Suggest one small improvement to trial. How would you check whether it helped?',note:'Look for a workable change such as order numbers, a clear collection point or checking names; compare mix-ups or waiting times before and after. More detail is useful only if relevant.'},
 {title:'A better way to queue',behaviour:'Voicing opinions',prompt:'Customers at your noodle bar are joining the collection queue to place orders. What would you say to the owner, and what constructive change would you suggest?',note:'Look for a respectful opinion or concern, a specific suggestion, appropriate permission and a plausible benefit for customers and staff.'},
 {title:'Help the rush, protect the till',behaviour:'Helping coworkers',prompt:'You are handling payments while a coworker falls behind packing noodle orders. How could you offer help without leaving cash or customer information unattended?',note:'Coordinate appropriate help, protect the till and your own duties, and explain how teamwork could keep service moving. Do not reward unsafe abandonment of responsibilities.'},
 {title:'Ready for more responsibility',behaviour:'Seeking responsibility',prompt:'You want to learn how your noodle bar checks stock for the next day. What responsibility would you ask to take on, what support would you need, and how might it help your future work?',note:'Name an appropriate responsibility and training or supervision. Link it to developing skills, trust or possible opportunities; promotion or recognition is never guaranteed.'},
 {title:'Asked to act, or first to notice?',behaviour:'Applying initiative',prompt:'Alex refills takeaway bowls when asked. Sam notices they are running low, checks with the owner and refills them before lunch. Which more clearly shows initiative? Explain a possible benefit for the noodle bar and the worker.',note:'Explain noticing and acting without waiting for an instruction, within safe boundaries. Distinguish useful routine work from initiative. Benefits may include efficiency, recognition, empowerment or opportunities, not guaranteed rewards.'},
]);
export function cardForMatch(match){
 if(!match.card||!Number.isSafeInteger(match.duelCount)||match.duelCount<1)return null;
 const card=initiativeCards[(match.duelCount-1)%initiativeCards.length];
 const revealed=['review','territory','resolved','ended'].includes(match.phase);
 return {title:card.title,prompt:card.prompt,behaviour:card.behaviour,...(revealed?{note:card.note}:{})};
}
export function restaurantProgress(tiles={}){
 const count={A:0,B:0};
 for(const tile of Object.values(tiles))if(tile&&Object.hasOwn(count,tile.holder)&&['route','closure','permit'].includes(tile.effect))count[tile.holder]++;
 return Object.fromEntries(['A','B'].map(team=>{const own=count[team],other=count[team==='A'?'B':'A'];
  return [team,{territories:own,level:Math.min(4,own),momentum:own-other,customers:Math.max(1,Math.min(9,3+own-other)),brightness:Math.max(.35,Math.min(1.65,.8+own*.15-other*.09)),label:['Opening shift','Finding a rhythm','Word is spreading','Lunch-rush favourite','Market standout'][Math.min(4,own)]}];
 }));
}
