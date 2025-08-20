from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.messages.views import SuccessMessageMixin

class LoginView(SuccessMessageMixin, LoginView):
    """View to handle user login"""

    authentication_form = AuthenticationForm
    template_name = "accounts/login.html"
    redirect_authenticated_user = True
    success_message = "Logged In Successfully !!"