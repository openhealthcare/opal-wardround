//
// Start page for our ward round !
//
angular.module('opal.wardround.controllers').controller(
    'WardRoundCtrl', function($rootScope, $scope, $routeParams,
                              $cookieStore, $location, $route,
                              ward_round, options){

          $scope.ward_round = ward_round;
          $scope.episodes = ward_round.episodes;
          $scope.results = ward_round.episodes;
          $scope.ready = true;

          //
          // Dive straight in if we have no filters. c.f. openhealthcare/opal-wardround#13
          //
          if($scope.episodes.length > 0 && _.keys($scope.ward_round.filters).length === 0){
              // $scope.start();
          }


        $scope.limit = 10;
        $scope.filters = {filter: undefined};
        $scope.filters.filter = $route.current.params.filter_arg;

        // Put all of our lookuplists in scope.
  	    for (var name in options) {
  		    if (name.indexOf('micro_test') != 0) {
  			    $scope[name + '_list'] = options[name];
  		    };
  	    };

        $scope.jumpToEpisode = function(episode){
            $location.path($routeParams.wardround + '/' + episode.id);
        };

        var getUrl = function(index){
            var url = '/' + $route.current.params.wardround;
            if($scope.filters.filter){
                url = url + '/' + $scope.filters.filter;
            }
            if(index){
                url = url + '/' + index;
            }
            return url;
        }

        $scope.$watch('filters', function(){
            $location.url(getUrl());
        }, true);

        $scope.start = function(){
            $location.path(getUrl(1));
        };
    });
