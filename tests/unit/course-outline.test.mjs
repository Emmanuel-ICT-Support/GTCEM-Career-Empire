import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
const copy=JSON.parse(readFileSync(new URL('../../economy-lab/course-outline.json',import.meta.url)));
test('student outline separates orientation and first paid gig while retaining source stage IDs and later Mara return',()=>{
 expect(copy.stages.map(s=>s.number)).toEqual([0,1,2,3,4,5,6,7,8,9,10,11]);expect(copy.stages.filter(s=>s.unit==='Unit 3')).toHaveLength(6);expect(copy.stages.filter(s=>s.unit==='Unit 4')).toHaveLength(5);
 expect(copy.stages.map(s=>s.stage_id)).toEqual(['INTRO','J0','J1','J2','J3','J4','J5','J6','J7','J8','J9','J10']);
 expect(copy.stages[0].title).toBe('Intro, exploration and world overview');expect(copy.stages[1].title).toBe('First paid gig: Mara’s noodles / Initiative');expect(copy.stages[2].title).toBe('Read the changing world');expect(copy.stages[6].experience).toContain('Revisit Mara');
});
test('student copy does not leak teacher traceability or invent weekly dates',()=>{
 expect(copy.header.subtitle).toBe('Draft learning sequence');expect(copy.header.status_note).toContain('still to be confirmed');
 expect(Object.keys(copy).sort()).toEqual(['header','stages','throughout']);expect(JSON.stringify(copy)).not.toMatch(/CEM12-|curriculum_ids|source_teaching|Week [0-9]|assessment_claim/);
 for(const stage of copy.stages)expect(Object.keys(stage).sort()).toEqual(['experience','learn','number','stage_id','title','unit']);
});
test('existing portfolio is the weekly reflection home; phases are not assessments',()=>{expect(copy.throughout.portfolio).toContain('Each teaching week');expect(JSON.stringify(copy.throughout)).toContain('formal tasks and due dates');expect(copy.stages[1].learn).toContain('Initiative');});
