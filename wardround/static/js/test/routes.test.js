describe('should configure our routes correctly!', function(){
    "use strict";

    var route;

    beforeEach(function(){
        module('opal.wardround');

        inject(function($route){
            route = $route;
        });
    });

    it('Detail view should resolve data', function(){
        var resolve = route.routes['/:wardround/:id'].resolve;
        var Metadata = {
          load: jasmine.createSpy()
        };

        Metadata.load.and.returnValue({some: 'metadata'});
        var Referencedata = {
          load: jasmine.createSpy()
        };
        Referencedata.load.and.returnValue({some: 'referencedata'});
        var UserProfile = {
          load: jasmine.createSpy()
        };
        UserProfile.load.and.returnValue({some: 'user profile'});
        expect(resolve.metadata(Metadata)).toEqual({some: 'metadata'});
        expect(resolve.referencedata(Referencedata)).toEqual({some: 'referencedata'});
        expect(resolve.profile(UserProfile)).toEqual({some: 'user profile'});
    });
});
