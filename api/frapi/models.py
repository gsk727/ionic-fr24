#-*-coding:utf-8-*-
from django.db import models
from django import forms

class MyForm(forms.Form):
    name = forms.CharField(label_suffix=' :',max_length=100, required=True,  
        label=u"用户名字", error_messages={'required': '你这个无名人士.....'})
# Create your models here.
