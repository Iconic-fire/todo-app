from rest_framework.viewsets import ModelViewSet

from core.models import Todo
from core.permissions import IsOwner
from core.serializers import TodoSerializer

class TodoViewSet(ModelViewSet):
    """Todo View Set"""

    serializer_class = TodoSerializer
    permission_classes=[IsOwner]

    def get_queryset(self):
        user = self.request.user
        return Todo.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)