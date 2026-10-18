import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {test,expect} from 'vitest';
test('teacher context with unavailable data can construct the empty dashboard before rendering',()=>{
 const source=readFileSync('dashboards/dashboard.js','utf8');
 const start=source.indexOf('function renderTeacherLiveData('),end=source.indexOf('  const dashboardContext',start);
 const context={getTeacherDashboardFilter:()=>({studentRecordFocus:'inactive'}),getActiveTeacherContext:()=>({teacher:{schoolId:'synthetic-school'}}),buildFallbackTeacherDashboardData:()=>({}),getStudentRecordCounts:()=>({active:0,inactive:0})};
 vm.runInNewContext(source.slice(start,end)+'return safeTeacherData; }\nthis.result=renderTeacherLiveData([],null,null);',context);
 expect(context.result.studentRecordFocus).toBe('inactive');expect(context.result.students).toEqual([]);expect(context.result.evidenceRows).toEqual([]);
});
