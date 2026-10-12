import {browserRun} from './game-session.mjs?v=guest-first-20261012';
import {createTasterIntro} from './intro-taster.mjs?v=default-exploration-20261011';
import {loadProfiles} from './profiles.js?v=named-students-20261011';
const params=new URLSearchParams(location.search),quiet=params.get('mode')!=='full'&&!params.has('experience')&&!params.has('outfit')&&!params.has('view');
const run=await browserRun();window.CareerEmpireGameRun=run;
if(quiet){const state=loadProfiles(run.storage),bridge={};const intro=createTasterIntro({profile:state.activeId,storage:run.storage,onPause:()=>bridge.pause?.(),onResume:()=>bridge.resume?.(),focusTarget:document.querySelector('#scene')});window.CareerEmpireIntro={intro,bridge};let progress;try{progress=JSON.parse(run.storage.getItem('ce-missing-frame-local-review-v1'));}catch{}intro.showIfDue(progress);document.documentElement.dataset.introShellMs=String(Math.round(performance.now()));}
import('./app.js?v=frame-upload-budget-20261012').catch(error=>{document.querySelector('#loading-message').textContent='The outdoor scene could not finish loading. Your browser saves have not been changed. Reload to retry.';document.querySelector('#avatar-retry').hidden=false;document.querySelector('#avatar-retry').onclick=()=>location.reload();console.error(error);});
