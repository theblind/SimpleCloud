from django import forms

class InstanceForm(forms.Form):
	instanceType = forms.CharField(max_length=100, label="instance Type")
	publicAddress = forms.IPAddressField(label="Public Address")
	innerAddress = forms.IPAddressField(label="Inner Address")
	username = forms.CharField(max_length=100, label="User Name")
	password = forms.CharField(max_length=100, label="Password", widget=forms.PasswordInput)