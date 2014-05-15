from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from benchmark.models import InstanceType, Instance, UnixBench, Phoronix, BandwidthNetbench

import traceback
import random

# return succeed page
def successView(request):
	return render(request, 'benchmark/success.html')

# return failed page
def failView(request):
	return render(request, 'benchmark/fail.html')

# save vm's unixbench result into database
def parseUnixBenchResult(request):
	if request.method == 'POST':
		try:
			# get hashKey to identify a vm
			hashKey = request.POST.get('hashKey')

			instance = Instance.objects.get(pk = instanceID)
			if instance.hashKey == hashKey:
				serialScore = request.POST['serialScore']
				parallelScore = request.POST['parallelScore']

				ub = UnixBench(instance = instance, serialScore = serialScore, parallelScore = parallelScore)
				ub.save()
				return HttpResponseRedirect('/benchmark/success')
		except ObjectDoesNotExist:
			return HttpResponseRedirect('/benchmark/fail')

	return HttpResponseRedirect('/benchmark/fail')

# save vm's phoronix result into database
def parsePhoronixResult(request):
	if request.method == 'POST':
		try:
			# get hashKey to identify a vm
			hashKey = request.POST.get('hashKey')

			instance = Instance.objects.get(pk = instanceID)
			if instance.hashKey == hashKey:
				compressionResult = request.POST['compressionResult']
				pgbenchResult = request.POST['pgbenchResult']

				phoronix = Phoronix(instance = instance, compressionResult = compressionResult, pgbenchResult = pgbenchResult)
				phoronix.save()
				return HttpResponseRedirect('/benchmark/success')
		except ObjectDoesNotExist:
			return HttpResponseRedirect('/benchmark/fail')

	return HttpResponseRedirect('/benchmark/fail')


def createInstance(request):
	if request.method == 'POST':
		try:
			alias_name = request.POST.get('instanceType')
			name = request.POST.get('instanceName')
			ip = request.POST.get('instanceIP')

			# Because of get method will raise MultiObjects Exception,
			# we use filter method for temporary
			instanceType = InstanceType.objects.get(alias_name = alias_name)

			instance = Instance(instanceType = instanceType)
			instance.generateKey(name+ip)
			#instance.save()
			'''
			except ObjectDoesNotExist:
				pass
			except MultipleObjectsReturned:
				pass
			'''
		except:
			tb = traceback.format_exc()
         	return HttpResponse(tb)
			#return HttpResponseRedirect('/benchmark/fail')
		
		return HttpResponseRedirect('/benchmark/success')

	return render(request, 'benchmark/createInstanceForm.html')

def parseIperfResult(request):
	if request.method != "POST":
		return HttpResponse("InvalidMethod")
	try:
		token = request.POST["tk"]
		bandwidth = request.POST["bw"]
		delay = request.POST["dl"]
		lossrate = request.POST["lr"]

		instance = Instance.objects.get(token = token)

		netbench = BandwidthNetbench(iperf_client=instance.instanceType, max_bandwidth=bandwidth, delay=delay,\
					loss_rate=lossrate)
		netbench.save()
	except Exception, e:
		print "miss match with token %s" % (token,)
		print "new record will be created with instancetype set to be null"

		bandwidth = request.POST["bw"]
		delay = request.POST["dl"]
		lossrate = request.POST["lr"]
		netbench = BandwidthNetbench(max_bandwidth=bandwidth, delay=delay, loss_rate=lossrate)
		netbench.save()
	finally:
		return HttpResponse("Accepted")
