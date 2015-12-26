describe('WardRoundUtils', function (){
    "use strict";
    var WardRoundUtils, $httpBackend, $rootScope, localStorageService, wardroundUtils, fakeWardroundCacheObject;

    beforeEach(module('opal.wardround.services'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        WardRoundUtils = $injector.get('WardRoundUtils');
        localStorageService = $injector.get('localStorageService');
        wardroundUtils = new WardRoundUtils("testWardround", {consultant: "someone"});
        fakeWardroundCacheObject = {
            wardround: "testWardround",
            lastSet: moment().format(),
            params: {consultant: "someone"},
            episodeIds: [1]
        };
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("loadWardRound", function(){
      /*
      loads a wardround using wardround and location.search
      gives the output links
      */
      it('Should load in wardround and cast them', function () {
          $httpBackend.expectGET('/wardround/testWardround?consultant=someone').respond({
            episodes: [{id: 1}],
          });
          var promise = wardroundUtils.loadWardRound();
          promise.then(function(r){
            expect(r).toEqual({
              episodes: [{
                id: 1,
                link: '/wardround/#/testWardround/1?consultant=someone'
              }]
            });
          });
          $httpBackend.flush();
      });
    });

    describe("getEpisodesIds from server", function(){
      beforeEach(inject(function ($injector) {
        $httpBackend.expectGET('/wardround/testWardround?consultant=someone').respond({
          episodes: [{id: 1}],
        });

        spyOn(localStorageService, "set");
      }));

      afterEach(function(){
        var episodeIdsPromise = wardroundUtils.getEpisodesIds();
        episodeIdsPromise.then(function(r){
          expect(r).toEqual([1]);
        });
        $httpBackend.flush();
        expect(localStorageService.get).toHaveBeenCalled();
        var callArgs = localStorageService.set.calls.allArgs();
        expect(callArgs.length).toEqual(1);

        // we expect the wardround key in local storage to be wardround
        expect(callArgs[0][0]).toEqual("wardround");

        // we expect
        expect(callArgs[0][1].wardround).toEqual("testWardround");
        expect(callArgs[0][1].params).toEqual({consultant: "someone"});
        expect(moment(callArgs[0][1].lastSet).isValid()).toEqual(true);
      });

      it('should load from the server and store if there is no cache', function(){
        spyOn(localStorageService, "get").and.returnValue(null);
      });

      it('should load from the server if the cache is old', function(){
        fakeWardroundCacheObject.lastSet = moment().subtract(1, "days").format();
        spyOn(localStorageService, "get").and.returnValue(fakeWardroundCacheObject);
      });
      //
      it('should load from the server if the cache is a different wardround', function(){
        fakeWardroundCacheObject.wardround = "other wardround";
        spyOn(localStorageService, "get").and.returnValue(fakeWardroundCacheObject);
      });

      it('should load from the server if the cache is using different get params', function(){
        fakeWardroundCacheObject.params = {consultant: "other"};
        spyOn(localStorageService, "get").and.returnValue(fakeWardroundCacheObject);
      });
    });

    describe('local storage not supported', function(){
      fit('should handle the case when local storage is not supported', function(){
        $httpBackend.expectGET('/wardround/testWardround?consultant=someone').respond({
          episodes: [{id: 1}],
        });
        spyOn(localStorageService, "get");
        spyOn(localStorageService, "set");
        localStorageService.isSupported = false;
        var episodeIdsPromise = wardroundUtils.getEpisodesIds();
        $httpBackend.flush();
        expect(localStorageService.get.calls.any()).toEqual(false);
        expect(localStorageService.set.calls.any()).toEqual(false);
        episodeIdsPromise.then(function(r){
          expect(r).toEqual([1]);
        });
      });
    });

    describe('cache is populated', function(){
      it('should return the values from cache if the cache is supported', function(){
        spyOn(localStorageService, "get").and.returnValue(fakeWardroundCacheObject);
        var episodeIdsPromise = wardroundUtils.getEpisodesIds();
        episodeIdsPromise.then(function(r){
          expect(r).toEqual([1]);
        });
      });
    });
});
