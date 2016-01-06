#-*-coding:utf-8-*-

from django.shortcuts import render
from django.views.generic import ListView, DetailView
# Create your views here.
from .models import *

class MyTestListView(ListView):
    #context_object_name = 'serverlist'
    #template_name = 'serverlist.jinja.html'
    paginate_by = 1
    model = MyTestListViewModel

class MyTestDetailView(DetailView):
    model = MyTestListViewModel
    queryset = MyTestListViewModel.objects.all()
    
def test(request):
    return render(request, "test.html")