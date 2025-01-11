from django import forms

from core.models import Todo


class TodoForm(forms.ModelForm):
    """Base Todo Form with common functionality"""

    class Meta:
        model = Todo
        fields = ('title', 'description', 'due_date')
        widgets = {
            # TODO: Ensure the due date is not in the past
            'due_date': forms.DateTimeInput(attrs={
                'type': 'datetime-local',
            }),
        }


class TodoCreateForm(TodoForm):
    """Todo Create Form"""
    
    class Meta(TodoForm.Meta):
        fields = ('title', 'description', 'due_date')


class TodoUpdateForm(TodoForm):
    """Todo Update Form"""
    
    class Meta(TodoForm.Meta):
        fields = ('title', 'description', 'is_completed', 'due_date')