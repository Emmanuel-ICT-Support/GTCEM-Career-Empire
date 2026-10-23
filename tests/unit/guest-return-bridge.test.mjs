import {test,expect} from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
import {openRun} from '../../playable-3d/game-session.mjs';
const html=fs.readFileSync(new URL('../../economy-lab/index.html',import.meta.url),'utf8');
const source=html.match(/<script id="guest-return-bridge">([\s\S]*?)<\/script>/)?.[1]||'';
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};};
function harness({token='same-run',savedId=token}={}){
 const tab=memory(),photo='data:image/png;base64,completed-photo',trail=JSON.stringify({step:4,souvenir:photo,chapelVisited:true});if(savedId)tab.setItem('ce-game-run-handoff-v1',JSON.stringify({id:savedId,createdAt:Date.now(),data:{trail}}));const raw=tab.getItem('ce-game-run-handoff-v1');
 const location=new URL('https://game.test/economy-lab/'+(token?'?guestRun='+token:'')),status={textContent:''};let handler,capture;
 vm.runInNewContext(source,{URL,URLSearchParams,Date,sessionStorage:tab,location,document:{addEventListener:(name,fn,option)=>{if(name==='click'){handler=fn;capture=option;}},getElementById:()=>status}});
 expect(handler,'return bridge must exist before the asynchronous module app').toBeTypeOf('function');expect(capture).toBe(true);
 const link={href:'https://game.test/playable-3d/?tour=resume'};let prevented=false;const click=()=>handler({target:{closest:()=>link},preventDefault:()=>prevented=true});return {tab,raw,photo,trail,link,status,click,get prevented(){return prevented;}};
}
test('early Back preserves the actual one-shot photo snapshot without needing the module app',()=>{const h=harness();h.click();expect(h.prevented).toBe(false);expect(new URL(h.link.href).searchParams.get('guestRun')).toBe('same-run');expect(new URL(h.link.href).searchParams.get('tour')).toBe('resume');expect(h.tab.getItem('ce-game-run-handoff-v1')).toBe(h.raw);const returned=openRun({url:h.link.href,tabStorage:h.tab,id:()=> 'fresh'});expect(returned.continued).toBe(true);expect(returned.run.storage.getItem('trail')).toBe(h.trail);expect(h.tab.getItem('ce-game-run-handoff-v1')).toBeNull();expect(openRun({url:returned.url,tabStorage:h.tab,id:()=> 'new-entry'}).run.storage.getItem('trail')).toBeNull();});
test('a mismatched handoff blocks navigation and preserves the stored snapshot',()=>{const h=harness({savedId:'different-run'});h.click();expect(h.prevented).toBe(true);expect(h.tab.getItem('ce-game-run-handoff-v1')).toBe(h.raw);expect(h.status.textContent).toContain('return');});
test('ordinary account/direct entry links are unchanged without a guest token',()=>{const h=harness({token:null,savedId:null});const before=h.link.href;h.click();expect(h.prevented).toBe(false);expect(h.link.href).toBe(before);});
test('early bridge does not overwrite newer module-side changes',()=>{const h=harness();const module=openRun({url:'https://game.test/economy-lab/?guestRun=same-run',tabStorage:h.tab,newEntry:false}).run;module.storage.setItem('module-note','latest');h.click();expect(openRun({url:h.link.href,tabStorage:h.tab}).run.storage.getItem('module-note')).toBe('latest');});
