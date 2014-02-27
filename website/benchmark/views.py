from django.shortcuts import render
from benchmark.models import Instance, UnixBench

# Create your views here.
def parseUnixBenchResult(request, instanceID):
	if request.method == 'POST':
		try:
			#print request.POST

			key = request.POST['key']
			instance = Instance.objects.get(pk = instanceID)
			if instance.key == key:
				serialScore = request.POST['serialScore']
				parallelScore = request.POST['parallelScore']

				ub = UnixBench(instance = instance, serialScore = serialScore, parallelScore = parallelScore)
				ub.save()
		except KeyError:
			print 'Error: can\'t parse UnixBench result'

	return render(request, 'benchmark/result.html')