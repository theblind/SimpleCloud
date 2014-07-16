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
	return render(request, 'cloudmanagers/index.html')

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
	return render(request, 'cloudmanagers/platforms.html')

def project(request, project_id):
    context = {}
    project = Farm.objects.get(id = project_id)
    servers = project.getAllServers()
    for server in servers:
        print server
	#return render(request, 'cloudmanagers/project.html')

def rolemarket(request):
	return render(request, 'cloudmanagers/rolemarket.html')

def settings(request):
	return render(request, 'cloudmanagers/settings.html')

def sshkey(request):
	return render(request, 'cloudmanagers/sshkey.html')

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
            result['success'] = True
            result['message'] = "Server Successfully Created"
            result['server_id'] = newServer.id
        else:
            result['success'] = False
            result['message'] = "Create Server Faied"
        render_to_json_response(result, status = 400)

