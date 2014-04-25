from django.conf.urls import patterns, url
from application import views

urlpatterns = patterns('',
	url(r'^$', views.index, name = 'index'),
	url(r'^deploy/$', views.deploy, name = 'deploy'),
)