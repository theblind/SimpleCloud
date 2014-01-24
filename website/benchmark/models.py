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


# create model Instance Type to represent 
# instance's hardware information
class InstanceType(models.Model):
	# many to one relationship with IaaS Provider
	provider = models.ForeignKey(IaaSProvider)


	# instance name
	name = models.CharField(max_length = 30)
	# instance vCPU frequency, unit is GHz/s
	vCPUFrequency = models.DecimalField(max_digits = 2, decimal_places = 1)
	# instance vCPU number
	vCPUNumber = models.IntegerField()
	# instance memory size, unit is GB
	memorySize = models.IntegerField()
	# instance storage capacity, unit is GB
	storageCapacity = models.IntegerField()
	# instance bandwidth, unit is Mb/s
	bandwidth = models.IntegerField()


	# instance's purpose type represent
	# what will user work with this instance
	INSTANCE_PURPOSE_TYPE = (
			('G', 'General'),
			('C', 'Compute'),
			('M', 'Memory'),
			('S', 'Storage'),
		)
	purpose_type = models.CharField(max_length = 1, 
					choices = INSTANCE_PURPOSE_TYPE)

	# instance's sclae represent
	# how big the instance it is
	INSTANCE_SCALE = (
			('T', 'Tiny'),
			('S', 'Small'),
			('M', 'Medium'),
			('L', 'Large'),
			('H', 'Huge'),
		)
	scale = models.CharField(max_length = 1,
	 		choices = INSTANCE_SCALE)

	# return instance's information
	def __unicode__(self):
		instanceInformation = "\nIaaS Provider:\t\t%s \nInstance Name:\t\t%s" \
								% (self.provider, self.name)
		instanceHardware = "vCPU Frequency:\t\t%s \nvCPU Number:\t\t%s \nmemory size:\t\t%s \
								\nstorage capacity:\t%s \nbandwidth:\t\t%s" \
								% (self.vCPUFrequency, self.vCPUNumber, \
								self.memorySize, self.storageCapacity, self.bandwidth)
		return "%s\n%s\n" % (instanceInformation, instanceHardware)


# create model Price to represent
# instance's price
class Price(models.Model):
	# many to one relationship with Instance Type
	instanceType = models.ForeignKey(InstanceType)


# create model Instance to represent
# single instance
class Instance(models.Model):
	# many to one relationship with Instance Type
	instanceType = models.ForeignKey(InstanceType)

	# using md5 encryption to identify instance
	key = models.CharField(max_length = 32)


# create model UnixBench to represent
# this benchmark's detail
class UnixBench(models.Model):
	# many to one relationship with Instance
	instance = models.ForeignKey(Instance)

	# instance score for serail test
	serialScore = models.IntegerField()
	
	# instance score for parallel test
	parallelScore = models.IntegerField()

	# timestamps for single test
	createdAt = models.DateField(auto_now_add = True)


# create model Phoronix to represent
# this benchmark's detail
class Phoronix(models.Model):
	# many to one relationship with Instance
	instance = models.ForeignKey(Instance)

	# test result for 7-zip compression
	# result unit is MIPS
	compressionResult = models.IntegerField()

	# test result for postgreSQL benchmark
	# result unit is TPS
	pgbenchResult = models.IntegerField()

	# timestamps for single test
	createdAt = models.DateField(auto_now_add = True)