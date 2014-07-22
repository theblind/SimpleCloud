from IaaS.middleware import IaaSConnection
from IaaS import usertoken
import boto.ec2 as ec2

from Crypto.PublicKey import RSA

if __name__ == '__main__':
    provider = "ec2"
    token = {
        "access_id": '123',
        "access_key": '123'
    } 
#    token = usertoken.get_access_key(None, provider)
    conn = IaaSConnection(token, provider, "us-west-2")
    print conn.conn.get_all_regions()

    """
	key = RSA.generate(2048)
	content = key.publickey().exportKey('OpenSSH')
	result = conn.conn.import_key_pair("test", content)
	print result
	"""
	# reservation = conn.buy_instance_temporary('ami-fa9cf1ca', 't1.micro')

	# serverID = reservation.instances[0].id
	# print serverID
	# address = reservation.instances[0].private_ip_address
	# print address
