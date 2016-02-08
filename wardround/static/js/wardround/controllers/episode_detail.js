//
// Editing/detail page for ward round episodes
//
angular.module('opal.wardround.controllers').controller(
  'WardRoundDetailCtrl', function($rootScope, $scope, $routeParams, $location,
    $cookieStore, $modal, episode, wardroundDetail, $modalStack,
    EpisodeDetailMixin, Flow, options, profile, WardRoundUtils){
      "use strict";

      if(!_.contains(wardroundDetail.episodeIds, episode.id)){
          $location.url("/" + $routeParams.wardround);
          $location.replace();
      }
      var wardRoundUtils = new WardRoundUtils($routeParams.wardround, $location.search());

      $modalStack.dismissAll();
      $scope.episode = episode;

      // this is currently used by some of the actions to figure out if we're in
      // a wardround. Its also used to add the title
      $scope.ward_round = wardroundDetail;
      $scope.options = options;
      $scope.profile = profile;
      $scope.Flow = Flow;
      EpisodeDetailMixin($scope);
      $scope.wardRoundOrderCollapsed = true;
      $scope.episodeNumber = _.indexOf(wardroundDetail.episodeIds, $scope.episode.id);
      $scope.totalEpisodes = wardroundDetail.episodeIds.length;

      $scope.findPatient = function(){
        $rootScope.state = 'modal';

        var modal_opts = {
          backdrop: 'static',
          templateUrl: '/templates/wardround/find_patient.html',
          controller: 'WardRoundFindPatientCtrl',
          size: 'md',
          resolve: {
            wardround: function(WardRoundUtils) {
              var w = new WardRoundUtils($routeParams.wardround, $location.search());
              return w.getSummariesFromIds();
            },
            episode: function(){ return $scope.episode; }
          }
        };

        var modal = $modal.open(modal_opts);
        modal.result.then(function(result) {
          $rootScope.state = 'normal';
        });
      };

      $scope.next = false;

      if($scope.episodeNumber + 1 !== $scope.totalEpisodes){
          $scope.next = wardRoundUtils.getEpisodeLink(wardroundDetail.episodeIds[$scope.episodeNumber + 1]);
      }

      $scope.previous = false;

      if($scope.episodeNumber !== 0){
          $scope.previous = wardRoundUtils.getEpisodeLink(wardroundDetail.episodeIds[$scope.episodeNumber - 1]);
      }
    }
  );
