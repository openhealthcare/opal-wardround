Virtual ward round plugin for OPAL.

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
