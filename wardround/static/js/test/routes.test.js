describe('should configure our routes correctly!', function(){
    "use strict";

    var route



    beforeEach(function(){
        module('opal.wardround');

        inject(function($route){
            route = $route;
        });
    });

    it('Detail view should resolve data', function(){
        var resolve = route.routes['/:wardround/:id'].resolve
        expect(resolve.metadata()).toBe(undefined);
        expect(resolve.referencedata()).toBe(undefined);
    })

});
