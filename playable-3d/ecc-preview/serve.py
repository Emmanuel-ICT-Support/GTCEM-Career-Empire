"""Local preview server. Serves the existing game; saves only this candidate's export."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = Path(__file__).resolve().parent / 'assets'

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):
        targets = {'/ecc-export.glb': 'ECC-Campus-Hub-Exterior-Candidate-01.glb',
                   '/ecc-layout.json': 'candidate-layout.json'}
        if self.path not in targets:
            self.send_error(404)
            return
        size = int(self.headers.get('Content-Length', '0'))
        if not 0 < size < 100_000_000:
            self.send_error(413)
            return
        data = self.rfile.read(size)
        if self.path.endswith('.glb') and data[:4] != b'glTF':
            self.send_error(400)
            return
        if self.path.endswith('.json'):
            json.loads(data)
        (OUTPUT / targets[self.path]).write_bytes(data)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(b'{"saved":true}')

if __name__ == '__main__':
    ThreadingHTTPServer(('127.0.0.1', 4269), Handler).serve_forever()
