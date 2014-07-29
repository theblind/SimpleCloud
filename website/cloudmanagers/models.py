from django.db import models
from clients.models import Client, ClientEnvironmentProperty
from benchmark.models import InstanceType, Manufacture
import datetime
import json
from Crypto.PublicKey import RSA

from util.IaaS.middleware import IaaSConnection

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
	def createServer(self, role, instanceType, info={}):
		newServer = Server(farm = self, role = role, instanceType = instanceType, name = info["server_name"], location = info['server_location'])

		# create connetion to buy instance
		token = {
			"access_id": info["properties"]["access_id"],
			"access_key": info["properties"]["access_key"]
		}		
		newServer.setConnection(token)

		if info["platform"] == "ec2":
			# import key pair
			key = RSA.generate(2048)
			publicKey = key.publickey().exportKey('OpenSSH')
			privateKey = key.exportKey('PEM')
			keyName = "simplecloud-" + self.name + "-" + info["server_name"]
			try:
				newServer.getConnection().import_key_pair(keyName, publicKey)
				# import EC2 key pair
				for env in self.client.getAllEnvironments():
					if env.manufacture.name == instanceType.manufacture.name:
						env.createSSHKey(keyName, privateKey, publicKey,
							platform = instanceType.manufacture.name,
							region = info['server_location'])
						break
			except:
				pass

			# get Server info to buy instance
			serverInfo = {}
			serverInfo["image_id"] = role.images.get(location = info["server_location"]).name
			serverInfo["key_name"] = keyName
			serverInfo["instance_type"] = instanceType.alias_name
			#serverInfo["instance_type"] = "t1.micro"
			serverInfo["security_groups"] = "default"

			try:
				# receive reservation of buy instance action
				#reservation = newServer.getConnection().buy_instance(serverInfo["image_id"], serverInfo)
				reservation = newServer.getConnection().buy_ec2_instance_temporary(
					serverInfo["image_id"], serverInfo["instance_type"], serverInfo["key_name"])
				result = reservation.instances[0]

				newServer.setServerId(result.id)
				newServer.innerIPAddress = result.private_ip_address
				newServer.dtLaunched = result.launch_time
				#newServer.status = newServer.PENDING
				newServer.status = newServer.START
				newServer.secretGroup = serverInfo['security_groups']
				newServer.save()
			except:
				pass
		elif info["platform"] == "qingcloud":
			# get Server info to buy instance
			serverInfo = {}
			serverInfo["image_id"] = role.images.get(location = info["server_location"]).name
			serverInfo["login_passwd"] = Client.objects.make_random_password(length = 20)
			serverInfo["instance_type"] = instanceType.alias_name

			try:
				# receive reservation of buy instance action
				reservation = newServer.getConnection().buy_qingcloud_instance_temporary(
					serverInfo["image_id"], serverInfo["instance_type"], serverInfo["login_passwd"])
				print reservation

				if reservation['ret_code'] == 0:
					serverID = reservation['instances'][0]
					print serverID
					newServer.setServerId(serverID)
					newServer.dtLaunched = datetime.datetime.now()
					newServer.status = newServer.START

					# import EC2 key pair
					for env in self.client.getAllEnvironments():
						if env.manufacture.name == instanceType.manufacture.name:
							keyName = "simplecloud-" + self.name + "-" + info["server_name"]
							env.createSSHKey(keyName,
								privateKey = serverInfo["login_passwd"],
								publicKey = "",
								platform = instanceType.manufacture.name,
								region = info['server_location'])
							break
					
					time.sleep(8)
					eip_name = 'simplecloud-' + self.name + "-" + info["server_name"]
					publicIP = newServer.getConnection().binding_qingcloud_eip(1, eip_name, serverID)
					newServer.publicIPAddress = publicIP
					newServer.save()
				else:
					return False
			except:
				pass

		# send message to client to notify creating server
		Message.objects.createProjectMessage(self.client.id, self.id, newServer.id,
			old_status = "",
			new_status = newServer.SERVER_STATUS[newServer.START][1],
			title = 'Server Create', text = newServer.name + ' has been successfully created.')

		return newServer

	# get all servers in this farm
	def getAllServers(self):
		return list(self.server_set.order_by('-dtAdded'))

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
	TERMINATE = 0
	PENDING = 1
	START = 2
	STOPPING = 3
	STOP = 4
	SERVER_STATUS = (
		(TERMINATE, 'terminated'),
		(PENDING, 'pending'),
		(START, 'running'),
		(STOPPING, 'stopping'),
		(STOP, 'stopped'),
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

	# save current server connection
	def getConnection(self):
		return self.connection

	def setConnection(self, token):
		self.connection = IaaSConnection(token, self.instanceType.manufacture.name, self.location)

	# get remote server id
	def getServerId(self):
		return self.replaceServerID

	def setServerId(self, serverID):
		self.replaceServerID = serverID

	# get current server status
	def getStatus(self):
		return self.SERVER_STATUS[self.status][1]

	# start server, set status and send a message
	def startServer(self, reason = ''):
		if self.status == self.TERMINATE:
			return

		Message.objects.createProjectMessage(self.farm.client.id, self.farm.id, self.id,
			old_status = self.SERVER_STATUS[self.status][1],
			new_status = self.SERVER_STATUS[self.START][1],
			title = 'Server Start', text = self.name + ' has been successfully started.')

		#self.status = self.PENDING
		self.status = self.START
		self.dtLaunched = datetime.datetime.now()

		# connect to iaas platform
		self.getConnection().start_instances(self.replaceServerID)
		self.save()

		# save server event
		self.createEvent(eventType = ServerEvent.START, reason = reason)
		# save server operation
		self.createOperation()

	# stop server, set status and send a message
	def stopServer(self, reason = ''):
		if self.status == self.TERMINATE:
			return

		Message.objects.createProjectMessage(self.farm.client.id, self.farm.id, self.id,
			old_status = self.SERVER_STATUS[self.status][1],
			new_status = self.SERVER_STATUS[self.STOP][1],
			title = 'Server Stop', text = self.name + ' has been successfully stopped.')

		#self.status = self.STOPPING
		self.status = self.STOP
		self.dtShutDown = datetime.datetime.now()

		# connect to iaas platform
		self.getConnection().stop_instances(self.replaceServerID)
		self.save()

		# save server event
		self.createEvent(eventType = ServerEvent.STOP, reason = reason)
		# save server operation
		self.createOperation()


	# stop server, set status and send a message
	def terminateServer(self, reason = ''):
		if self.status == self.TERMINATE:
			return

		Message.objects.createProjectMessage(self.farm.client.id, self.farm.id, self.id,
			old_status = self.SERVER_STATUS[self.status][1],
			new_status = self.SERVER_STATUS[self.TERMINATE][1],
			title = 'server Terminate', text = self.name + ' has been successfully terminated.')

		self.status = self.TERMINATE
		# connect to iaas platform
		self.getConnection().terminate_instances(self.replaceServerID)
		self.save()

		# delete this server
		#self.delete()

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
		info["name"] = self.name
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

class MessageManager(models.Manager):
	def createSystemMessage(self, uid, title = 'System Notification', text = ''):
		content = {}
		content["text"] = text
		content = json.dumps(content)
		msg = self.model(client=uid, messageType=self.model.SYSTEM_MESSAGE, title = title, content=content)
		msg.setUnread()
		msg.save()
		return msg
	def createUserMessage(self, from_uid, to_uid, title = 'User Message', text = ''):
		content = {}
		content["from"] = from_uid
		content["text"] = text
		content = json.dumps(content)
		msg = self.model(client=uid, messageType=self.model.USER_MESSAGE, title = title, content=content)
		msg.setUnread()
		msg.save()
		return msg
	def createProjectMessage(self, uid, project_id = None, server_id = None, old_status = None, new_status = None, title = 'Project Notification', text = ''):
		content = {}
		content["text"] = text
		content["project"] = project_id
		content["server"] = server_id
		content["old_status"] = old_status
		content["new_status"] = new_status

		content = json.dumps(content)

		client = Client.objects.get(id = uid)
		msg = self.model(client=client, messageType=self.model.PROJECT_MESSAGE, title = title, content=content)
		msg.setUnread()
		msg.save()
		return msg


class Message(models.Model):
	client = models.ForeignKey(Client)

	# system message and project message
	SYSTEM_MESSAGE = 'S'
	PROJECT_MESSAGE = 'P'
	USER_MESSAGE = 'U'
	MESSAGE_TYPE = (
		(SYSTEM_MESSAGE, 'system'),
		(PROJECT_MESSAGE, 'project'),
		(USER_MESSAGE, 'user'),
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

	objects = MessageManager()

	# get message basic info
	def getDetails(self):
		info = {}

		info["title"] = self.title

		content = json.loads(self.content)
		
		info["text"] = content["text"]
		info["type"] = self.messageType

		# if self.messageType == self.SYSTEM_MESSAGE:
			# Only text.
			
		if self.messageType == self.USER_MESSAGE:
			info["from_uid"] = content["from"]
			info["from_name"] = Client.objects.get(id = content["from"]).fullName

		if self.messageType == self.PROJECT_MESSAGE:
			info["project_id"] = content["project"]
			info["project_name"] = Farm.objects.get(id = content["project"]).name
			if content["server"]:
				info["server_id"] = content["server"]
				info["server_name"] = Server.objects.get(id = content["server"]).name
			info["old_status"] = content["old_status"]
			info["new_status"] = content["new_status"]

		info["status"] = self.status
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

		roles = {}
		for i in images:
			role = i.role
			if role.name not in roles:
				info = role.getBasicInfo()
				info["platforms"] = [i.getDetails()]
				roles[role.name] = info
			else:
				roles[role.name]["platforms"].append(i.getDetails())

		result = []
		for role in roles.keys():
			result.append(roles[role])
		return result

	def getAvailableRolesByManufactureWithoutPlatforms(self, manufacture):
		images = RoleImage.objects.getRoleImagesByManufacture(manufacture)
		result = []
		roles = {}
		for i in images:
			role = i.role
			if role.name not in roles:
				info = role.getBasicInfo()
				roles[role.name] = info
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

	def getBasicInfo(self):
		info = {}

		info["role_id"] = self.id
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

	def getDetails(self):
		info = self.getBasicInfo()

		info["platforms"] = self.getAllPlatforms()
		info["platforms_name"] = self.getAllPlatforms_name()

		return info

	def getAllSoftwares(self):
		return list(self.softwares.all()) 

	def getAllSoftwares_name(self):
		name_list = []
		soft_list = self.getAllSoftwares()
		for soft in soft_list:
			name_list.append(soft.name)
		return name_list

	def getImages(self):
		return list(self.images.all())

	# get all paltforms for this role
	def getAllPlatforms(self):
		result = []

		images = self.getImages()
		for i in images:
			result.append(i.getDetails())
		return result

	def getAllPlatforms_name(self):
		result = []
		platforms_list = self.getAllPlatforms()
		for i in platforms_list:
			if i['manufacture'] in result:
				continue
			else:
				result.append(i['manufacture'])
		return result


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
		info["architecture"] = self.architecture

		return info

# --------------- Role End ---------------
