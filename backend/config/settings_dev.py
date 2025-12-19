import os
from pathlib import Path

DEBUG = True

ALLOWED_HOSTS = ('*',)

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# SQLite для разработки
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# PostgreSQL настройки (если нужны)
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.environ.get('POSTGRES_DB', 'youth_database'),
#         'USER': os.environ.get('POSTGRES_USER', 'postgres'),
#         'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'qwerty1514'),
#         'HOST': os.environ.get('HOST', 'localhost'),
#         'PORT': os.environ.get('POSTGRES_PORT', 5432),
#     }
# }

# EMAIL_HOST = 'smtp.sendgrid.net'
# EMAIL_PORT = 587
# EMAIL_HOST_USER = 'apikey'
# EMAIL_HOST_PASSWORD = ''  # SendGrid API Key
# SERVER_EMAIL = EMAIL_HOST_USER
# DEFAULT_FROM_EMAIL = ''
