"""
Standalone test runner for wardrounds plugin
"""
import os
import sys

from django.conf import settings

settings.configure(DEBUG=True,
                   DATABASES={
                       'default': {
                           'ENGINE': 'django.db.backends.sqlite3',
                       }
                   },
                   OPAL_OPTIONS_MODULE='wardround.tests.dummy_options_module',
                   ROOT_URLCONF='opal.urls',
                   STATIC_URL='/assets/',
                   STATIC_ROOT='static',
                   STATICFILES_FINDERS=(
                       'django.contrib.staticfiles.finders.FileSystemFinder',
                       'django.contrib.staticfiles.finders.AppDirectoriesFinder',
                       'compressor.finders.CompressorFinder',),
                   COMPRESS_ROOT='/tmp/',
                   MIDDLEWARE_CLASSES=(
                       'django.middleware.common.CommonMiddleware',
                       'django.contrib.sessions.middleware.SessionMiddleware',
                       'opal.middleware.AngularCSRFRename',
                       'django.middleware.csrf.CsrfViewMiddleware',
                       'django.contrib.auth.middleware.AuthenticationMiddleware',
                       'django.contrib.messages.middleware.MessageMiddleware',
                       'opal.middleware.DjangoReversionWorkaround',
                       'reversion.middleware.RevisionMiddleware',
                       'axes.middleware.FailedLoginMiddleware',
                   ),
                   INSTALLED_APPS=('django.contrib.auth',
                                   'django.contrib.contenttypes',
                                   'django.contrib.sessions',
                                   'django.contrib.admin',
                                   'django.contrib.staticfiles',
                                   'compressor',
                                   'opal',
                                   'opal.tests',
                                   'wardround',),
                   TEMPLATES = [
                       {
                           'BACKEND': 'django.template.backends.django.DjangoTemplates',
                           'DIRS': [],
                           'APP_DIRS': True,
                           'OPTIONS': {
                               'context_processors': [
                                   'django.contrib.auth.context_processors.auth',
                                   'django.template.context_processors.debug',
                                   'django.template.context_processors.i18n',
                                   'django.template.context_processors.media',
                                   'django.template.context_processors.request',
                                   'django.template.context_processors.static',
                                   'django.template.context_processors.tz',
                                   'django.contrib.messages.context_processors.messages',
                                   'opal.context_processors.settings',
                                   'opal.context_processors.models'
                               ],
                               # ... some options here ...
            },
                       },
                   ],
                   MIGRATION_MODULES={
                       'opal': 'opal.nomigrations'
                   }
)

from opal.core import application
class Application(application.OpalApplication):
    pass


from wardround.tests import dummy_options_module

import django
django.setup()

from django.test.runner import DiscoverRunner
test_runner = DiscoverRunner(verbosity=1)
if len(sys.argv) == 2:
    failures = test_runner.run_tests([sys.argv[-1], ])
else:
    failures = test_runner.run_tests(['wardround', ])
if failures:
    sys.exit(failures)
