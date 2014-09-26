"""
Urls for the OPAL wardrounds plugin
"""
from django.conf.urls import patterns, url

from wardround import views

urlpatterns = patterns(
    '',
    url('^wardround/$', views.WardRoundIndexView.as_view()),
    url('^wardround/(?P<name>[a-z_]+)$', views.WardRoundView.as_view()),
    url(r'^wardround/templates/(?P<name>[a-z_]+.html)$', views.WardRoundTemplateView.as_view()),
)
