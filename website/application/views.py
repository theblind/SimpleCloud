from django.shortcuts import render
from django.http import HttpResponse
import json
import pprint

from benchmark.models import InstanceType

def index(request):
	return render(request, 'application/index.html')

def deploy(request):
	return render(request, 'application/deploy.html')

def search(request):
	if request.method == 'GET':
		os = str(request.GET['os'])
		vcpu = int(request.GET['vcpu'])
		vram = float(request.GET['vram'])
		storage = int(request.GET['storage'])

		# query virtual machine's info from database by given condition
		queryResult = InstanceType.objects.filter(os_type = os,
											vcpu = vcpu,
											vram__range = [vram - 1, vram + 1])

		# fill up responseData in json format and return
		responseData = {}
		
		responseData["rsm"] = { "Instances" : {}, "Performance" : {} }

		if len(queryResult) > 10:
			queryResult = queryResult[:10]

		for instance in queryResult:
			info = parseInstanceInfo(instance)
			responseData["rsm"]["Instances"][instance.id] = info

		responseData["errno"] = 1
		responseData["err"] = ""

		pp = pprint.PrettyPrinter(indent=4)
		pp.pprint(responseData)


		return HttpResponse(json.dumps(responseData), content_type="application/json")
	else:
		return None

# extract general info from specific instance
def parseInstanceInfo(instance):
	info = {}

	info["id"] = instance.id
	info["instance"] = instance.alias_name
	info["vcpu"] = instance.vcpu
	info["vram"] = str(instance.vram)
	info["storage"] = instance.storage
	info["pricing"] = parseInstancePrice(instance)

	info["provider"] = instance.manufacture.name
	info["link"] = ""#instance.manufacture.link
	info["image"] = ""#instance.manufacture.imagePath

	return info

# extract price info from specific instance
def parseInstancePrice(instance):
	price = {}

	if instance.pricing_cycle == "hour":
		price["pph"] = str(instance.prices)
		price["ppm"] = str(instance.prices * 24 * 30)
	elif instance.pricing_cycle == "month":
		price["pph"] = str(instance.prices / (24 * 30))
		price["ppm"] = str(instance.prices)
	price["unit"] = instance.monetary_unit

	return price