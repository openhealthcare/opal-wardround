"""
Views for the OPAL Wardrounds plugin
"""
from django.views.generic import TemplateView

from opal.utils.views import LoginRequiredMixin

class WardRoundIndexView(LoginRequiredMixin, TemplateView):
    """
    Main entrypoint into the ward rounds service. 
    
    Lists our ward rounds to allow the user to select and enter it.
    """
    template_name = 'wardround/index.html
