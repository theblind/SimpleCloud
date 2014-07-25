from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth import hashers

from benchmark.models import Manufacture

class ClientUserManager(BaseUserManager):
	def create_user(self, email, name='anonymous', fullName='anonymous', password=None):
		if not email:
			raise ValueError('Users must have an email address')
		user = self.model(
			email=self.normalize_email(email),
			name=name,
			fullName=fullName,
		)
		user.isActive = 1
		user.set_password(password)
		user.save()
		return user

	def create_superuser(self, email, name, fullName, password):
		user = self.create_user(email,
			password=password,
			name=name,
			fullName=fullName,
		)
		user.isBilled = 1
		user.is_staff = 1
		user.save(using=self._db)
		return user

# Client's information
class Client(models.Model):
	# use email address to identify a client
	email = models.EmailField(unique = True)
	password = models.CharField(max_length = 32)
	name = models.CharField(max_length = 30)
	fullName = models.CharField(max_length = 60)

	org = models.CharField(max_length = 60)
	country = models.CharField(max_length = 60)
	state = models.CharField(max_length = 60)
	city = models.CharField(max_length = 60)
	phone = models.CharField(max_length = 60)

	status = models.CharField(max_length = 100)
	isBilled = models.SmallIntegerField(default = 0)
	isActive = models.SmallIntegerField(default = 0)
	is_staff = models.SmallIntegerField(default = 0)

	comments = models.TextField()
	priority = models.IntegerField(default = 0)
	loginAttempts = models.IntegerField(default = 0)

	dtAdded = models.DateTimeField(auto_now_add = True)
	dtDue = models.DateTimeField(null = True)
	dtLastLoginAttempt = models.DateTimeField(null = True)
	last_login = models.DateTimeField(null = True)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['name', 'fullName']
	objects = ClientUserManager()
	def get_full_name(self):
		return self.fullName
	def get_short_name(self):
		return self.name
	def set_password(self, password):
		self.password = hashers.make_password(password, None, 'unsalted_md5')
	def check_password(self, password):
		return hashers.check_password(password, self.password)
	def has_module_perms(self, app_label):
		return self.is_staff
	def has_perm(self, app_label):
		return self.is_staff
	def is_authenticated(self):
		return True
	@property
	def is_active(self):
		return self.isActive


	# create farm for this client
	def createFarm(self, name = "", comments = ""):
		import cloudmanagers.models as cloudmanagers
		newFarm = cloudmanagers.Farm(client=self, createdByEmail=self.email, name=name, comments=comments)
		newFarm.save()
		return newFarm

	# get all farms which belong to the client
	def getAllFarms(self):
		return list(self.farm_set.all())

	# get all servers which belong to the client
	def getAllServers(self):
		servers = []
		try:
			farmSet = self.getAllFarms()
			for farm in farmSet:
				servers.extend(farm.getAllServers())
			return servers
		except:
			return []

	# collect access key to bind an environment
	def bindingEnvironment(self, manufacture, **kwargs):
		newEnvironment = ClientEnvironment(client = self, manufacture = manufacture)
		newEnvironment.setActive()
		newEnvironment.save()

		for (name, value) in kwargs.items():
			newEnvironment.createProperty(name = name, value = value)


	# get all environments which are active
	def getAllEnvironments(self):
		result = []
		environments = self.environments.all()
		for env in environments:
			if env.isActive():
				result.append(env)
		return result

	# get all environsments' properties in following format:
	# result = [{ "manufacture": "ec2", "secret_key": "", "access_key": "" },
	#            { "manufacture": "azure", "secret_key": "", "access_key": "" }]
	def getAllEnvironmentsProperties(self):
		result = []
		environments = self.getAllEnvironments()

		for env in environments:
			result.append(env.getAllProperties())

		return result

	# get properties in spesicif environment
	def getPropertiesByManufacture(self, manufacture):
		try:
			environment = self.environments.get(manufacture = manufacture)
			return environment.getAllProperties()
		except:
			return {}

	# get sshkey in specific environment
	def getSSHKeysByManufacture(self, manufacture):
		environment = self.environments.get(manufacture = manufacture)
		return environment.getAllSSHKeys()

	# get all sshkeys in every environment
	def getAllEnvironmentsSSHKeys(self):
		result = []
		environments = self.getAllEnvironments()
		for env in environments:
			result.extend(env.getAllSSHKeys())

		return result

	def getAllEnvironmentsAvailableRoles(self):
		result = []
		environments = self.getAllEnvironments()

		for env in environments:
			result.extend(env.getAllAvailableRoles())

		return result

	def getAllMessages(self):
		result = {}
		result['sysmessage_list'] = []
		result['promessage_list'] = []

		messages = self.message_set.order_by('-dtAdded')
		for message in messages:
			if message.messageType == "S":
				result['sysmessage_list'].append(message.getDetails())
			elif message.messageType == "P":
				result['promessage_list'].append(message.getDetails())

		return result

