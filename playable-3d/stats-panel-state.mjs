// Preserve the student's disclosure and keyboard position across a Stats repaint.
export function captureStatsPanel(root){
 const active=root.ownerDocument.activeElement;
 const focus=root.contains(active)?active:null;
 return {open:Object.fromEntries([...root.querySelectorAll('[data-stats-disclosure]')].map(el=>[el.dataset.statsDisclosure,el.open])),action:focus?.dataset.marketMoneyAction||null,summary:focus?.tagName==='SUMMARY'?focus.parentElement.dataset.statsDisclosure:null,scrollTop:root.parentElement?.scrollTop||0};
}
export function restoreStatsPanel(root,state){
 for(const el of root.querySelectorAll('[data-stats-disclosure]'))el.open=state.open[el.dataset.statsDisclosure]===true;
 let target=null,fallback=false;
 if(state.action){target=[...root.querySelectorAll('[data-market-money-action]')].find(el=>el.dataset.marketMoneyAction===state.action&&!el.disabled);if(!target){target=root.querySelector('[data-stats-disclosure="game-money"] > summary');fallback=true;}}
 else if(state.summary)target=[...root.querySelectorAll('[data-stats-disclosure]')].find(el=>el.dataset.statsDisclosure===state.summary)?.querySelector(':scope > summary');
 target?.focus({preventScroll:true});if(root.parentElement)root.parentElement.scrollTop=state.scrollTop;if(fallback)target?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
}
