import { test } from 'vitest';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function fixture() {
 const state={answers:{},arcFlows:{},contentGroupIndex:0,stageDeck:{contentGroups:[{id:'initiative'}]},contentTopicBestScores:{initiative:75}};
 const c=vm.createContext({state,console,window:{},persistESTProgressSnapshot(){},renderRewardPulse(){}});
 for(const file of ['est-prep-data.js','est-prep-render.js','est-prep-content.js'])vm.runInContext(fs.readFileSync(new URL('../../modules/est-prep/'+file,import.meta.url),'utf8'),c);
 c.renderContentStage=()=>{};
 const config=c.getContentTrainingConfig('initiative');
 const key=item=>c.getArcTrainingAnswerKey(config.type,item.id);
 return {c,state,config,key,flow:()=>c.getArcFlow(config)};
}
test('all nine video answers give feedback; wrong answers retry and correct answers advance',()=>{
 for(let index=0;index<3;index++)for(const option of fixture().config.steps[0].items[index].options){
  const f=fixture(),item=f.config.steps[0].items[index];for(const prior of f.config.steps[0].items.slice(0,index))f.state.answers[f.key(prior)]=prior.correct;f.state.arcFlows[f.config.type]={phase:'question',stepIndex:0,itemIndex:index};
  f.c.setTrainingChoiceEncoded(f.key(item),encodeURIComponent(option));
  assert.equal(f.flow().phase,'feedback');assert.equal(f.flow().lastOutcome,option===item.correct?'correct':'wrong');
  if(option!==item.correct){f.c.retryArcCard(f.config.type);assert.equal(f.flow().phase,'question');assert.equal(f.state.answers[f.key(item)],undefined);}
  else {f.c.advanceArcCard(f.config.type);assert.equal(f.flow().phase,index===2?'transition':'question');}
 }
});
test('completed video step can be reviewed through all cards without changing earned answers or score',()=>{
 const f=fixture();for(const item of f.config.steps[0].items)f.state.answers[f.key(item)]=item.correct;
 const earned=JSON.stringify(f.state.answers),score=f.c.getTrainingScore(f.config).correct;
 f.c.jumpArcStep(f.config.type,0);
 for(let index=0;index<3;index++){
  const item=f.config.steps[0].items[index];assert.equal(f.flow().phase,'review');assert.equal(f.flow().reviewAnswer,null);assert.equal(f.flow().itemIndex,index);
  f.c.setTrainingChoiceEncoded(f.key(item),encodeURIComponent(item.options.find(x=>x!==item.correct)));
  assert.equal(f.flow().lastOutcome,'wrong');assert.equal(JSON.stringify(f.state.answers),earned);
  f.c.advanceArcCard(f.config.type);assert.equal(f.flow().phase,'feedback');
  f.c.retryArcCard(f.config.type);assert.equal(f.flow().phase,'review');assert.equal(f.flow().reviewAnswer,null);
  f.c.setTrainingChoiceEncoded(f.key(item),encodeURIComponent(item.correct));assert.equal(f.flow().lastOutcome,'correct');
  f.c.advanceArcCard(f.config.type);
 }
 assert.equal(f.flow().phase,'transition');assert.equal(JSON.stringify(f.state.answers),earned);assert.equal(f.c.getTrainingScore(f.config).correct,score);assert.equal(f.state.contentTopicBestScores.initiative,75);
 f.c.startArcStep(f.config.type);assert.equal(f.flow().stepIndex,1);assert.equal(f.flow().phase,'question');
});
test('old saved review state and reloaded review feedback recover without a reset',()=>{
 const f=fixture(),item=f.config.steps[0].items[0];f.state.answers[f.key(item)]=item.correct;
 f.state.arcFlows[f.config.type]={phase:'review',stepIndex:0,itemIndex:0,lastOutcome:'review'};
 assert.equal(f.flow().reviewing,true);assert.equal(f.flow().reviewAnswer,undefined);
 f.c.setTrainingChoice(f.key(item),'Needs more initiative');
 f.state.arcFlows=JSON.parse(JSON.stringify(f.state.arcFlows));
 assert.equal(f.flow().lastOutcome,'wrong');f.c.retryArcCard(f.config.type);assert.equal(f.flow().phase,'review');assert.equal(f.state.answers[f.key(item)],item.correct);
});
