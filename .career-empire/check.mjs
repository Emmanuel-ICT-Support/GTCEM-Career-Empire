import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repo = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const canonical = process.env.CAREER_EMPIRE_BLUEPRINT_ROOT || execFileSync('git', ['config', '--get', 'careerEmpire.blueprintRoot'], { encoding: 'utf8' }).trim();
if (!canonical) throw new Error('Canonical Blueprint access is not configured. Do not create another Blueprint.');
const { main } = await import(pathToFileURL(path.join(canonical, 'scripts/project-guard.mjs')).href);
await main([...process.argv.slice(2), '--repo', repo]).catch((error) => {
  console.error('Career Empire guard: ' + error.message);
  process.exitCode = 1;
});
