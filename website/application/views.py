from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
import json
import pprint

from benchmark.models import *

def index(request):
	return render(request, 'application/index.html')

def deploy(request):
	return render(request, 'application/deploy.html')

def search(request):
	if request.method == 'GET':
		os = request.GET.get('os')
		vcpu = request.GET.get('vcpu')
		vram = request.GET.get('vram')
		storage = request.GET.get('storage')

		if (not os) or (not vcpu) or (not vram):
			return HttpResponseBadRequest()

		# query virtual machine's info from database by given condition
		queryResult = InstanceType.objects.filter(os_type = str(os),
											vcpu = int(vcpu),
											vram = float(vram),
											os_text__startswith="Ubuntu")
		queryResult = InstanceType.objects.filterPlausibleInstanceType(queryResult)
		
		queryResult = list(queryResult)
		ec2_result = InstanceType.objects.filter(manufacture_id = "ec2",
											vcpu = int(vcpu),
											region = "us-west-2")
		queryResult.extend(list(ec2_result))

		# fill up responseData in json format and return
		responseData = {}
		
		responseData["rsm"] = { "Instances" : {}, "Performance" : {} }

		# set error flag if query result is empty
		if len(queryResult) == 0:
			responseData["errno"] = -1
			responseData["err"] = "no query data"
			return HttpResponse(json.dumps(responseData), content_type="application/json")

		# just return first ten results to display
		if len(queryResult) > 10:
			queryResult = queryResult[:10]

		for instance in queryResult:
			responseData["rsm"]["Instances"][instance.id] = instance.getDetailsUgly()


		responseData["rsm"]["Performance"] = parsePerformanceInfo(queryResult)
		responseData["errno"] = 1

		return HttpResponse(json.dumps(responseData), content_type="application/json")
	else:
		return HttpResponseBadRequest()


# extract performance info from all instances
def parsePerformanceInfo(queryResult):
	info = {}

	# receive unixbench result info
	info["unixbench"] = parseUnixBenchResult(queryResult)
	info["bonnie"] = parseBonnieResult(queryResult)

	return info

# extract unixbench result from all instances
def parseUnixBenchResult(queryResult):
	result = { "series": {}, "average": {} }
	
	result["name"] = "unixbench"
	result["description"] = "unixbench"
	result["scale"] = "Score"
	result["os"] = "linux"

	for instance in queryResult:
		result["series"][instance.id] = UnixBench.objects.getRecordsByInstanceTypeTemporary(instance)
		result["average"][instance.id] = UnixBench.objects.getAverageScoreByInstanceType(instance)
	return result

# extract bonnie result from query instances
def parseBonnieResult(queryResult):
	result = { "average": {} }

	result["name"] = "bonnie"
	result["description"] = "bonnie"
	result["scale"] = "MB/S"
	result["os"] = "linux"

	for instance in queryResult:
		result["average"][instance.id] = Bonnie.objects.getAveragePerformanceByInstancetType(instance)
	return result	