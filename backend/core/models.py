from django.db import models
from django.conf import settings

# Create your models here.

class Todo(models.Model):
    """Todo Model"""

    class Meta:
        ordering = ["-updated_at"]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    due_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(
        to=settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='todos',
    )

    def __str__(self):
        return self.title