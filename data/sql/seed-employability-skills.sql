insert into employability_skills (category_id, category_title, subskill_id, subskill_title, description, sort_order)
values
  ('communication', 'Communication', 'terminology-spelling-grammar', 'Terminology, Spelling and Grammar', 'Use appropriate terminology, spelling, and grammar to communicate clearly.', 1),
  ('communication', 'Communication', 'purpose-audience-format', 'Purpose, Audience and Format', 'Choose the right message, structure, and format for the intended audience and purpose.', 2),
  ('communication', 'Communication', 'non-verbal-communication', 'Non-verbal Communication', 'Use body language, facial expression, and tone to support meaning and connection.', 3),
  ('communication', 'Communication', 'active-listening', 'Active Listening', 'Listen with focus, ask questions, and respond thoughtfully.', 4),

  ('digital-literacy', 'Digital Literacy', 'reliable-online-research', 'Reliable Online Research', 'Locate trustworthy information and assess source reliability.', 5),
  ('digital-literacy', 'Digital Literacy', 'online-safety', 'Online Safety', 'Use online safety processes to reduce risk and protect digital identity.', 6),
  ('digital-literacy', 'Digital Literacy', 'electronic-communication', 'Electronic Communication', 'Communicate effectively using email, text, video calls, and related media.', 7),
  ('digital-literacy', 'Digital Literacy', 'work-related-software', 'Work-related Software', 'Use documents, presentations, spreadsheets, and multimedia tools in work contexts.', 8),

  ('teamwork', 'Teamwork', 'build-rapport', 'Build Rapport', 'Develop positive relationships and trust with team members.', 9),
  ('teamwork', 'Teamwork', 'team-roles-and-responsibilities', 'Team Roles and Responsibilities', 'Perform agreed team roles and meet responsibilities.', 10),
  ('teamwork', 'Teamwork', 'reliability-and-task-completion', 'Reliability and Task Completion', 'Complete tasks on time and to the expected standard.', 11),
  ('teamwork', 'Teamwork', 'consensus-building', 'Consensus Building', 'Consider other viewpoints and work toward shared decisions.', 12),

  ('time-management', 'Time Management', 'plan-and-prioritise', 'Plan and Prioritise', 'Organise tasks and priorities to meet deadlines.', 13),
  ('time-management', 'Time Management', 'productivity-tools', 'Productivity Tools', 'Use planning and productivity tools to manage tasks and workflow.', 14),
  ('time-management', 'Time Management', 'track-and-reassess', 'Track and Reassess', 'Monitor progress and adjust priorities when circumstances change.', 15),

  ('critical-thinking', 'Critical Thinking', 'research-and-information-gathering', 'Research and Information Gathering', 'Collect reliable information relevant to a task.', 16),
  ('critical-thinking', 'Critical Thinking', 'analysis-and-evaluation', 'Analysis and Evaluation', 'Compare, analyse, and evaluate information to develop a solution.', 17),
  ('critical-thinking', 'Critical Thinking', 'bias-reflection', 'Bias Reflection', 'Recognise and reflect on bias that may affect decisions.', 18),

  ('problem-solving', 'Problem-Solving', 'questioning-techniques', 'Questioning Techniques', 'Use open and closed questions to understand situations and issues.', 19),
  ('problem-solving', 'Problem-Solving', 'generate-solutions', 'Generate Solutions', 'Develop a range of possible solutions.', 20),
  ('problem-solving', 'Problem-Solving', 'decision-making-models', 'Decision-making Models', 'Use a decision-making model to plan, implement, and evaluate solutions.', 21)
on conflict do nothing;
