"""
Plugin definition
"""
from opal.core import plugins, menus

from wardround.urls import urlpatterns


class WardRoundsPlugin(plugins.OpalPlugin):
    """
    Main entrypoint to expose this plugin to the host
    OPAL instance !
    """
    urls = urlpatterns
    javascripts = {
        'opal.wardround': [
            'js/wardround/app.js',
            'js/wardround/services/wardround_utils.js',
            'js/wardround/controllers/list.js',
            'js/wardround/controllers/wardround.js',
            'js/wardround/controllers/episode_detail.js',
            'js/wardround/controllers/find_patient.js',
        ]
    }
    menuitems = [
        menus.MenuItem(
            href="/wardround/#/", display="Ward Rounds", icon="fa fa-tasks",
            activepattern='/wardround', index=1)
    ]
