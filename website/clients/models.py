from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from benchmark.models import Manufacture
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth import hashers

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
	@property
	def is_active(self):
		return self.isActive

	# create farm for this client 
	def createFarm(self, name = "", region = "", comments = ""):
		import cloudmanagers.models as cloudmanagers	 
		newFarm = cloudmanagers.Farm(client=self, createdByEmail=self.email, name=name, region=region, comments=comments)
		newFarm.save()
		return newFarm

	# get all environments which is active
	def getAllEnvironments(self):
		result = []
		try:
			environmentsSet = self.environment_set.all()
			for env in environmentsSet:
				if env.isActive():
					result.append(env)
			return result
		except:
			return []

	# collect access key to bind a environment
	def bindingEnvironment(self, manufacture, **kwargs):
		newEnvironment = ClientEnvironment(client = self, manufacture = manufacture)
		newEnvironment.setActive()
		newEnvironment.save()

		for (name, value) in kwargs.items():
			newEnvironmentProperty = ClientEnvironmentProperty(environment = newEnvironment, name = name, value = value)
			newEnvironmentProperty.save()

	# get sshkey in specific environment
	def getSSHKeyByEnvironment(self, environment):
		try:
			result = []
			environments = self.environment_set.filter(name = environment)
			for env in environments:
				result.extend(env.getSSHKeys())
			return result
		except:
			return []

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

# cloud environment info
class ClientEnvironment(models.Model):
	# which manufature
	manufacture = models.ForeignKey(Manufacture)
	# which client
	client = models.ForeignKey(Client, related_name = "environment")

	# set status to identify this environment's activeness
	ACTIVE = 'A'
	INACTIVE = 'I'
	BINDING_STATUS = (
		(ACTIVE, 'Active'),
		(INACTIVE, 'Inactive'),
	)
	status = models.CharField(max_length = 1, choices = BINDING_STATUS, default = INACTIVE)

	def isActive(self):
		return self.status == ACTIVE

	def setActive(self):
		self.status = ACTIVE

	def setInactive(self):
		self.status = INACTIVE

	def getSSHKeys(self):
		return list(self.sshkey_set.all())


# save properties for environment
class ClientEnvironmentProperty(models.Model):
	environment = models.ForeignKey(ClientEnvironment)

	name = models.CharField(max_length = 255)
	value = models.TextField()
	group = models.CharField(max_length = 20)
	cloud = models.CharField(max_length = 20)


# Client's SSH key in specific environment
class SSHKey(models.Model):
	environment = models.ForeignKey(ClientEnvironment)

	keyType = models.CharField(max_length = 10)
	privateKey = models.TextField()
	publicKey = models.TextField()

	platform = models.CharField(max_length = 20)
	cloudLocation = models.CharField(max_length = 255)
	cloudKeyName = models.CharField(max_length = 255)

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