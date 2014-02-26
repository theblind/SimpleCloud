from django.conf.urls import patterns, url
from benchmark import views

urlpatterns = patterns('',
	url(r'^instance/(?P<instanceID>\d+)/unixbench$', views.parseUnixBenchResult, name = 'unixbench'),
)