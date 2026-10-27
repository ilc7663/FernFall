import json
import sqlite3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent
SAVE_DB_PATH = Path.home() / ".fernfall" / "save.sqlite3"


class GameHandler(SimpleHTTPRequestHandler):
	def __init__(self, *args, **kwargs):
		super().__init__(*args, directory=str(ROOT), **kwargs)

	def do_GET(self):
		request_path = urlsplit(self.path).path
		if request_path == "/":
			self.path = "/site.html"
			request_path = "/site.html"
		if request_path == "/api/save":
			self._send_json(200, self._load_save())
			return
		if request_path == "/site.html":
			save_json = json.dumps(self._load_save()).replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")
			bootstrap = f"<script>window.FERNFALL_SERVER_MODE = true; window.FERNFALL_SERVER_SAVE = {save_json};</script>"
			html = (ROOT / "site.html").read_text(encoding="utf-8").replace("</head>", f"{bootstrap}</head>", 1)
			body = html.encode("utf-8")
			self.send_response(200)
			self.send_header("Content-Type", "text/html; charset=utf-8")
			self.send_header("Content-Length", str(len(body)))
			self.send_header("Cache-Control", "no-store")
			self.end_headers()
			self.wfile.write(body)
			return
		super().do_GET()

	def do_POST(self):
		if urlsplit(self.path).path != "/api/save":
			self.send_error(404)
			return
		try:
			content_length = int(self.headers.get("Content-Length", "0"))
			if content_length <= 0 or content_length > 1_000_000:
				self.send_error(413)
				return
			save = json.loads(self.rfile.read(content_length).decode("utf-8"))
		except (ValueError, UnicodeDecodeError):
			self.send_error(400)
			return
		if not isinstance(save, dict):
			self.send_error(400)
			return
		self._store_save(save)
		self.send_response(204)
		self.end_headers()

	def _send_json(self, status, value):
		body = json.dumps(value).encode("utf-8")
		self.send_response(status)
		self.send_header("Content-Type", "application/json; charset=utf-8")
		self.send_header("Content-Length", str(len(body)))
		self.end_headers()
		self.wfile.write(body)

	def _load_save(self):
		SAVE_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
		with sqlite3.connect(SAVE_DB_PATH) as connection:
			connection.execute("CREATE TABLE IF NOT EXISTS saves (id INTEGER PRIMARY KEY CHECK (id = 1), data TEXT NOT NULL)")
			row = connection.execute("SELECT data FROM saves WHERE id = 1").fetchone()
		return json.loads(row[0]) if row else None

	def _store_save(self, save):
		SAVE_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
		with sqlite3.connect(SAVE_DB_PATH) as connection:
			connection.execute("CREATE TABLE IF NOT EXISTS saves (id INTEGER PRIMARY KEY CHECK (id = 1), data TEXT NOT NULL)")
			connection.execute(
				"INSERT INTO saves (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data",
				(json.dumps(save),),
			)


if __name__ == "__main__":
	server = ThreadingHTTPServer(("127.0.0.1", 8000), GameHandler)
	print("Fernfall is ready at http://127.0.0.1:8000")
	try:
		server.serve_forever()
	except KeyboardInterrupt:
		print("\nFernfall server stopped.")
		server.server_close()
