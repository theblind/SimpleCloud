from django.conf.urls import patterns, url
from benchmark import views

urlpatterns = patterns('',
	url(r'^success/$', views.successView, name = 'success'),
	url(r'^fail/$', views.failView, name = 'fail'),
	url(r'^instance/new/$', views.createInstance, name = 'createInstance'),
	url(r'^instance/(?P<instanceID>\d+)/unixbench$', views.parseUnixBenchResult, name = 'unixbench'),
	url(r'^instance/(?P<instanceID>\d+)/phoronix$', views.parsePhoronixResult, name = 'phoronix'),
)