"""
Unittests for wardround templatetags
"""
from mock import MagicMock, patch

from opal.core.test import OpalTestCase
from opal.models import Team
from opal.tests.test_patient_lists import TaggingTestPatientList, TaggingTestNotSubTag

from wardround.templatetags.wardrounds import team_filter
from wardround.templatetags.wardrounds import patient_list_tags_filter

class TeamFilterTestCase(OpalTestCase):
    def test_team_filter_alphebetises(self):
        wat = Team(name='wat')
        bar = Team(name='bar')
        baz = Team(name='baz')
        caz = Team(name='caz')
        context = MagicMock()
        context['request'].user.profile.get_teams.return_value = [wat, bar, caz, baz]
        teams = team_filter(context)
        expected = ['bar', 'baz', 'caz', 'wat']
        self.assertEqual([t.name for t in teams['teams']], expected)


class PatientListTagsFilterTestCase(OpalTestCase):

    @patch('opal.core.patient_lists.PatientList.for_user')
    def test_context(self, mock_for_user):
        mock_for_user.return_value = [TaggingTestNotSubTag, TaggingTestPatientList]
        ctx = patient_list_tags_filter(MagicMock())
        self.assertEqual([
            dict(display_name='Carnivores', tag='carnivore'),
            dict(display_name='Herbivores', tag='herbivore')
        ], ctx['lists'])
