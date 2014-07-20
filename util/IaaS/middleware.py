#!/usr/bin/python
# coding: utf-8
import boto.ec2 as ec2


# connect to ec2
def __connect_to_ec2__(token, region):
	return ec2.connect_to_region(token['access_id'], token['access_key'], region)

def __connect_to_azure__():
	pass

class IaasConnection():
	"""docstring for IaasConnection"""

	def __init__(self, token, provider, region):
		super(IaasConnection, self).__init__()
		self.arg = arg
		if provider is "aws":
			self.conn = __connect_to_aws__(token, region)
		elif provider is "azure":
			self.conn = __connect_to_azure(token, region)
		else:
			self.conn = None

	def buy_instance(self, provider, instance_type, *args, **kwds):
		self.conn.