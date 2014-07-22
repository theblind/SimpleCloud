from IaaS.middleware import IaaSConnection
from IaaS import usertoken
import boto.ec2 as ec2

from Crypto.PublicKey import RSA

if __name__ == '__main__':
	provider = "ec2"
	token = usertoken.get_access_key(None, provider)
	conn = IaaSConnection(token, provider, "us-west-2")

	key = RSA.generate(2048)
	content = key.publickey().exportKey('OpenSSH')
	result = conn.conn.import_key_pair("test", content)
	print result