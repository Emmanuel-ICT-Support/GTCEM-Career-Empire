import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = path.join(root, 'private/governance/project-registry.json');
const receiptPath = '.career-empire/receipts.json';
const publicRoot = 'https://taniab1975.github.io/career-empire-blueprint/';
export const digest = (value) => createHash('sha256').update(value).digest('hex');
const excluded = (name) => name === receiptPath || name.startsWith('private/governance/state/');
const readJson = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'));
const git = (repo, args, options = {}) => execFileSync('git', ['-C', repo, ...args], {
  // Git hooks export repository-local variables. Each -C call must inspect its own repo.
  env: Object.fromEntries(Object.entries(process.env).filter(([key]) =>
    !['GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE', 'GIT_PREFIX'].includes(key))),
  encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'], ...options,
});
const optionalGit = (repo, args) => {
  try { return git(repo, args).trim(); } catch { return null; }
};
const jsonHash = (value) => digest(JSON.stringify(value));
const safeId = (value) => {
  assert.match(value, /^[a-z0-9][a-z0-9-]{1,60}$/);
  return value;
};
const atomicJson = (filename, value) => {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const temporary = filename + '.' + randomUUID() + '.tmp';
  fs.writeFileSync(temporary, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 });
  fs.renameSync(temporary, filename);
};

export function tree(repo, revision) {
  if (!revision) return {};
  assert.match(revision, /^[a-f0-9]{40,64}$/);
  const entries = git(repo, ['ls-tree', '-r', '-z', revision]).split('\0').filter(Boolean);
  return Object.fromEntries(entries.map((entry) => {
    const separator = entry.indexOf('\t');
    const [mode, , blob] = entry.slice(0, separator).split(' ');
    return [entry.slice(separator + 1), mode + ':' + blob];
  }));
}

export function difference(before, after) {
  return Object.fromEntries([...new Set([...Object.keys(before), ...Object.keys(after)])]
    .sort().filter((name) => !excluded(name) && before[name] !== after[name])
    .map((name) => [name, after[name] ?? null]));
}

export function snapshot(repo) {
  const head = optionalGit(repo, ['rev-parse', '--verify', 'HEAD']);
  const files = tree(repo, head);
  const changed = head ? git(repo, ['diff', '--no-renames', '--name-only', '-z', head]).split('\0') : [];
  const names = [...new Set([...changed,
    ...git(repo, ['ls-files', '--others', '--exclude-standard', '-z']).split('\0'),
    ...(!head ? git(repo, ['ls-files', '-z']).split('\0') : []),
  ])].filter(Boolean);
  for (const name of names) {
    if (excluded(name)) continue;
    const filename = path.join(repo, name);
    let stat;
    try { stat = fs.lstatSync(filename); } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      delete files[name];
      continue;
    }
    if (stat.isDirectory()) {
      files[name] = 'submodule:' + (optionalGit(filename, ['rev-parse', 'HEAD']) ?? 'unknown') +
        ':' + digest(optionalGit(filename, ['status', '--porcelain']) ?? 'unreadable');
    } else {
      const mode = stat.isSymbolicLink() ? '120000' : (stat.mode & 0o111) ? '100755' : '100644';
      const blob = stat.isSymbolicLink()
        ? git(repo, ['hash-object', '--stdin'], { input: fs.readlinkSync(filename) }).trim()
        : git(repo, ['hash-object', '--no-filters', '--', filename]).trim();
      files[name] = mode + ':' + blob;
    }
  }
  return { head, files: Object.fromEntries(Object.entries(files).sort(([first], [second]) => first.localeCompare(second))) };
}

