from django.shortcuts import render_to_response,render,get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.template.context import RequestContext
from django.utils import simplejson
from cloudmanagers.models import Farm, Server, ServerProperty, Role ,Message
from benchmark.models import InstanceType, Manufacture
from clients.models import Client, ClientBackend
from django.contrib import auth
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required

from django.core.management import call_command

import json

from util.IaaS.middleware import IaaSConnection
from util.IaaS import usertoken

# Create your views here.
@login_required
def index(request):

    client = Client.objects.get(id = request.user.id)
    servers_num = len(client.getAllServers())
    sshkey_num = len(client.getAllEnvironmentsSSHKeys())

    context = {
              'servers_num':servers_num,              
              'sshkey_num':sshkey_num,
              }
    return render(request, 'cloudmanagers/index.html',context, context_instance = RequestContext(request))


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
    return HttpResponseRedirect('/cloudmanagers/login')

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

@login_required
def platforms(request):
    context = {}
    client = Client.objects.get(id = request.user.id)
    manufacture = Manufacture.objects.get(name = "ec2")
    context['properties'] = client.getPropertiesByManufacture(manufacture)

    return render(request, 'cloudmanagers/platforms.html', context, context_instance = RequestContext(request))

def ajax_platform_setting(request):
    if request.is_ajax() and request.method == 'POST':
        accountNumber = request.POST.get('accountNumber')
        accessKey = request.POST.get('accessKey')
        secretAccessKey = request.POST.get('secretAccessKey')
        client = Client.objects.get(id = request.user.id)
        manufacture = Manufacture.objects.get(name = 'ec2')
        res = client.bindingEnvironment(manufacture = manufacture, account_number = accountNumber, access_id = accessKey, access_key = secretAccessKey)
        
        result = {}
        if res:
            result['success'] = True
            result['message'] = "Platform Keys Successfully Saved"
        else:
            result['success'] = False
            result['message'] = "Unvalid Keys"
        return render_to_json_response(result, status = 200)

def ajax_client_setting(request):
    if request.is_ajax() and request.method == 'POST':
        client = Client.objects.get(id = request.user.id)
        client.phone = request.POST.get('phone')
        client.fullName = request.POST.get('fullName')
        client.country = request.POST.get('country')
        client.save()
        result = {}
        result['success'] = True
        result['message'] = "User Settings Saved"
        
        return render_to_json_response(result, status = 200)


@login_required
def project(request, project_id):
    context = {}
    client = Client.objects.get(id = request.user.id)

    project = Farm.objects.get(id = project_id)
    context['current_project'] = project
    servers = project.getAllServers()
    servers_list = []
    for index, server in enumerate(servers):
        servers_list.append(server.getDetails())
        servers_list[index]['name'] = server.name
    context['servers_list'] = servers_list
    context['project_id'] = int(project_id)

    roles_list = client.getAllEnvironmentsAvailableRoles()
    for index,role in enumerate(roles_list):
        roles_list[index]['behaviors_list'] = role['behaviors'].split(',')

        roles_list[index]['architecture'] = ''
        for platform in role['platforms']:
            if platform['architecture']:
                roles_list[index]['architecture'] = platform['architecture'] 

    context['roles_list'] = roles_list

    context['instance_type_list'] = InstanceType.objects.getAllEC2Instances()

    return render(request, 'cloudmanagers/project.html', context, context_instance = RequestContext(request))

@login_required
def rolemarket(request):
    context = {}
    client = Client.objects.get(id = request.user.id)

    role_list  = list(Role.objects.all()[:36])
 #   role_list = list(Role.objects.all())
    role_res = []
    for index, role in enumerate(role_list):
        role_res.append(role.getDetails())
        role_res[index]['id'] = role.id
        role_res[index]['role_bev'] = role.behaviors.split(",")
        role_res[index]['role_soft'] = role.getAllSoftwares_name()
    context['role_list'] = role_res

    return render(request, 'cloudmanagers/rolemarket.html', context, context_instance = RequestContext(request))

@login_required
def settings(request):
    context = {}

    return render(request, 'cloudmanagers/settings.html', context, context_instance = RequestContext(request))

@login_required
def sshkey(request):
    context = {}
    client = Client.objects.get(id = request.user.id)

    ssh_keys = client.getAllEnvironmentsSSHKeys()
    context['ssh_keys_list'] = ssh_keys
    return render(request, 'cloudmanagers/sshkey.html', context, context_instance = RequestContext(request))

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
       	    Message.objects.createProjectMessage(
                uid = request.user.id,
                project_id = newFarm.id,
                title = 'Project Successfully Created',
                text = request.POST['name'] + ' has successfully created.',
            )
        else :
            result['success'] = False
            result['message'] = "Create Project Failed"
            Message.objects.createProjectMessage(
                uid = request.user.id,
                title = 'Create Project Failed',
                text = 'Oops, something wrong happened.',
            )
        return render_to_json_response(result, status = 200)
    else :
        return HttpResponse("Bad Request")

def ajax_create_server(request):
    if request.is_ajax() and request.method == 'POST':
        projects = Farm.objects.get(id = int(request.POST['project_id']))
        role = Role.objects.get(id = int(request.POST['role_id']))
        server_exinfo = {}
        server_exinfo['server_name'] = request.POST['server_name']
        instanceType = InstanceType.objects.get(id = int(request.POST['instance_type']))
        server_exinfo['instanceType'] = instanceType
        server_exinfo['server_location'] = request.POST['server_location']
        server_exinfo['platform'] = request.POST['platform']
        server_exinfo['properties'] = projects.client.getPropertiesByManufacture(instanceType.manufacture)
        newServer = projects.createServer(role, server_exinfo['instanceType'],server_exinfo)
        result = {}
        result['success'] = True
        result['message'] = "Server Successfully Created"

        return render_to_json_response(result, status = 200)

def ajax_stop_server(request):
    if request.is_ajax() and request.method == 'POST':
        server = Server.objects.get(id = int(request.POST['server_id']))
        client = Client.objects.get(id = int(request.user.id))
        properties = client.getPropertiesByManufacture(server.instanceType.manufacture)
        token = {
            "access_id" : properties['access_id'],
            "access_key" : properties['access_key']
        }
        server.setConnection(token)
        server.stopServer();
        result = {}
        result['success'] = True
        result['message'] = "Server successfully Stopped"
        return render_to_json_response(result, status = 200)

def ajax_start_server(request):
    if request.is_ajax() and request.method == 'POST':
        server = Server.objects.get(id = int(request.POST['server_id']))
        client = Client.objects.get(id = int(request.user.id))
        properties = client.getPropertiesByManufacture(server.instanceType.manufacture)
        token = {
            "access_id" : properties['access_id'],
            "access_key" : properties['access_key']
        }
        server.setConnection(token)
        server.startServer();
        result = {}
        result['success'] = True
        result['message'] = "Server successfully Started"
        return render_to_json_response(result, status = 200)

def ajax_terminate_server(request):
    if request.is_ajax() and request.method == 'POST':
        server = Server.objects.get(id = int(request.POST['server_id']))
        client = Client.objects.get(id = int(request.user.id))
        properties = client.getPropertiesByManufacture(server.instanceType.manufacture)
        token = {
            "access_id" : properties['access_id'],
            "access_key" : properties['access_key']
        }
        server.setConnection(token)
        server.terminateServer();
        result = {}
        result['success'] = True
        result['message'] = "Server successfully Started"
        return render_to_json_response(result, status = 200)    

def cron_update_instance(request):
    call_command('updateinstance')
    return HttpResponse(status=204)
