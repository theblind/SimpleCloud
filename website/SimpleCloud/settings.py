"""
Django settings for SimpleCloud project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

import os
import ConfigParser
from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '4ip$mk1&#co3k((i^*esnlknxs7lc3=!8oqiph3t)oo0@ocvwr'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    #'south',
    'application',
    'benchmark',
    'clients',
    'cloudmanagers',
    'omnibus'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS += ('omnibus.context_processors.omnibus',)

ROOT_URLCONF = 'SimpleCloud.urls'

WSGI_APPLICATION = 'SimpleCloud.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

config = ConfigParser.ConfigParser()
config.read(os.path.join(BASE_DIR, 'SimpleCloud', 'database.conf'))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config.get('database', 'name'),
        'USER': config.get('database', 'user'),
        'PASSWORD': config.get('database', 'password'),
        #'NAME': 'git_simplecloud',
        #'USER': 'root',
        #'PASSWORD': '',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static/'),
)

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'templates/'),
)

AUTH_USER_MODEL = 'clients.Client'

LOGIN_URL = '/cloudmanagers/login'
