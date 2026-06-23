@echo off
REM ============================================================
REM  Perfect Fit – Backend Build Script
REM  Bundles Django + SQLite into a single perfectfit-server.exe
REM  Uses `py` launcher (Windows standard)
REM ============================================================

echo [1/3] Installing build dependencies...
py -m pip install waitress pyinstaller django-cors-headers --quiet

echo [2/3] Running PyInstaller...
py -m PyInstaller ^
    --onefile ^
    --name perfectfit-server ^
    --distpath dist ^
    --workpath build_temp ^
    --specpath . ^
    --add-data "perfectfitsoftware;perfectfitsoftware" ^
    --add-data "adminApp;adminApp" ^
    --add-data "db.sqlite3;." ^
    --hidden-import django.contrib.admin ^
    --hidden-import django.contrib.auth ^
    --hidden-import django.contrib.contenttypes ^
    --hidden-import django.contrib.sessions ^
    --hidden-import django.contrib.messages ^
    --hidden-import django.contrib.staticfiles ^
    --hidden-import django.db.backends.sqlite3 ^
    --hidden-import adminApp ^
    --hidden-import waitress ^
    server_entry.py

echo [3/3] Done! Output: dist\perfectfit-server.exe
