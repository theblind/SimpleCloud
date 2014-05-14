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

	# using ripemd-160 encryption to identify instance
	hashKey = models.CharField(max_length = 40)

	# ip address of public network address
	publicAddress = models.CharField(max_length=15)

	# ip address inner network
	innerAddress = models.CharField(max_length=15)

	# username on the instance
	username = models.CharField(max_length=100)
	# password of this user
	password = models.CharField(max_length=100)

	# generat hash key by using given identity
	def generateKey(self, identity):
		hashGenerator = hashlib.new("ripemd160")
		hashGenerator.update(identity)
		self.hashKey = hashGenerator.hexdigest()


# create model UnixBench to represent
# this benchmark's detail
class UnixBench(models.Model):
	# many to one relationship with Instance
	instance = models.ForeignKey(InstanceType)

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
	instance = models.ForeignKey(InstanceType)

	# test result for 7-zip compression
	# result unit is MIPS
	compressionResult = models.IntegerField()

	# test result for postgreSQL benchmark
	# result unit is TPS
	pgbenchResult = models.IntegerField()

	# timestamps for single test
	createdAt = models.DateField(auto_now_add = True)

# create model BandwidthNetbench to represent
# the vm's network status
class BandwidthNetbench(models.Model):
	# iperf client instance
	iperf_client = models.ForeignKey(InstanceType)

	# result: bandwidth
	max_bandwidth = models.IntegerField(null=True, default=None)

	# result: delay
	delay = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=None)

	# result: loss_rate
	loss_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, default=None)

	# timestamp of this benchmark task
	createdAt = models.DateField(auto_now=True,auto_now_add=True)