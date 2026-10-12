"""Export the committed test game's static dependency closure, without a build service.

Run: python3 scripts/export-test-pages.py coverage/pages-site/test-career-empire
The root redirect replaces development navigation; every other copied byte is
from HEAD. Runtime directories with constructed URLs are declared below.
"""
from pathlib import Path, PurePosixPath
import hashlib, json, os, re, struct, subprocess, sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
WEB = {'.html','.css','.js','.mjs','.json','.glb','.gltf','.bin','.wasm','.hdr',
       '.png','.jpg','.jpeg','.webp','.gif','.svg','.ico','.woff','.woff2','.ttf',
       '.otf','.mp3','.mp4','.wav','.ogg','.webm','.pdf'}
TEXT = {'.html','.css','.js','.mjs','.json','.gltf','.svg'}
# Paths assembled by runtime code rather than a single literal. These small
# delivery folders contain the complete selectable cast, documents and scenery.
DYNAMIC = ['playable-3d/vendor/', 'playable-3d/assets/helpers/',
 'playable-3d/assets/market-npcs/', 'playable-3d/assets/community-cast-20260927/',
 'playable-3d/assets/campus-buildings/shared-textures/',
 'playable-3d/assets/est-documents/', 'playable-3d/wardrobe-thumbnails/']
EXCLUDED = {'node_modules','coverage','qa','tests','scripts','.git','.agents','.codex','.aws'}

def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args])

