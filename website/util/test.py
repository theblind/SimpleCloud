from IaaS.middleware import IaaSConnection
from IaaS import usertoken
from pprint import pprint
import boto.ec2 as ec2

if __name__ == '__main__':
	provider = "ec2"
	token = usertoken.get_access_key(None, provider)
	conn = IaaSConnection(token, provider, "us-west-2")

	reservation = conn.buy_instance_temporary('ami-fa9cf1ca', 't1.micro')
	
	serverID = reservation.instances[0].id
	print serverID
	address = reservation.instances[0].private_ip_address
	print address