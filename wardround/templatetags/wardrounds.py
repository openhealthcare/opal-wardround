"""
Template tags for [Virtual] Ward Rounds
"""
from __future__ import unicode_literals


from django import template
from opal.core import patient_lists

register = template.Library()


@register.inclusion_tag('wardround/partials/patient_list_tags_filter.html',
                        takes_context=True)
def patient_list_tags_filter(context):
    user = context['request'].user
    lists = patient_lists.TaggedPatientList.for_user(user)
    list_tags = []
    for l in lists:
        tag = l.tag
        if hasattr(l, 'subtag'):
            tag = l.subtag
        list_tags.append(
            dict(display_name=l.display_name,
                 tag=tag)
        )
    return {'lists': list_tags}