export function verifyIntegration(integration, contract) {
  assert.equal(integration?.status, 'complete', 'Blueprint integration is not complete');
  assert.ok(Array.isArray(integration.types) && integration.types.length, 'Missing change types');
  const required = new Set(contract.common);
  for (const type of integration.types) {
    const kind = contract.kinds.find((entry) => entry.id === type);
    assert.ok(kind, 'Unknown change type: ' + type);
    kind.targets.forEach((target) => required.add(target));
  }
  assert.ok(Array.isArray(integration.targets), 'Missing impact checklist');
  const seen = new Set();
  for (const target of integration.targets) {
    assert.ok(!seen.has(target.surface), 'Duplicate surface');
    seen.add(target.surface);
    assert.ok(['updated', 'checked-unchanged'].includes(target.disposition), 'Unresolved surface: ' + target.surface);
    assert.equal(target.verification?.result, 'passed', 'Unverified surface: ' + target.surface);
    for (const value of [target.action, target.owner, target.acceptance, target.verification?.method]) {
      assert.ok(typeof value === 'string' && value.trim().length >= 12, 'Specific verification required');
    }
    assert.ok(target.evidence?.length && target.evidence.every((value) => typeof value === 'string' && value.trim()), 'Evidence required');
    assert.ok(target.records?.length, 'Affected record IDs required');
    assert.match(target.verification.date, /^\d{4}-\d{2}-\d{2}$/);
  }
  for (const surface of required) assert.ok(seen.has(surface), 'Missing affected surface: ' + surface);
}

export function uncovered(changes, receipts, blueprint, projectId) {
  assert.ok(Array.isArray(receipts), 'Receipt list required');
  const valid = receipts.filter((receipt) => {
    try {
      const integration = blueprint.changeIntegrations.changes.find((item) => item.changeId === receipt.changeId);
      verifyIntegration(integration, blueprint.changeWorkflows);
      assert.ok(blueprint.operations.governance.changes.some((item) => item.id === receipt.changeId), 'Missing material record');
      assert.equal(receipt.integrationSha256, jsonHash(integration), 'Stale integration receipt');
      assert.equal(receipt.project, projectId, 'Wrong project receipt');
      assert.ok(typeof receipt.reviewEvidence === 'string' && receipt.reviewEvidence.trim().length >= 12);
      assert.ok(receipt.files && typeof receipt.files === 'object');
      return true;
    } catch { return false; }
  });
  return Object.keys(changes).filter((name) =>
    !valid.some((receipt) => {
      const integration = blueprint.changeIntegrations.changes.find((item) => item.changeId === receipt.changeId);
      const approvedFiles = integration.projectChanges?.[projectId];
      return approvedFiles && Object.hasOwn(approvedFiles, name) && approvedFiles[name] === changes[name] &&
        Object.hasOwn(receipt.files, name) && receipt.files[name] === changes[name];
    }));
}

export async function publishedBlueprint() {
  const suffix = '?guard=' + Date.now();
  const [manifestResponse, recordResponse] = await Promise.all([
    fetch(publicRoot + 'publication-manifest.json' + suffix, { signal: AbortSignal.timeout(20000) }),
    fetch(publicRoot + 'blueprint-records.json' + suffix, { signal: AbortSignal.timeout(20000) }),
  ]);
  assert.ok(manifestResponse.ok && recordResponse.ok, 'Live Blueprint unavailable; release remains blocked');
  const manifest = await manifestResponse.json();
  const bytes = Buffer.from(await recordResponse.arrayBuffer());
  assert.equal(digest(bytes), manifest.recordSha256, 'Live record/manifest mismatch; retry after deployment settles');
  return { record: JSON.parse(bytes.toString()), manifest };
}

function receiptsAt(repo, revision) {
  try {
    return revision ? JSON.parse(git(repo, ['show', revision + ':' + receiptPath])) : readJson(path.join(repo, receiptPath));
  } catch { return []; }
}

export function resolveRegistered(repo, projects) {
  const resolved = fs.realpathSync(repo);
  let entry = projects.find((project) => fs.existsSync(project.path) && fs.realpathSync(project.path) === resolved);
  if (!entry) {
    const top = optionalGit(repo, ['rev-parse', '--show-toplevel']);
    assert.ok(top && fs.realpathSync(top) === resolved, 'A project root is required');
    const common = optionalGit(repo, ['rev-parse', '--path-format=absolute', '--git-common-dir']);
    entry = projects.find((project) => {
      const candidate = optionalGit(project.path, ['rev-parse', '--path-format=absolute', '--git-common-dir']);
      return common && candidate && fs.realpathSync(common) === fs.realpathSync(candidate);
    });
    if (entry) return { ...entry, path: resolved, sourceProjectId: entry.id,
      id: entry.id.slice(0, 44) + '-wt-' + digest(resolved).slice(0, 12) };
  }
  assert.ok(entry, 'Project not registered with the canonical Blueprint; do not create another master');
  return entry;
}

