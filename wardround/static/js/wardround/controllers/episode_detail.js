// 
// Editing/detail page for ward round episodes
//
angular.module('opal.wardround.controllers').controller(
   'WardRoundDetailCtrl', function($rootScope, $scope, $routeParams, $location,
                                   EpisodeDetailMixin,
                                   schema,
                                   ward_round, options, profile){

       $scope.ward_round = ward_round;
       $scope.results = ward_round.episodes;
       $scope.limit = ward_round.episodes.length;
       $scope.episode_id = $routeParams.episode_id;
       $scope.episode = _.findWhere($scope.ward_round.episodes, {id: parseInt($scope.episode_id)});
       
       $scope.options = options;
       $scope.profile = profile;

       EpisodeDetailMixin($scope);

       $scope.total_episodes = ward_round.episodes.length;
       $scope.this_episode_number = _.indexOf(_.pluck(ward_round.episodes, 'id'), parseInt($scope.episode_id));
       $scope.wardRoundOrderCollapsed = true;
       
       $scope.jumpToEpisode = function(e){
           $location.path($routeParams.wardround + '/' + e.id);
       };

       $scope.next = function(){
           $scope.jumpToEpisode($scope.results[$scope.this_episode_number + 1]);
       };

       $scope.previous = function(){
           $scope.jumpToEpisode($scope.results[$scope.this_episode_number - 1]);
       };
   }
);
