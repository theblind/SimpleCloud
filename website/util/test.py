from IaaS.middleware import IaaSConnection
from django.contrib.auth.models import User
import qingcloud.iaas


if __name__ == '__main__':
    provider = "qingcloud"
    token = {
        "access_id": 'YZYITLSRAXONXSLUMQBK',
        "access_key": 'TijzWiPFaqz21NJquhcZSSOtCnvmTvCFMxCohBOl'
    } 

    conn = IaaSConnection(token, provider, "gd1")

    login_pass = User.objects.make_random_password(length = 20)

    print login_pass

	#reservation = conn.buy_qingcloud_instance_temporary('centos64x86a', 'c1m1', login_pass)

	# serverID = reservation.instances[0].id
	# print serverID
	# address = reservation.instances[0].private_ip_address
	# print address
