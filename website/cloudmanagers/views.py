from util.IaaS.middleware import IaaSConnection
from util.IaaS import usertoken
from django.shortcuts import render_to_response,render,get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.template.context import RequestContext
from django.utils import simplejson
from cloudmanagers.models import Farm, Server, ServerProperty, Role ,Message
from benchmark.models import InstanceType, Manufacture
from clients.models import Client, ClientBackend
from django.contrib import auth
from django.core.urlresolvers import reverse

# Create your views here.

def index(request):

    client = Client.objects.get(id = request.user.id)
    servers_num = len(client.getAllServers())
    sshkey_num = len(client.getAllEnvironmentsSSHKeys())
    project_list = client.getAllFarms()
    projects_num = len(project_list)
    sysmessage_list = list(Message.objects.filter(client_id = request.user.id, messageType = 'S'))
    context = {'projects_num': projects_num,'servers_num':servers_num,'projects_list':project_list,'sysmessage_list':sysmessage_list,}
    context['sshkey_num'] = sshkey_num
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
    context = {}
    client = Client.objects.get(id = request.user.id)
    projects_list = client.getAllFarms()
    context['projects_list'] = projects_list
    return render(request, 'cloudmanagers/platforms.html', context)

def platformsSave(request):
    accountNumber = request.POST.get('accountNumber')
    accessKey = request.POST.get('accessKey')
    secretAccessKey = request.POST.get('secretAccessKey')
    client = Client.objects.get(id = request.user.id)
    manufacture = Manufacture.objects.get(name = 'ec2')
    client.bindingEnvironment(manufacture = manufacture, account_number = accountNumber, access_key = accessKey, secret_key = secretAccessKey)
    return HttpResponseRedirect(reverse('cloudmanagers:platforms'))

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

    roles_list = client.getAllEnvironmentsAvailableRoles()
    for index,role in enumerate(roles_list):
        roles_list[index]['behaviors_list'] = role['behaviors'].split(',')
    context['roles_list'] = roles_list

    return render(request, 'cloudmanagers/project.html', context)

def rolemarket(request):
    context = {}
    client = Client.objects.get(id = request.user.id)
    projects_list = client.getAllFarms()
    context['projects_list'] = projects_list

    role_list  = list(Role.objects.all())
    role_res = []
    for index, role in enumerate(role_list):
        role_res.append(role.getDetails())
        role_res[index]['id'] = role.id
        role_res[index]['role_bev'] = role.behaviors.split(",")
        role_res[index]['role_soft'] = role.getAllSoftwares_name()
    context['role_list'] = role_res
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

def buy_instances(request):
    if(request.method is not "POST"):
        return response_bad_method()

    userid = request.session['userid']
    instance_list = request.POST['inst_list']

    # get the platform token with userid
    token = usertoken.get_access_key(userid, provider)

    feedback_message = []
    # get the connection object with given userid
    for instance in instance_list:
        try:
            provider = instance['prov']
            instance_type = instance['type']
            region = instance['region']
            if provider is None or instance_type is None or region is None:
                raise Exception("parameters should not be none")
            # set up the connection
            conn = new IaaSConnection(userid, provider, region)
            conn.buy_instances(instance_type)
        except Exception, e:
            feedback_message.append({index: instance.index, message: "error"})
    if len(feedback_message) == 0:
        return HttpResponse(json.dumps({status: "success", msg: None}))
    else:
        return HttpResponse(json.dumps({status: "error", msg: feedback_message}))

# start a list of specified instances with the 
def start_instance(request):
    return operate_instance(request, "start_instance")

# stop a list of instance specified by provider, region and instance_id
def stop_instance(request):
    return operate_instance(request, "stop_instance")

def terminate_instance(request):
    return operate_instance(request, "terminate_instance")

def reboot_instance(request):
    return operate_instance(request, "reboot_instance")

def operate_instance(request, method):
    if(request.method is not "POST"):
        return response_bad_method()

    userid = request.session['userid']

    # parameterss needed: provider, region, instance_ids(list)
    # request.POST sample: [
    #   {
    #       index: 1
    #       provider: "aliyun",
    #       region: "qingdao-sssx",
    #       instance_ids: ["instance-01", 'instancce-02']
    #   },{
    #       index: 2
    #       provider: "azure",
    #       region: "qingdao-sssx",
    #       instance_ids: ["instance-01", 'instancce-02']
    #   }
    # ]

    batch_request = request.POST
    # check the parameters
    if not isinstance(batch_request, list):
        return response_bad_param()

    feedback_message = []

    for order_item in batch_request:
        try:
            provider = order_item['prov']
            region = order_item['region']
            instance_ids = order_item['insts']
            if not isinstance(instance_ids, list):
                raise Exception("instance ids should be list type")
            conn = new IaaSConnection(userid, provider, region)
            conn[method](instance_ids)
        except Exception, e:
            feedback_message.append({index: order_item, message: e.message})
    if(len(feedback_message) == 0):
        return HttpResponse(json.dumps({status: "success", msg: "none"}))
    return HttpResponse(json.dumps({status: 'errror', msg: feedback_message}))


# Create your views here.
def response_bad_method():
    return HttpResponse(json.dumps({status: "fail", msg: "bad request method"}))

def response_bad_param():
    return HttpResponse(json.dumps({status: "fail", msg: 'bad request parameters'}))