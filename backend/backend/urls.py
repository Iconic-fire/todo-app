"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework.schemas import get_schema_view

from core import views
from core.routers import todo_router

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include(todo_router.urls)),
    path("todos/", include("core.urls")),
    path("", views.HomeTemplateView.as_view(), name='home'),
    path(
        "openapi/",
        get_schema_view(
            title="Todo App", 
            description="Productivity tool that allows users to organize, manage, and prioritize tasks", 
            version="1.0.0"
        ),
        name="openapi-schema",
    ),
]
