from rest_framework import serializers

from core.models import Todo

class TodoSerializer(serializers.ModelSerializer):
    """Todo Serializer"""

    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Todo
        fields = '__all__'