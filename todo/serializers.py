from rest_framework import serializers

from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    """Todo Serializer"""

    class Meta:
        model = Todo
        fields= '__all__'