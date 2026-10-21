import {MARKET_APPROACH} from './landing.mjs';
export const JOURNEY_KEY='ce-discovery-journey-v1';
export const MARKET_NEXT=Object.freeze({id:'market',label:'Sunday Market · next experience',...MARKET_APPROACH});
export const COMPLETION_COPY='First experience complete! Well done. Your discoveries have been added to My Journey.';
export const NEXT_COPY='Remember, Career Empire lets you try out life beyond school: work, study, money and the choices that come with them. Your next experience explores initiative: noticing what needs doing and taking a thoughtful first step, without waiting to be told every move. It is a skill you can develop. The town’s Sunday Market is where you’ll try it out. You won’t have all the answers straight away. Look around, ask questions and try something. You can learn and adjust as you go.';
export function discoverySaveCopy({scope='tab'}={}){
 if(scope==='run')return 'My Journey keeps discoveries for this run. Reloading or starting a new entry starts a new run. Download your final photo to keep a copy.';
 if(scope==='browser')return 'My Journey saves discoveries in this browser. Clearing browser data removes them. Download your final photo to keep a separate copy.';
 return 'Saving is unavailable. My Journey keeps discoveries while this tab stays open. Download your final photo to keep a copy.';
}
// Discovery records pictures, never the legacy exploration currency bonuses.
export const explorationForRoute=(discoveryRoute,award)=>milestone=>discoveryRoute?Promise.resolve(true):award(milestone);
// Separate from the trail and wallet: replay/retake cannot erase discoveries or pay twice.
export function createJourneyStore(storage){
 let data={discoveries:{},choice:null},persistent=storage?.persistent!==false,damaged=false;
 try{const raw=storage?.getItem(JOURNEY_KEY);if(raw){const parsed=JSON.parse(raw);if(!parsed||!parsed.discoveries||typeof parsed.discoveries!=='object'||Array.isArray(parsed.discoveries))throw Error('Invalid journey');data=parsed;}}catch{persistent=false;damaged=true;}
 function write(){if(damaged)return;try{storage.setItem(JOURNEY_KEY,JSON.stringify(data));persistent=storage?.persistent!==false;}catch{persistent=false;}}
 return {bank(s){let changed=false;for(const [id,label,image,earned] of [['chapel','Chapel discovery',s.shots?.chapel?.image||'./discovery-assets/chapel-clue.jpg',s.chapelVisited],['mural','Your mural photo',s.shots?.mural?.image,Boolean(s.shots?.mural)],['oval','Your final photo',s.souvenir,typeof s.souvenir==='string'&&s.souvenir.startsWith('data:image/png;base64,')]]){if(earned&&!data.discoveries[id]){data={...data,discoveries:{...data.discoveries,[id]:{id,label,image}}};changed=true;}}if(changed)write();return this.snapshot();},visitMarket(){if(!data.marketVisited){data={...data,marketVisited:true};write();}},choose(choice){if(!['market','explore'].includes(choice))return false;data={...data,choice};write();return true;},snapshot:()=>({...data,discoveries:{...data.discoveries},persistent,scope:storage?.persistent===false?'run':persistent?'browser':'tab'})};
}
export function createDiscoveryHandover({journey,header,goMarket,resume,pause}){
 const style=document.createElement('style');style.textContent=`
 #discovery-handover{box-sizing:border-box;width:min(38rem,calc(100vw - 24px));max-height:calc(100dvh - 24px);overflow:auto;border:1px solid #72918c;border-radius:18px;background:#fffaf0;color:#173d38;padding:clamp(18px,4vw,32px);font:16px/1.55 system-ui;box-shadow:0 16px 60px #1236}
 #discovery-handover::backdrop{background:#102d37b8}#discovery-handover h2{font-size:clamp(23px,5vw,30px);line-height:1.2;margin:8px 0 16px}#discovery-handover footer{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}#discovery-handover button,#next-experience{font:inherit;min-height:44px;border:1px solid #345c50;border-radius:9px;padding:10px 14px;background:#e5eee5;color:#173d38;cursor:pointer}#discovery-handover button:first-child{background:#245e50;color:white}#discovery-handover button:focus-visible,#next-experience:focus-visible{outline:3px solid #b65b10;outline-offset:3px}#next-experience{font-size:13px;padding:6px 10px}#next-experience[hidden]{display:none}
 `;document.head.append(style);
 const dialog=document.createElement('dialog');dialog.id='discovery-handover';dialog.setAttribute('aria-labelledby','handover-title');dialog.innerHTML='<small>MY JOURNEY · EXPERIENCE 1</small><h2 id="handover-title" tabindex="-1">First experience complete! Well done.</h2><p data-banked></p><p data-next></p><p data-status role="status"></p><footer><button type="button" data-market>Head straight to the market</button><button type="button" data-explore>Keep exploring</button></footer>';document.body.append(dialog);
 const q=s=>dialog.querySelector(s),reminder=document.createElement('button');reminder.id='next-experience';reminder.type='button';reminder.hidden=true;reminder.textContent='Next: Sunday Market · Travel';reminder.setAttribute('aria-label','Next experience: Sunday Market. Travel to the market entrance');header.append(reminder);
 let busy=false;const buttons=()=>dialog.querySelectorAll('button');
 function refresh(){reminder.hidden=!journey.snapshot().discoveries.oval||journey.snapshot().marketVisited||dialog.open;}
 function finish(choice){journey.choose(choice);dialog.close();refresh();resume();}
 async function travel(){if(busy)return;busy=true;buttons().forEach(b=>b.disabled=true);reminder.disabled=true;q('[data-status]').textContent='Preparing the market entrance…';try{await goMarket();finish('market');}catch{q('[data-status]').textContent='The market entrance could not load. Try again, or keep exploring.';}finally{busy=false;buttons().forEach(b=>b.disabled=false);reminder.disabled=false;}}
 q('[data-market]').onclick=travel;q('[data-explore]').onclick=()=>finish('explore');reminder.onclick=travel;
 dialog.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const choices=[...buttons()].filter(b=>!b.disabled);if(!choices.length){event.preventDefault();q('h2').focus();return;}const first=choices[0],last=choices.at(-1),active=document.activeElement;if(event.shiftKey&&(active===first||active===q('h2'))){event.preventDefault();last.focus();}else if(!event.shiftKey&&active===last){event.preventDefault();first.focus();}});
 dialog.addEventListener('cancel',e=>{e.preventDefault();if(!busy)finish('explore');});
 return {show(){if(dialog.open)return;pause();q('[data-banked]').textContent='Your discoveries have been added to My Journey. '+discoverySaveCopy(journey.snapshot());q('[data-next]').textContent=NEXT_COPY;q('[data-status]').textContent='';dialog.showModal();refresh();q('h2').focus();},open:()=>dialog.open,update(inMarket=false){if(inMarket)journey.visitMarket();refresh();},snapshot:()=>({open:dialog.open,reminder:!reminder.hidden,busy})};
}
