'''Use this for development'''

from .base import *

ALLOWED_HOSTS += ['127.0.0.1', 'localhost',
                  'c359-2607-9880-1650-df-5893-85a9-5e87-815e.ngrok.io']
DEBUG = True

WSGI_APPLICATION = 'home.wsgi.dev.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
)
