#-*-coding:utf-8-*-
from django.db import models

# Create your models here.
class MyTestListViewModel(models.Model):
    name = models.CharField(max_length=100, verbose_name="姓名")
    
    def __unicode__(self):
        return str(self.name)
    class Meta:
        verbose_name = u"测试"
        verbose_name_plural= u"测试"