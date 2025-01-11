from django.contrib import messages
from django.urls import reverse_lazy
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect
from django.views.generic import ListView, DetailView, DeleteView, TemplateView, CreateView, UpdateView, View

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


class TodoDeleteView(DeleteView):
    """Todo Delete View"""
    
    model = Todo
    success_url = reverse_lazy("core:todo_list")

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Todo successfully deleted.')
        return response

class TodoCreateView(CreateView):
    """Todo Create View"""

    model = Todo
    form_class = TodoCreateForm
    template_name_suffix= '_create'
    success_url = reverse_lazy("core:todo_list")
    
    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Todo successfully created.')
        return response

class TodoUpdateView(UpdateView):
    """Todo Update View"""

    model = Todo
    form_class = TodoUpdateForm
    template_name_suffix= '_update'
    success_url = reverse_lazy("core:todo_list")
        
    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Todo successfully updated.')
        return response


class TodoUpdateCompletedView(View):
    """Todo Update Completed"""

    def post(self, request: HttpRequest, pk: int) -> HttpResponse:
        """Method to handle todo completed post request"""

        todo = get_object_or_404(Todo, pk=pk)
        form = TodoUpdateCompletedForm(request.POST)

        if form.is_valid():
            is_completed = form.cleaned_data['completed']
            todo.is_completed = is_completed
            todo.save()
            message_status = 'complete' if is_completed else 'uncomplete'
            messages.success(request, f"TODO '{todo.title}' marked as {message_status}.")
        
        else:
            messages.warning(request, "Invalid action")

        return redirect('core:todo_list')
