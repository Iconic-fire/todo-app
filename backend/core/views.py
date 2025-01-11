from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, TemplateView, CreateView, UpdateView

from core.models import Todo
from core.forms import TodoCreateForm, TodoUpdateForm

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
    template_name_suffix= '_create'
    success_url = reverse_lazy("core:todo_list")


class TodoUpdateView(UpdateView):
    """Todo Update View"""

    model = Todo
    form_class = TodoUpdateForm
    template_name_suffix= '_update'
    success_url = reverse_lazy("core:todo_list")
