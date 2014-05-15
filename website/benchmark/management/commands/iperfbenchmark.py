from django.core.management.base import BaseCommand
from benchmark.models import BandwidthNetbench, Instance, InstanceType

from multiprocessing.dummy import Pool as ThreadPool
import os

class Command(BaseCommand):
	def handle(self, *args, **options):
		instances = Instance.objects.all()
		if len(instances) == 0:
			print "no jobs to run"
			return
		pool = ThreadPool(len(instances));
		netbench_result = pool.map(iperf_benchmark, instances)
		# deal with the result
		# ...
		pool.close()
		pool.join()

def iperf_benchmark(instance):
	current_path = os.path.dirname(os.path.realpath(__file__))
	script_dir = os.path.join(current_path, "../../../../benchmark")
	os.chdir(script_dir)
	command = "bash ./run.sh runclient %s %s %s %s %s" % (instance.username, instance.password, \
			instance.publicAddress, "42.159.158.39", instance.hashKey)
	return os.system(command)