function registered(repo) {
  return resolveRegistered(repo, readJson(registryPath).projects);
}

export function scanProject(project, stateRoot) {
  safeId(project.id);
  const current = snapshot(project.path);
  const statePath = path.join(stateRoot, project.id + '.json');
  const previous = fs.existsSync(statePath) ? readJson(statePath) : null;
  const changed = difference(previous?.files ?? tree(project.path, project.baselineHead), current.files);
  const fingerprint = jsonHash(current);
  const observation = {
    id: 'CE-INBOX-' + project.id + '-' + fingerprint.slice(0, 16),
    project: project.id, observedAt: new Date().toISOString(), head: current.head,
    status: 'unreviewed', initialBaseline: !previous,
    changed, nextAction: 'Review source/approval, classify types, update the canonical material record and every affected reader surface. This observation is not approval or completion.',
  };
  if (Object.keys(changed).length || (previous && previous.head !== current.head)) {
    const filename = path.join(stateRoot, 'inbox', observation.id + '.json');
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    try { fs.writeFileSync(filename, JSON.stringify(observation, null, 2) + '\n', { flag: 'wx', mode: 0o600 }); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
  }
  atomicJson(statePath, current);
  return { project: project.id, changedFiles: Object.keys(changed).length, observation: observation.id, head: current.head };
}

export async function main(args = process.argv.slice(2)) {
  const command = args[0] ?? 'check';
  const option = (name) => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
  const repo = path.resolve(option('--repo') ?? process.cwd());
  const stateRoot = path.join(root, 'private/governance/state');
  if (command === 'scan') {
    const monitor = await import('./workflow-monitor.mjs');
    monitor.main();
    return;
  }
  if (command === 'scan-registered-only') {
    const projects = option('--repo') ? [registered(repo)] : readJson(registryPath).projects;
    const lock = path.join(stateRoot, '.scan-lock');
    fs.mkdirSync(stateRoot, { recursive: true });
    fs.mkdirSync(lock);
    const results = [];
    try {
      for (const project of projects) {
        try {
          const result = scanProject(project, stateRoot);
          if (project.hookExpected) {
            const configured = optionalGit(project.path, ['config', '--get', 'core.hooksPath']);
            const hook = path.join(project.path, '.career-empire/hooks/pre-push');
            const policy = path.join(project.path, 'CAREER-EMPIRE-WORKFLOW.md');
            const localGuard = path.join(project.path, '.career-empire/guard.mjs');
            assert.equal(configured, '.career-empire/hooks', 'Required pre-push hook configuration missing');
            assert.ok(fs.statSync(hook).mode & 0o111, 'Required pre-push hook is not executable');
            assert.equal(digest(fs.readFileSync(policy)), digest(fs.readFileSync(path.join(root, 'docs/production/project-work-contract.md'))), 'Project instructions have drifted');
            assert.equal(digest(fs.readFileSync(localGuard)), digest(fs.readFileSync(path.join(root, 'scripts/project-guard.mjs'))), 'Project CI guard has drifted');
          }
          results.push(result);
        }
        catch (error) { results.push({ project: project.id, error: error.message }); }
      }
      atomicJson(path.join(stateRoot, 'last-scan.json'), { checkedAt: new Date().toISOString(), results });
    } finally { fs.rmdirSync(lock); }
    console.log(JSON.stringify(results, null, 2));
    if (results.some((result) => result.error)) process.exitCode = 1;
    return;
  }
  if (command === 'intake') {
    const project = registered(repo);
    const title = option('--title');
    const types = option('--types')?.split(',');
    const contract = readJson(path.join(root, 'data/change-workflows.json'));
    assert.ok(title?.trim().length >= 12 && types?.length, 'Intake requires --title and --types');
    const targets = new Set(contract.common);
    for (const type of types) {
      const kind = contract.kinds.find((item) => item.id === type);
      assert.ok(kind, 'Unknown type ' + type);
      kind.targets.forEach((target) => targets.add(target));
    }
    const intake = {
      id: 'CE-DISCUSSION-' + randomUUID(), project: project.id,
      recordedAt: new Date().toISOString(), title, types,
      status: 'pending-canonical-integration', source: option('--source') ?? 'Current task; attach exact user evidence before approval',
      targets: [...targets], nextAction: 'Append canonical material record and per-surface integration; no completion inferred.',
    };
    atomicJson(path.join(stateRoot, 'inbox', intake.id + '.json'), intake);
    console.log(JSON.stringify(intake, null, 2));
    return;
  }
  const project = command === 'ci' ? null : registered(repo);
  const projectId = project?.sourceProjectId ?? project?.id ?? safeId(fs.readFileSync(path.join(repo, '.career-empire/project-id'), 'utf8').trim());
  const base = command === 'ci' ? option('--base') : project.baselineHead;
  if (base) assert.match(base, /^[a-f0-9]{40,64}$/);
  const candidate = option('--ref');
  if (candidate) assert.match(candidate, /^[a-f0-9]{40,64}$/);
  if (command === 'pre-push') {
    const lines = fs.readFileSync(0, 'utf8').trim().split('\n').filter(Boolean);
    for (const line of lines) {
      const [, localSha] = line.split(/\s+/);
      assert.match(localSha ?? '', /^[a-f0-9]{40,64}$/);
      if (!/^0+$/.test(localSha)) await main(['check', '--repo', repo, '--ref', localSha]);
    }
    return;
  }
  if (base && candidate) git(repo, ['merge-base', '--is-ancestor', base, candidate]);
  const before = base && !/^0+$/.test(base) ? tree(repo, base) : {};
  const after = candidate ? tree(repo, candidate) : command === 'ci'
    ? tree(repo, git(repo, ['rev-parse', 'HEAD']).trim()) : snapshot(repo).files;
  const changes = difference(before, after);
  if (!Object.keys(changes).length) {
    console.log('No changed file versions require Blueprint coverage.');
    return;
  }
  const published = await publishedBlueprint();
  if (command === 'receipt') {
    const changeId = option('--change');
    const integration = published.record.changeIntegrations.changes.find((item) => item.changeId === changeId);
    verifyIntegration(integration, published.record.changeWorkflows);
    const evidence = option('--evidence');
    assert.ok(evidence?.trim().length >= 12, '--evidence must identify the actual source/reader review');
    const selectedPaths = option('--paths-json') ? JSON.parse(option('--paths-json')) : option('--paths')?.split(',');
    assert.ok(selectedPaths?.length, 'Specify exact reviewed --paths; blanket receipt creation is not allowed');
    const files = {};
    for (const name of selectedPaths) {
      assert.ok(Object.hasOwn(changes, name), 'Path not in changed set: ' + name);
      assert.ok(Object.hasOwn(integration.projectChanges?.[projectId] ?? {}, name), 'File not explicitly reviewed in the published Blueprint: ' + name);
      assert.equal(integration.projectChanges[projectId][name], changes[name], 'Published source review does not match file version: ' + name);
      files[name] = changes[name];
    }
    const receipts = receiptsAt(repo);
    receipts.push({
      changeId, project: projectId, integrationSha256: jsonHash(integration),
      recordSha256: published.manifest.recordSha256, reviewedAt: new Date().toISOString(),
      reviewEvidence: evidence, files,
    });
    atomicJson(path.join(repo, receiptPath), receipts);
    console.log('Receipt saved for ' + Object.keys(files).length + ' explicitly reviewed file versions.');
    return;
  }
  assert.ok(['check', 'ci'].includes(command), 'Unknown guard command');
  const revision = candidate ?? (command === 'ci' ? git(repo, ['rev-parse', 'HEAD']).trim() : null);
  const missing = uncovered(changes, receiptsAt(repo, revision), published.record, projectId);
  assert.equal(missing.length, 0, 'Blueprint coverage missing/stale for ' + missing.length + ' file(s): ' +
    missing.slice(0, 12).join(', ') + '. Update actual Blueprint surfaces, verify the live release, then bind exact reviewed versions. Do not bypass the guard.');
  console.log('Changed file versions have completed, published Blueprint integration receipts.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error('Career Empire guard: ' + error.message); process.exitCode = 1; });
}
