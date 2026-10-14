import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
const copy=JSON.parse(readFileSync(new URL('../../economy-lab/course-outline.json',import.meta.url)));
test('student outline retains all eleven stages with Unit 3 and Unit 4 separated',()=>{
 expect(copy.stages.map(s=>s.number)).toEqual([1,2,3,4,5,6,7,8,9,10,11]);expect(copy.stages.filter(s=>s.unit==='Unit 3')).toHaveLength(6);expect(copy.stages.filter(s=>s.unit==='Unit 4')).toHaveLength(5);
});
test('student copy does not leak teacher traceability or invent weekly dates',()=>{
 expect(copy.header.subtitle).toBe('Draft learning sequence');expect(copy.header.status_note).toContain('still to be confirmed');
 expect(Object.keys(copy).sort()).toEqual(['header','stages','throughout']);expect(JSON.stringify(copy)).not.toMatch(/CEM12-|curriculum_ids|source_teaching|Week [0-9]|assessment_claim/);
 for(const stage of copy.stages)expect(Object.keys(stage).sort()).toEqual(['experience','learn','number','title','unit']);
});
test('existing portfolio is the weekly reflection home; stages are not assessments',()=>{expect(copy.throughout.portfolio).toContain('Each teaching week');expect(JSON.stringify(copy.throughout)).toContain('formal tasks and due dates');expect(copy.stages[0].learn).toContain('Initiative');});
