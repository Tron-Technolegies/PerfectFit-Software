"""
Django settings for perfectfitsoftware project.
"""

import os
import sys
from pathlib import Path

# ── Base directory ────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# ── Detect PyInstaller frozen exe ────────────────────────────────────────────
IS_FROZEN = getattr(sys, 'frozen', False)

# ── Database path ─────────────────────────────────────────────────────────────
# In production (frozen): DB lives in %APPDATA%/PerfectFit/  →  writable,
# persists across updates, never deleted on reinstall.
# On first install: the seed db.sqlite3 bundled in the exe is copied there.
if IS_FROZEN:
    APP_DATA_DIR = Path(os.environ.get('APPDATA', '')) / 'PerfectFit'
    APP_DATA_DIR.mkdir(parents=True, exist_ok=True)
    DB_PATH = APP_DATA_DIR / 'db.sqlite3'
    MEDIA_ROOT = str(APP_DATA_DIR / 'media')

    # First-run: copy bundled seed DB if none exists yet
    if not DB_PATH.exists():
        import shutil
        seed_db = Path(sys._MEIPASS) / 'db.sqlite3'
        if seed_db.exists():
            shutil.copy(str(seed_db), str(DB_PATH))
else:
    DB_PATH = BASE_DIR / 'db.sqlite3'
    MEDIA_ROOT = str(BASE_DIR / 'media')

# ── Security ──────────────────────────────────────────────────────────────────
SECRET_KEY = 'django-insecure-qo0gm7p@9u^zsq9!=$%31b839)-=8bth$k896w2=e3ip4(t8#-'
DEBUG = True  # Desktop-only — keep True for readable errors
ALLOWED_HOSTS = ['*']
CORS_ALLOW_ALL_ORIGINS = True

# ── Apps ──────────────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'adminApp',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'perfectfitsoftware.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'perfectfitsoftware.wsgi.application'

# ── Database ──────────────────────────────────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': DB_PATH,
    }
}

# ── Media files (local storage — works offline on client machine) ─────────────
MEDIA_URL = '/media/'

# ── Password validation ───────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ── Internationalization ──────────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ── Static files ──────────────────────────────────────────────────────────────
STATIC_URL = 'static/'

# ── Email ─────────────────────────────────────────────────────────────────────
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'trontechnologies.access@gmail.com'
EMAIL_HOST_PASSWORD = 'your_app_password'
