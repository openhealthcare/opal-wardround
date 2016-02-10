"""
Views for the OPAL Wardrounds plugin
"""
from django.views.generic import View, TemplateView

from opal.core.views import LoginRequiredMixin
from opal.core.subrecords import subrecords
from wardround.wardrounds import WardRound

class WardRoundIndexView(LoginRequiredMixin, TemplateView):
    """
    Main entrypoint into the ward rounds service.

    Lists our ward rounds to allow the user to select and enter it.
    """
    template_name = 'wardround/index.html'


class WardRoundEpisodeDetailTemplateView(TemplateView):
    def dispatch(self, *args, **kwargs):
        self.wardround = WardRound(self.request)
        if 'wardround_name' in kwargs:
            self.wardround = WardRound.get(kwargs['wardround_name'])(self.request)
        return super(WardRoundEpisodeDetailTemplateView, self).dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(WardRoundEpisodeDetailTemplateView, self).get_context_data(**kwargs)
        context['models'] = { m.__name__: m for m in subrecords() }
        return context

    def get_template_names(self, *args, **kwargs):
        return [self.wardround.detail_template]


class WardRoundTemplateView(TemplateView):
    def dispatch(self, *args, **kwargs):
        self.name = kwargs['name']
        return super(WardRoundTemplateView, self).dispatch(*args, **kwargs)

    def get_template_names(self, *args, **kwargs):
        return ['wardround/'+self.name]

    def get_context_data(self, *args, **kwargs):
        context = super(WardRoundTemplateView, self).get_context_data(**kwargs)
        context['wardrounds'] = [i(self.request) for i in WardRound.list()]

        if 'wardround_name' in kwargs:
            context['wardround'] = WardRound.get(kwargs['wardround_name'])(self.request)
        return context
