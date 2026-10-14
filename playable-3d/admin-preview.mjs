// Public navigation preview only; this does not establish an authenticated role.
export const isAdminPreview=params=>params.get('admin-review')==='1'&&params.get('market-review')==='1';
export const administrationAvailable=(state,preview=false)=>state.paid===true||preview===true;
export function adminPreviewURL(href){
  const url=new URL('./',href);
  url.searchParams.set('experience','night-market');
  url.searchParams.set('market-review','1');url.searchParams.set('admin-review','1');
  return url.href;
}
export function createPreviewStorage(){
  const data=new Map();
  return {persistent:false,getItem:key=>data.get(key)??null,
    setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)};
}
