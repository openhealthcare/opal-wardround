//
// Start page for our ward round !
//
angular.module('opal.wardround.controllers').controller(
  'WardRoundCtrl', function($rootScope, $scope, $routeParams, $location,
    $cookieStore, wardround, options, localStorageService, WardRoundUtils){

      "use strict";

      $scope.wardround = wardround;
      $scope.limit = 10;
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

      $scope.start = function(){
        $location.path($routeParams.wardround + '/' + $scope.wardround.episodes[0].id);
      };
    });
