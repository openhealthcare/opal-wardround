//
// Start page for our ward round ! 
//
angular.module('opal.wardround.controllers').controller(
    'WardRoundCtrl', function($rootScope, $scope, $routeParams, $location,
                              $cookieStore,
                              ward_round){
        $scope.ward_round = ward_round;
        $scope.episodes = ward_round.episodes;
        $scope.results = ward_round.episodes;
        $scope.limit = 10;
        $scope.filters = {};


        $scope.jumpToEpisode = function(episode){
            $location.path($routeParams.wardround + '/' + episode.id);
        };

        //
        // Dive straight in if we have no filters. c.f. openhealthcare/opal-wardround#13
        //
        if($scope.episodes.length > 0 && _.keys($scope.ward_round.filters).length == 0){
            $scope.start();
        }

        //
        // Iterate over our active filters and restrict the episodes accordingly
        //
        $scope.set_visible_episodes = function(){
            var episodes = $scope.episodes;
            _.each(_.keys($scope.filters), function(filter){
                var filter_expression = $scope.ward_round.filters[filter];
                episodes = _.filter(episodes, function(episode){
                    var value = $scope.filters[filter];
                    return eval(filter_expression);
                });
            });
            $scope.results = episodes;
        };

        $scope.$watch('filters', function(){
            $scope.set_visible_episodes();
        }, true);
        
        $scope.start = function(){
            $cookieStore.put('wardround_filters', $scope.filters);
            $location.path($routeParams.wardround + '/' + $scope.results[0].id);
        };

    });
