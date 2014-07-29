from django.db import models
import hashlib
import datetime
import calendar

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


# create Instance Type Manager to add table-level method
class InstanceTypeManager(models.Manager):
	def getDistinctInstanceType(self):
		return self.filterPlausibleInstanceType(self.all())

	def isPlausibleHardwareIndicator(self, indicator):
		vcpu = indicator[1]
		vram = indicator[2]
		return (vcpu * 2 >= vram)

	def filterPlausibleInstanceType(self, querySet):
		result = []

		indicators = set()
		for instance in querySet:
			indicator = instance.getHardwareIndicator()

			if indicator not in indicators:
				indicators.add(indicator)
				result.append(instance)

		return list(result)

	def getInstanceByManufacture(self, manufacture):
		result = []

		state = set()
		querySet = self.filter(manufacture_id = manufacture).order_by('alias_name')
		for instance in querySet:
			if instance.alias_name not in state:
				state.add(instance.alias_name)
				result.append(instance.getDetails())

		return result


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
	# instance memory size, unit is GB
	vram = models.DecimalField(max_digits = 6, decimal_places = 2, default = 0)
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

	# set table-level manager
	objects = InstanceTypeManager()

	# better option to get instance type's details
	def getDetails(self):
		info = {}

		info['id'] = self.id
		info["manufacture"] = self.manufacture.name
		info["alias_name"] = self.alias_name
		info["vcpu"] = self.vcpu
		info["vram"] = str(self.vram)
		info["storage"] = self.storage
		info["band_width"] = str(self.band_width)
		info["region"] = self.region
		info["os_type"] = self.os_type
		info["os_text"] = self.os_text
		info["os_value"] = self.os_value

		return info

	# current edition to get instance type's details
	def getDetailsUgly(self):
		info = {}

		info["id"] = self.id
		info["instance"] = self.alias_name
		info["vcpu"] = self.vcpu
		info["vram"] = str(self.vram)
		info["storage"] = self.storage

		info["pricing"] = self.getPrice()

		info["provider"] = self.manufacture.name
		info["link"] = self.manufacture.link
		info["image"] = self.manufacture.image

		return info

	# get current price information
	def getPrice(self):
		info = {}
		price = self.price.first()

		if price.pricing_cycle == "hour":
			info["pph"] = str(price.prices)
			info["ppm"] = str(price.prices * 24 * 30)
		elif price.pricing_cycle == "month":
			info["pph"] = "%.2f" % (price.prices / (24 * 30))
			info["ppm"] = str(price.prices)

		if self.manufacture == 'Aliyun':
			if price.pricing_cycle == "hour":
				info["pph"] = str(price.prices / 3)
				info["ppm"] = str(price.prices * 24 * 30 / 3)
			elif price.pricing_cycle == "month":
				info["pph"] = "%.2f" % (price.prices / (24 * 30) / 3)
				info["ppm"] = str(price.prices / 3)

		info["unit"] = price.monetary_unit

		return info

	# get key performance indecator for instance
	def getHardwareIndicator(self):
		return (self.manufacture.name, self.vcpu, self.vram)


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
	instanceType = models.ForeignKey(InstanceType, related_name = "price")
	# on-demand, reserved or audition
	pricing_type = models.CharField(max_length = 30)
	# RMB or USD
	monetary_unit = models.CharField(max_length = 30)
	prices = models.DecimalField(max_digits = 8, decimal_places = 2)
	duration = models.IntegerField()
	# hour or month
	pricing_cycle = models.CharField(max_length = 30)
	update_time = models.IntegerField()

	def getDetails(self):
		info = {}

		info["pricing_type"] = self.pricing_type
		info["monetary_unit"] = self.monetary_unit
		info["prices"] = self.prices
		info["duration"] = self.duration
		info["pricing_cycle"] = self.pricing_cycle

		return info


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
	def getRecordsByInstanceType(self, instanceType):
		recordsList = self.filter(instanceType = instanceType)
		result = []
		for record in recordsList:
			timestamp = calendar.timegm(record.createdAt.utctimetuple())
			if record.parallelScore != 0:
				result.append([timestamp, record.parallelScore])
			else:
				result.append([timestamp, record.serialScore])
		return result

	def getRecordsByInstanceTypeTemporary(self, instanceType):
		recordsList = self.filter(instanceType = instanceType)
		timestamp = [1398070673000, 1398185855000, 1398243468000, 1398301067000, 1398416652000]
		index = 0
		result = []
		for record in recordsList[0:5]:
			if record.parallelScore != 0:
				result.append([timestamp[index], record.parallelScore])
			else:
				result.append([timestamp[index], record.serialScore])
			index = index + 1
		return result

	# return average score of records for specific instance type
	def getAverageScoreByInstanceType(self, instanceType):
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


# create UnixBench Manager to add table-level method
class BonnieManager(models.Manager):
	# reutrn all score records for specific instance type
	def getRecordsByInstanceType(self, instanceType):
		recordsList = self.filter(instanceType = instanceType)
		result = []
		for record in recordsList:
			result.append(record.getDetails())
		return result

	def getAveragePerformanceByInstancetType(self, instanceType):
		recordsList = self.filter(instanceType = instanceType)
		result = {
			"writeBlockSpeed": 0,
			"readBlcokSpeed": 0,
		}

		if len(recordsList) == 0:
			return result

		for record in recordsList:
			result["writeBlockSpeed"] += record.writeBlockSpeed
			result["readBlcokSpeed"] += record.readBlcokSpeed

		result["writeBlockSpeed"] /= (len(recordsList) * 1000)
		result["readBlcokSpeed"] /= (len(recordsList) * 1000)

		return result


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
	randomSeek = models.IntegerField(default = 0)

	# timestamps for single test
	createdAt = models.DateTimeField(auto_now_add = True)

	# set objects manager to be Bonnie Manager
	objects = BonnieManager()

	def getDetails(self):
		info = {}

		info["writeCharaterSpeed"] = self.writeCharaterSpeed
		info["writeBlockSpeed"] = self.writeBlockSpeed
		info["readCharacerSpeed"] = self.readCharacerSpeed
		info["readBlcokSpeed"] = self.readBlcokSpeed
		info["randomSeek"] = self.randomSeek

		return info
