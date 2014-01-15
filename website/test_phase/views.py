from django.shortcuts import render

def index(request):
	return render(request, 'test_phase/index.html')

def deploy(request):
	return render(request, 'test_phase/deploy.html')