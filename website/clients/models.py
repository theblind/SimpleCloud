from django.db import models

# Client's information
class Client(models.Model):
	name = models.CharField(max_length = 30)
	fullName = models.CharField(max_length = 60)

	org = models.CharField(max_length = 60)
	country = models.CharField(max_length = 60)
	state = models.CharField(max_length = 60)
	city = models.CharField(max_length = 60)
	phone = models.CharField(max_length = 60)
	email = models.EmailField()

	status = models.CharField(max_length = 100)
	isBilled = models.SmallIntegerField()
	isActive = models.SmallIntegerField()

	comments = models.TextField()
	priority = models.IntegerField()
	loginAttempts = models.IntegerField()

	dtDue = models.DateField()
	dtLastLoginAttempt = models.DateField()
	dtAdded = models.DateField(auto_now_add = True)


# IaaS provider info
class ClentEnvironmentProperty(models.Model):
	client = models.ForeignKey(Client)

	name = models.CharField(max_length = 255)
	value = models.TextField()
	group = models.CharField(max_length = 20)
	cloud = models.CharField(max_length = 20)


# Client's SSH key
class SSHKey(models.Model):
	client = models.ForeignKey(Client)
	environment = models.ForeignKey(ClentEnvironmentProperty)

	keyType = models.CharField(max_length = 10)
	privateKey = models.TextField()
	publicKey = models.TextField()

	platform = models.CharField(max_length = 20)
	cloudLocation = models.CharField(max_length = 255)
	cloudKeyName = models.CharField(max_length = 255)