"""
Template tags for [Virtual] Ward Rounds
"""
from django import template

register = template.Library()

@register.inclusion_tag('wardround/partials/team_filter.html',
                        takes_context=True)
def team_filter(context):
    return {'teams': context['request'].user.get_profile().get_teams() }
