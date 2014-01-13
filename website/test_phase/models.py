from django.db import models

# create model Iaas Provider to represent
# AWS, Azure, RackSpace etc.
class IaaSProvider(models.Model):
	# Iaas Provider name
	name = models.CharField(max_length = 30)

	# IaaS Provoder description
	description = models.CharField(max_length = 300)


# create model machine to represent virtual machine
class Machine(models.Model):
	# many to one relationship with IaaS Provider
	provider = models.ForeignKey(IaaSProvider)

	# machine name
	name = models.CharField(max_length = 30)
	# machine price
	price = models.IntegerField()

	# machine's purpose type represent
	# what will user work with this VM
	VIRTUAL_MACHINE_PURPOSE_TYPE = (
			('G', 'General'),
			('C', 'Compute'),
			('M', 'Memory'),
			('S', 'Storage'),
		)
	purpose_type = models.CharField(max_length = 1, 
		choices = VIRTUAL_MACHINE_PURPOSE_TYPE)

	# machine's sclae represent
	# how big the VM it is
	VIRTUAL_MACHINE_SCALE = (
			('T', 'Tiny'),
			('S', 'Small'),
			('M', 'Medium'),
			('L', 'Large'),
			('H', 'Huge'),
		)
	scale = models.CharField(max_length = 1, choices = VIRTUAL_MACHINE_SCALE)

# create model Benchmark Performance to represent
# a virtual machine's performance
class BenchmarkPerformance(models.Model):
	# many to one relationship whith machine
	machine = models.ForeignKey(Machine)

# create model UnixBench to represent
# this benchmark's detail
class UnixBench(models.Model):
	# many to one relationship with benchmark performance
	benchmarkPerformance = models.ForeignKey(BenchmarkPerformance)

	# desciption for UnixBench benchmark
	description = models.CharField(max_length = 300)

	# machine score for serail test
	serialScore = models.IntegerField()
	# machine score for parallel test
	parallelScore = models.IntegerField()

