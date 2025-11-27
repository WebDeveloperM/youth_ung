import os

DEBUG = True

ALLOWED_HOSTS = ('*',)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'youth_database'),
        'USER': os.environ.get('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'qwerty1514'),
        'HOST': os.environ.get('HOST', 'host.docker.internal'),
        'PORT': os.environ.get('POSTGRES_PORT', 5432),
    }
}

# EMAIL_HOST = 'smtp.sendgrid.net'
# EMAIL_PORT = 587
# EMAIL_HOST_USER = 'apikey'
# EMAIL_HOST_PASSWORD = ''  # SendGrid API Key
# SERVER_EMAIL = EMAIL_HOST_USER
# DEFAULT_FROM_EMAIL = ''
