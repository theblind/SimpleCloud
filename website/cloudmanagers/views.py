from django.shortcuts import render_to_response,render,get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.template.context import RequestContext
from django.utils import simplejson
from cloudmanagers.models import Farm, Server, ServerProperty, Role ,Message
from benchmark.models import InstanceType
from clients.models import Client, ClientBackend
from django.contrib import auth
from django.core.urlresolvers import reverse

# Create your views here.
def index(request):
    client = Client.objects.get(id = request.user.id)
    servers_num = len(client.getAllServers())
    project_list = client.getAllFarms()
    projects_num = len(project_list)
    sysmessage_list = list(Message.objects.filter(client_id = request.user.id, messageType = 'S'))
    context = {'projects_num': projects_num,'servers_num':servers_num,'project_list':project_list,'sysmessage_list':sysmessage_list,}
    return render(request, 'cloudmanagers/index.html',context)

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

def project(request):
    return render(request, 'cloudmanagers/project.html')

def rolemarket(request):
    role_list  = list(Role.objects.all())
    role_res = []
    for index, role in enumerate(role_list):
        role_res.append(role.getDetails())
        role_res[index]['id'] = role.id
        role_res[index]['role_bev'] = role.behaviors.split(",")
        role_res[index]['role_soft'] = role.getAllSoftwares_name()
    context = {'role_list':role_res}
    return render(request, 'cloudmanagers/rolemarket.html', context)

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

