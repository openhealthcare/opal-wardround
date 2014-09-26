//
// Start page for our ward round ! 
//
angular.module('opal.wardround.controllers').controller(
    'WardRoundCtrl', function($rootScope, $scope, ward_round){
        $scope.ward_round = ward_round;
        $scope.results = ward_round.episodes;
    }
);
