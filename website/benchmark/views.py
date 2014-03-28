from django.shortcuts import render
from benchmark.models import Instance, UnixBench, Phoronix

# save vm's unixbench result into database
def parseUnixBenchResult(request, instanceID):
	if request.method == 'POST':
		try:
			hashKey = request.POST['hashKey']
			instance = Instance.objects.get(pk = instanceID)
			if instance.hashKey == hashKey:
				serialScore = request.POST['serialScore']
				parallelScore = request.POST['parallelScore']

				ub = UnixBench(instance = instance, serialScore = serialScore, parallelScore = parallelScore)
				ub.save()
				return render(request, 'benchmark/succeed.html')
		except KeyError:
			print 'Error: can\'t parse UnixBench result'

	return render(request, 'benchmark/failed.html')

# save vm's phoronix result into database
def parsePhoronixResult(request, instanceID):
	if request.method == 'POST':
		try:
			hashKey = request.POST['hashKey']
			instance = Instance.objects.get(pk = instanceID)
			if instance.hashKey == hashKey:
				compressionResult = request.POST['compressionResult']
				pgbenchResult = request.POST['pgbenchResult']

				phoronix = Phoronix(instance = instance, compressionResult = compressionResult, pgbenchResult = pgbenchResult)
				phoronix.save()
				return render(request, 'benchmark/succeed.html')
		except KeyError:
			print 'Error: can\'t parse UnixBench result'

	return render(request, 'benchmark/failed.html')