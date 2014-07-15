from django.shortcuts import render_to_response,render,get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest
from django.template.context import RequestContext
from django.utils import simplejson
from cloudmanagers.models import Farm, Server, ServerProperty, Role
from benchmark.models import InstanceType
from clients.models import Client

# Create your views here.
def index(request):
	return render(request, 'cloudmanagers/index.html')

def login(request):
	return render(request, 'cloudmanagers/login.html')

def platforms(request):
	return render(request, 'cloudmanagers/platforms.html')

def project(request):
	return render(request, 'cloudmanagers/project.html')

def rolemarket(request):
	return render(request, 'cloudmanagers/rolemarket.html')

def settings(request):
	return render(request, 'cloudmanagers/settings.html')

def sshkey(request):
	return render(request, 'cloudmanagers/sshkey.html')

def render_to_json_response(self, context, **response_kwargs):
    data = simplejson.dumps(context)
    response_kwargs['content_type'] = 'application/json'
    return HttpResponse(data, **response_kwargs)

def ajax_create_project(request):
    if request.is_ajax() and request.method == 'POST':
        client = Client.objects.get(email = request.user.get_username())
        newFarm = client.createFarm(name = request.POST['name'], comments = request.POST['comments'])

        result = {}
        if newFarm.id :
            result['success'] = true
            result['message'] = "Project Successfully Created"
            result['farm_id'] = newFarm.id
        else :
            result['success'] = false
            result['message'] = "Create Project Failed"
        self.render_to_json_response(result, status = 400)

def ajax_create_server(request):
    if request.is_ajax() and request.method == 'POST':
        prjects = Farm.objects.get(id = request.POST['project_id'])
        role = Role.objects.get(id = request.POST['role_id'])
        server_exinfo = {}
        server_exinfo['instanceType'] = InstanceType.objects.get(id = request.POST['instancetype_id'])
        server_exinfo['status'] = 'stop'
        server_exinfo['location'] = request.POST['location']
        newServer = projects.createServer(role, server_exinfo)

        result = {}
        if newServer.id :
            ServerProperty.objects.create(newServer, name = 'server_name', value = request.POST['name'] )
            result['success'] = true
            result['message'] = "Server Successfully Created"
            result['server_id'] = newServer.id
        else:
            result['success'] = false
            result['message'] = "Create Server Faied"
        self.render_to_json_response(result, status = 400)

