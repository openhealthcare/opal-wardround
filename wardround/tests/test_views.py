from django.core.urlresolvers import reverse

from opal.core.test import OpalTestCase
from opal.tests.models import Colour

from wardround.tests.test_wardrounds import TestWardround

from wardround import views

__all__ = ["TestWardround"]

class WardRoundEpisodeDetailTemplateViewTestCase(OpalTestCase):

    def setUp(self):
        self.request = self.rf.get('/wat')
        self.view = views.WardRoundEpisodeDetailTemplateView()
        self.view.request = self.request

    def test_dispatch(self):
        self.view.dispatch(self.request, wardround_name='test')
        self.assertTrue(hasattr(self.view, 'wardround'))

    def test_get_context_data(self):
        ctx = self.view.get_context_data()
        self.assertEqual(Colour, ctx['models']['Colour'])

    def test_get_template_names(self):
        self.view.dispatch(self.request, wardround_name='test')
        names = self.view.get_template_names()
        self.assertEqual(['detail/wardround_default.html'], names)

class TestViews(OpalTestCase):

    def test_wardround_template_view(self):
        url = reverse("wardround_template_view", kwargs=dict(name="list.html"))
        self.client.login(username=self.user.username, password=self.PASSWORD)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
