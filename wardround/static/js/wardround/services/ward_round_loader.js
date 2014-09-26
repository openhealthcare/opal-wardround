angular.module('opal.wardround.services')
    .factory('wardRoundLoader', function($q, $route, $http) {
        return function() {
	    var deferred = $q.defer();
	    $http.get('/wardround/'+$route.current.params.wardround).then(
                function(resource) {
		    deferred.resolve(resource.data);
	    }, function() {
		// handle error better
		alert('Ward Round could not be loaded');
	    });
            
	    return deferred.promise;
        };
    });
