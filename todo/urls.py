from django.urls import path
from .views import SnippetList

urlpatterns = [
    path('todos/', SnippetList.as_view(), name='todo-list'),
]
