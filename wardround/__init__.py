"""
Plugin definition
"""
from opal.utils import OpalPlugin, camelcase_to_underscore

from wardround.urls import urlpatterns

class WardRoundsPlugin(OpalPlugin):
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
        ]
    }
    menuitems = [
        dict(href="/wardround/", display="Ward Rounds")
    ]


class BaseWardRound(object):
    """
    Ward round utility methods - shouldn't have to override these !
    """

    @classmethod
    def get(klass, name):
        for sub in klass.__subclasses__():
            if sub.slug() == name:
                return sub

    @classmethod
    def slug(klass):
        return camelcase_to_underscore(klass.name).replace(' ', '')
     
    @classmethod
    def to_dict(klass, user):
        return dict(name=klass.name, 
                    description=klass.description, 
                    episodes=[e.to_dict(user) for e in klass.episodes()])


class WardRound(BaseWardRound):
    """
    Base Ward Round class - individual wardrounds should override this.
    """
    name        = 'PLEASE NAME ME Larry!'
    description = 'PLEASE DESCRIBE ME Larry!'

    @staticmethod
    def episodes():
        """
        Subclasses should override this method in order to define a getter
        method that returns an iterable of opal.models.Episode instances
        that are 'on' this ward round.
        """
        return []
