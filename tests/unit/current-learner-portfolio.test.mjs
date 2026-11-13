import { it, expect } from 'vitest';
import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync(new URL('../../dashboards/dashboard.js',import.meta.url),'utf8');
const start=source.indexOf('function currentLearnerPortfolioEntries('),end=source.indexOf('\nfunction ',start+10);
const scope={};vm.createContext(scope);vm.runInContext(source.slice(start,end)+';this.filterEntries=currentLearnerPortfolioEntries;',scope);
const context={studentId:'fictional-learner-a',classId:'fictional-class-a'};
const own={id:'reflection-a',skillId:'initiative',contextId:'school',reviewId:'review-a'};
const ownReview={id:'review-a',student_id:context.studentId,class_id:context.classId,evidence_type:'employability-star',task_key:'employability-star:initiative:school:reflection-a'};
it('shows only current-learner and current-class entries with exact authoritative bindings',()=>{
  const foreign={id:'reflection-b',reviewId:'review-b'},unlinked={id:'legacy-unlinked',reviewText:'same text'};
  const entries=[own,foreign,unlinked,{...own,id:'demo',demoOnly:true}];
  const before=JSON.stringify(entries);
  const foreignReview={...ownReview,id:'review-b',student_id:'fictional-learner-b'};
  expect(scope.filterEntries(entries,[ownReview,foreignReview],context).map(e=>e.id)).toEqual(['reflection-a']);
  expect(JSON.stringify(entries)).toBe(before);
  expect(scope.filterEntries(entries,[{...ownReview,class_id:'other-class'}],context)).toHaveLength(0);
  expect(scope.filterEntries(entries,[ownReview],{})).toHaveLength(0);
});
it('allows an exact legacy task binding but never ownership by equal free text or partial entry id',()=>{
  const legacy={...own,reviewId:null};
  expect(scope.filterEntries([legacy],[ownReview],context)).toHaveLength(1);
  expect(scope.filterEntries([legacy],[{...ownReview,task_key:ownReview.task_key+'-different',raw_response_text:'same text'}],context)).toHaveLength(0);
  expect(scope.filterEntries([legacy],[{...ownReview,evidence_type:'other',task_key:ownReview.task_key}],context)).toHaveLength(0);
});
