from django import forms

from core.models import Todo

class TodoCreateForm(forms.ModelForm):

    class Meta:
        model = Todo
        fields = ('title', 'description', 'due_date')
        widgets = {
            # TODO: Ensure the due date is not in the past
            'due_date': forms.DateTimeInput(attrs={
                'type': 'datetime-local',
            }),
        }