from clients.models import Client


def global_vars(request):

	if hasattr(request, 'user'):
		user = request.user
	elif not user.id:
		return {}
	else:
		from django.contrib.auth.models import AnonymousUser
		user = AnonymousUser()
		return {}

	context = {}
	try:
		client = Client.objects.get(id = user.id)
		context['userinfo'] = client
	except Exception, e:
		return context
	
	projects_list = client.getAllFarms()
	context['projects_list'] = projects_list

	message_list = client.getAllMessages()
	context['sysmessage_list'] = message_list['sysmessage_list']
	context['promessage_list'] = message_list['promessage_list']

	return context