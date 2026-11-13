import {it,expect} from 'vitest';
import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync(new URL('../../dashboards/dashboard.js',import.meta.url),'utf8');
const scope={getStarEntryExperienceDate:e=>e.experienceDate,compareStarEntriesByExperienceDate:(a,b)=>(Date.parse(b.experienceDate)||0)-(Date.parse(a.experienceDate)||0)};vm.createContext(scope);
for(const name of ['uniquePortfolioEntries','groupPortfolioTimeline']){const start=source.indexOf('function '+name+'('),end=source.indexOf('\nfunction ',start+10);vm.runInContext(source.slice(start,end),scope);}
it('projects multi-tag references once in chronology without merging equal text or mutating source records',()=>{
 const first={id:'a',experienceDate:'2026-11-12',skillIds:['initiative','teamwork'],summary:'Same words'},second={id:'b',experienceDate:'2026-11-04',summary:'Same words'};
 const input=[first,second,first],before=JSON.stringify(input);expect(scope.uniquePortfolioEntries(input).map(e=>e.id)).toEqual(['a','b']);expect(JSON.stringify(input)).toBe(before);expect(scope.uniquePortfolioEntries([{summary:'legacy'},{summary:'legacy'}])).toHaveLength(2);
});
it('groups newest years and months first and retains invalid or missing dates visibly as undated',()=>{
 const input=[{id:'old',experienceDate:'2025-02-15'},{id:'later',experienceDate:'2026-11-12'},{id:'oct',experienceDate:'2026-10-21'},{id:'bad',experienceDate:'2026-02-31'},{id:'missing'},{id:'overflow',experienceDate:'2026-13-99'}];
 const result=scope.groupPortfolioTimeline(input);expect(result.map(x=>x.year)).toEqual(['2026','2025','undated']);expect(result[0].months.map(x=>x.month)).toEqual(['11','10']);expect(result[2].months[0].entries.map(x=>x.id).sort()).toEqual(['bad','missing','overflow']);expect(result.flatMap(y=>y.months.flatMap(m=>m.entries))).toHaveLength(6);
});
