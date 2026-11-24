"""로컬 미리보기용 정적 서버.

python -m http.server 와 같지만 캐시를 끕니다.
브라우저가 예전 css/js 를 붙들고 있어서 "고쳤는데 안 바뀌네" 하는 일을 막아줍니다.

사용법:
    python tools/devserver.py          # http://localhost:4173
    python tools/devserver.py 5000     # 포트 바꾸기
"""

import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    handler = partial(NoCacheHandler, directory=root)
    print(f"http://localhost:{port}  (Ctrl+C 로 종료)")
    try:
        ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
