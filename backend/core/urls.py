from django.urls import path
from core import views

app_name = "core"

urlpatterns = [
    path('', views.HomeTemplateView.as_view(), name='home'),
    path('todos/', views.TodoListView.as_view(), name='todos'),
]