from django.db import models
from clients.models import Client, ClentEnvironmentProperty

# Farm represent a task for cloud vms
class Farm(models.Model):
	client = models.ForeignKey(Client)

	name = models.CharField(max_length = 255)
	region = models.CharField(max_length = 255)
	status = models.SmallIntegerField()
	isCompleted = models.SmallIntegerField()
	hashKey = models.CharField(max_length = 25)
	termOnSyncFail = models.SmallIntegerField()
	#farmRolesLaunchOrder = models.SmallIntegerField()
	comments = models.TextField()
	
	createdByID = models.SmallIntegerField()
	createdByEmail = models.EmailField()
	changedByID = models.SmallIntegerField()
	changedTime = models.DateField()

	dtLaunched = models.DateField(auto_now_add = True)
	dtAdded = models.DateField(auto_now_add = True)


# Role represent a vm's functionality in a farm
class Role(models.Model):
	farm = models.ForeignKey(Farm)

	category = models.ForeignKey('RoleCategory')
	securityRule = models.ForeignKey('RoleSecurityRule')
	software = models.ForeignKey('RoleSoftware')
	image = models.ForeignKey('RoleImage')

	#origin
	name = models.CharField(max_length = 100)
	description = models.TextField()
	behaviors = models.CharField(max_length = 90)
	histroy = models.TextField()

	generation = models.SmallIntegerField()
	os = models.CharField(max_length = 60)
	osFamily = models.CharField(max_length = 30)
	osGeneration = models.CharField(max_length = 10)
	osVersion = models.CharField(max_length = 10)

	dtAdded = models.DateField()
	addedByClientID = models.IntegerField()
	addedByEmail = models.EmailField()


class RoleCategory(models.Model):
	enviroment = models.ForeignKey(ClentEnvironmentProperty)

	name = models.CharField(max_length = 30)


class RoleSecurityRule(models.Model):
	rule = models.CharField(max_length = 90)


class RoleSoftware(models.Model):
	softwareName = models.CharField(max_length = 45)
	softwareVersion = models.CharField(max_length = 20)
	softwareKey = models.CharField(max_length = 20)


class RoleImage(models.Model):
	name = models.CharField(max_length = 255)
	platform = models.CharField(max_length = 25)
	cloudLocation = models.CharField(max_length = 50)
	architecture = models.CharField(max_length = 6)

	osFamily = models.CharField(max_length = 30)
	osGeneration = models.CharField(max_length = 10)
	osVersion = models.CharField(max_length = 10)


class FarmRoles(models.Model):
	farm = models.ForeignKey(Farm)
	role = models.ForeignKey(Role)

	alias = models.CharField(max_length = 50)
	rebootTimeout = models.IntegerField()
	launchTimeout = models.IntegerField()
	statusTimeout = models.IntegerField()
	launchIndex = models.IntegerField()
	platform = models.CharField(max_length = 20)
	cloudLocation = models.CharField(max_length = 50)

	dtLastSync = models.DateField()


# Server represent a specific vm with a role
class Server(models.Model):
	farmRoles = models.ForeignKey(FarmRoles)
	properties = models.ForeignKey('ServerProperty')


	platform = models.CharField(max_length = 20)
	status = models.CharField(max_length = 25)
	remoteIP = models.CharField(max_length = 15)
	localIP = models.CharField(max_length = 15)
	index = models.IntegerField()
	replaceServerID = models.CharField(max_length = 36)
	#osType

	dtAdded = models.DateField()
	dtShutDownScheduled = models.DateField()
	dtRebootStart = models.DateField()
	dtLastSync = models.DateField()


class ServerProperty(models.Model):
	name = models.CharField(max_length = 255)
	value = models.TextField()


class ServerHistroy(models.Model):
	server = models.ForeignKey(Server)

	launchReason = models.CharField(max_length = 255)
	terminateReason = models.CharField(max_length = 255)
	platform = models.CharField(max_length = 20)
	eventType = models.CharField(max_length = 25)
	serverIndex = models.IntegerField()

	dtLaunched = models.DateField()
	dtTerminated = models.DateField()

class ServerOperation(models.Model):
	server = models.ForeignKey(Server)

	name = models.CharField(max_length = 50)
	status = models.CharField(max_length = 20)
	phases = models.TextField()
	timeStamp = models.IntegerField()


class ServerOperationProgress(models.Model):
	operation = models.ForeignKey(ServerOperation)

	phase = models.CharField(max_length = 100)
	step = models.CharField(max_length = 100)
	status = models.CharField(max_length = 15)
	progress = models.IntegerField()
	stepNo = models.IntegerField()
	message = models.TextField()
	trace = models.TextField()
	handler = models.CharField(max_length = 255)
	timeStamp = models.IntegerField()


class Message(models.Model):
	server = models.ForeignKey(Server)

	#messageType = 
	status = models.SmallIntegerField()
	handleAttempts = models.IntegerField()
	message = models.TextField()
	messageName = models.CharField(max_length = 30)
	messageVersion = models.IntegerField()
	#messageFormat = 
	ipAddress = models.IPAddressField()

	dtLastHandleAttempt = models.DateField()
	dtAdded = models.DateField()