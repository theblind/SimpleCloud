from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^benchmark/', include('benchmark.urls', namespace = 'benchmark')),
    url(r'^cloudmanagers/', include('cloudmanagers.urls', namespace = 'cloudmanagers')),
    url(r'', include('application.urls', namespace = 'application'))
)
