from clients.models import Client


def global_vars(request):

	if hasattr(request, 'user'):
		user = request.user
	else:
		from django.contrib.auth.models import AnonymousUser
		user = AnonymousUser()
		return {}

	context = {}
	client = Client.objects.get(id = user.id)
	context['username'] = client.get_full_name()
	projects_list = client.getAllFarms()
	context['projects_list'] = projects_list

	message_list = client.getAllMessages()
	context['sysmessage_list'] = message_list['sysmessage_list']
	context['promessage_list'] = message_list['promessage_list']

	return context