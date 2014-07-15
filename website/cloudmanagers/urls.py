from django.conf.urls import patterns, url, include
from cloudmanagers import views
from django.views.generic import TemplateView

urlpatterns = patterns('',
	url(r'^index/$', views.index, name = 'index'),
	url(r'^login/$', views.login, name = 'login'),
	url(r'^platforms/$', views.platforms, name = 'platforms'),
	url(r'^project/$', views.project, name = 'project'),
	url(r'^rolemarket/$', views.rolemarket, name = 'rolemarket'),
	url(r'^settings/$', views.settings, name = 'settings'),    
	url(r'^sshkey/$', views.sshkey, name = 'sshkey'),      
)