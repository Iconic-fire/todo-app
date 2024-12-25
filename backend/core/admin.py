from django.contrib import admin
from core.models import Todo

# Register your models here.

@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    """Todo Model Admin"""

    list_filter = ('is_completed',)
    search_fields = ('title', 'description')
    list_display = (
        'title',
        'description',
        'is_completed',
        'due_date', 
        'created_at', 
        'updated_at',
    )