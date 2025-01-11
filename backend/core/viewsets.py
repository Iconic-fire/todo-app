from rest_framework.viewsets import ModelViewSet

from core.models import Todo
from core.serializers import TodoSerializer

class TodoViewSet(ModelViewSet):
    """Todo View Set"""

    queryset = Todo.objects.all()
    serializer_class = TodoSerializer