from django.urls import path
from .viewsets import Todo
from .views import todo_list
urlpatterns = [
    path('', todo_list, name='todo_list_template'),
    path('api/todos/', Todo.as_view(), name='todo-list'),
]
