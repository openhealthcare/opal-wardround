// 
// Ward round filter / find patient modal 
//
angular.module('opal.wardround.controllers').controller(
    'WardRoundFindPatientCtrl', function(
        $scope, $modalInstance, $routeParams, $location,
        episodes
    ){
        $scope.limit = 20;
        $scope.episodes = episodes;
        $scope.results = episodes;
        $scope.filter = {
            query: ""
        };

        $scope.jumpToEpisode = function(episode){
            $location.path($routeParams.wardround + '/' + episode.id);
            $modalInstance.close();
        };

        $scope.get_filtered_episodes = function(){
            return _.filter($scope.episodes, function(e){
                var demographics = e.demographics[0];
                var query = $scope.filter.query.toLowerCase()
                console.log(demographics.name)
                console.log(query)
                if(
                    demographics.name.toLowerCase().indexOf(query) != -1 || 
                        demographics.hospital_number.toLowerCase().indexOf(query) != -1 
                  ){return true}
                return false
            })
        };

        $scope.$watch('filter.query', function(){ $scope.results = $scope.get_filtered_episodes() } );
        
        $scope.cancel = function() {
            $modalInstance.close(null);
        };

    }
);
