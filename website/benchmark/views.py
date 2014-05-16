from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from benchmark.models import InstanceType, Instance, UnixBench, Phoronix, BandwidthNetbench
from benchmark.forms import InstanceForm

import traceback
import random

# return succeed page
def successView(request):
	return render(request, 'benchmark/success.html')


# return failed page
def failView(request):
	return render(request, 'benchmark/fail.html')

# add new instance
def createInstance(request):
	if request.method == 'POST':
		try:
			# get instance info
			alias_name = request.POST.get('instanceType')
			publicAddress = request.POST.get('publicAddress')
			innerAddress = request.POST.get('innerAddress')
			username = request.POST.get('username')
			password = request.POST.get('password')

			instanceType = InstanceType.objects.get(alias_name = alias_name)

			instance = Instance(instanceType = instanceType, publicAddress = publicAddress,
								innerAddress = innerAddress, username = username,
								password = password)
			instance.generateKey(alias_name+publicAddress)
			instance.save()
		except:
			tb = traceback.format_exc()
			request.session['error'] = tb
			return HttpResponseRedirect('/benchmark/fail')
		
		return HttpResponseRedirect('/benchmark/success')

	form = InstanceForm()
	return render(request, 'benchmark/createInstanceForm.html', {
        'form': form,
    })


# save vm's unixbench result into database
def parseUnixBenchResult(request):
	if request.method == 'POST':
		try:
			# get hashKey to identify a vm
			hashKey = request.POST.get('hashKey')

			instance = Instance.objects.get(hashKey = hashKey)
			serialScore = request.POST.get('serialScore', 0)
			parallelScore = request.POST.get('parallelScore', 0)

			ub = UnixBench(instance = instance, serialScore = serialScore, parallelScore = parallelScore)
			ub.save()
			return HttpResponseRedirect('/benchmark/success')
		except ObjectDoesNotExist:
			tb = traceback.format_exc()
         	return HttpResponse(tb)

	return HttpResponseRedirect('/benchmark/fail')


# save vm's phoronix result into database
def parsePhoronixResult(request):
	if request.method == 'POST':
		try:
			# get hashKey to identify a vm
			hashKey = request.POST.get('hashKey')

			instance = Instance.objects.get(hashKey = hashKey)
			compressionResult = request.POST.get('compressionResult', 0)
			pgbenchResult = request.POST.get('pgbenchResult', 0)

			phoronix = Phoronix(instance = instance, compressionResult = compressionResult, pgbenchResult = pgbenchResult)
			phoronix.save()
			return HttpResponseRedirect('/benchmark/success')
		except ObjectDoesNotExist:
			tb = traceback.format_exc()
         	return HttpResponse(tb)

	return HttpResponseRedirect('/benchmark/fail')


def parseIperfResult(request):
	if request.method != "POST":
		return HttpResponse("InvalidMethod")
	try:
		token = request.POST["tk"]
		bandwidth = request.POST["bw"]
		delay = request.POST["dl"]
		lossrate = request.POST["lr"]

		instance = Instance.objects.get(hashKey = token)

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
