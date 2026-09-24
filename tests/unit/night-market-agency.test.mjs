import {describe,it,expect} from 'vitest';
import {freshState,applyEvent,decodeSave,createPracticeStore,MARKET_KEY} from '../../playable-3d/night-market-state.js';
import {DEFAULT_PLAN,evaluatePlan,caseNoteText} from '../../playable-3d/night-market-agency.js';
const run=(...events)=>events.reduce(applyEvent,freshState());
const plan=changes=>({type:'plan',plan:{...DEFAULT_PLAN,...changes}});
const closeShift=['inspect-trial','consolidate','pay'];
describe('agency and learning record',()=>{
 it('allows a personal case-note draft before accepting a shift without awarding anything',()=>{const s=run({type:'case-note',fields:{noticed:'People waiting'}});expect(s.caseNote.noticed).toBe('People waiting');expect(s.badges).toEqual([]);expect(s.paid).toBe(false);});
 it('allows an informed attempt without any compulsory clue visit',()=>{
  const s=run('accept',plan({sign:'both',position:'approach'}),'share-plan','run-trial',...closeShift);
  expect(s.wallet).toBe(1800);expect(s.badges).toEqual(['initiative','problem']);expect(s.learned).toBe(false);
 });
 it('pays agreed work even with unresolved results and no written reflection',()=>{
  const s=run('accept','share-plan','run-trial',...closeShift);
  expect(s.solution).toBe(null);expect(s.wallet).toBe(1800);expect(s.pass).toBe(true);expect(s.caseNote).toEqual({});expect(s.badges).toEqual(['problem']);
 });
 it('requires an actual trial and review, not a payment shortcut',()=>{
  expect(run('accept','share-plan','inspect-trial','consolidate','pay').paid).toBe(false);
  expect(run('accept','share-plan','run-trial','consolidate','pay').paid).toBe(false);
 });
 it('has multiple effective arrangements and interpretable tradeoffs',()=>{
  const signs=evaluatePlan({...DEFAULT_PLAN,sign:'pickup',position:'approach'});
  const helper=evaluatePlan({...DEFAULT_PLAN,helper:'collect'});
  const greeting=evaluatePlan({...DEFAULT_PLAN,helper:'greet'});
  expect(signs.effective).toBe(true);expect(helper.effective).toBe(true);expect(greeting.pickup).toBe(4);expect(greeting.packed).toBe(4);expect(greeting.effective).toBe(false);
  expect(evaluatePlan({...DEFAULT_PLAN,collection:'front'}).ordering).toBe(1);
 });
 it('keeps failed attempts and revisions instead of erasing them',()=>{
  const s=run('accept',plan({sign:'orders',position:'approach'}),'share-plan','run-trial','inspect-trial',plan({sign:'both',position:'approach'}),'run-trial',...closeShift,'pay');
  expect(s.trials).toHaveLength(2);expect(s.trials[0].outcome.pickup).toBe(0);expect(s.trials[1].outcome.pickup).toBe(4);expect(s.badges).toContain('adapting');expect(s.wallet).toBe(1800);
 });
 it('persists editable explanations separately from factual trials without scoring prose',()=>{
  const events=['accept','share-plan','run-trial',...closeShift,{type:'case-note',fields:{noticed:'<script>my own words</script>',transfer:'Ask before changing a shared system.'}}];
  const s=decodeSave(JSON.stringify({version:3,events}));
  expect(s.caseNote.transfer).toContain('Ask before');expect(s.wallet).toBe(1800);expect(s.trials).toHaveLength(1);
  const text=caseNoteText(s);expect(text).toContain('MY EXPLANATION');expect(text).toContain('GAME RECORD');expect(text).toContain('Not verified workplace');expect(text).toContain('my own words');
 });
 it('rejects invalid plans and oversized or unexpected reflection fields',()=>{
  const s=run('accept');for(const event of [{type:'plan',plan:{...DEFAULT_PLAN,helper:'everyone'}},{type:'case-note',fields:{score:'100'}},{type:'case-note',fields:{noticed:'a'.repeat(1201)}}])expect(applyEvent(s,event)).toBe(s);
 });
 it('does not lose existing saved explanations when storage fails',()=>{
  let raw=null;const storage={getItem:()=>raw,setItem:(k,v)=>{raw=v;},removeItem:()=>{raw=null;}};const store=createPracticeStore(storage);store.dispatch('accept');store.dispatch({type:'case-note',fields:{noticed:'Original'}});storage.setItem=()=>{throw Error('quota');};expect(store.dispatch({type:'case-note',fields:{noticed:'Changed'}})).toBe(false);expect(store.state.caseNote.noticed).toBe('Original');
 });
 it('caps trials with a valid paid handover still available',()=>{
  let s=run('accept','share-plan');for(let i=0;i<12;i++){s=applyEvent(s,plan({sign:i%2?'orders':'pickup'}));s=applyEvent(s,'run-trial');s=applyEvent(s,'inspect-trial');}
  s=applyEvent(s,plan({helper:'greet'}));expect(applyEvent(s,'run-trial')).toBe(s);s=applyEvent(applyEvent(s,'consolidate'),'pay');expect(s.wallet).toBe(1800);
 });
});
