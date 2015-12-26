"""
Urls for the OPAL wardrounds plugin
"""
from django.conf.urls import patterns, url

from wardround import views, api

urlpatterns = patterns(
    '',
    url('^wardround/$', views.WardRoundIndexView.as_view(), name="wardround_index"),
    url('^wardround/(?P<name>[a-z_]+)$', api.WardRoundView.as_view(), name="wardround_api_view"),
    url('^wardround/(?P<name>[a-z_]+)/find_patient$', api.FindPatientView.as_view(), name="find_patient_api_view"),
    url(
        r'^wardround/templates/(?P<wardround_name>[a-z_]+)/episode_detail.html$',
        views.WardRoundEpisodeDetailTemplateView.as_view(),
        name="wardround_episode_detail"
    ),
    url(r'^wardround/templates/(?P<name>[a-z_]+.html)$',
        views.WardRoundTemplateView.as_view(),
        name="wardround_template_view",
    ),
    url(r'^wardround/templates/(?P<wardround_name>[a-z_]+)/(?P<name>[a-z_]+.html)$',
        views.WardRoundTemplateView.as_view(),
        name="wardround_named_template_view",
    ),
)
