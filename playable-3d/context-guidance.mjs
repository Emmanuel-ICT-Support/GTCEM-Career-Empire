import {nextDestination} from './exploration-tools.mjs';
export function contextGuidance(state){
 const next=nextDestination(state||{step:0});
 if(next?.id==='market')return {title:'Next experience: initiative',copy:'At the Sunday Market, practise noticing what needs doing and taking a thoughtful first step. You won’t have all the answers straight away. Look around, ask questions and try something. You can learn and adjust as you go.',hint:'The map marks the safe market entrance. Use the next-experience reminder to travel there whenever you are ready.',action:'market',label:'Travel to market entrance'};
 const messages={parcel:'Look for the parcel along the front garden path.',chapel:'Visit the round stone Chapel doorway. Going inside is optional.',mural:'Find an orange detail on the mural outside the arts/media building.',oval:'Follow the paths around the arts/media building to the oval for your final photo.'};
 return {title:next?.label||'Explore at your own pace',copy:messages[next?.id]||'Explore freely. Open Help whenever you need it.',hint:'Use the map and picture clue for your next place. Clearer hint and movement assistance are available in the picture clue.',action:'clue',label:'Open picture clue'};
}

const VOICES={echo:'Let’s take a closer look together.',sprout:'Small steps can lead to new discoveries.',moss:'Take your time. Notice the details.',bloom:'There’s room to try something new.',spark:'Curious? Let’s investigate.',pax:'Pause, look around, then choose your next step.',atlas:'Let’s explore the possibilities.'};
// Both the physical companion and plain Help render this exact information.
export function renderContextGuidance(panel,state,helper){
 const q=s=>panel.querySelector(s),info=contextGuidance(state),creature=Boolean(helper.model);
 q('[data-count]').textContent='HELP · WHENEVER YOU NEED IT';q('h2').textContent=info.title;q('[data-message]').textContent=info.copy;q('[data-note]').textContent=info.hint;
 for(const name of ['back','skip','next'])q('[data-'+name+']').hidden=true;
 q('[data-revisit]').replaceChildren();q('[data-action]').hidden=false;q('[data-action]').textContent=info.label;
 let presentation=q('[data-companion]');if(!presentation){presentation=document.createElement('div');presentation.dataset.companion='';presentation.innerHTML='<img width="64" height="64" alt="" style="width:64px;height:64px;object-fit:contain;float:right;margin:0 0 8px 12px"><p style="font-size:13px"></p>';q('h2').before(presentation);}presentation.hidden=!creature;if(creature){presentation.querySelector('img').src=helper.portrait;presentation.querySelector('p').textContent=helper.name+' · '+(VOICES[helper.id]||VOICES.echo);}
 return info;
}
