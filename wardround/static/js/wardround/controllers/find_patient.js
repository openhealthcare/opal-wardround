//
// Ward round filter / find patient modal
//
angular.module('opal.wardround.controllers').controller(
    'WardRoundFindPatientCtrl', function(
        $scope, $modalInstance, $routeParams, $location,
        wardround, episode
    ){
        $scope.wardround = wardround;
        $scope.limit = 10;
        $scope.filter = {
            query: ""
        };

        $scope.episode = episode;

        $scope.$watch('filter.query', function() {
            if($scope.filter.query.length){
              var query = $scope.filter.query.toLowerCase();
              $scope.episodes = _.filter($scope.wardround.episodes, function(e){
                  // filter all rows that have string values
                  var found = false;
                  _.each(e, function(value, key){
                     // don't query by the link
                     if (key === "link") {
                       return;
                     }
                     if(_.isString(value)){
                       if(value.toLowerCase().indexOf(query.toLowerCase()) !== -1){
                          found = true;
                       }
                     }
                  });

                  return found;
              });
            }
            else{
              $scope.episodes = $scope.wardround.episodes;
            }

        }, true);

        $scope.cancel = function() {
            $modalInstance.close(null);
        };
    }
);
