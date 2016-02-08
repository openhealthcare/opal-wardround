//
// Start page for our ward round !
//
angular.module('opal.wardround.controllers').controller(
  'WardRoundCtrl', function($rootScope, $scope, $routeParams, $location,
    $cookieStore, wardround, options, localStorageService, WardRoundUtils){

      "use strict";
      $scope.ready = false;

      // we clear out the cache so that if the user was to add a patient
      // then look at the wardround the cache would be cleaned appropriately
      var wardroundUtils = new WardRoundUtils($routeParams.wardround, $location.search());
      wardroundUtils.cleanLocalStorage();

      $scope.wardround = wardround;
      $scope.filters = $location.search();
      $scope.episodes = wardround.episodes;

      // Put all of our lookuplists in scope.
      for (var name in options) {
        if (name.indexOf('micro_test') != 0) {
          $scope[name + '_list'] = options[name];
        }
      }

      $scope.$watch('filters', function() {
        $location.search($scope.filters);
      }, true);

      if(wardround.auto_start){
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
