#-*-coding:utf-8-*-
from django.db import models

# Create your models here.
class MyTestListViewModel(models.Model):
    name = models.CharField(max_length=100, verbose_name="姓名")