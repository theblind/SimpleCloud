from django.db import models
from clients.models import Client, ClientEnvironmentProperty
from benchmark.models import InstanceType

# Farm represent a task for cloud vms
class Farm(models.Model):
	client = models.ForeignKey(Client)

	name = models.CharField(max_length = 255)
	region = models.CharField(max_length = 255)
	status = models.SmallIntegerField(default = 0)
	isCompleted = models.SmallIntegerField(default = 0)
	hashKey = models.CharField(max_length = 25)
	termOnSyncFail = models.SmallIntegerField(default = 0)
	farmRolesLaunchOrder = models.SmallIntegerField(default = 0)
	comments = models.TextField()
	
	createdByID = models.SmallIntegerField(default = 0)
	createdByEmail = models.EmailField()
	changedByID = models.SmallIntegerField(default = 0)
	changedTime = models.DateTimeField(null = True)

	dtLaunched = models.DateTimeField(auto_now_add = True)
	dtAdded = models.DateTimeField(auto_now_add = True)

	# create server for this farm
	def createServer(self, role, **kwargs):
		newServer = Server(farm = self, role = role, **kwargs)
		newServer.save()
		return newServer

	# get all servers in this farm
	def getAllServers(self):
		return list(self.server_set.all())

	# get all roles in this farm
	def getAllRoles(self):
		result = set()
		try:
			serverSet = self.server_set.all()
			for server in serverSet:
				if server.role not in result:
					result.add(server.role)
			return list(result)
		except:
			return []

	# get all servers by specific role in this farm
	def getServersByRole(self, role):
		servers = []
		try:
			serverSet = self.server_set.all()
			for server in serverSet:
				if server.role == role:
					servers.append(server)
			return servers
		except:
			return []


# Server represent a specific vm in a farm
class Server(models.Model):
	# which farm
	farm = models.ForeignKey(Farm)
	# which role
	role = models.ForeignKey('Role')
	# which instance type
	instanceType = models.ForeignKey(InstanceType)


	# use server status to represent vm's current status
	STOP = 0
	START = 1
	TERMINATE = 2
	SERVER_STATUS = (
		(STOP, 'stop'),
		(START, 'start'),
		(TERMINATE, 'terminate'),
	)
	status = models.SmallIntegerField(choices = SERVER_STATUS, default = STOP)

	name = models.CharField(max_length = 255)
	value = models.TextField()
	replaceServerID = models.CharField(max_length = 36)
	location = models.CharField(max_length = 50)
	secretGroup = models.CharField(max_length = 50)

	publicIPAddress = models.GenericIPAddressField(null = True)
	innerIPAddress = models.GenericIPAddressField(null = True)
	publicDNS = models.CharField(max_length = 100)

	dtAdded = models.DateTimeField(null = True)
	dtLaunched = models.DateTimeField(null = True)
	dtShutDown = models.DateTimeField(null = True)
	dtLastSync = models.DateTimeField(null = True)

	# start server, set status and send a message
	def startServer(self):
		status = START
		newMessage = Message(client = farm.client, messageType = Message.PROJECT_MESSAGE)
		newMessage.save()

	# stop server, set status and send a message
	def stopServer(self):
		status = STOP
		newMessage = Message(client = farm.client, messageType = Message.PROJECT_MESSAGE)
		newMessage.save()

	# stop server, set status and send a message
	def terminateServer(self):
		status = TERMINATE
		newMessage = Message(client = farm.client, messageType = Message.PROJECT_MESSAGE)
		newMessage.save()
		
	# create histroy event for this server
	def createHistory(self, **kwargs):
		newHistroy = Histroy(server = self, **kwargs)
		newHistroy.save()
		return newHistroy

	# create operation for this vm
	def createOperation(self, **kwargs):
		newOperation = ServerOperation(server = self, **kwargs)
		newOperation.save()
		return newOperation

	# get all histroy of this vm
	def getAllHistroy(self):
		return self.histroy_set.all()

	# get all operations ot this vm
	def getAllOperations(self):
		return self.operation_set.all()

	# get basic information of this server
	def getServerBasicInfo(self):
		basicInfo = {}

		basicInfo["manufacture"] = self.instanceType.manufacture.name
		basicInfo["role"] = self.role.name
		basicInfo["serverID"] = self.replaceServerID
		basicInfo["status"] = SERVER_STATUS[self.status][1]
		basicInfo["publicIP"] = self.publicIPAddress
		basicInfo["instanceType"] = self.instanceType.alias_name
		basicInfo["location"] = self.location
		basicInfo["launchTime"] = str(dtLaunched)

		return basicInfo

	# get all details of this server
	def getServerExtendedInfo(self):
		extendedInfo = getServerBasicInfo()

		extendedInfo["publicDNS"] = self.publicDNS
		extendedInfo["innerIPAddress"] = self.innerIPAddress
		extendedInfo["secretGroup"] = self.secretGroup

		return extendedInfo


