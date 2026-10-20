import {nearCampusStart,CAMPUS_START} from './landing.mjs?v=post-photo-tour-20261013';
const KEY='ce-orientation-tour-v1';
// Keep old final destinations stable when inserting the new character beats.
export function resumeOrientationStep(saved){
 if(!saved||![1,2].includes(saved.version)||!Number.isInteger(saved.step)||saved.step<0||saved.step>=(saved.version===1?8:10))return 0;
 return saved.version===1&&saved.step>=6?saved.step+2:saved.step;
}
const TITLES=['First mission complete!','Your companion','Fly back to the start','Your menu','Your discoveries','Your course outline','Choose your character','Explore at your own pace','Start with Initiative','Mara needs your help'];
export function createOrientationTour({storage,photo,summary,helper,chooseHelper,fly,openOptions,optionsOpen,openStats,statsOpen,openCourse,goMarket,openCharacter,characterOpen=()=>false,pause,resume,stop}){
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('./orientation-tour.css?v=post-photo-tour-20261013',import.meta.url);document.head.append(css);
 const panel=document.createElement('section');panel.id='orientation-tour';panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-label','Companion campus tour');
 panel.innerHTML='<header><small data-count></small><button type="button" data-close aria-label="Close tour">×</button></header><img data-picture alt=""><h2 tabindex="-1"></h2><div data-visual aria-hidden="true"></div><p data-copy></p><p data-status role="status"></p><footer><button type="button" data-action></button><button type="button" data-keep hidden>Keep my character</button><button type="button" data-skip>Skip tour</button></footer>';
 document.body.append(panel);const q=s=>panel.querySelector(s);let active=false,step=0,generation=0,busy=false,awaitingClose=false,notice='';
 const save=()=>{try{storage.setItem(KEY,JSON.stringify({version:2,step,finished:!active&&step===9}));}catch{}};
 function finish(){generation++;active=false;busy=false;awaitingClose=false;panel.hidden=true;stop();resume();}
 function render(){
  panel.hidden=!active||awaitingClose;if(!active)return;panel.dataset.step=String(step);panel.dataset.flight=String(step===2);q('[data-count]').textContent=(step+1)+' / 10 · campus tour';q('h2').textContent=TITLES[step];q('[data-status]').textContent=notice;
  const h=helper(),image=step===0?photo():step===1&&h.model?h.portrait:step===9?'./assets/community-cast-20260927/mara-portrait.png':null;
  q('[data-visual]').innerHTML=step===3?'<span>Options</span><span>Places · Character · Companion · My Life</span>':step===4?'<span>▧ My Journey</span><span>Collected discoveries and pictures</span>':step===5?'<span>Unit 3</span><span>Unit 4</span>':step===8?'<span>Notice</span><span>Investigate</span><span>Agree & act</span><span>Check</span>':'';q('[data-picture]').hidden=!image;if(image)q('[data-picture]').src=new URL(image,import.meta.url).href;
  const copy=[summary(),h.model?'Hi, I’m '+h.name+'. I’ll help you find your way.':'You can explore independently. The same help is available with phone / journal or no companion.',
   'Use Flyover to return to Arrival Gardens. Follow the start marker on the live map at bottom right. WASD moves; Q / E changes height. Land with the visible button or L. Landing elsewhere is fine: the start is still your destination.',
   'Open Options to see Places, Character, the optional companion and My Life. Close it when you are ready to continue.',
   'Open Stats to see My Journey: the discoveries and pictures you collected. Close Stats whenever you are ready.',
   'My Life keeps your draft learning sequence and printable outline alongside Progress and My work. Numbered phases are proposed; teaching weeks, lessons, dates and assessment tasks are still to be confirmed.',
   'Choose a character in Avatar Studio. Your character is how you appear in this world; it does not choose or limit your occupation. Save and return to continue, or keep your current character.',
   'Take time to explore if you like. Close this tour to walk freely; choose Resume companion tour in Options whenever you want to continue. When you are ready, continue to Initiative.',
   'Initiative is our first learning focus. Notice a problem or opportunity, investigate, and take a useful agreed action. Ask before changing someone’s work. Stay within your role and safety rules; get help with hazards or decisions beyond your responsibility.',
   'Mara runs the Juniper Kitchen noodle stall. Prepaid collections and walk-up orders share a busy workplace. Start by observing and asking a useful question. You’ll arrive outside the campus Market building, facing the entrance. Walk forward to enter, then approach Mara.'];
  q('[data-copy]').textContent=copy[step];q('[data-action]').textContent=['Choose my companion','Start Flyover','Resume Flyover','Open Options','Open Stats','Open course outline in My Life','Open Avatar Studio','Continue to Initiative','Meet Mara’s workplace','Go to Market entrance'][step];q('[data-action]').disabled=busy;q('[data-keep]').hidden=step!==6;
 }
 async function action(){
  if(!active||busy)return;busy=true;notice='';const request=generation;q('[data-action]').disabled=true;
  try{
   if(step===0){await chooseHelper(message=>{if(request===generation){notice=message;render();}});if(request!==generation)return;notice='';step=1;}
   else if(step===1){step=2;render();resume();if(!fly())notice='Flyover is still preparing. Try Resume Flyover when campus is ready.';}
   else if(step===2){resume();if(!fly())q('[data-status]').textContent='Close any open panel, then try Flyover again.';busy=false;q('[data-action]').disabled=false;return;}
   else if(step===3){openOptions();awaitingClose=true;}
   else if(step===4){openStats();awaitingClose=true;}
   else if(step===5){step=6;save();openCourse();finish();return;}
   else if(step===6){awaitingClose=true;render();await openCharacter();if(request!==generation)return;}
   else if(step===7)step=8;
   else if(step===8)step=9;
   else{notice='Preparing campus and Market entrance…';render();const arrived=await goMarket(()=>request===generation&&active);if(request!==generation)return;if(arrived===false)throw Error('Market entrance unavailable');save();finish();return;}
   save();
  }catch{if(request===generation){awaitingClose=false;notice='That action could not finish. Your progress is intact; try again or skip.';}}
  finally{if(request===generation){busy=false;render();if(active&&step!==2)pause();}}
 }
 q('[data-keep]').onclick=()=>{if(active&&step===6&&!busy){step=7;save();render();}};q('[data-action]').onclick=action;q('[data-skip]').onclick=finish;q('[data-close]').onclick=finish;
 panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();finish();}});
 return {
  start({restore=false}={}){generation++;active=true;step=0;busy=false;awaitingClose=false;notice='';if(restore)try{step=resumeOrientationStep(JSON.parse(storage.getItem(KEY)));}catch{}pause();save();render();q('h2').focus({preventScroll:true});},
  stop:finish,get active(){return active;},blocksWalking:()=>active&&step!==2&&!awaitingClose,
  target:()=>active&&step===2?{...CAMPUS_START,id:'start',label:'Campus start · land here'}:null,
  landed(point){if(!active||step!==2)return;if(nearCampusStart(point)){step=3;save();pause();render();}else{render();q('[data-status]').textContent='Safely landed. You haven’t returned to the start yet. Resume Flyover, follow the map, or skip the tour.';}},
  update(){if(!active||!awaitingClose)return;if(step===3&&!optionsOpen()||step===4&&!statsOpen()||step===6&&!characterOpen()){awaitingClose=false;step++;save();render();pause();}},
  snapshot:()=>({active,step,awaitingClose})
 };
}
