"""
Plugin definition
"""
from opal.utils import OpalPlugin

from wardround.urls import urlpatterns

class WardRoundsPlugin(OpalPlugin):
    """
    Main entrypoint to expose this plugin to the host
    OPAL instance !
    """
    urls = urlpatterns
