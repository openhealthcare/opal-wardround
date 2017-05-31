//
// Main OPAL Ward round plugin application!
//
var opal = OPAL.module('opal');
var services = OPAL.module('opal.wardround.services', ['opal.services']);

var controllers = OPAL.module('opal.wardround.controllers', ['opal.services']);

var app = OPAL.module('opal.wardround', [
    'ngRoute',
    'ngProgressLite',
    'ngCookies',
    'opal.filters',
    'opal.services',
    'opal.directives',
    'opal.controllers',
    'opal.wardround.controllers',
    'opal.wardround.services'
]);
OPAL.run(app);

app.config(function($routeProvider){
    $routeProvider.when('/', {redirectTo: '/list'})
        .when('/list', {
            controller: 'WardRoundListCtrl',
            resolve: {},
            templateUrl: '/wardround/templates/list.html'
        })
        .when('/:wardround', {
            controller: 'WardRoundCtrl',
            resolve: {
              wardround: function(WardRoundUtils, $route, $location){
                var w = new WardRoundUtils($route.current.params.wardround, $location.search());
                return w.loadWardRound();
              },
            	referencedata: function(Referencedata) { return Referencedata.load(); },
            },
            templateUrl: function(params){
                return '/wardround/templates/' + params.wardround + '/detail.html';
            }
        })
        .when('/:wardround/:id', {
            controller: 'WardRoundDetailCtrl',
            resolve: {
                episode: function(episodeLoader){
                    return episodeLoader();
                },
                wardroundDetail: function(WardRoundUtils, $route, $location){
                    var w = new WardRoundUtils($route.current.params.wardround, $location.search());
                    return w.getWardroundDetail();
                },
            	metadata: function(Metadata) { return Metadata.load(); },
              referencedata: function(Referencedata){ return Referencedata.load(); },
              profile: function(UserProfile){ return UserProfile.load(); }
            },
            templateUrl: function(params){
                return '/wardround/templates/' + params.wardround + '/episode_detail.html';
            }
        });
});
