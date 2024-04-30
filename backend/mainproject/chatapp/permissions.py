from rest_framework.permissions import BasePermission

class IsAdminOrReadOnly(BasePermission):
    """
    Custom permission to allow only admins to access the view.
    """

    def has_permission(self, request, view):
        # Allow access to admin users
        return request.user and request.user.is_staff
