import copy
from mock import MagicMock
from datetime import date
from opal.core.test import OpalTestCase
from opal.models import Patient, Episode
from opal.tests.models import Demographics
from wardround.wardrounds import WardRound

class TestWardround(WardRound):
    name = "test"
    description = "test wardround"

    @property
    def find_patient_columns(self):
        c = copy.copy(self.list_columns)
        c["patient__demographics__gender_ft"] = "Gender"
        return c

    def episodes(self):
        return Episode.objects.all()


class WardroundTest(OpalTestCase):

    patient_1_dict = dict(
        name = "James Jameson",
        hospital_number = "2",
        date_of_birth = date(1985, 10, 1),
        gender_ft = "Male"
    )

    patient_2_dict = dict(
        name = "Sue Smithson",
        hospital_number = "1",
        date_of_birth = date(1980, 10, 1),
        gender_ft = "Female"
    )


    def setUp(self, *args, **kwargs):
        self.patient_1 = Patient.objects.create()
        self.patient_1.demographics_set.update(
            **self.patient_1_dict
        )
        self.episode_1 = self.patient_1.create_episode()

        self.patient_2 = Patient.objects.create()
        self.patient_2.demographics_set.update(
            **self.patient_2_dict
        )
        self.episode_2 = self.patient_2.create_episode()

        request = MagicMock(name='Mock request')
        self.wardround = TestWardround(request)
        return super(WardroundTest, self).setUp(*args, **kwargs)

    def test_list_view_dict(self):
        table_dict = self.wardround.list_view_table()
        expected = {
            'columns': [
                'Hospital #', 'Name', 'DOB', 'Admitted', 'Discharged'
            ],
            'auto_start': True,
            'description': 'test wardround',
            'episodes': [
                {
                    'Admitted': None,
                    'DOB': date(1980, 10, 1),
                    'Discharged': None,
                    'Hospital #': u'1',
                    'Name': u'Sue Smithson',
                    'id': 2
                },
                {
                    'Admitted': None,
                    'DOB': date(1985, 10, 1),
                    'Discharged': None,
                    'Hospital #': u'2',
                    'Name': u'James Jameson',
                    'id': 1
                }
            ],
            'fields': [
                'Hospital #', 'Name', 'DOB', 'Admitted', 'Discharged'
            ],
            'name': 'test'
        }

        self.assertEqual(table_dict, expected)

    def test_find_patient_dict(self):
        episode_ids = [self.episode_1.id, self.episode_2.id]
        table_dict = self.wardround.find_patient_table(episode_ids)
        expected = {
            'columns': [
                'Hospital #', 'Name', 'DOB', 'Admitted', 'Discharged', 'Gender'
            ],
            'description': 'test wardround',
            'auto_start': True,
            'episodes': [
                {
                    'Admitted': None,
                    'DOB': date(1980, 10, 1),
                    'Discharged': None,
                    'Gender': "Female",
                    'Hospital #': u'1',
                    'Name': u'Sue Smithson',
                    'id': 2
                },
                {
                    'Admitted': None,
                    'DOB': date(1985, 10, 1),
                    'Discharged': None,
                    'Gender': "Male",
                    'Hospital #': u'2',
                    'Name': u'James Jameson',
                    'id': 1
                }
            ],
            'fields': [
                'Hospital #', 'Name', 'DOB', 'Admitted', 'Discharged', 'Gender'
            ],
            'name': 'test'
        }
        self.assertEqual(table_dict, expected)
