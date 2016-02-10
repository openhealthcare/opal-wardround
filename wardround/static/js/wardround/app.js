//
// Main OPAL Ward round plugin application!
//
var opal = OPAL.module('opal');
var services = OPAL.module('opal.wardround.services', []);

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
            		options: function(Options) { return Options; },
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
            		options: function(Options) { return Options; },
                profile: function(UserProfile){ return UserProfile }
            },
            templateUrl: function(params){
                return '/wardround/templates/' + params.wardround + '/episode_detail.html'
            }
        })
})
