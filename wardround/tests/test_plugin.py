from __future__ import unicode_literals

"""
Unittest for plugin
"""
from opal.core.test import OpalTestCase

from wardround import plugin

class PluginTestCase(OpalTestCase):
    def test_javascripts(self):
        j = plugin.WardRoundsPlugin.javascripts
        self.assertIn(
            'js/wardround/app.js',
            j['opal.wardround']
        )
