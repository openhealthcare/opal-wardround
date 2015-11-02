angular.module('opal.wardround.services').factory('WardRoundEpisodesLoader', function($q, $http, $routeParams, $location){
    return function(){
        var url = 'wardound/(?P<name>[a-z_]+)/'+$routeParams.wardround;

        if($routeParams.filter_arg){
            url  = url + "/" + $routeParams.wardround.filter_arg;
        }

        url = url + "/episode/";

        if($routeParams.index){
          url = url + $routeParams.index;
        }
        else{
          url = url + location.search().episode_id;
        }
        var deferred = $q.defer();
        $http.get(url).then(
                  function(resource) {
                      var wardround = resource.data;
                      wardround.episodes = _.map(wardround.episodes, function(e){return new Episode(e);} );
                      deferred.resolve(wardround);
            }, function() {
              // handle error better
              alert('Ward Round could not be loaded');
            });
          return deferred.promise;
    };
});
