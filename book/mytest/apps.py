#-*-coding:utf-8-*-
from django.apps import AppConfig
from django.conf import settings


class DummyAppConfig(AppConfig):
    name = 'mytest'
    verbose_name = u"我的测试"