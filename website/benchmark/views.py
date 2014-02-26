from django.shortcuts import render

# Create your views here.
def parseUnixBenchResult(request, instanceID):
	print request.POST
	if request.method == 'POST':
		try:
			print "start"
			key = request.POST['key']
			instance = Instance.get(pk = instanceID)
			if instance.key == key:
				serialScore = request.POST['serialScore']
				parallelScore = request.POST['parallelScore']
				

				ub = UnixBench(instance = instance, serialScore = serialScore, parallelScore = parallelScore)
				ub.save()
				print "well done"
		except KeyError:
			print 'Error: can\'t parse UnixBench result'

	return render(request, 'benchmark/result.html')