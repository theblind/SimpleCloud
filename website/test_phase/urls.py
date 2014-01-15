from django.conf.urls import patterns, url
from test_phase import views

urlpatterns = patterns('',
	url(r'^$', views.index, name = 'index'),
	url(r'^deploy/$', views.deploy, name = 'deploy'),
)