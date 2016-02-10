from django.core.urlresolvers import reverse

from opal.core.test import OpalTestCase
from wardround.tests.test_wardrounds import TestWardround

__all__ = ["TestWardround"]


class TestAPI(OpalTestCase):
    # def test_wardround_view(self):
    #     url = reverse("wardround_api_view", kwargs=dict(name="test"))
    #     self.client.login(username=self.user.username, password=self.PASSWORD)
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, 200)

    def test_find_patient_view(self):
        url = reverse("find_patient_api_view", kwargs=dict(name="test"))
        self.client.login(username=self.user.username, password=self.PASSWORD)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
