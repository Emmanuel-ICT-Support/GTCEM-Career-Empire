"""Exercise real loopback readiness and existing full/range HTTP delivery."""
import importlib.util
from http.client import HTTPConnection
from pathlib import Path
from tempfile import TemporaryDirectory
from threading import Thread
from unittest import TestCase, main
from unittest.mock import patch
from functools import partial

spec = importlib.util.spec_from_file_location('test_site', Path(__file__).with_name('serve-test-site.py'))
site = importlib.util.module_from_spec(spec)
spec.loader.exec_module(site)

class ServerTests(TestCase):
    def test_loopback_ready_without_dns_and_full_range_delivery(self):
        with TemporaryDirectory() as directory:
            Path(directory, 'sample.bin').write_bytes(b'0123456789')
            handler = partial(site.Handler, directory=directory)
            # Any DNS lookup is a regression: it caused the hosted readiness hang.
            with patch('socket.getfqdn', side_effect=AssertionError('DNS must not be used')):
                with site.TestServer(('127.0.0.1', 0), handler) as server:
                    self.assertEqual(server.server_address[0], '127.0.0.1')
                    self.assertEqual(server.server_name, '127.0.0.1')
                    self.assertEqual(server.server_port, server.server_address[1])
                    thread = Thread(target=server.serve_forever, daemon=True)
                    thread.start()
                    connection = HTTPConnection(*server.server_address, timeout=2)
                    try:
                        connection.request('GET', '/')
                        response = connection.getresponse()
                        self.assertEqual(response.status, 200)
                        self.assertIn(b'sample.bin', response.read())
                        connection.request('GET', '/sample.bin')
                        response = connection.getresponse()
                        self.assertEqual(response.status, 200)
                        self.assertEqual(response.read(), b'0123456789')
                        for value, expected in [('bytes=2-5', b'2345'), ('bytes=-3', b'789')]:
                            connection.request('GET', '/sample.bin', headers={'Range': value})
                            response = connection.getresponse()
                            self.assertEqual(response.status, 206)
                            self.assertEqual(response.getheader('Accept-Ranges'), 'bytes')
                            self.assertEqual(int(response.getheader('Content-Length')), len(expected))
                            self.assertEqual(response.read(), expected)
                        connection.request('GET', '/sample.bin', headers={'Range': 'bytes=20-30'})
                        response = connection.getresponse()
                        self.assertEqual(response.status, 416)
                        self.assertEqual(response.getheader('Content-Range'), 'bytes */10')
                        response.read()
                    finally:
                        connection.close()
                        server.shutdown()
                        thread.join(timeout=2)
                        self.assertFalse(thread.is_alive())

if __name__ == '__main__':
    main()
