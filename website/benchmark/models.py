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
		return self.description


# create model machine to represent virtual machine
class Machine(models.Model):
	# many to one relationship with IaaS Provider
	provider = models.ForeignKey(IaaSProvider)

	# using md5 encryption to identify virtual machine
	key = models.CharField(max_length = 32)

	# machine name
	name = models.CharField(max_length = 30)
	# machine vCPU frequency, unit is GHz/s
	vCPUFrequency = models.DecimalField(max_digits = 2, decimal_places = 1)
	# machine vCPU number
	vCPUNumber = models.IntegerField()
	# machine memory size, unit is GB
	memorySize = models.IntegerField()
	# machine storage capacity, unit is GB
	storageCapacity = models.IntegerField()
	# machine bandwidth, unit is Mb/s
	bandwidth = models.IntegerField()


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

	# return machine's information
	def __unicode__(self):
		machineInformation = "\nIaaS Provider:\t\t%s \nMachine Name:\t\t%s" \
								% (self.provider, self.name)
		machineHardware = "vCPU Frequency:\t\t%s \nvCPU Number:\t\t%s \nmemory size:\t\t%s \
								\nstorage capacity:\t%s \nbandwidth:\t\t%s" \
								% (self.vCPUFrequency, self.vCPUNumber, \
								self.memorySize, self.storageCapacity, self.bandwidth)
		return "%s\n%s\n" % (machineInformation, machineHardware)


# create model Price to represent
# virtual machine's price
class Price(models.Model):
	# many to one relationship with machine
	machine = models.ForeignKey(Machine)


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
	createdAt = models.DateField(auto_now_add = True)


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
	createdAt = models.DateField(auto_now_add = True)