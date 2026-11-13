// A separate presentation data source. Never reads or writes learner records.
export function createFictionalPortfolioEntries(categories) {
  const examples = [
    ['2026-11-12', 'gameplay', ['initiative', 'teamwork', 'communication'], 'A Market queue needed clearer directions.', 'Help the fictional crew keep ordering and collection clear.', 'I checked the crew plan, suggested separate signs and explained the change calmly.', 'The fictional trial showed fewer customers joining the wrong queue.', 'Check the queue again before keeping the change.'],
    ['2026-11-04', 'school', ['time-management', 'digital-literacy'], 'A fictional class group had several tasks due together.', 'Agree a realistic plan using a shared checklist.', 'I compared deadlines, divided the work and checked the shared file permissions.', 'The group completed the planned tasks before its practice deadline.', 'Leave more time for checking sources.'],
    ['2026-10-21', 'workplace', ['initiative', 'problem-solving', 'critical-thinking'], 'A fictional store repeatedly ran low on display stock.', 'Suggest an improvement within the worker role and safety limits.', 'I checked the pattern, compared two safe options and asked the supervisor to trial a checklist.', 'The fictional trial found gaps earlier; the supervisor reviewed the result.', 'Collect a longer sample before claiming the problem is solved.'],
    ['2026-09-18', 'community', ['communication', 'teamwork'], 'A fictional volunteer group needed to explain its event plan.', 'Make the instructions clear for new volunteers.', 'I listened to questions, used simple directions and checked everyone knew their role.', 'The fictional group could repeat the instructions and ask for help.', 'Ask the next group which directions could be clearer.']
  ];
  return examples.map(([experienceDate, contextId, ids, situation, task, actions, results, nextSteps], index) => {
    const selected = ids.map(id => categories.find(c => c.id === id));
    if (selected.some(c => !c)) throw Error('Demo capability content is unavailable');
    return { id: `fictional-demo-${index + 1}`, demoOnly: true, fictionalSeed: true,
      skillId: ids[0], skillIds: [...ids], skillTitle: selected[0].title,
      skillTitles: selected.map(c => c.title), experienceDate, contextId,
      summary: `Fictional example: ${situation}`, responses: { situation, task, actions, results, nextSteps },
      subskillTags: selected.map(c => ({ skillId: c.id, subskillId: c.subskills[0].id })), salaryReward: 0 };
  });
}

export function makeDemoPracticeEntry(draft, categories, index) {
  const skillIds = [...new Set(draft.selectedSkillIds || [])].filter(id => categories.some(c => c.id === id));
  if (!skillIds.length || !['school', 'workplace', 'community', 'gameplay'].includes(draft.contextId)) throw Error('Choose an experience and capability');
  const responses = Object.fromEntries(['situation', 'task', 'actions', 'results', 'nextSteps'].map(key => [key, String(draft.responses?.[key] || '').trim().slice(0, 4000)]));
  if (Object.values(responses).some(v => !v)) throw Error('Complete each reflection field');
  const subskillTags = (draft.selectedSubskillIds || []).flatMap(key => {
    const [skillId, subskillId] = key.split(':');
    return skillIds.includes(skillId) && categories.find(c => c.id === skillId)?.subskills.some(s => s.id === subskillId) ? [{ skillId, subskillId }] : [];
  });
  return { id: `demo-practice-${index}`, demoOnly: true, fictionalSeed: false, skillId: skillIds[0], skillIds,
    skillTitle: categories.find(c => c.id === skillIds[0]).title, experienceDate: draft.experienceDate,
    contextId: draft.contextId, responses, subskillTags, summary: `Anonymous demo practice: ${responses.situation}`, salaryReward: 0 };
}