def main():
    target = Path(sys.argv[1]).resolve()
    if target == ROOT or not (target.is_relative_to(ROOT / 'coverage') or target.is_relative_to(Path('/tmp'))):
        raise SystemExit('Export destination must be a separate coverage/ or /tmp/ directory.')
    if target.exists() and any(target.iterdir()):
        raise SystemExit('Export destination must be empty; existing work is never deleted.')
    origin = git('remote','get-url','origin').decode().strip()
    if origin != 'https://github.com/taniab1975/test-career-empire.git':
        raise SystemExit('Wrong origin: only the authorized personal test repository can be exported.')
    commit = git('rev-parse','HEAD').decode().strip()
    entries = {}
    for line in git('ls-tree','-r','HEAD').decode().splitlines():
        meta, name = line.split('\t',1)
        entries[name] = meta.split()[2]
    cache, selected, queue, failures = {}, set(), [], set()
    def contents(name):
        if name not in cache:
            cache[name] = git('cat-file','blob',entries[name])
        return cache[name]
    def add(name, by):
        name = os.path.normpath(unquote(name)).replace(os.sep,'/')
        if name == '.': return
        if name == 'index.html': return  # generated test-game entrance
        if any(part in EXCLUDED for part in PurePosixPath(name).parts):
            failures.add(f'{by}: forbidden development path {name}'); return
        if name not in entries:
            failures.add(f'{by}: missing {name}'); return
        license_notice = name.startswith('playable-3d/vendor/') and 'license' in PurePosixPath(name).name.lower()
        if PurePosixPath(name).suffix.lower() not in WEB and not license_notice:
            return
        if name not in selected:
            selected.add(name); queue.append(name)
    manifest = json.loads(contents('playable-3d/release-manifest.json'))
    for item in manifest['files']:
        name = os.path.normpath('playable-3d/'+item['path'])
        if hashlib.sha256(contents(name)).hexdigest() != item['sha256']:
            raise SystemExit(f'Committed release hash mismatch: {name}')
        add(name, 'release manifest')
    add('playable-3d/index.html','entrance')
    for name in entries:
        if any(name.startswith(prefix) for prefix in DYNAMIC): add(name,'constructed runtime URL')
        # Character Studio constructs these names from selectable profile values.
        if re.fullmatch(r'playable-3d/assets/(avatar-[ab]|hair-.+|shoes-.+|occupational-.+|hospital-scrub-top|neckline-skin)\.glb', name):
            add(name,'constructed wardrobe URL')
    def resolve(raw, parent, strict=False, asset=False):
        raw = raw.strip()
        if not raw or raw.startswith(('#','data:','blob:','http:','https:','mailto:','javascript:')): return
        raw = unquote(urlsplit(raw).path)
        if not raw or '${' in raw: return
        base = str(PurePosixPath(parent).parent)
        candidates = [os.path.normpath(base+'/'+raw)]
        # Textures/catalog JSON frequently resolve against the playable page.
        if not strict or asset: candidates += [os.path.normpath('playable-3d/'+raw),raw,re.sub(r'^(?:\.\.?/)+','',raw)]
        if asset and parent.endswith(('.js','.mjs')):
            candidates += [str(PurePosixPath(page).parent)+'/'+raw for page in entries if page.endswith('.html')]
        for name in candidates:
            if name == '.': return  # generated root entrance
            name = os.path.normpath(name)
            if name in entries or name == 'index.html': add(name,parent); return
            if name.endswith('/') or not PurePosixPath(name).suffix:
                index = name.rstrip('/')+'/index.html'
                if index in entries or index == 'index.html': add(index,parent); return
        if not strict or asset:
            # Dedicated GLB/PDF declarations can use a basename plus a URL prefix.
            matches = [name for name in entries if PurePosixPath(name).name == raw and PurePosixPath(name).suffix.lower() in WEB]
            if matches:
                for name in matches: add(name,parent)
                return
        if strict: failures.add(f'{parent}: unresolved {raw}')
    while queue:
        name = queue.pop()
        if name.endswith('.glb'):
            data = contents(name)
            if data[:4] != b'glTF': raise SystemExit(f'Invalid GLB: {name}')
            length, kind = struct.unpack_from('<I4s',data,12)
            if kind != b'JSON': raise SystemExit(f'GLB has no JSON chunk: {name}')
            document = json.loads(data[20:20+length])
            for item in document.get('images',[])+document.get('buffers',[]):
                if item.get('uri'):
                    # DefaultLoadingManager substitutes phone bytes but GLTFLoader
                    # retains the requested original URL as its resource base.
                    base = {'playable-3d/assets/phone/careers-mobile.glb':'playable-3d/assets/campus-buildings/careers-shared-textures.glb',
                            'playable-3d/assets/phone/workplace-mobile.glb':'playable-3d/assets/campus-buildings/workplace-shared-textures.glb'}.get(name,name)
                    resolve(item['uri'],base,True)
            continue
        if PurePosixPath(name).suffix.lower() not in TEXT: continue
        source = contents(name).decode('utf-8')
        if name.endswith(('.js','.mjs','.css')):
            source = re.sub(r'/\*[\s\S]*?\*/','',source)
            source = re.sub(r'^\s*//.*$','',source,flags=re.MULTILINE)
        if name.endswith(('.js','.mjs')):
            for match in re.finditer(r'(?:\bfrom\s*|\bimport\s*\(?\s*)([\'\"])(\.[^\'\"]+)\1',source):
                resolve(match[2],name,True)
        # HTML attributes, including HTML embedded in JS templates.
        for match in re.finditer(r'\b(?:src|href|poster)\s*=\s*([\'\"])([^\'\"]+)\1',source):
            resolve(match[2],name,not name.endswith(('.js','.mjs')))
        for match in re.finditer(r'url\(\s*([\'\"]?)([^)\'\"]+)\1\s*\)',source):
            resolve(match[2],name,True)
        for match in re.finditer(r'([\'\"])([^\'\"\n]+)\1',source):
            raw = match[2]
            if '${' in raw: continue
            if PurePosixPath(urlsplit(raw).path).suffix.lower() in WEB:
                literal_path = raw.startswith(('./','../','assets/','Assets/','vendor/','environment/'))
                resolve(raw,name,literal_path,True)
    known_legacy = {'data/world/town-layout.stage1-corrected.json: unresolved ../modules/megatrends/index.html'}
    legacy_warnings = sorted(failures & known_legacy)
    failures -= known_legacy
    if failures: raise SystemExit('\n'.join(sorted(failures)))
    inventory = [{'path':name,'bytes':len(contents(name)),'sha256':hashlib.sha256(contents(name)).hexdigest()} for name in sorted(selected)]
    size = sum(item['bytes'] for item in inventory)
    if size >= 1_000_000_000: raise SystemExit(f'Export exceeds GitHub Pages 1 GB limit: {size} bytes')
    target.mkdir(parents=True,exist_ok=True)
    for name in sorted(selected):
        path=target/name;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(contents(name))
    (target/'.nojekyll').write_text('')
    (target/'index.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=./playable-3d/"><title>Career Empire test preview</title><a href="./playable-3d/">Open Career Empire test preview</a></html>\n')
    report={'repository':'taniab1975/test-career-empire','sourceCommit':commit,'gamePath':'playable-3d/','fileCount':len(inventory)+3,'dependencyBytes':size,'existingLegacyLinkWarnings':legacy_warnings,'files':inventory}
    (target/'preview-release.json').write_text(json.dumps(report,indent=2)+'\n')
    total = sum(path.stat().st_size for path in target.rglob('*') if path.is_file())
    if total >= 1_000_000_000: raise SystemExit(f'Final export exceeds Pages limit: {total} bytes')
    print(json.dumps({'sourceCommit':commit,'files':len(inventory)+3,'bytes':total,'MiB':round(total/1024**2,2),'destination':str(target),'existingLegacyLinkWarnings':legacy_warnings},indent=2))

if __name__ == '__main__': main()
