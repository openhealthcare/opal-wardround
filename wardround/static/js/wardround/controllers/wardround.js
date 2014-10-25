//
// Start page for our ward round ! 
//
angular.module('opal.wardround.controllers').controller(
    'WardRoundCtrl', function($rootScope, $scope, $routeParams, $location,
                              ward_round){
        $scope.ward_round = ward_round;
        $scope.results = ward_round.episodes;
        $scope.limit = 10;

        $scope.jumpToEpisode = function(episode){
            window.open('/#/episode/'+episode.id, '_blank');
        };

        $scope.start = function(){
            $location.path($routeParams.wardround + '/' + $scope.results[0].id);
        };

    });