# cloud environment info
class ClientEnvironment(models.Model):
	# which manufature
	manufacture = models.ForeignKey(Manufacture)
	# which client
	client = models.ForeignKey(Client, related_name = "environments")

	# set status to identify this environment's activeness
	ACTIVE = 'A'
	INACTIVE = 'I'
	BINDING_STATUS = (
		(ACTIVE, 'Active'),
		(INACTIVE, 'Inactive'),
	)
	status = models.CharField(max_length = 1, choices = BINDING_STATUS, default = INACTIVE)


	# create SSHKey
	def createSSHKey(self, keyName, privateKey, publicKey, platform = "ec2", region = "us-west-2"):
		newSSHKey = SSHKey(environment = self, privateKey = privateKey, publicKey = publicKey,
			platform = platform, cloudLocation = region, cloudKeyName = keyName)
		newSSHKey.save()
		
	# create property for current environment
	def createProperty(self,name,value):
		cep, created = ClientEnvironmentProperty.objects.get_or_create(environment = self, name = name)
		cep.value = value
		cep.save()

	def isActive(self):
		return self.status == self.ACTIVE

	def setActive(self):
		self.status = self.ACTIVE

	def setInactive(self):
		self.status = self.INACTIVE

	# return sshkeys in following format:
	# result = [ {"manufacture": "ec2", "privateKey": "", "publicKey": "", ...},
	#			{"manufacture": "ec2", "privateKey": "", "publicKey": "", ...},
	#			... ]
	def getAllSSHKeys(self):
		result = []
		sshkeys = self.sshkey_set.all()

		for key in sshkeys:
			info = key.getDetails()
			info["manufacture"] = self.manufacture.name
			result.append(info)

		return result

	# return properties in following format:
	# info = { "manufacture": "ec2", "secret_key": "", "access_key": "" }
	def getAllProperties(self):
		info = {}
		info["manufacture"] = self.manufacture.name

		properties = self.properties.all()
		for p in properties:
			pair = p.getDetails()
			info[pair["name"]] = pair["value"]

		return info

	# return available roles for current environment
	def getAllAvailableRoles(self):
		import cloudmanagers.models as cloudmanagers

		return cloudmanagers.Role.objects.getAvailableRolesByManufacture(manufacture = self.manufacture)


# save properties for environment
class ClientEnvironmentProperty(models.Model):
	environment = models.ForeignKey(ClientEnvironment, related_name = "properties")

	name = models.CharField(max_length = 255)
	value = models.TextField()
	group = models.CharField(max_length = 20)
	cloud = models.CharField(max_length = 20)

	def getDetails(self):
		info = {}

		info["name"] = self.name
		info["value"] = self.value

		return info


# Client's SSH key in specific environment
class SSHKey(models.Model):
	environment = models.ForeignKey(ClientEnvironment)

	keyType = models.CharField(max_length = 10)
	privateKey = models.TextField()
	publicKey = models.TextField()

	platform = models.CharField(max_length = 20)
	cloudLocation = models.CharField(max_length = 255)
	cloudKeyName = models.CharField(max_length = 255)

	def getDetails(self):
		info = {}

		info["keyType"] = self.keyType
		info["privateKey"] = self.privateKey
		info["publicKey"] = self.publicKey
		info["platform"] = self.platform
		info["cloudLocation"] = self.cloudLocation
		info["cloudKeyName"] = self.cloudKeyName

		return info


class ClientBackend(models.Model):
	def authenticate(self, username=None, password=None):
		try:
			usr = Client.objects.get(email=username)
		except usr.DoesNotExist:
			return None
		else:
			if usr.check_password(password, usr.password):
				return usr
			return None

	def get_user(self, user_id):
		try:
			return Client.objects.get(pk=user_id)
		except Client.DoesNotExist:
			return None
