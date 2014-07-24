from django.core.management.base import BaseCommand, CommandError
from omnibus.api import publish

def send_hello_world():
    publish(
        'jasonniu',  # the name of the channel
        'update_instance',  # the `type` of the message/event, clients use this name
                  # to register event handlers
        {'text': 'Hello world'},  # payload of the event, needs to be
                                  # a dict which is JSON dumpable.
        sender='server'  # sender id of the event, can be None.
    )


class Command(BaseCommand):
    help = 'Update the instance status and push message to user'

    def handle(self, *args, **options):
		send_hello_world()