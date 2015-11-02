//
// Main OPAL Ward round plugin application!
//
var opal = OPAL.module('opal');
var services = OPAL.module('opal.wardround.services', []);

var controllers = OPAL.module('opal.wardround.controllers', [
    'opal.services',
    'opal.wardround.services'
]);

var app = OPAL.module('opal.wardround', [
    'ngRoute',
    'ngProgressLite',
    'ngCookies',
    'opal.filters',
    'opal.services',
    'opal.directives',
    'opal.controllers',
    'opal.wardround.controllers'
]);
OPAL.run(app);

app.config(function($routeProvider){

    var episodeListView = {
        controller: 'WardRoundCtrl',
        resolve: {
            ward_round: function(WardRoundLoader){ return WardRoundLoader(); },
            options: function(Options) { return Options; },
        },
        templateUrl: function(params){
            return '/wardround/templates/' + params.wardround + '/detail.html';
        }
    };

    var episodeDetailView = {
        controller: 'WardRoundDetailCtrl',
        resolve: {
            ward_round_episode_loader: function(WardRoundEpisodesLoader){
                return WardRoundEpisodesLoader();
            },
            options: function(Options) { return Options; },
            profile: function(UserProfile){ return UserProfile; }

        },
        templateUrl: function(params){
            return '/wardround/templates/' + params.wardround + '/episode_detail.html';
        }
    };

    $routeProvider.when('/', {redirectTo: '/list'})
        .when('/list', {
            controller: 'WardRoundListCtrl',
            resolve: {},
            templateUrl: '/wardround/templates/list.html'
        })
        .when('/:wardround/:filter_arg?', episodeListView)
        .when('/:wardround/:filter_arg?/episode/:index?', episodeDetailView)
});
