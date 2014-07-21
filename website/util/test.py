from IaaS.middleware import IaaSConnection
from IaaS import usertoken
from pprint import pprint
import boto.ec2 as ec2

if __name__ == '__main__':
	provider = "ec2"
	token = usertoken.get_access_key(None, provider)
	conn = IaaSConnection(token, provider, "us-west-2")
	rs = conn.conn.get_all_security_groups()
	
	#result = conn.buy_instance_temporary('ami-fa9cf1ca', 't1.micro')
	#print result
	
	"""
	reservations = conn.get_all_reservations()
	for res in reservations:
		instances = res.instances
		for instance in instances:
			#pass
			#pprint (vars(instance))
	"""