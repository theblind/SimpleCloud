import json

from django.shortcuts import render
from django.http import HttpResponse

from util.IaaS.middleware import IaaSConnection
from util.IaaS import usertoken

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
	# 	{
	#		index: 1
	# 		provider: "aliyun",
	# 		region: "qingdao-sssx",
	# 		instance_ids: ["instance-01", 'instancce-02']
	# 	},{
	#		index: 2
	# 		provider: "azure",
	# 		region: "qingdao-sssx",
	# 		instance_ids: ["instance-01", 'instancce-02']
	# 	}
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