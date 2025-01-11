from django.views.generic import ListView, DetailView, TemplateView

from core.models import Todo

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
    fields=('title', 'description', 'due_date')