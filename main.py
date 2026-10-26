from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent


class GameHandler(SimpleHTTPRequestHandler):
	def __init__(self, *args, **kwargs):
		super().__init__(*args, directory=str(ROOT), **kwargs)

	def do_GET(self):
		if self.path == "/":
			self.path = "/site.html"
		super().do_GET()


if __name__ == "__main__":
	server = ThreadingHTTPServer(("127.0.0.1", 8000), GameHandler)
	print("Fernfall is ready at http://127.0.0.1:8000")
	try:
		server.serve_forever()
	except KeyboardInterrupt:
		print("\nFernfall server stopped.")
		server.server_close()
