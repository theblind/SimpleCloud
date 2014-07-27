from django.core.management.base import BaseCommand, CommandError
from clients.models import Client, ClientEnvironment, ClientEnvironmentProperty
from cloudmanagers.models import Server
from util.IaaS.middleware import IaaSConnection
from omnibus.api import publish
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
                        token = {'access_id' : key['access_id'], 'access_key' : key['access_key']}
                        conn = IaaSConnection(token, key['manufacture'], 'us-east-1')
                        reservations = conn.get_all_reservations()

                        for reservation in reservations:
                            instances = reservation.instances
                            for instance in instances:
                                for status in Server.SERVER_STATUS:
                                    if instance.state == status[1]:
                                        new_status = status[0]
                                        break

                                change_num = Server.objects.filter(replaceServerID = instance.id).update(publicIPAddress = instance.ip_address, publicDNS = instance.public_dns_name, status = new_status)
                                try:
                                    server_new = Server.objects.get(replaceServerID = instance.id)
                                except Exception, e:
                                    continue

                                change_num = 1
                                if change_num > 0:
                                    publish(
                                        client.name,
                                        'wakeup',
                                        {},
                                        sender='server'
                                    )
                                    publish(
                                        client.name,
                                        'update_instance',
                                        {'name': server_new.name, 'status': server_new.SERVER_STATUS[new_status][1]},
                                        sender='server'
                                    )
        
        #self.stdout.write('Successfully closed poll')# Dummy file to make this directory a package.
