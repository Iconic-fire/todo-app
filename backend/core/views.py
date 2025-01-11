from django.urls import reverse_lazy
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect
from django.views.generic import ListView, DetailView, TemplateView, CreateView, UpdateView, View

from core.models import Todo
from core.forms import TodoCreateForm, TodoUpdateCompletedForm, TodoUpdateForm

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


class TodoUpdateCompletedView(View):
    """Todo Update Completed"""

    def post(self, request: HttpRequest, pk: int) -> HttpResponse:
        """Method to handle todo completed post request"""

        todo = get_object_or_404(Todo, pk=pk)
        form = TodoUpdateCompletedForm(request.POST)

        if form.is_valid():
            todo.is_completed = form.cleaned_data['completed']
            todo.save()

        # TODO: Add message

        return redirect('core:todo_list')
