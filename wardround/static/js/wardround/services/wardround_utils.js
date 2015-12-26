angular.module('opal.wardround.services')
.factory('WardRoundUtils', function($q, $location, $http, localStorageService) {
  "use strict";

  var WardRoundUtils = function(wardround, getParams){
    var self = this;
    self.wardround = wardround;
    self.getParams = getParams;

    this.isCacheStale = function(someCache){
      return !(this.wardround === someCache.wardround &&
             _.isEqual(someCache.params, this.getParams) &&
             moment(someCache.lastSet).isAfter(moment().subtract(1, "h")));
    };

    this.castWardRounds = function(wardround){
        _.each(wardround.episodes, function(episode){
            episode.link = '/wardround/#/' + this.wardround + '/' + episode.id;

            if(_.size(getParams)){
              episode.link = episode.link + "?" + $.param(this.getParams);
            }
        }, this);

        return wardround;
    };


    this.setLocalStorage = function(episodeIds){
      if(localStorageService.isSupported){
        var saveObject = {
          episodeIds: episodeIds,
          lastSet: moment().format(),
          wardround: this.wardround,
          params: this.getParams,
        };
        localStorageService.set("wardround", saveObject);
      }
    };

    this.loadWardRound = function(){
      var deferred = $q.defer();
      var getUrl = '/wardround/' + self.wardround;

      $http.get(getUrl, {params: self.getParams}).then(
        function(resource) {
          var wardround = self.castWardRounds(resource.data);
          deferred.resolve(wardround);
        }, function() {
            // handle error better
            alert('Ward Round could not be loaded');
        }
      );

      return deferred.promise;
    };

    this.getEpisodeIdsFromCache = function(){
        if(!localStorageService.isSupported){
          return;
        }
        var cache = localStorageService.get("wardround");
        if(cache && !self.isCacheStale(cache)){
          var episodeIds = cache.episodeIds;
          self.setLocalStorage(episodeIds);
          return episodeIds;
        }
    };

    this.getEpisodesIds = function(){
      var deferred = $q.defer();
      var episodeIdsFromCache = self.getEpisodeIdsFromCache();

      if(episodeIdsFromCache){
          deferred.resolve(episodeIdsFromCache);
      }
      else{
        this.loadWardRound().then(function(wardround){
          var episodeIds = _.pluck(wardround.episodes, "id");
          self.setLocalStorage(episodeIds);
          deferred.resolve(episodeIds);
        });
      }

      return deferred.promise;
    };

    this.getSummariesFromIds = function(){
      var deferred = $q.defer();
      var episodeIdPromise = this.getEpisodesIds();
      episodeIdPromise.then(function(episodeIds){
        var getUrl = '/wardround/'+ self.wardround;
        getUrl = getUrl + "/find_patient";
        $http.get(getUrl, {params: {episode_id: episodeIds}}).then(
          function(resource) {
            var wardround = self.castWardRounds(resource.data);
            deferred.resolve(wardround);
          }, function() {
              // handle error b etter
              alert('Ward Round could not be loaded');
          }
        );
      });

      return deferred.promise;
    };
  };

  return WardRoundUtils;
});
