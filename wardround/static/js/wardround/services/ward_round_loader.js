angular.module('opal.wardround.services')
    .factory('wardRoundLoader', function($q, $route, $http, Episode, detailSchemaLoader) {
        return function() {
	    var deferred = $q.defer();
	    detailSchemaLoader.then(function(schema) {

	        $http.get('/wardround/'+$route.current.params.wardround).then(
                    function(resource) {
                        var wardround = resource.data;
                        wardround.episodes = _.map(wardround.episodes,
                                                   function(e){return new Episode(e, schema)} );
		        deferred.resolve(wardround);
	            }, function() {
		        // handle error better
		        alert('Ward Round could not be loaded');
	            });
            });
	    return deferred.promise;
        };
    });
