describe('WardRoundCtrl', function (){
    "use strict";

    var $rootScope, $scope, $controller, $location, WardRoundUtils;

    var fakeWardRoundUtils = function(){
        this.cleanLocalStorage = function(){};
    }

    var createController = function(wardround, referencedata){
        if(!referencedata){
            referencedata = { toLookuplists: function(){return {}}};
        }
        return $controller('WardRoundCtrl', {
            $scope         : $scope,
            $location      : $location,
            $routeParams   : {wardround: "test"},
            WardRoundUtils : fakeWardRoundUtils,
            referencedata  : referencedata,
            wardround      : wardround
        });
    };

    beforeEach(module('opal.wardround.services'));
    beforeEach(module('opal.wardround.controllers'));

    beforeEach(function(){
      inject(function($injector){
        $rootScope   = $injector.get('$rootScope');
        $scope       = $rootScope.$new();
        $controller  = $injector.get('$controller');
        $location  = $injector.get('$location');
      });
    });

    describe("autostart redirection", function(){
      beforeEach(function(){
        spyOn($location, "path");
        spyOn($location, "replace");
      });

      it("should redirect if the wardround is autostart and there are episodes", function(){
          var wardround = {
              auto_start: true,
              episodes: [{id: 100}]
          };

          var controller = createController(wardround);
          expect($location.path).toHaveBeenCalledWith("test/100");
          expect($location.replace).toHaveBeenCalled();
      });

      it("should not redirect if there are no episodes", function(){
        var wardround = {
            auto_start: true,
            episodes: []
        };

        var controller = createController(wardround);
        expect($location.path.calls.any()).toEqual(false);
        expect($location.replace.calls.any()).toEqual(false);
      });
      it("should not redirect if there it is not auto start", function(){
        var wardround = {
            auto_start: false,
            episodes: [{id: 100}]
        };

        var controller = createController(wardround);
        expect($location.path.calls.any()).toEqual(false);
        expect($location.replace.calls.any()).toEqual(false);
      });
   });
});
