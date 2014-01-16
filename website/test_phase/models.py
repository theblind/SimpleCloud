from django.db import models

# create model Iaas Provider to represent
# AWS, Azure, RackSpace etc.
class IaaSProvider(models.Model):
	# Iaas Provider name
	name = models.CharField(max_length = 30)

	# IaaS Provoder description
	description = models.CharField(max_length = 300)

	# return description as object's string format
	def __unicode__(self):
		return description


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
	scale = models.CharField(max_length = 1,
	 choices = VIRTUAL_MACHINE_SCALE)


# create model UnixBench to represent
# this benchmark's detail
class UnixBench(models.Model):
	# many to one relationship with machine
	machine = models.ForeignKey(Machine)

	# machine score for serail test
	serialScore = models.IntegerField()
	
	# machine score for parallel test
	parallelScore = models.IntegerField()

	# timestamps for single test
	created_at = models.DateField(auto_now_add = True)


# create model Phoronix to represent
# this benchmark's detail
class Phoronix(models.Model):
	# many to one relationship with machine
	machine = models.ForeignKey(Machine)

	# test result for 7-zip compression
	# result unit is MIPS
	compressionResult = models.IntegerField()

	# test result for postgreSQL benchmark
	# result unit is TPS
	pgbenchResult = models.IntegerField()

	# timestamps for single test
	created_at = models.DateField(auto_now_add = True)