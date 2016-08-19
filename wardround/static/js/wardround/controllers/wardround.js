//
// Start page for our ward round !
//
angular.module('opal.wardround.controllers').controller(
  'WardRoundCtrl', function($scope, $routeParams, $location,
      WardRoundUtils, wardround, referencedata){

      "use strict";
      $scope.ready = false;

      // we clear out the cache so that if the user was to add a patient
      // then look at the wardround the cache would be cleaned appropriately
      var wardroundUtils = new WardRoundUtils($routeParams.wardround, $location.search());
      wardroundUtils.cleanLocalStorage();

      $scope.wardround = wardround;
      $scope.filters = $location.search();
      $scope.episodes = wardround.episodes;

      _.extend($scope, referencedata.toLookuplists());

      $scope.$watch('filters', function() {
        $location.search($scope.filters);
      }, true);

      if(wardround.auto_start && wardround.episodes.length){
        $location.path($routeParams.wardround + '/' + $scope.wardround.episodes[0].id);
        $location.replace();
      }
      else{
        $scope.ready = true;
      }

      $scope.start = function(){
        $location.path($routeParams.wardround + '/' + $scope.wardround.episodes[0].id);
      };
    });
