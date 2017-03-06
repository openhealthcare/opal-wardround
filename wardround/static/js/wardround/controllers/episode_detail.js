//
// Editing/detail page for ward round episodes
//
angular.module('opal.wardround.controllers').controller(
    'WardRoundDetailCtrl', function($rootScope, $scope, $routeParams, $location,
                                    $modal, episode, wardroundDetail, $modalStack,
                                    Flow, metadata, referencedata, profile, WardRoundUtils){
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
        $scope.ward_round    = wardroundDetail;
        $scope.metadata      = metadata;
        $scope.referencedata = referencedata;
        $scope.profile       = profile;
        $scope.Flow          = Flow;

        $scope.wardRoundOrderCollapsed = true;
        $scope.episodeNumber = _.indexOf(wardroundDetail.episodeIds, $scope.episode.id);
        $scope.totalEpisodes = wardroundDetail.episodeIds.length;

        $scope.findPatient = function(){
            $rootScope.state = 'modal';

            var modal_opts = {
                backdrop: 'static',
                templateUrl: '/templates/wardround/find_patient.html',
                controller: 'WardRoundFindPatientCtrl',
                size: 'lg',
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
        };

	$scope.dischargeEpisode = function() {
            if(profile.readonly){ return null; };

	    $rootScope.state = 'modal';
            var exit = Flow.exit(
                $scope.episode,
                {
                    current_tags: {
                        tag   : $scope.currentTag,
                        subtag: $scope.currentSubTag
                    },
                }
            );

            exit.then(function(result) {
		$rootScope.state = 'normal';
	    });
	};

        $scope.addEpisode = function(){
            if(profile.readonly){ return null; };

            var enter = Flow.enter(
                {
                    current_tags: { tag: 'mine', subtag: '' },
                    hospital_number: $scope.episode.demographics[0].hospital_number
                }
            );

	    $rootScope.state = 'modal';

            enter.then(
                function(episode) {
		    // User has either retrieved an existing episode or created a new one,
		    // or has cancelled the process at some point.
		    //
		    // This ensures that the relevant episode is added to the table and
		    // selected.
		    $rootScope.state = 'normal';
                    if(episode){
                        $location.path('/episode/' + episode.id);
                    }
	        },
                function(reason){
                    // The modal has been dismissed. We just need to re-set in order
                    // to re-enable keybard listeners.
                    $rootScope.state = 'normal';
                });
        },


        $scope.jumpToTag = function(tag){
            $location.path(metadata.tag_slugs[tag]);
        };


    }
);
