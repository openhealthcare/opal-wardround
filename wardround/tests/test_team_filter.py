from __future__ import unicode_literals

"""
Unittests for wardround templatetags
"""
from mock import MagicMock, patch

from opal.core.test import OpalTestCase
from opal.tests.test_patient_lists import TaggingTestPatientList, TaggingTestNotSubTag

from wardround.templatetags.wardrounds import patient_list_tags_filter

class PatientListTagsFilterTestCase(OpalTestCase):

    @patch('opal.core.patient_lists.PatientList.for_user')
    def test_context(self, mock_for_user):
        mock_for_user.return_value = [TaggingTestNotSubTag, TaggingTestPatientList]
        ctx = patient_list_tags_filter(MagicMock())
        self.assertEqual([
            dict(display_name='Carnivores', tag='carnivore'),
            dict(display_name='Herbivores', tag='herbivore')
        ], ctx['lists'])
