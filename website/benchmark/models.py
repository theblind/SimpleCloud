from django.db import models

# create model Manufacture to represent
# AWS, Azure, RackSpace etc.
class Manufacture(models.Model):
	# Manufacture name, image and hyperlink
	name = models.CharField(max_length = 30)
	#imagePath = models.CharField(max_length = 100)
	#link = models.CharField(max_length = 100)


# create model Instance Type to represent 
# instance's hardware information
class InstanceType(models.Model):
	# many to one relationship with IaaS Provider
	manufacture = models.ForeignKey(Manufacture)


	# instance name
	alias_name = models.CharField(max_length = 30)


	# instance hardware info
	# instance vCPU number
	vcpu = models.IntegerField()
	# instance memory size, unit is GB
	vram = models.DecimalField(max_digits = 4, decimal_places = 2)
	# instance storage capacity, unit is GB
	storage = models.IntegerField()
	# instance bandwidth, unit is Mb/s
	band_width = models.DecimalField(max_digits = 5, decimal_places = 1)


	# operation system info
	os_type = models.CharField(max_length = 30)
	os_text = models.CharField(max_length = 50)
	os_value = models.CharField(max_length = 50)


	# instance pricing info
	pricing_type = models.CharField(max_length = 30)
	monetary_unit = models.CharField(max_length = 30)
	prices = models.DecimalField(max_digits = 8, decimal_places = 2)
	duration = models.IntegerField()
	pricing_cycle = models.CharField(max_length = 30)


	# update timestamp
	update_time = models.IntegerField()


# create model Instance to represent
# single instance
class Instance(models.Model):
	# many to one relationship with Instance Type
	instanceType = models.ForeignKey(InstanceType)

	# using md5 encryption to identify instance
	hashKey = models.CharField(max_length = 32)

	def generateKey(self):
		self.hashKey = "12345678901234567890123456789012"


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

# create model NetworkStatistics to represent
# the vm's network status
class NetworkStatistics(models.Model):
	# many to one relationship with Instance
	instance = models.ForeignKey(Instance)

	# measured bandwidth in a short peroid
	bandWidth = models.DecimalField(max_digits = 5, decimal_places = 1)

	# timestamps for single test
	createdAt = models.DateField(auto_now_add = True)