from django.db import models
from clients.models import Client, ClientEnvironmentProperty
from benchmark.models import InstanceType, Manufacture
import datetime

# --------------- Farm Start ---------------

# Farm represent a task for cloud servers
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
	def createServer(self, role, instanceType, **kwargs):
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

# --------------- Farm End ---------------




#--------------- Server Start ---------------

# Server represent a specific server in a farm
class Server(models.Model):
	# which farm
	farm = models.ForeignKey(Farm)
	# which role
	role = models.ForeignKey('Role')
	# which instance type
	instanceType = models.ForeignKey(InstanceType)

	# use server status to represent server's current status
	STOP = 0
	START = 1
	SERVER_STATUS = (
		(STOP, 'stop'),
		(START, 'start'),
	)
	status = models.SmallIntegerField(choices = SERVER_STATUS, default = STOP)

	name = models.CharField(max_length = 50)
	replaceServerID = models.CharField(max_length = 36)
	location = models.CharField(max_length = 50)
	secretGroup = models.CharField(max_length = 50)

	publicIPAddress = models.GenericIPAddressField(null = True)
	innerIPAddress = models.GenericIPAddressField(null = True)
	publicDNS = models.CharField(max_length = 100)

	dtAdded = models.DateTimeField(auto_now_add = True)
	dtLaunched = models.DateTimeField(auto_now_add = True)
	dtShutDown = models.DateTimeField(auto_now_add = True)
	dtLastSync = models.DateTimeField(auto_now_add = True)

	# start server, set status and send a message
	def startServer(self, reason = ''):
		self.status = self.START
		self.dtLaunched = datetime.datetime.now()

		# save server event
		self.createEvent(eventType = ServerEvent.START, reason = reason)
		# save server operation
		self.createOperation()

		# send message to client to notify starting server
		messageTitle = "Start server"
		messageContent = ""
		self.createMessage(client = self.farm.client, messageType = Message.PROJECT_MESSAGE, title = messageTitle, content = messageContent)

	# stop server, set status and send a message
	def stopServer(self, reason = ''):
		self.status = self.STOP
		self.dtShutDown = datetime.datetime.now()

		# save server event
		self.createEvent(eventType = ServerEvent.STOP, reason = reason)
		# save server operation
		self.createOperation()

		# send message to client to notify starting server
		messageTitle = "Stop server"
		messageContent = ""
		self.createMessage(client = self.farm.client, messageType = Message.PROJECT_MESSAGE, title = messageTitle, content = messageContent)

	# stop server, set status and send a message
	def terminateServer(self, reason = ''):
		# send message to client to notify starting server
		messageTitle = "Terminate server"
		messageContent = ""
		self.createMessage(client = self.farm.client, messageType = Message.PROJECT_MESSAGE, title = messageTitle, content = messageContent)

		# delete this server
		self.delete()


	# create message for this server
	def createMessage(self, client, messageType, title, content):
		newMessage = Message(client = self.farm.client, messageType = messageType, title = title, content = content)
		newMessage.save()
		return newMessage

	# create histroy event for this server
	def createEvent(self, eventType, reason):
		newEvent = ServerEvent(server = self, eventType = eventType, reason = reason)
		newEvent.save()
		return newEvent

	# create operation for this server
	def createOperation(self, **kwargs):
		newOperation = ServerOperation(server = self, **kwargs)
		newOperation.save()
		return newOperation


	# get all details of this server
	def getDetails(self):
		info = {}

		info["id"] = self.id
		info["manufacture"] = self.instanceType.manufacture.name
		info["role"] = self.role.name
		info["serverID"] = self.replaceServerID
		info["status"] = self.SERVER_STATUS[self.status][1]
		info["publicIP"] = self.publicIPAddress
		info["instanceType"] = self.instanceType.alias_name
		info["location"] = self.location
		info["launchTime"] = str(self.dtLaunched)
		info["publicDNS"] = self.publicDNS
		info["innerIPAddress"] = self.innerIPAddress
		info["secretGroup"] = self.secretGroup

		return info

	# get server's manufacture
	def getManufacture(self):
		return self.instanceType.manufacture

	# get all histroy of this server
	def getAllEvents(self):
		return self.events.all()

	# get all operations of this server
	def getAllOperations(self):
		return self.operations.all()

	# get all properties of this server
	def getAllProperties(self):
		return list(self.properties)

	def getPropertyByName(self, name):
		return self.properties.filter(name = name)


class ServerProperty(models.Model):
	server = models.ForeignKey(Server, related_name = 'properties')

	name = models.CharField(max_length = 255)
	value = models.TextField()


class ServerEvent(models.Model):
	server = models.ForeignKey(Server, related_name = 'events')

	STOP = 0
	START = 1
	EVENT_TYPE = (
		(STOP, 'stop'),
		(START, 'start'),
	)
	eventType = models.SmallIntegerField(choices = EVENT_TYPE, default = STOP)
	reason = models.CharField(max_length = 255)

	dtAdded = models.DateTimeField(auto_now_add = True)


