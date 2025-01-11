from rest_framework.routers import DefaultRouter

from core import viewsets

todo_router = DefaultRouter()
todo_router.register('todos', viewsets.TodoViewSet, basename='todos')