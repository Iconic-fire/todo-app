from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, TemplateView, CreateView

from core.models import Todo
from core.forms import TodoCreateForm

# Create your views here.

class HomeTemplateView(TemplateView):
    """Home Template View"""

    template_name='core/home.html'


class TodoListView(ListView):
    """Todo List View"""

    model = Todo


class TodoDetailView(DetailView):
    """Todo Detail View"""
    
    model = Todo


class TodoCreateView(CreateView):
    """Todo Create View"""

    model = Todo
    form_class = TodoCreateForm
    success_url = reverse_lazy("core:todos")
