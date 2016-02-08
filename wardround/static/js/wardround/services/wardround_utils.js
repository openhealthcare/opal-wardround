angular.module('opal.wardround.services')
.factory('WardRoundUtils', function($q, $location, $http, localStorageService) {
  "use strict";

  var WardRoundDetail = function(slug, episodeIds, name, getParams){
    // this is the object that we store in local storage
    this.episodeIds = episodeIds;
    this.lastSet = moment().format();
    this.wardroundSlug = slug;
    this.name = name;
    this.getParams = getParams;
  };

  var WardRoundUtils = function(wardroundSlug, getParams){
    var self = this;
    self.wardroundSlug = wardroundSlug;
    self.getParams = getParams;

    this.isCacheStale = function(someCache){
      return !(this.wardroundSlug === someCache.wardroundSlug &&
             _.isEqual(someCache.getParams, this.getParams) &&
             moment(someCache.lastSet).isAfter(moment().subtract(1, "h")));
    };

    this.castWardRounds = function(wardround){
        _.each(wardround.episodes, function(episode){
            episode.link = this.getEpisodeLink(episode.id);
        }, this);

        return wardround;
    };

    this.getEpisodeLink = function(episodeId){
      var link = '/wardround/#/' + this.wardroundSlug + '/' + episodeId;
      if(_.size(getParams)){
        link = link + "?" + $.param(this.getParams);
      }

      return link;
    };

    this.setLocalStorage = function(wardroundDetail){
      localStorageService.set("wardround", wardroundDetail);
    };

    this.cleanLocalStorage = function(){
      localStorageService.remove("wardround");
    }

    this.loadWardRound = function(){
      var deferred = $q.defer();
      var getUrl = '/wardround/' + self.wardroundSlug;

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

    this.wardroundDetailFromCache = function(){
        if(!localStorageService.isSupported){
          return;
        }
        var cache = localStorageService.get("wardround");
        if(cache && !self.isCacheStale(cache)){
          self.setLocalStorage(cache);
          return cache;
        }
    };

    this.getWardroundDetail = function(){
      var deferred = $q.defer();
      var wardroundDetail = self.wardroundDetailFromCache();

      if(wardroundDetail){
          deferred.resolve(wardroundDetail);
      }
      else{
        this.loadWardRound().then(function(wardround){
          var episodeIds = _.pluck(wardround.episodes, "id");
          var wardroundDetail = new WardRoundDetail(
            self.wardroundSlug,
            episodeIds,
            wardround.name,
            self.getParams
          );
          if(localStorageService.isSupported){
            self.setLocalStorage(wardroundDetail);
          }
          deferred.resolve(wardroundDetail);
        });
      }

      return deferred.promise;
    };

    this.getSummariesFromIds = function(){
      var deferred = $q.defer();
      var episodeIdPromise = this.getWardroundDetail();
      episodeIdPromise.then(function(wardroundDetail){
        var getUrl = '/wardround/'+ wardroundDetail.wardroundSlug;
        getUrl = getUrl + "/find_patient";
        $http.get(getUrl, {params: {episode_id: wardroundDetail.episodeIds}}).then(
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
