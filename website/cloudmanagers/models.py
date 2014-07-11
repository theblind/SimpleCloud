from django.db import models
from clients.models import Client, ClientEnvironmentProperty
from benchmark.models import InstanceType
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

	name = models.CharField(max_length = 255)
	value = models.TextField()
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


	# get all histroy of this server
	def getAllEvents(self):
		return self.events.all()

	# get all operations ot this server
	def getAllOperations(self):
		return self.operations.all()


	# get basic information of this server
	def getServerBasicInfo(self):
		basicInfo = {}

		basicInfo["manufacture"] = self.instanceType.manufacture.name
		basicInfo["role"] = self.role.name
		basicInfo["serverID"] = self.replaceServerID
		basicInfo["status"] = self.SERVER_STATUS[self.status][1]
		basicInfo["publicIP"] = self.publicIPAddress
		basicInfo["instanceType"] = self.instanceType.alias_name
		basicInfo["location"] = self.location
		basicInfo["launchTime"] = str(self.dtLaunched)

		return basicInfo

	# get all details of this server
	def getServerExtendedInfo(self):
		extendedInfo = self.getServerBasicInfo()

		extendedInfo["publicDNS"] = self.publicDNS
		extendedInfo["innerIPAddress"] = self.innerIPAddress
		extendedInfo["secretGroup"] = self.secretGroup

		return extendedInfo


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
	def getMessage(self):
		info = {}

		info["title"] = self.title
		info["content"] = self.content
		info["time"] = self.dtAdded

		return info

# --------------- Message End ---------------




# --------------- Role Start ---------------

# Role represent a server's functionality in a farm
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

# --------------- Role End ---------------