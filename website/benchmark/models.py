from django.db import models
import hashlib
import datetime

# create model Manufacture to represent
# AWS, Azure, RackSpace etc.
class Manufacture(models.Model):
	# Manufacture name, image and hyperlink
	name = models.CharField(max_length = 30, primary_key=True)
	description = models.TextField()

	image = models.CharField(max_length = 100)
	link = models.CharField(max_length = 100)

	def getDetails():
		info = {}

		info["name"] = self.name
		info["description"] = self.description
		info["image"] = self.image
		info["link"] = self.link

		return info


# create model Instance Type to represent 
# instance's hardware information
class InstanceType(models.Model):
	# many to one relationship with IaaS Provider
	manufacture = models.ForeignKey(Manufacture)

	# instance name
	alias_name = models.CharField(max_length = 30)

	# instance hardware info
	# instance vCPU number
	vcpu = models.IntegerField(default=0)
	# vCPU frequency
	frequency = models.DecimalField(max_digits = 4, decimal_places = 2, default = 0)
	# instance memory size, unit is GB
	vram = models.DecimalField(max_digits = 4, decimal_places = 2, default = 0)
	# instance storage capacity, unit is GB
	storage = models.IntegerField(default = 0)
	# instance bandwidth, unit is Mb/s
	band_width = models.DecimalField(max_digits = 5, decimal_places = 1, default=0)
	# the region of instance
	region = models.CharField(max_length=100)
	# operation system info
	os_type = models.CharField(max_length = 30)
	os_text = models.CharField(max_length = 50)
	os_value = models.CharField(max_length = 50)

	# update timestamp
	update_time = models.IntegerField(default = 0)

# store the pricing information of specified instancetype
class InstancePriceAll(models.Model):
	"""docstring for InstancePriceAll"""
	instanceType = models.ForeignKey(InstanceType)
	# on-demand, reserved or audition
	pricing_type = models.CharField(max_length = 30)
	# RMB or USD
	monetary_unit = models.CharField(max_length = 30)
	prices = models.DecimalField(max_digits = 8, decimal_places = 2)
	duration = models.IntegerField()
	# hour or month
	pricing_cycle = models.CharField(max_length = 30)
	update_time = models.IntegerField()

# keep the latest instance price information of all manumfactures
class InstancePriceLatest(models.Model):
	"""docstring for InstancePriceCurrent"""
	instanceType = models.ForeignKey(InstanceType)
	# on-demand, reserved or audition
	pricing_type = models.CharField(max_length = 30)
	# RMB or USD
	monetary_unit = models.CharField(max_length = 30)
	prices = models.DecimalField(max_digits = 8, decimal_places = 2)
	duration = models.IntegerField()
	# hour or month
	pricing_cycle = models.CharField(max_length = 30)
	update_time = models.IntegerField()

# create model Instance to represent
# single instance
class Instance(models.Model):
	# many to one relationship with Instance Type
	instanceType = models.ForeignKey(InstanceType)

	# using ripemd-160 encryption to identify instance
	hashKey = models.CharField(max_length = 40)

	# ip address of public network address
	publicAddress = models.GenericIPAddressField(null = True)

	# ip address inner network
	innerAddress = models.GenericIPAddressField(null = True)

	# username on the instance
	username = models.CharField(max_length=100)
	# password of this user
	password = models.CharField(max_length=100)

	# generat hash key by using given identity
	def generateKey(self, identity):
		hashGenerator = hashlib.new("ripemd160")
		hashGenerator.update(identity)
		self.hashKey = hashGenerator.hexdigest()


# create UnixBench Manager to add table-level method
class UnixBenchManager(models.Manager):
	# reutrn all score records for specific instance type
	def getScoresByInstanceType(self, instanceType):
		recordsList = self.filter(instanceType = instanceType)
		result = []
		for record in recordsList:
			if record.parallelScore != 0:
				result.append(record.parallelScore)
			else:
				result.append(record.serialScore)
		return result

	# return average score of records for specific instance type
	def averageScore(self, instanceType):
		recordsList = self.filter(instanceType = instanceType)
		if len(recordsList) == 0:
			return 0
		
		amounts = 0.0
		for record in recordsList:
			if record.parallelScore != 0:
				amounts += record.parallelScore
			else:
				amounts += record.serialScore

		result = amounts / len(recordsList)
		return result

# create model UnixBench to represent
# this benchmark's detail
class UnixBench(models.Model):
	# many to one relationship with InstanceType
	instanceType = models.ForeignKey(InstanceType)

	# instance score for serial test
	serialScore = models.IntegerField(default = 0)
	
	# instance score for parallel test
	parallelScore = models.IntegerField(default = 0)

	# timestamps for single test
	createdAt = models.DateTimeField(auto_now_add = True)

	# set objects manager to be UnixBench Manager
	objects = UnixBenchManager()



# create model Phoronix to represent
# this benchmark's detail
class Phoronix(models.Model):
	# many to one relationship with InstanceType
	instanceType = models.ForeignKey(InstanceType)

	# timestamps for single test
	createdAt = models.DateTimeField(auto_now_add = True)


# create model BandwidthNetbench to represent
# the vm's network status
class BandwidthNetbench(models.Model):
	# iperf client instance
	# iperf_client = models.ForeignKey(InstanceType)
	iperf_client = models.ForeignKey(InstanceType, null=True, default=None)

	# result: bandwidth
	max_bandwidth = models.IntegerField(default = 0)

	# result: delay
	delay = models.DecimalField(max_digits=10, decimal_places=2, default = 0)

	# result: loss_rate
	loss_rate = models.DecimalField(max_digits=5, decimal_places=2, default = 0)

	# timestamp of this benchmark task
	createdAt = models.DateTimeField(auto_now=True, auto_now_add=True)


# create model Bonnie to represent
# this benchmark's detail
class Bonnie(models.Model):
	# many to one relationship with InstanceType
	instanceType = models.ForeignKey(InstanceType)

	# Writing with putc(), a.k.a, by character
	writeCharaterSpeed = models.IntegerField(default = 0)
	# Writing with block
	writeBlockSpeed = models.IntegerField(default = 0)
	# Reading with getc(), a.k.a, by character
	readCharacerSpeed = models.IntegerField(default = 0)
	# Reading with block
	readBlcokSpeed = models.IntegerField(default = 0)
	# Random Seek per second
	randomSeek = models.DecimalField(max_digits = 5, decimal_places = 1, default = 0)

	# timestamps for single test
	createdAt = models.DateTimeField(auto_now_add = True)
