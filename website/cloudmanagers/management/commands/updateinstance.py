from django.core.management.base import BaseCommand, CommandError
from clients.models import Client, ClientEnvironment, ClientEnvironmentProperty
from util.IaaS.middleware import IaaSConnection
from util.IaaS import usertoken
from pprint import pprint


class Command(BaseCommand):
    help = 'Update the instance status and push message to user'

    def handle(self, *args, **options):
        clients = Client.objects.all()
        for client in clients:
            env_properties = client.getAllEnvironmentsProperties()
            if env_properties:
                for key in env_properties:
                    if key['manufacture'] == 'ec2':
                        token = {'access_id' : key['ec2.access_key'], 'access_key' : key['ec2.secret_key']}
                        conn = IaaSConnection(token, key['manufacture'], 'us-east-1')
                        reservations = conn.get_all_reservations()
                        print reservations
        
        self.stdout.write('Successfully closed poll')# Dummy file to make this directory a package.
