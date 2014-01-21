from django.shortcuts import render

def index(request):
	return render(request, 'pages/index.html')

def deploy(request):
	return render(request, 'pages/deploy.html')