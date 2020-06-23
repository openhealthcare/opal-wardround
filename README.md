Virtual ward round plugin for OPAL.


## ! Important Notice !

This plugin is no longer actively maintiained - as it depends on a version of django that is no longer supported by OPAL



[![Build Status](https://travis-ci.org/openhealthcare/opal-wardround.svg?branch=v0.10.0)](https://travis-ci.org/openhealthcare/opal-wardround)
[![Coverage Status](https://coveralls.io/repos/github/openhealthcare/opal-wardround/badge.svg?branch=v0.10.0)](https://coveralls.io/github/openhealthcare/opal-wardround?branch=v0.10.0)
[![PyPI version](https://badge.fury.io/py/opal-wardround.svg)](https://badge.fury.io/py/opal-wardround)

Define wardronds in your implementation by subclassing wardrounds.WardRound.

As a minimum, you will need to specify a name & description, and implemenet the episodes
staticmethod.

```python
@staticmethod
def episodes():
    return [list, of, episodes]
```

### Filters

Your wardround may also define user filters for the episodes included in this ward round.

The template for the HTML snippet containing the UI for this should be set as the `filter_template` property
of your ward round

The filters themselves are set as a dictionary in the `filters` property.

This should be a dictionary where the key is the filters.foo property being set in your UI snippet,
the value being an expression to eval. This expression will have access to the following variables:

 - episode: the OPAL Episode() instance
 - value: the value of your filter as set by the UI.

#### Filter Helpers

The wardrounds plugin also defines a Django Templatetag library that contains commonly used filters such
as "Filter by patient list".

```html
{% load wardrounds %}
<form class="form-horizontal col-md-8" role="form">
  {% patient_list_tags_filter %}
</form>
```

### Schemas

Your wardround detail view may restrict the available fields by implementing the `schema()` classmethod.

This method should return a column schema (an ordered iterable of models.)

This returns opal.views.core.schema.detail_columns by default.
