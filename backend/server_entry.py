"""
server_entry.py  –  Perfect Fit backend entry point (production)

PyInstaller bundles this file as perfectfit-server.exe.
Electron spawns it automatically when the app starts.

Key behaviours:
- Runs `migrate` on every startup so new DB schema is applied WITHOUT
  deleting existing data (Django migrations are always additive).
- Listens on localhost:8765 so it never conflicts with other services.
- Uses Waitress (pure-Python WSGI server) – no C extensions needed.
"""

import os
import sys
import django
from django.core.management import call_command

# ── Path bootstrap ────────────────────────────────────────────────────────────
# When frozen by PyInstaller, sys._MEIPASS contains the extracted bundle.
# We add it to sys.path so Django can find its modules.
if getattr(sys, 'frozen', False):
    bundle_dir = sys._MEIPASS
else:
    bundle_dir = os.path.dirname(os.path.abspath(__file__))

sys.path.insert(0, bundle_dir)

# ── Django setup ──────────────────────────────────────────────────────────────
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'perfectfitsoftware.settings')
django.setup()

# ── Apply migrations (preserves existing data on updates) ─────────────────────
# This runs every time the server starts.  Django skips migrations that have
# already been applied, so old records are NEVER touched.
print("[PerfectFit] Applying database migrations…")
call_command('migrate', '--run-syncdb', verbosity=0)
print("[PerfectFit] Migrations done.")

# ── Start Waitress ────────────────────────────────────────────────────────────
from waitress import serve
from perfectfitsoftware.wsgi import application

HOST = '127.0.0.1'
PORT = 8765

print(f"[PerfectFit] Server starting on http://{HOST}:{PORT}")
serve(application, host=HOST, port=PORT, threads=4)
