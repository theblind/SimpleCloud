from django.db import models
import hashlib
import datetime

# create model Manufacture to represent
# AWS, Azure, RackSpace etc.
class Manufacture(models.Model):
	# Manufacture name, image and hyperlink
	name = models.CharField(max_length = 30)
	image = models.CharField(max_length = 100)
	link = models.CharField(max_length = 100)


# instance type pricing info
class Price(models.Model):
	# on-demand, reserved or audition
	pricing_type = models.CharField(max_length = 30)
	# RMB or USD
	monetary_unit = models.CharField(max_length = 30)
	prices = models.DecimalField(max_digits = 8, decimal_places = 2)
	duration = models.IntegerField()
	# hour or month
	pricing_cycle = models.CharField(max_length = 30)


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

	# One to One relationship with price
	price = models.OneToOneField(Price)

	# update timestamp
	update_time = models.IntegerField()


# create model Instance to represent
# single instance
class Instance(models.Model):
	# many to one relationship with Instance Type
	instanceType = models.ForeignKey(InstanceType)

	# using ripemd-160 encryption to identify instance
	hashKey = models.CharField(max_length = 40)

	# ip address of public network address
	publicAddress = models.IPAddressField()

	# ip address inner network
	innerAddress = models.IPAddressField()

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
	serialScore = models.IntegerField()
	
	# instance score for parallel test
	parallelScore = models.IntegerField()

	# timestamps for single test
	createdAt = models.DateField(auto_now_add = True)

	# set objects manager to be UnixBench Manager
	objects = UnixBenchManager()



# create model Phoronix to represent
# this benchmark's detail
class Phoronix(models.Model):
	# many to one relationship with InstanceType
	instanceType = models.ForeignKey(InstanceType)

	# timestamps for single test
	createdAt = models.DateField(auto_now_add = True)


# create model BandwidthNetbench to represent
# the vm's network status
class BandwidthNetbench(models.Model):
	# iperf client instance
	# iperf_client = models.ForeignKey(InstanceType)
	iperf_client = models.ForeignKey(InstanceType, null=True, default=None)

	# result: bandwidth
	max_bandwidth = models.IntegerField()

	# result: delay
	delay = models.DecimalField(max_digits=10, decimal_places=2)

	# result: loss_rate
	loss_rate = models.DecimalField(max_digits=5, decimal_places=2)

	# timestamp of this benchmark task
	createdAt = models.DateField(auto_now=True, auto_now_add=True)


# create model Bonnie to represent
# this benchmark's detail
class Bonnie(models.Model):
	# many to one relationship with InstanceType
	instanceType = models.ForeignKey(InstanceType)

	# Writing with putc(), a.k.a, by character
	writeCharaterSpeed = models.IntegerField()
	# Writing with block
	writeBlockSpeed = models.IntegerField()
	# Reading with getc(), a.k.a, by character
	readCharacerSpeed = models.IntegerField()
	# Reading with block
	readBlcokSpeed = models.IntegerField()
	# Random Seek per second
	randomSeek = models.DecimalField(max_digits=5, decimal_places=1)

	# timestamps for single test
	createdAt = models.DateField(auto_now_add = True)