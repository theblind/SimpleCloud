from util.IaaS.middleware import IaaSConnection
from util.IaaS import usertoken
from pprint import pprint
import boto.ec2 as ec2

if __name__ == '__main__':
	provider = "ec2"
	token = usertoken.get_access_key(None, provider)
	print token
	conn = IaaSConnection(token, provider, "us-west-2")
	reservations = conn.get_all_reservations()
	for res in reservations:
		instances = res.instances
		for instance in instances:
			pass
			#pprint (vars(instance))

