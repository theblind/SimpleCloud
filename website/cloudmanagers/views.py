from django.shortcuts import render_to_response,render,get_object_or_404  
from django.http import HttpResponse, HttpResponseBadRequest
from django.template.context import RequestContext

# Create your views here.
def index(request):
	return render(request, 'cloudmanagers/index.html')
    
def login(request):
	return render(request, 'cloudmanagers/login.html')
    
def platforms(request):
	return render(request, 'cloudmanagers/platforms.html')

def project(request):
	return render(request, 'cloudmanagers/project.html')
    
def rolemarket(request):
	return render(request, 'cloudmanagers/rolemarket.html')
    
def settings(request):
	return render(request, 'cloudmanagers/settings.html')
    
def sshkey(request):
	return render(request, 'cloudmanagers/sshkey.html')