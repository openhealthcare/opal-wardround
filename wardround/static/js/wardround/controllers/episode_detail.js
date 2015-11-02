//
// Editing/detail page for ward round episodes
//
angular.module('opal.wardround.controllers').controller(
   'WardRoundDetailCtrl', function($rootScope, $scope, $routeParams, $location,
                                   $cookieStore, $modal,
                                   EpisodeDetailMixin, Flow,
                                   options, profile, ward_round_episode_loader){

      $scope.ward_round = ward_round;
      $scope.episode = ward_round_episode_loader.episodes[0];
      $scope.episode_id = $scope.episode.id;
      $scope.options = options;
      $scope.profile = profile;
      $scope.Flow = Flow;
      EpisodeDetailMixin($scope);
      $scope.wardRoundOrderCollapsed = true;
      $scope.total_episodes = ward_round_episode_loader.total_count;
      $scope.this_episode_number = ward_round_episode_loader.index;

      var getUrl = function(){
          var url = '/wardround/'+$routeParams.wardround;
          var param = {};
          if($routeParams.filter_arg){
              url = url + "/" + $routeParams.filter_arg;
          }
      };

      var getUrlFromIndex = function(index){
          var url = getUrl();
          return url + '/' + index;
      }

      if($routeParams.index){
          var url = '/wardround/'+$routeParams.wardround;
          var param = {};
          if($routeParams.filter_arg){
              url = url + "/" + $routeParams.filter_arg;
          }
          url = url + "/episodes/?" + $.params({episode_id: $scope.episode_id});
      }

      $scope.jumpToEpisode = function(e){
         $location.path($routeParams.wardround + '/' + e.id);
      };

      $scope.next = function(){
         $scope.jumpToEpisode($scope.results[$scope.this_episode_number + 1]);
      };

      $scope.previous = function(){
         $scope.jumpToEpisode($scope.results[$scope.this_episode_number - 1]);
      };

      $scope.named_controller = function(template, controller){
         $modal.open({
             templateUrl: template,
             controller: controller,
             resolve: {
                 episode: function(){ return $scope.episode },
                 tags: function(){ return {}  },
                 schema: function(){ return {} },
                 options: function(){ return options }
             }
         });
      }
    }
);
