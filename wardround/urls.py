"""
Urls for the OPAL wardrounds plugin
"""
from django.conf.urls import patterns, url

from wardround import views

urlpatterns = patterns(
    '',
    url('^/wardrounds/$', views.WardRoundIndexView.as_view())
)
