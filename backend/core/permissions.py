from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    """
    Permission to only allow owners of a Todo to view, edit, or delete it.
    """ 

    def has_permission(self, request, view):
        return super().has_permission(request, view)
    def has_object_permission(self, request, view, obj):
        # Only allow access to the todo if the logged-in user is the owner of the todo
        return obj.user == request.user