from django.core.management.base import BaseCommand, CommandError

from util.IaaS.middleware import IaaSConnection
from clients.models import Client
import qingcloud.iaas
import time

class Command(BaseCommand):
    help = 'Update the instance status and push message to user'

    def handle(self, *args, **options):
        provider = "qingcloud"
        token = {
            "access_id": 'YZYITLSRAXONXSLUMQBK',
            "access_key": 'TijzWiPFaqz21NJquhcZSSOtCnvmTvCFMxCohBOl'
        } 

        conn = IaaSConnection(token, provider, "gd1")

        login_pass = Client.objects.make_random_password(length = 20)
        reservation = conn.buy_qingcloud_instance_temporary('centos64x86a', 'c1m1', login_pass)

        if reservation['ret_code'] == 0:
            print "fuck all you"

        print reservation