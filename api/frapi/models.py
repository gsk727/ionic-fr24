#-*-coding:utf-8-*-
from django.db import models
from django import forms
from django.dispatch import Signal
from django.contrib.auth.models import User

class MyForm(forms.Form):
    name = forms.CharField(label_suffix=' :',max_length=100, required=True,  
        label=u"用户名字", error_messages={'required': '你这个无名人士.....'})
# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name="profile")
    pos_lng = models.FloatField(null=True, blank=False)
    pos_lat = models.FloatField(null=True, blank=False)

def handler_user_save(sender, instance, **kwargs):
    #pass
    u = UserProfile(user=instance)
    u.save()
    
    
models.signals.post_save.connect(handler_user_save, sender=User)
    
    
