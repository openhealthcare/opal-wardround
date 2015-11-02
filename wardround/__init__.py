"""
Plugin definition
"""
from django.conf import settings
from django.db.models import QuerySet

from opal.core import plugins
from opal.utils import camelcase_to_underscore, stringport
from opal.models import Episode

from wardround.urls import urlpatterns

# So we only do it once
IMPORTED_FROM_APPS = False


def import_from_apps():
    """
    Iterate through installed apps attempting to import app.wardrounds
    This way we allow our implementation, or plugins, to define their
    own ward rounds.
    """
    print "Importing from apps"
    for app in settings.INSTALLED_APPS:
        try:
            stringport(app + '.wardrounds')
        except ImportError:
            pass # not a problem
    global IMPORTED_FROM_APPS
    IMPORTED_FROM_APPS = True
    return


class WardRoundsPlugin(plugins.OpalPlugin):
    """
    Main entrypoint to expose this plugin to the host
    OPAL instance !
    """
    urls = urlpatterns
    javascripts = {
        'opal.wardround': [
            'js/wardround/app.js',
            'js/wardround/services/ward_round_loader.js',
            'js/wardround/controllers/list.js',
            'js/wardround/controllers/wardround.js',
            'js/wardround/controllers/episode_detail.js',
            'js/wardround/controllers/find_patient.js',
        ]
    }
    menuitems = [
        dict(
            href="/wardround/#/", display="Ward Rounds", icon="fa fa-tasks",
            activepattern='/wardround')
    ]


plugins.register(WardRoundsPlugin)


class BaseWardRound(object):
    """
    Ward round utility methods - shouldn't have to override these !
    """
    name        = None
    description = None

    @classmethod
    def get(klass, name):
        """
        Return a specific ward round by slug
        """
        if not IMPORTED_FROM_APPS:
            import_from_apps()

        for sub in klass.__subclasses__():
            if sub.slug() == name:
                return sub

    @classmethod
    def list(klass):
        """
        Return a list of all ward rounds
        """
        if not IMPORTED_FROM_APPS:
            import_from_apps()
        return klass.__subclasses__()

    @classmethod
    def slug(klass):
        return camelcase_to_underscore(klass.name).replace(' ', '')


class WardRound(BaseWardRound):
    """
    Base Ward Round class - individual wardrounds should override this.
    """
    name = 'PLEASE NAME ME Larry!'
    description = 'PLEASE DESCRIBE ME Larry!'

    detail_template = 'detail/wardround_default.html'
    filter_template = None
    filters = {}

    def __init__(self, filter_arg=None, request=None):
        self.filter_arg = filter_arg

    def episodes(self):
        """
        Subclasses should override this method in order to define a getter
        method that returns an iterable of opal.models.Episode instances
        that are 'on' this ward round.
        """
        return []

    def get_total_count(self, episodes):
        if isinstance(episodes, QuerySet):
            return episodes.count()

        return len(episodes)

    def get_episode_information(self, index):
        episodes = self.episodes()
        total_count = self.get_total_count(episodes)
        current_episode = episodes[index]

        return dict(
            episodes=Episode.objects.serialize([current_episode]),
            total_count=total_count,
            index=index,
            name=self.name,
            description=self.description,
        )

    def get_index_from_episode_id(self, episode_id):
        episodes = self.episodes()
        for index, episode in enumerate(episodes):
            if episode.id == episode_id:
                return index

    def get_current_stage_information(self, *args, **kwargs):
        index = kwargs.pop("index", None)

        if index is None:
            episode_id = kwargs.pop("episode_id", None)
            index = self.get_index_from_episode_id(episode_id)

        return self.get_episode_information(index)

    def to_dict(self, user, filter_arg=None):
        """
        If you need to change the way episodes are serialised - e.g. to insert
        extra data, subclassing this method would be a good place to do it!
        """

        episodes = Episode.objects.serialised(
            user, self.episodes(), episode_history=True
        )

        return dict(name=self.name,
                    description=self.description,
                    episodes=episodes,
                    )
