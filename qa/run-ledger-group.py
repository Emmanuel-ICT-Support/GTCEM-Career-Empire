"""Run only a verified selection from the saved failed/unfinished inventory."""
from pathlib import Path
import argparse,hashlib,json,os,re,signal,subprocess

parser=argparse.ArgumentParser()
parser.add_argument('groups',nargs='+');parser.add_argument('--renderer',choices=['native','software'],required=True)
parser.add_argument('--label',required=True);parser.add_argument('--timeout',type=int,default=600)
parser.add_argument('--id',action='append',dest='ids')
args=parser.parse_args()
root=Path(__file__).resolve().parents[1];os.chdir(root)
ledger_path=root/'docs/broader-failure-ledger-20261014.json';ledger=json.loads(ledger_path.read_text())
selected=[e for e in ledger['entries'] if e['group'] in args.groups and (not args.ids or e['id'] in args.ids)]
assert selected,'No ledger cases selected'
assert set(args.groups)<={e['group'] for e in selected},'Unknown group'
if args.ids:assert set(args.ids)=={e['id'] for e in selected},'Unknown case ID'
folder=root/'coverage/broader-targeted-20261014'/args.label;folder.mkdir(parents=True,exist_ok=False)
env=os.environ.copy();env.update({'CE_TEST_RENDERER':args.renderer,'CE_TEST_OUTPUT':str(folder/'browser'),'CE_RECORD_BACKEND':'1','CE_LEDGER_EVENTS':str(folder/'events.jsonl')})
env.pop('PLAYWRIGHT_JSON_OUTPUT_FILE',None)
pattern='(?:'+'|'.join(re.escape(' '.join(e['titlePath']))+'$' for e in selected)+')'
command=['npx','playwright','test','--config','qa/ecc-root-causes.playwright.config.mjs','--grep',pattern,'--workers=1','--retries=0','--max-failures=0']
listed=subprocess.run(command+['--list','--reporter=json'],env=env,text=True,capture_output=True,check=True)
(folder/'inventory.json').write_text(listed.stdout);inventory=json.loads(listed.stdout)
def cases(report):
 out=[]
 def visit(suites):
  for suite in suites:
   for spec in suite.get('specs',[]):
    for i,test in enumerate(spec.get('tests',[])):
     out.append((spec['id']+':'+(test.get('projectId') or test.get('projectName'))+':'+str(i),spec,test))
   visit(suite.get('suites',[]))
 visit(report.get('suites',[]));return out
expected={e['id'] for e in selected};actual=[c[0] for c in cases(inventory)]
assert len(actual)==len(set(actual)) and set(actual)==expected,(len(actual),len(expected),set(actual)^expected)
test_sources=[root/'tests/e2e'/e['titlePath'][0] for e in selected]
test_sources += [root/'tests/e2e/campus-fixtures.js',root/'tests/e2e/helper-fixtures.js',root/'tests/e2e/owned-account-fixtures.js',root/'qa/ecc-root-causes.playwright.config.mjs',root/'qa/ledger-progress.cjs']
test_sources += [p for p in [root/'qa/shader-program-profile.js',root/'qa/environment-cache-experiment.mjs'] if p.exists()]
variant='precomputed-room-environment' if env.get('CE_ENV_CACHE_PATH') else 'baseline'
plan={'groups':args.groups,'requestedRenderer':args.renderer,'count':len(actual),'ids':actual,'baseCommit':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'appSha256':hashlib.sha256((root/'playable-3d/app.js').read_bytes()).hexdigest(),'runtimeVariant':variant,'diagnosticOnly':variant!='baseline','coldShaderDiskCacheDisabled':env.get('CE_COLD_SHADERS')=='1','testSourceHashes':{str(path.relative_to(root)):hashlib.sha256(path.read_bytes()).hexdigest() for path in sorted(set(test_sources))}}
(folder/'plan.json').write_text(json.dumps(plan,indent=2)+'\n');print('Exact targeted inventory:',len(actual),flush=True)
env['PLAYWRIGHT_JSON_OUTPUT_FILE']=str(folder/'report.json')
link=root/'Assets';created=False
if not link.exists():link.symlink_to('/Users/tania.byrnes/Documents/Codex/2026-10-08/task/ecc-final-ba60122/Assets',target_is_directory=True);created=True
try:
 with (folder/'run.log').open('w') as log:
  process=subprocess.Popen(command+['--reporter=./qa/ledger-progress.cjs,json'],env=env,stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
  try:returncode=process.wait(timeout=args.timeout)
  except subprocess.TimeoutExpired:
   os.killpg(process.pid,signal.SIGTERM)
   try:process.wait(timeout=10)
   except subprocess.TimeoutExpired:os.killpg(process.pid,signal.SIGKILL);process.wait()
   returncode=124
finally:
 if created:link.unlink()
summary={**plan,'exitCode':returncode,'passed':0,'failed':0,'skipped':0,'notRun':0,'reported':0,'unreported':len(actual),'onceOnly':False}
if (folder/'report.json').exists():
 report=json.loads((folder/'report.json').read_text());recorded=cases(report)
 assert len(recorded)==len(actual) and {c[0] for c in recorded}==expected
 summary.update({'reported':len(recorded),'unreported':0})
 summary['onceOnly']=all(len(test.get('results',[]))==1 for _,_,test in recorded)
 ledger=json.loads(ledger_path.read_text())
 for identifier,spec,test in recorded:
  results=test.get('results',[]);outcome='notRun' if not results else 'passed' if test.get('status')=='expected' else 'skipped' if results[-1]['status']=='skipped' else 'failed'
  summary[outcome]+=1
  entry=next(e for e in ledger['entries'] if e['id']==identifier)
  entry.setdefault('proof',[]).append({'label':args.label,'renderer':args.renderer,'outcome':outcome,'baseCommit':plan['baseCommit'],'appSha256':plan['appSha256'],'runtimeVariant':variant,'diagnosticOnly':plan['diagnosticOnly'],'report':str((folder/'report.json').relative_to(root))})
  if outcome=='failed':entry['latestFailure']=results[-1].get('error',{})
ledger_path.write_text(json.dumps(ledger,indent=2)+'\n');(folder/'summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2),flush=True)
raise SystemExit(returncode)
