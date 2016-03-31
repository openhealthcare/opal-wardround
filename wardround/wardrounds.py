from copy import copy

from opal.core import discoverable
from opal.utils import camelcase_to_underscore
from opal.models import Episode
from collections import OrderedDict


class BaseWardRound(discoverable.DiscoverableFeature):
    """
    Ward round utility methods - shouldn't have to override these !
    """
    module_name = 'wardrounds'

    display_name = None
    description = None


class WardRound(BaseWardRound):
    """
    Base Ward Round class - individual wardrounds should override this.
    """
    display_name = 'PLEASE NAME ME Larry!'
    description = 'PLEASE DESCRIBE ME Larry!'
    detail_template = 'detail/wardround_default.html'
    filter_template = None

    def __init__(self, request):
        self.request = request

    @property
    def auto_start(self):
        return not bool(self.filter_template)

    @property
    def list_columns(self):
        """ returns an ordered dict with the order of columns to fields
            ordered in the order you want them to appear in the page.
            This is for the detail page where it shows a list of the
            episodes in the wardround
        """
        list_columns = OrderedDict()
        list_columns["patient__demographics__hospital_number"] = "Hospital #"
        list_columns["patient__demographics__first_name"] = "First Name"
        list_columns["patient__demographics__surname"] = "Surname"
        list_columns["patient__demographics__date_of_birth"] = "DOB"
        list_columns["date_of_admission"] = "Admitted"
        list_columns["discharge_date"] = "Discharged"
        return list_columns

    @property
    def find_patient_columns(self):
        """ the same as list_columns but for the find patient modal """
        return self.list_columns

    @classmethod
    def episodes(self):
        """
        Subclasses should override this method in order to define a getter
        method that returns an iterable of opal.models.Episode instances
        that are 'on' this ward round.
        """
        return Episode.objects.none()

    def serialize(self, episodes, field_dict):
        field_dict_copy = copy(field_dict)
        field_dict_copy["id"] = "id"

        episodes = episodes.order_by(field_dict.keys()[0])
        episodes = episodes.values(*field_dict_copy.keys())
        episodes = [
            {field_dict_copy[k]: v for k, v in episode.items()} for episode in episodes]

        columns = field_dict.values()

        return dict(name=self.display_name,
                    description=self.description,
                    episodes=episodes,
                    fields=field_dict.values(),
                    columns=columns,
                    auto_start=self.auto_start
                    )

    def list_view_table(self):
        episodes = self.episodes()
        return self.serialize(episodes, self.list_columns)

    def find_patient_table(self, episode_ids):
        episodes = Episode.objects.filter(id__in=episode_ids)
        return self.serialize(episodes, self.find_patient_columns)
