from django.core.urlresolvers import reverse

from opal.core.test import OpalTestCase

from wardround.tests.test_wardrounds import TestWardround

__all__ = ["TestWardround"]


class TestViews(OpalTestCase):
    def test_wardround_episode_detail_templateview(self):
        url = reverse(
            "wardround_episode_detail", kwargs=dict(wardround_name="test")
        )
        self.client.login(username=self.user.username, password=self.PASSWORD)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_wardround_template_view(self):
        url = reverse("wardround_template_view", kwargs=dict(name="list.html"))
        self.client.login(username=self.user.username, password=self.PASSWORD)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
