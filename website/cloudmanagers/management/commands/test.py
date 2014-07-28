from django.core.management.base import BaseCommand, CommandError

from util.IaaS.middleware import IaaSConnection
from clients.models import Client
import boto.ec2 as ec2
import qingcloud.iaas
import time

from pprint import pprint

class Command(BaseCommand):
    help = 'Update the instance status and push message to user'

    def handle(self, *args, **options):
        # provider = "qingcloud"
        # token = {
        #     "access_id": 'YZYITLSRAXONXSLUMQBK',
        #     "access_key": 'TijzWiPFaqz21NJquhcZSSOtCnvmTvCFMxCohBOl'
        # } 

        provider = "ec2"
        token = {"access_id": "AKIAJ3PC3B6J6VVSNTGQ","access_key": "2Yjrq35Y8H3X2AGIhP+ZAvUDUZaddgzyGb/5fi9Z"}
        conn = IaaSConnection(token, provider)

        reservation = conn.conn.get_all_reservations()
        

        pprint(vars(reservation[0].instances[0]))