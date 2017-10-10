from __future__ import unicode_literals

from rest_framework.views import APIView
from wardround.wardrounds import WardRound
from opal.core.views import json_response
from django.http import Http404


class WardRoundView(APIView):
    """
    Return a JSON serialised wardround
    """
    def get(self, request, *args, **kwargs):
        w = WardRound.get(kwargs['name'])

        if not w:
            raise Http404("wardround not found")

        wardround = w(request)

        serialised = json_response(
            wardround.list_view_table()
        )
        return serialised


class FindPatientView(APIView):
    """
    Return a list of episodes based on the ids for the find patient view
    (where the qs may no longer still fit requirements)
    """
    def get(self, request, *args, **kwargs):
        w = WardRound.get(kwargs['name'])

        if not w:
            raise Http404("wardround not found")

        wardround = w(request)

        episode_ids = request.GET.getlist("e")
        response = wardround.find_patient_table(episode_ids)
        return json_response(response)
