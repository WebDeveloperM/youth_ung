DEBUG = True

ALLOWED_HOSTS = ('*',)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'youth-ung',
        'USER': 'postgres',
        'PASSWORD': 'shMM1514',
        'HOST': 'localhost',
        'PORT': 5432,
    }
}

# EMAIL_HOST = 'smtp.sendgrid.net'
# EMAIL_PORT = 587
# EMAIL_HOST_USER = 'apikey'
# EMAIL_HOST_PASSWORD = ''  # SendGrid API Key
# SERVER_EMAIL = EMAIL_HOST_USER
# DEFAULT_FROM_EMAIL = ''
