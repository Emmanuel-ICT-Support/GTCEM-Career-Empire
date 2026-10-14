// Portraits are the only assets used by the picker. URLs do not fetch models.
export const HELPERS=Object.freeze(['Echo','Sprout','Moss','Bloom','Spark','Pax','Atlas'].map(name=>Object.freeze({id:name.toLowerCase(),name,portrait:`./assets/helpers/${name.toLowerCase()}.png`,model:`./assets/helpers/${name.toLowerCase()}.glb`})));
export const GUIDANCE_MODES=Object.freeze([{id:'none',name:'Help',model:null},{id:'journal',name:'Journal',model:null}]);
export const helperFor=id=>GUIDANCE_MODES.find(h=>h.id===id)||HELPERS.find(h=>h.id===id)||HELPERS[0];
const validChoice=id=>GUIDANCE_MODES.some(h=>h.id===id)||HELPERS.some(h=>h.id===id);
export function createHelperStore(storage){
 const memory=new Map();let persistent=true;
 const key=profile=>'ce-guidance-v2:'+encodeURIComponent(profile);
 return {legacy(profile){try{return storage?.getItem('ce-helper-v1:'+encodeURIComponent(profile));}catch{return null;}},get persistent(){return persistent;},read(profile){if(memory.has(profile))return memory.get(profile);try{const id=storage?.getItem(key(profile));const valid=validChoice(id)?id:null;memory.set(profile,valid);return valid;}catch{persistent=false;return null;}},write(profile,id){if(!validChoice(id))return false;memory.set(profile,id);try{if(!storage)throw Error('Storage unavailable');storage.setItem(key(profile),id);}catch{persistent=false;}return true;}};
}
