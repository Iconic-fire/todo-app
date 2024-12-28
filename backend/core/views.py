from django.views.generic import TemplateView

# Create your views here.

class HomeTemplateView(TemplateView):
    """Home Template View"""

    template_name='core/home.html'