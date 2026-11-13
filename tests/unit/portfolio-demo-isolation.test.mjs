import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { createFictionalPortfolioEntries, makeDemoPracticeEntry } from '../../dashboards/portfolio-demo.mjs';
const categories = JSON.parse(fs.readFileSync(new URL('../../data/employability-skills.json', import.meta.url))).categories;
describe('separate fictional portfolio data source', () => {
  it('covers all capabilities with varied dates and multi-capability tags without learner identities or rewards', () => {
    const entries = createFictionalPortfolioEntries(categories);
    expect(new Set(entries.flatMap(e => e.skillIds))).toEqual(new Set(categories.map(c => c.id)));
    expect(new Set(entries.map(e => e.experienceDate)).size).toBe(4);
    expect(entries.every(e => e.demoOnly && e.fictionalSeed && e.salaryReward === 0 && e.skillIds.length > 1)).toBe(true);
    expect(entries.some(e => 'studentId' in e || 'userId' in e || 'reviewStatus' in e)).toBe(false);
    entries[0].responses.situation = 'changed locally';
    expect(createFictionalPortfolioEntries(categories)[0].responses.situation).not.toBe('changed locally');
  });
  it('whitelists anonymous practice fields and known multi-tags without persisting caller identities', () => {
    const entry = makeDemoPracticeEntry({ selectedSkillIds: ['initiative', 'teamwork', 'unknown'], selectedSubskillIds: ['initiative:being-proactive', 'teamwork:build-rapport', 'unknown:bad'], experienceDate: '2026-11-13', contextId: 'school', responses: Object.fromEntries(['situation','task','actions','results','nextSteps'].map(k => [k, 'Fictional '+k])), studentId: 'must-not-cross', salaryReward: 999 }, categories, 5);
    expect(entry.skillIds).toEqual(['initiative', 'teamwork']);
    expect(entry.subskillTags).toHaveLength(2);
    expect(entry.salaryReward).toBe(0); expect(entry).not.toHaveProperty('studentId');
    expect(entry.demoOnly).toBe(true); expect(entry.fictionalSeed).toBe(false);
    expect(() => makeDemoPracticeEntry({selectedSkillIds:['initiative'], contextId:'unknown'}, categories, 1)).toThrow();
  });
});
