import os
import environ
from datetime import timedelta
# Initialise environment variables
env = environ.Env()
environ.Env.read_env()

BASE_DIR = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))

DEBUG = True
ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'corsheaders',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'rest_framework',
    'rest_framework.authtoken',
    'catalog',
    'djmoney',
    'localflavor',
    'djmoney.contrib.exchange',
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

ROOT_URLCONF = 'home.urls'
AUTHENTICATION_BACKENDS = [
    'allauth.account.auth_backends.AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
]
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = '/static/'
MEDIA_URL = '/media/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'build/static')]
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
SITE_ID = 1
REST_USE_JWT = True
JWT_AUTH_COOKIE = 'my-app-auth'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'dj_rest_auth.jwt_auth.JWTCookieAuthentication',
    ),
}
IMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
}
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = "ojosunday1410@gmail.com"
EMAIL_HOST_PASSWORD = "dzjmrzspqyscntyt"
EMAIL_PORT = 587


SECRET_KEY = 'cf5b21d711aa406a84eb3d9d688559af'
OPEN_EXCHANGE_API_KEY = env('OPEN_EXCHANGE_API_KEY')
RAPYD_SECRET_KEY = env('RAPYD_SECRET_KEY')
RAPYD_ACCESS_KEY = env('RAPYD_ACCESS_KEY')
RAPYD_API_URL = env('RAPYD_API_URL')
COMPANY_NAME = env('COMPANY_NAME')
EWALLET_ID = env('EWALLET_ID')
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'
