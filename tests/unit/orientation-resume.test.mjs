import {test,expect} from 'vitest';
import {resumeOrientationStep} from '../../playable-3d/orientation-tour.mjs';
test('legacy photo, companion, landing, menu, Stats and course positions retain meaning',()=>{for(let step=0;step<6;step++)expect(resumeOrientationStep({version:1,step})).toBe(step);});
test('legacy Initiative resumes at Initiative after inserted character beats',()=>{expect(resumeOrientationStep({version:1,step:6})).toBe(8);});
test('legacy Mara arrival resumes its original final destination and recovery',()=>{expect(resumeOrientationStep({version:1,step:7})).toBe(9);});
test('new tour retains all ten current positions without modifying saved data',()=>{for(let step=0;step<10;step++){const saved={version:2,step};expect(resumeOrientationStep(saved)).toBe(step);expect(saved).toEqual({version:2,step});}});
test('unrecognized and invalid checkpoints recover to the photo review',()=>{for(const saved of [null,{}, {version:3,step:6},{version:1,step:8},{version:2,step:10},{version:2,step:-1},{version:2,step:1.5}])expect(resumeOrientationStep(saved)).toBe(0);});
