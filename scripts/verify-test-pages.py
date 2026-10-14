"""Verify a static preview's published inventory through HTTP, including media ranges."""
from concurrent.futures import ThreadPoolExecutor
import hashlib, json, sys
from urllib.parse import quote
from urllib.request import Request, urlopen

base = sys.argv[1].rstrip('/')+'/'
with urlopen(base+'preview-release.json',timeout=30) as response:
    release = json.load(response)
if release['repository'] != 'taniab1975/test-career-empire':
    raise SystemExit('Wrong preview repository')
if len(sys.argv)>2 and release['sourceCommit'] != sys.argv[2]:
    raise SystemExit('Preview source commit mismatch')
def check(item):
    digest = hashlib.sha256();size=0
    with urlopen(base+quote(item['path']),timeout=30) as response:
        while data:=response.read(1024*1024): digest.update(data);size+=len(data)
    if digest.hexdigest()!=item['sha256'] or size!=item['bytes']:
        raise RuntimeError('HTTP bytes differ: '+item['path'])
with ThreadPoolExecutor(max_workers=8) as pool:
    list(pool.map(check,release['files']))
video = next(item for item in release['files'] if item['path'].endswith('career-empire-intro.mp4'))
with urlopen(Request(base+quote(video['path']),headers={'Range':'bytes=0-63'}),timeout=30) as response:
    if response.status!=206 or len(response.read())!=64:
        raise SystemExit('Video byte-range delivery failed')
print(json.dumps({'baseURL':base,'sourceCommit':release['sourceCommit'],'verifiedHttpFiles':len(release['files']),'verifiedBytes':sum(item['bytes'] for item in release['files']),'mediaRange':'206, 64 bytes','existingLegacyLinkWarnings':release.get('existingLegacyLinkWarnings',[])},indent=2))
