import {buildPublicMarketPortfolioUrl} from '../modules/initiative/parallel/learning/portfolio/initiative-portfolio.mjs';
import {createInitiativeNotes,initiativeMarketChoices} from './initiative-market.mjs';
import {createMarketArchon} from './market-archon.mjs';
import {validateLibrary,mountLesson} from '../modules/initiative/parallel/learning/lesson.mjs';
import {createMarketLearningHost,createNotesPersistenceBridge} from '../modules/initiative/parallel/integration/market-learning-host.mjs';
export function createMarketLearningRoutes({dialog,show,storage,currentLearner,lobbyUrl}){
 let host,bridge,identity,library;
 const libraryUrl=new URL('../modules/initiative/parallel/learning/library.json',import.meta.url);
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('../modules/initiative/parallel/learning/lesson.css',import.meta.url);document.head.append(css);
 function status(text){let p=dialog.querySelector('[data-learning-save]');if(!p){p=document.createElement('p');p.dataset.learningSave='1';p.setAttribute('role','status');dialog.append(p);}p.textContent=text;}
 function ensure(context){if(!library||!context.learner)throw Error('Learning context unavailable');if(identity!==context.learner){host?.destroy();identity=context.learner;host=createMarketLearningHost({library,learnerKey:identity,storage,onStatus:status});bridge=createNotesPersistenceBridge(host,{learnerKey:identity,library});}return bridge;}
 const notes=createInitiativeNotes({dialog,show,libraryUrl:libraryUrl.href,currentLearner,validateLibrary:l=>{validateLibrary(l);library=l;},mountLesson,
 readDraft:c=>ensure(c).readDraft(c),saveDraft:c=>ensure(c).saveDraft(c),recordEvidence:c=>ensure(c).recordEvidence(c)});
 const archon=lobbyUrl?createMarketArchon({dialog,show,lobbyUrl}):null;
 return ({welcome,mara})=>{
  const choices=initiativeMarketChoices({notes,archon:archon?archon.openLobby:back=>show('Careers Archon · connection not configured','The Archon service is not configured for this world. Your Market visit and learning are kept.',[['Back to Market choices',back]]),mara,welcome});
  choices[2][0]='Mara';choices[0][0]='Lecture notes';choices[1][0]=archon?'Archon Game':'Archon Game · connection not configured';const portfolioUrl=buildPublicMarketPortfolioUrl(new URL('../dashboards/student.html',import.meta.url).href,new URL('./',import.meta.url).href);const ordered=[choices[2],choices[0],choices[1],['Portfolio Builder',null,false,portfolioUrl]];ordered.byId={mara:choices[2][1],notes:choices[0][1],archon:choices[1][1],portfolioHref:portfolioUrl,archonAvailable:Boolean(archon)};return ordered;
 };
}
