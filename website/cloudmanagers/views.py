from django.shortcuts import render_to_response,render,get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.template.context import RequestContext
from django.utils import simplejson
from cloudmanagers.models import Farm, Server, ServerProperty, Role
from benchmark.models import InstanceType
from clients.models import Client, ClientBackend
from django.contrib import auth
from django.core.urlresolvers import reverse

# Create your views here.
def index(request):
    context = {}
    client = Client.objects.get(id = request.user.id)
    projects_list = client.getAllFarms()
    context['projects_list'] = projects_list
    return render(request, 'cloudmanagers/index.html', context)

def login(request):
	login_message = None
	email = request.POST.get('email')
	if email is not None:
		password = request.POST.get('password')
		auth.AUTHENTICATION_BACKENDS = ('ClientBackend',)
		user = auth.authenticate(username = email, password = password)
		if user is None:
			login_message = "Invalid E-mail or wrong password."
		else:
			auth.login(request, user)
			return HttpResponseRedirect(reverse('cloudmanagers:index'))
	context = {'login_message': login_message}
	return render(request, 'cloudmanagers/login.html', context)

def logout(request):
	auth.logout(request)
	return HttpResponseRedirect(reverse('cloudmanagers:index'))

def signup(request):
	email = request.POST.get('email')
	name = request.POST.get('name')
	password = request.POST.get('password')
	fullname = request.POST.get('fullname')
	address = request.POST.get('address')
	city = request.POST.get('city')
	country = request.POST.get('country')
	user = Client.objects.create_user(email=email, password=password, name=name, fullName=fullname)
	user.country = country
	user.city = city
	user.save()
	auth.AUTHENTICATION_BACKENDS = ('ClientBackend',)
	loguser = auth.authenticate(username = email, password = password)
	auth.login(request, loguser)
	return HttpResponseRedirect(reverse('cloudmanagers:index'))

def platforms(request):
    context = {}
    client = Client.objects.get(id = request.user.id)
    projects_list = client.getAllFarms()
    context['projects_list'] = projects_list
    return render(request, 'cloudmanagers/platforms.html', context)

def project(request, project_id):
    context = {}
    client = Client.objects.get(id = request.user.id)
    projects_list = client.getAllFarms()
    context['projects_list'] = projects_list

    project = Farm.objects.get(id = project_id)
    context['current_project'] = project
    servers = project.getAllServers()
    servers_list = []
    for index, server in enumerate(servers):
        servers_list.append(server.getDetails())
        servers_list[index]['name'] = server.name
    context['servers_list'] = servers_list
    context['project_id'] = int(project_id)
    return render(request, 'cloudmanagers/project.html', context)

def rolemarket(request):
    context = {}
    client = Client.objects.get(id = request.user.id)
    projects_list = client.getAllFarms()
    context['projects_list'] = projects_list
    return render(request, 'cloudmanagers/rolemarket.html', context)

def settings(request):
    context = {}
    client = Client.objects.get(id = request.user.id)
    projects_list = client.getAllFarms()
    context['projects_list'] = projects_list
    return render(request, 'cloudmanagers/settings.html', context)

def sshkey(request):
    context = {}
    client = Client.objects.get(id = request.user.id)
    projects_list = client.getAllFarms()
    context['projects_list'] = projects_list

    ssh_keys = client.getAllEnvironmentsSSHKeys()
    context['ssh_keys_list'] = ssh_keys
    return render(request, 'cloudmanagers/sshkey.html', context)

def render_to_json_response(context, **response_kwargs):
    data = simplejson.dumps(context)
    response_kwargs['content_type'] = 'application/json'
    return HttpResponse(data, **response_kwargs)

def ajax_create_project(request):
#    if request.is_ajax() and request.method == 'POST':
    if request.method == 'POST':
        client = Client.objects.get(id = request.user.id)
        newFarm = client.createFarm(name = request.POST['name'], comments = request.POST['comments'])

        result = {}
        if newFarm.id :
            result['success'] = True
            result['message'] = "Project Successfully Created"
            result['farm_id'] = newFarm.id
        else :
            result['success'] = False
            result['message'] = "Create Project Failed"
        return render_to_json_response(result, status = 200)
    else :
        return HttpResponse("Bad Request")

def ajax_create_server(request):
    if request.is_ajax() and request.method == 'POST':
        projects = Farm.objects.get(id = request.POST['project_id'])
        role = Role.objects.get(id = request.POST['role_id'])
        server_exinfo = {}
        server_exinfo['name'] = request.POST['server_name']
        server_exinfo['instanceType'] = InstanceType.objects.get(id = request.POST['instance_type'])
        server_exinfo['location'] = request.POST['server_location']
        newServer = projects.createServer(role, name = server_exinfo['name'], instanceType = server_exinfo['instanceType'], location = server_exinfo['location'] )

        result = {}
        if newServer.id :
            result['success'] = True
            result['message'] = "Server Successfully Created"
            result['server_id'] = newServer.id
        else:
            result['success'] = False
            result['message'] = "Create Server Faied"
        return render_to_json_response(result, status = 200)

    else :
        return HttpResponse("Bad Request")