class ServerHistroy(models.Model):
	server = models.ForeignKey(Server, related_name = 'histroy')

	launchReason = models.CharField(max_length = 255)
	terminateReason = models.CharField(max_length = 255)
	eventType = models.CharField(max_length = 25)

	dtLaunched = models.DateTimeField(null = True)
	dtTerminated = models.DateTimeField(null = True)


class ServerOperation(models.Model):
	server = models.ForeignKey(Server, related_name = 'operation')

	status = models.CharField(max_length = 20)
	name = models.CharField(max_length = 50)
	phases = models.TextField()
	timeStamp = models.IntegerField(default = 0)


class ServerOperationProgress(models.Model):
	operation = models.ForeignKey(ServerOperation, related_name = 'progress')

	phase = models.CharField(max_length = 100)
	step = models.CharField(max_length = 100)
	status = models.CharField(max_length = 15)
	progress = models.IntegerField(default = 0)
	stepNo = models.IntegerField(default = 0)
	message = models.TextField()
	trace = models.TextField()
	handler = models.CharField(max_length = 255)
	timeStamp = models.IntegerField(default = 0)


class Message(models.Model):
	client = models.ForeignKey(Client)

	# system message and project message
	SYSTEM_MESSAGE = 'S'
	PROJECT_MESSAGE = 'P'
	MESSAGE_TYPE = (
		(SYSTEM_MESSAGE, 'system'),
		(PROJECT_MESSAGE, 'project'),
	)
	messageType = models.CharField(max_length = 1, choices = MESSAGE_TYPE, default = SYSTEM_MESSAGE)

	status = models.SmallIntegerField(default = 0)
	handleAttempts = models.IntegerField(default = 0)
	message = models.TextField()
	messageName = models.CharField(max_length = 30)
	messageVersion = models.IntegerField(default = 0)
	ipAddress = models.GenericIPAddressField(null = True)

	dtLastHandleAttempt = models.DateTimeField(null = True)
	dtAdded = models.DateTimeField(null = True)


# Role represent a vm's functionality in a farm
class Role(models.Model):
	origin = models.CharField(max_length = 30)
	name = models.CharField(max_length = 100)
	rule = models.CharField(max_length = 100)
	description = models.TextField()
	behaviors = models.CharField(max_length = 90)
	histroy = models.TextField()

	generation = models.SmallIntegerField(default = 0)
	os = models.CharField(max_length = 60)
	osFamily = models.CharField(max_length = 30)
	osGeneration = models.CharField(max_length = 10)
	osVersion = models.CharField(max_length = 10)

	dtAdded = models.DateTimeField(null = True)
	addedByClientID = models.IntegerField(default = 0)
	addedByEmail = models.EmailField()


class RoleSoftware(models.Model):
	role = models.ForeignKey(Role, related_name = 'software')

	softwareName = models.CharField(max_length = 45)
	softwareVersion = models.CharField(max_length = 20)
	softwareKey = models.CharField(max_length = 20)


class RoleImage(models.Model):
	role = models.OneToOneField(Role, related_name = 'image')

	name = models.CharField(max_length = 255)
	platform = models.CharField(max_length = 25)
	cloudLocation = models.CharField(max_length = 50)
	architecture = models.CharField(max_length = 6)

	osFamily = models.CharField(max_length = 30)
	osGeneration = models.CharField(max_length = 10)
	osVersion = models.CharField(max_length = 10)