from django.urls import path
from core import views

app_name = "core"

urlpatterns = [
    path('', views.TodoListView.as_view(), name='todos'),
    path('<int:pk>/', views.TodoDetailView.as_view(), name='todos_detail'),
]