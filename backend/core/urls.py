from django.urls import path
from core import views

app_name = "core"

urlpatterns = [
    path('', views.TodoListView.as_view(), name='todo_list'),
    path('create/', views.TodoCreateView.as_view(), name='todo_create'),
    path('<int:pk>/', views.TodoDetailView.as_view(), name='todo_detail'),
    path('<int:pk>/update/', views.TodoUpdateView.as_view(), name='todo_update'),
]