from typing import Any

from django.contrib import messages
from django.contrib.auth.views import LoginView as BaseLoginView, LogoutView as BaseLogoutView
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.messages.views import SuccessMessageMixin

class LoginView(SuccessMessageMixin, BaseLoginView):
    """View to handle user login"""

    authentication_form = AuthenticationForm
    template_name = "accounts/login.html"
    redirect_authenticated_user = True
    success_message = "Logged In Successfully !!"

class LogoutView(BaseLogoutView):
    """View to handle user logout"""

    
    def dispatch(self, request, *args: Any, **kwargs: Any) -> Any:
        response = super().dispatch(request, *args, **kwargs)
        messages.success(request, "Logged Out Successfully !!")
        return response