class ServerOperation(models.Model):
	server = models.ForeignKey(Server, related_name = 'operations')

	status = models.CharField(max_length = 20)
	name = models.CharField(max_length = 50)
	phases = models.TextField()

	dtAdded = models.DateTimeField(auto_now_add = True)


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

# --------------- Server End ---------------




# --------------- Message Start ---------------

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

	# read or unread this message
	READ = 1
	UNREAD = 0
	MESSAGE_STATUS = (
		(READ, 'read'),
		(UNREAD, 'unread'),
	)
	status = models.SmallIntegerField(choices = MESSAGE_STATUS, default = UNREAD)

	title = models.CharField(max_length = 30)
	content = models.TextField()
	messageVersion = models.IntegerField(default = 0)
	handleAttempts = models.IntegerField(default = 0)
	ipAddress = models.GenericIPAddressField(null = True)

	dtLastHandleAttempt = models.DateTimeField(null = True)
	dtAdded = models.DateTimeField(auto_now_add = True)

	# return message status
	def isRead(self):
		return self.status == self.READ

	def setRead(self):
		self.status = self.READ

	def setUnread(self):
		self.status = self.UNREAD

	# get message basic info
	def getDetails(self):
		info = {}

		info["title"] = self.title
		info["content"] = self.content
		info["type"] = MESSAGE_TYPE[self.messageType][1]
		info["status"] = MESSAGE_STATUS[self.status][1]
		info["time"] = self.dtAdded

		return info

# --------------- Message End ---------------




# --------------- Role Start ---------------

# create Role Image Manager to add table-level method
class RoleImageManager(models.Manager):
	def getRoleImagesByManufacture(self, manufacture):
		return list(self.filter(manufacture = manufacture))


# create Role Manager to add table-level method
class RoleManager(models.Manager):
	def getAvailableRolesByManufacture(self, manufacture):
		images = RoleImage.objects.getRoleImagesByManufacture(manufacture)

		result = []
		roles = set()
		for i in images:
			role = i.role
			if role not in roles:
				info = role.getDetails()
				info["platforms"] = []
				roles.add(role)
			info["platforms"].append(i.getDetails())
			result.append(info)

		return result


# Role represent a server's functionality in a farm
class Role(models.Model):
	name = models.CharField(max_length = 100, unique = True)

	# role categories
	BASE = 0
	DATABASES = 1
	APPLICATION_SERVERS = 2
	LOAD_BALANCERS = 3
	MESSAGE_QUEUES = 4
	CACHES = 5
	CLOUD_FOUNDRY = 6
	MIXED = 7
	CATEGORY = (
		(BASE, 'Base'),
		(DATABASES, 'Databases'),
		(APPLICATION_SERVERS, 'Application Servers'),
		(LOAD_BALANCERS, 'Load Balancers'),
		(MESSAGE_QUEUES, 'Message Queues'),
		(CACHES, 'Caches'),
		(CLOUD_FOUNDRY, 'Cloud Foundry'),
		(MIXED, 'Mixed'),
	)
	category = models.SmallIntegerField(choices = CATEGORY, default = BASE)

	rule = models.CharField(max_length = 100)
	description = models.TextField()
	behaviors = models.CharField(max_length = 90)

	generation = models.SmallIntegerField(default = 1)
	os = models.CharField(max_length = 60)
	osFamily = models.CharField(max_length = 30)
	osGeneration = models.CharField(max_length = 10)
	osVersion = models.CharField(max_length = 10)

	dtAdded = models.DateTimeField(auto_now_add = True)
	addedByClientID = models.IntegerField(default = 0)
	addedByEmail = models.EmailField()

	objects = RoleManager()

	def getDetails(self):
		info = {}

		info["name"] = self.name
		info["category"] = self.CATEGORY[self.category][1]
		info["rule"] = self.rule
		info["description"] = self.description
		info["behaviors"] = self.behaviors
		info["generation"] = self.generation
		info["os"] = self.os
		info["osFamily"] = self.osFamily
		info["osGeneration"] = self.osGeneration
		info["osVersion"] = self.osVersion

		return info

	def getAllSoftwares(self):
		return list(self.softwares.all())

	def getImages(self):
		return list(self.images.all())


class RoleSoftware(models.Model):
	role = models.ForeignKey(Role, related_name = 'softwares')

	name = models.CharField(max_length = 45)
	version = models.CharField(max_length = 20)

	def getDetails(self):
		info = {}

		info["name"] = self.name
		info["version"] = self.version

		return info


class RoleImage(models.Model):
	role = models.ForeignKey(Role, related_name = 'images')
	manufacture = models.ForeignKey(Manufacture, related_name = 'images')

	name = models.CharField(max_length = 255)
	location = models.CharField(max_length = 50)
	architecture = models.CharField(max_length = 6)

	objects = RoleImageManager()

	def getDetails(self):
		info = {}

		info["manufacture"] = self.manufacture.name
		info["name"] = self.name
		info["location"] = self.location

		return info

# --------------- Role End ---------------
