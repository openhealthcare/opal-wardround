"""
Plugin definition
"""
from django.conf import settings

from opal.utils import OpalPlugin, camelcase_to_underscore, stringport

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
            wr = stringport(app + '.wardrounds')
        except ImportError:
            pass # not a problem
    IMPORTED_FROM_APPS = True
    return
    
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
            'js/wardround/controllers/episode_detail.js',
        ]
    }
    menuitems = [
        dict(href="/wardround/", display="Ward Rounds", icon="fa fa-tasks")
    ]


class BaseWardRound(object):
    """
    Ward round utility methods - shouldn't have to override these !
    """

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
     
    @classmethod
    def to_dict(klass, user):
        from opal.models import Episode

        return dict(name=klass.name, 
                    description=klass.description,
                    episodes=Episode.objects.serialised(user, klass.episodes()),
                    filters=klass.filters)



class WardRound(BaseWardRound):
    """
    Base Ward Round class - individual wardrounds should override this.
    """
    name        = 'PLEASE NAME ME Larry!'
    description = 'PLEASE DESCRIBE ME Larry!'
    
    filter_template = None
    filters         = {}
    
    @staticmethod
    def episodes():
        """
        Subclasses should override this method in order to define a getter
        method that returns an iterable of opal.models.Episode instances
        that are 'on' this ward round.
        """
        return []

    @staticmethod
    def schema():
        """
        Subclasses should override this method in order to define a field
        schema for your wardround.

        You should return an iterable of OPAL subrecord models. 
        
        It defaults to opal.views.core.schema.detail_columns.
        """
        from opal.views.core import schema
        return schema.detail_columns
