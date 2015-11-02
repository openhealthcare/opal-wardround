angular.module('opal.wardround.services')
    .factory('WardRoundLoader', function($q, $routeParams, $http, recordLoader, Episode) {
        return function() {
          var url = '/wardround/'+$routeParams.wardround;
          if($routeParams.filter_arg){
              url = url + "/" + $routeParams.filter_arg;
          }
    	    var deferred = $q.defer();
          recordLoader.then(function(records){
	        $http.get(url).then(
                    function(resource) {
                        var wardround = resource.data;
                        wardround.episodes = _.map(wardround.episodes,
                                                   function(e){return new Episode(e);} );
		        deferred.resolve(wardround);
	            }, function() {
    		        // handle error better
    		        alert('Ward Round could not be loaded');
	            });
            });
	    return deferred.promise;
        };
    });
