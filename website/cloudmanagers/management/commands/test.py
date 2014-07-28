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
            "access_id": 'YZYITLSRAXONXSLUMQBK1',
            "access_key": 'TijzWiPFaqz21NJquhcZSSOtCnvmTvCFMxCohBOl'
        } 

        conn = IaaSConnection(token, provider, "gd1")

        reservation = conn.conn.describe_instances()

        print reservation