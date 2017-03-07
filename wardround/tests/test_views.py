from django.core.urlresolvers import reverse

from opal.core.test import OpalTestCase
from opal.tests.models import Colour

from wardround.tests.test_wardrounds import TestWardround

from wardround import views

__all__ = ["TestWardround"]


class WardRoundViewsTestCase(OpalTestCase):
    def setUp(self):
        self.request = self.rf.get('/wat')
        self.view = self.active_view()
        self.view.request = self.request


class WardRoundEpisodeDetailTemplateViewTestCase(WardRoundViewsTestCase):
    active_view = views.WardRoundEpisodeDetailTemplateView

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


class WardRoundTemplateViewTestCase(WardRoundViewsTestCase):
    active_view = views.WardRoundTemplateView

    def test_dispatch(self):
        self.view.dispatch(self.request, name='test')
        self.assertEqual('test', self.view.name)


class WardroundFindPatientTemplateTestCase(OpalTestCase):
    def test_get(self):
        self.assertTrue(
            self.client.login(
                username=self.user.username, password=self.PASSWORD
            )
        )
        url = reverse(
            'raw_template_view', kwargs=dict(
                template_name='wardround/find_patient.html'
            )
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


# class TestViews(OpalTestCase):

#     def test_wardround_template_view(self):
#         url = reverse("wardround_template_view", kwargs=dict(name="list.html"))
#         self.client.login(username=self.user.username, password=self.PASSWORD)
#         response = self.client.get(url)
#         self.assertEqual(response.status_code, 200)
