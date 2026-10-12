// Separate review version: preserves the earlier v4 trail and souvenir verbatim.
export const KEY='ce-missing-frame-local-review-v1';
const image=(v,type)=>typeof v==='string'&&v.startsWith(`data:image/${type};base64,`)?v:null;
export function normalise(raw){
 const shots={};for(const place of ['chapel','mural']){const s=raw?.shots?.[place];if(s&&typeof s.label==='string'&&image(s.image,'jpeg'))shots[place]={label:s.label.slice(0,60),image:s.image};}
 let step=[0,1,3,4].includes(raw?.step)?raw.step:0;
 if(step>=3&&!Object.keys(shots).length)step=1;
 const chapelVisited=raw?.chapelVisited===true||Boolean(shots.chapel)||Boolean(shots.mural);
 if(step===3&&!shots.mural)step=1;
 return {step,skipped:raw?.skipped===true,souvenir:image(raw?.souvenir,'png'),developed:raw?.developed===true||chapelVisited,shots,chapelVisited,style:raw?.style==='comedy'?'comedy':'mystery',destination:chapelVisited?'mural':'chapel'};
}
export function advance(state,event){return !state.skipped&&((event==='parcel'&&state.step===0)||(event==='oval'&&state.step===3))?{...state,step:event==='parcel'?1:4}:state;}
export function collectShot(state,place,shot){return !state.skipped&&state.step>=1&&place==='mural'&&state.chapelVisited&&!state.shots[place]&&typeof shot?.label==='string'&&image(shot.image,'jpeg')?{...state,step:state.step===1?3:state.step,shots:{...state.shots,[place]:{label:shot.label.slice(0,60),image:shot.image}}}:state;}
export function reward(state,picture){return state.step===4&&!state.souvenir&&image(picture,'png')?{...state,souvenir:picture}:state;}
export function restart(state){return {...state,step:0,skipped:false,developed:false,chapelVisited:false,shots:{}};}

export function chooseStyle(state,style){return ['mystery','comedy'].includes(style)?{...state,style}:state;}

export function discoveryLocation(mode,p){
 if(mode==='chapel')return {title:'ECC Chapel',subtitle:'Quiet interior · blue entrance returns to campus'};
 if(mode!=='town')return null;
 if(Math.hypot(p.x-10.6,p.z+38.4)<8)return {title:'Mural · arts/media exterior',subtitle:'Original school mural · outside the building'};
 if(p.z<-46&&p.z>-74&&p.x>-24&&p.x<12)return {title:'Oval · filming spot',subtitle:'Open grass facing the curved arts/media building'};
 if(p.z<-26&&(p.x<=-24||p.x>=28))return {title:'Campus grounds',subtitle:'School landscape · open exploration'};
 if(p.z<-26)return {title:'Arts/media · campus paths',subtitle:'Walk around the building to reach the oval'};
 if(Math.hypot(p.x+3.15,p.z+8.8)<9)return {title:'Chapel gardens',subtitle:'Round stone Chapel · blue entrance'};
 if(p.z<5)return {title:'Campus paths',subtitle:'Gardens between arrival and the Chapel'};
 return {title:'Arrival Gardens',subtitle:'Parcel and camera · front garden path'};
}

export function visitChapel(state){return state.chapelVisited?state:{...state,chapelVisited:true,developed:true,destination:state.step===1&&!state.shots.mural?"mural":state.destination};}

// Once the photo-finish surprise starts, cancelling its camera sequence must
// not turn already-present teachers into invisible interaction targets.
export function teachersRevealed(state,revealStarted,sequence){return state.step===4||revealStarted||Boolean(sequence);}

// Progress may already have been saved at the doorway; exit still presents its clue.
export function needsMuralClue(state){return !state.skipped&&state.step===1&&state.chapelVisited&&!state.shots.mural;}
