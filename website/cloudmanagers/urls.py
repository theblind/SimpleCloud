from django.conf.urls import patterns, url
from cloudmanagers import views

urlpatterns = patterns('',
	# parse benchmark's result
	url(r'^ajax/create_server$', views.ajax_create_server, name = 'xCreateServer'),
	url(r'^ajax/create_project$', views.ajax_create_project, name = 'xCreateProject'),

)
