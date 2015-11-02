"""
Views for the OPAL Wardrounds plugin
"""
from django.views.generic import View, TemplateView

from opal.core.views import LoginRequiredMixin, _build_json_response
from opal.core.subrecords import subrecords


class WardRoundIndexView(LoginRequiredMixin, TemplateView):
    """
    Main entrypoint into the ward rounds service.

    Lists our ward rounds to allow the user to select and enter it.
    """
    template_name = 'wardround/index.html'


class WardRoundView(LoginRequiredMixin, View):
    """
    Return a JSON serialised wardround
    """
    def get(self, *args, **kwargs):
        from wardround import WardRound
        filter_arg = kwargs.pop('filter_arg', None)
        wordround_kwargs = {}
        if filter_arg:
            wordround_kwargs["filter_arg"] = filter_arg

        wardround = WardRound.get(kwargs['name'])(**wordround_kwargs)
        serialised = _build_json_response(
            wardround.to_dict(self.request.user)
        )
        return serialised


class WardRoundEpisodeDetailView(LoginRequiredMixin, View):
    def get(self, *args, **kwargs):
        from wardround import WardRound
        filter_arg = kwargs.pop('filter_arg', None)
        kwargs = {}

        if filter_arg:
            kwargs["filter_arg"] = filter_arg

        wardround = WardRound.get(kwargs['name'])(**kwargs)
        data = wardround.get_current_stage_information()
        return data


class WardRoundEpisodeDetailTemplateView(TemplateView):
    def dispatch(self, *args, **kwargs):
        from wardround import WardRound
        self.wardround = WardRound
        if 'wardround_name' in kwargs:
            self.wardround = WardRound.get(kwargs['wardround_name'])
        return super(WardRoundEpisodeDetailTemplateView, self).dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(WardRoundEpisodeDetailTemplateView, self).get_context_data(**kwargs)
        context['models'] = { m.__name__: m for m in subrecords() }
        return context

    def get_template_names(self, *args, **kwargs):
        return [self.wardround.detail_template]


class WardRoundPatientDetailTemplateView(TemplateView):
    def dispatch(self, *args, **kwargs):
        from wardround import WardRound

        self.wardround = WardRound

        if 'wardround_name' in kwargs:
            self.wardround = WardRound.get(kwargs['wardround_name'])

        return super(WardRoundPatientDetailTemplateView, self).dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(WardRoundPatientDetailTemplateView, self).get_context_data(**kwargs)
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
        from wardround import WardRound

        context['wardrounds'] = WardRound.list()
        if 'wardround_name' in kwargs:
            context['wardround'] = WardRound.get(kwargs['wardround_name'])()
        return context
