"""
Urls for the OPAL wardrounds plugin
"""
from django.conf.urls import patterns, url

from wardround import views

urlpatterns = patterns(
    '',
    url('^wardround/$', views.WardRoundIndexView.as_view(), name="wardround_index"),
    url(r'^wardround/templates/episode_detail.html$',
        views.WardRoundEpisodeDetailTemplateView.as_view()),
    url(r'^wardround/templates/(?P<wardround_name>[a-z_]+)/episode_detail.html$',
        views.WardRoundEpisodeDetailTemplateView.as_view()),
    url(r'^wardround/templates/(?P<name>[a-z_]+.html)$',
        views.WardRoundTemplateView.as_view()),
    url(r'^wardround/templates/(?P<wardround_name>[a-z_]+)/(?P<name>[a-z_]+.html)$',
        views.WardRoundTemplateView.as_view()),
    url('^wardound/(?P<name>[a-z_]+)/(/(?P<filter_arg>.+))/episode/(?P<index>[1-9]*)$', views.WardRoundEpisodeDetailView.as_view(), name="wardround_episode"),
    url('^wardround/(?P<name>[a-z_]+)(/(?P<filter_arg>.+))?$', views.WardRoundView.as_view()),
)
