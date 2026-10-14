"""Local test server with byte ranges, matching production media delivery."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import re, sys

class Handler(SimpleHTTPRequestHandler):
    def send_head(self):
        self.byte_range = None
        header = self.headers.get('Range')
        path = Path(self.translate_path(self.path))
        if not header or not path.is_file():
            return super().send_head()
        match = re.fullmatch(r'bytes=(\d*)-(\d*)', header.strip())
        size = path.stat().st_size
        if not match or not size or not any(match.groups()):
            self.send_error(416, 'Unsupported byte range')
            return None
        first, last = match.groups()
        start = int(first) if first else max(0, size-int(last))
        end = min(size-1, int(last)) if first and last else size-1
        if start > end or start >= size:
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{size}')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        stream = path.open('rb')
        stream.seek(start)
        self.byte_range = end-start+1
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(str(path)))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(self.byte_range))
        self.end_headers()
        return stream

    def copyfile(self, source, output):
        if self.byte_range is None:
            return super().copyfile(source, output)
        remaining = self.byte_range
        while remaining:
            block = source.read(min(65536, remaining))
            if not block:
                break
            output.write(block)
            remaining -= len(block)

class TestServer(ThreadingHTTPServer):
    # ES-module startup opens many parallel requests; the default backlog of five
    # resets legitimate browser downloads and leaves the import graph incomplete.
    request_queue_size = 128
    daemon_threads = True

if __name__ == '__main__':
    TestServer(('127.0.0.1', int(sys.argv[1])), Handler).serve_forever()
