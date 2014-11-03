"""
Views for the OPAL Wardrounds plugin
"""
from django.conf import settings
from django.views.generic import View, TemplateView

from opal.utils import stringport
from opal.utils.views import LoginRequiredMixin, _build_json_response


class WardRoundIndexView(LoginRequiredMixin, TemplateView):
    """
    Main entrypoint into the ward rounds service. 
    
    Lists our ward rounds to allow the user to select and enter it.
    """
    template_name = 'wardround/index.html'


class WardRoundEpisodesView(LoginRequiredMixin, View):
    """
    Return a list of JSON serialised episodes that are on this wardround
    """
    def get(self, *args, **kwargs):
        from wardround import WardRound

        wardround = WardRound.get(kwargs['name'])
        episodes = wardround.episodes()
        episodes = [e.to_dict(self.request.user) for e in episodes]
        return _build_json_response(episodes)


class WardRoundView(LoginRequiredMixin, View):
    """
    Return a JSON serialised wardround
    """
    def get(self, *args, **kwargs):
        from wardround import WardRound
        
        wardround = WardRound.get(kwargs['name'])
        serialised = _build_json_response(wardround.to_dict(self.request.user))
        return serialised


class WardRoundEpisodeDetailTemplateView(TemplateView):
    template_name = 'wardround/episode_detail.html'
    
    def get_context_data(self, *args, **kwargs):
        from opal.views.core import schema
        from opal.views.templates import _get_column_context
        
        context = super(WardRoundEpisodeDetailTemplateView, self).get_context_data(*args, **kwargs)
        context['columns'] = _get_column_context(schema.detail_columns, **kwargs)
        return context


class WardRoundTemplateView(TemplateView):
    def dispatch(self, *args, **kwargs):
        self.name = kwargs['name']
        return super(WardRoundTemplateView, self).dispatch(*args, **kwargs)

    def get_template_names(self, *args, **kwargs):
        return ['wardround/'+self.name]

    def get_context_data(self, *args, **kwargs):
        context = super(WardRoundTemplateView, self).get_context_data(**kwargs)
        from wardround import WardRound        
        context['wardrounds'] = WardRound.list()
        return context
