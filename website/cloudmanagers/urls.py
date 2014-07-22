from django.conf.urls import patterns, url, include
from cloudmanagers import views
from django.views.generic import TemplateView

urlpatterns = patterns('',
	url(r'^index/$', views.index, name = 'index'),
	url(r'^login/$', views.login, name = 'login'),
	url(r'^logout/$', views.logout, name = 'logout'),
	url(r'^signup/$', views.signup, name = 'signup'),
	url(r'^platforms/$', views.platforms, name = 'platforms'),
	url(r'^platforms/save/$', views.platformsSave, name = 'platformsSave'),
	url(r'^project/(?P<project_id>\d+)$', views.project, name = 'project'),
	url(r'^rolemarket/$', views.rolemarket, name = 'rolemarket'),
	url(r'^settings/$', views.settings, name = 'settings'),
	url(r'^sshkey/$', views.sshkey, name = 'sshkey'),
	url(r'^ajax/create_server$', views.ajax_create_server, name = 'xCreateServer'),
	url(r'^ajax/create_project$', views.ajax_create_project, name = 'xCreateProject'),
	url(r'^ajax/stop_server$', views.ajax_stop_server, name = 'xStopServer'),
	url(r'^ajax/start_server$', views.ajax_start_server, name = 'xStartServer'),
	url(r'^ajax/terminate_server$', views.ajax_terminate_server, name = 'xTerminateServer'),
)
