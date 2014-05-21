from django.conf.urls import patterns, url
from benchmark import views

urlpatterns = patterns('',
	url(r'^success/$', views.successView, name = 'success'),
	url(r'^fail/$', views.failView, name = 'fail'),
	url(r'^instance/new/$', views.createInstance, name = 'createInstance'),

	# parse benchmark's result
	url(r'^instance/unixbench$', views.parseUnixBenchResult, name = 'unixbench'),
	url(r'^instance/phoronix$', views.parsePhoronixResult, name = 'phoronix'),
	url(r'^instance/bandwidth$', views.parseIperfResult, name = 'bandwidth'),
	url(r'^instance/bonnie$', views.parseBonnieResult, name = 'bonnie')
)