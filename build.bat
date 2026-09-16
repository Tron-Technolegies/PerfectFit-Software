@echo off
REM ====================================================================
REM  Perfect Fit v1.0.4  –  Master Build Script
REM  Run this from the project root: D:\Tron-Projects\Perfect-Fit\
REM
REM  What it does:
REM    1. Install Python build tools (waitress + pyinstaller)
REM    2. Bundle Django backend → backend\dist\perfectfit-server.exe
REM    3. Build React frontend  → frontend\dist\
REM    4. Package everything    → electron\releases\Perfect Fit Setup 1.1.1.exe
REM
REM  Requirements:
REM    - `py` (Python Windows Launcher) in PATH
REM    - Node + npm in PATH
REM    - Internet access (first run only, to download packages)
REM ====================================================================

setlocal enabledelayedexpansion

echo.
echo  ██████╗ ███████╗██████╗ ███████╗███████╗ ██████╗████████╗    ███████╗██╗████████╗
echo  ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝██╔════╝╚══██╔══╝    ██╔════╝██║╚══██╔══╝
echo  ██████╔╝█████╗  ██████╔╝█████╗  █████╗  ██║        ██║       █████╗  ██║   ██║
echo  ██╔═══╝ ██╔══╝  ██╔══██╗██╔══╝  ██╔══╝  ██║        ██║       ██╔══╝  ██║   ██║
echo  ██║     ███████╗██║  ██║██║     ███████╗╚██████╗   ██║       ██║     ██║   ██║
echo  ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝   ╚═╝       ╚═╝     ╚═╝   ╚═╝
echo                                                              v1.0.4 Build System
echo.

REM ── Step 1: Backend ──────────────────────────────────────────────────────────
echo [STEP 1/4] Installing Python build dependencies...
py -m pip install waitress pyinstaller --quiet
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] pip install failed. Make sure `py` is available.
    exit /b 1
)

echo [STEP 2/4] Building Django backend (PyInstaller)...
cd backend
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
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PyInstaller failed.
    cd ..
    exit /b 1
)
cd ..

echo    Backend built: backend\dist\perfectfit-server.exe

REM ── Step 2: Frontend ─────────────────────────────────────────────────────────
echo [STEP 3/4] Building React frontend (Vite)...
cd frontend
cmd /c npm install --silent
cmd /c npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vite build failed.
    cd ..
    exit /b 1
)
cd ..

echo    Frontend built: frontend\dist\

REM ── Step 3: Electron installer ───────────────────────────────────────────────
echo [STEP 4/4] Packaging Electron installer (electron-builder)...
cmd /c npm install --silent
cmd /c npx electron-builder --win
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] electron-builder failed.
    exit /b 1
)

echo.
echo ====================================================================
echo  BUILD COMPLETE!
echo  Installer: electron\releases\Perfect Fit Setup 1.1.1.exe
echo ====================================================================
echo.
