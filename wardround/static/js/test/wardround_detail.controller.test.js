describe('WardRoundDetailCtrl', function(){
    "use strict";

    var $scope, $modal, $httpBackend, $location;
    var $rootScope, $q, $controller;
    var Flow, Episode, episode;
    var controller;

    var profile = {
        readonly   : false,
        can_extract: true,
        can_see_pid: function(){return true; }
    };

    var metadata = {
        tag_slugs: {tropical: 'tropical', id_inpatients: 'id-inpatients'}

    };
    var referencedata = {
        condition: ['Another condition', 'Some condition'],
    }

    var episodeData = {
        id: 123,
        active: true,
        prev_episodes: [],
        next_episodes: [],
        demographics: [{
            id: 101,
            patient_id: 99,
            name: 'John Smith',
            date_of_birth: '1980-07-31',
            hospital_number: '555-333'
        }],
        tagging: [{'mine': true, 'tropical': true}],
        location: [{
            category: 'Inepisode',
            hospital: 'UCH',
            ward: 'T10',
            bed: '15',
            date_of_admission: '2013-08-01',
        }],
        diagnosis: [{
            id: 102,
            condition: 'Dengue',
            provisional: true,
        }, {
            id: 103,
            condition: 'Malaria',
            provisional: false,
        }]
    };

    var columns = {
        "default": [
            {
                name: 'demographics',
                single: true,
                fields: [
                    {name: 'name', type: 'string'},
                    {name: 'date_of_birth', type: 'date'},
                ]},
            {
                name: 'location',
                single: true,
                fields: [
                    {name: 'category', type: 'string'},
                    {name: 'hospital', type: 'string'},
                    {name: 'ward', type: 'string'},
                    {name: 'bed', type: 'string'},
                    {name: 'date_of_admission', type: 'date'},
                    {name: 'tags', type: 'list'},
                ]},
            {
                name: 'diagnosis',
                single: false,
                fields: [
                    {name: 'condition', type: 'string'},
                    {name: 'provisional', type: 'boolean'},
                ]},
        ]
    };
    var fields = {}
    _.each(columns.default, function(c){
        fields[c.name] = c;
    });

    beforeEach(function(){
        module('opal.wardround');
        inject(function($injector){
            $rootScope   = $injector.get('$rootScope');
            $scope       = $rootScope.$new();
            $q           = $injector.get('$q');
            $controller  = $injector.get('$controller');
            $modal       = $injector.get('$modal');
            $httpBackend = $injector.get('$httpBackend');
            $location    = $injector.get('$location');
            Episode      = $injector.get('Episode');
        });

        $rootScope.fields = fields
        episode = new Episode(angular.copy(episodeData));
        Flow = {
            enter: jasmine.createSpy('Flow.enter').and.callFake(function(){
                return {then: function(fn){ fn() }}}),
            exit: jasmine.createSpy('Flow.exit').and.callFake(function(){
                return {then: function(fn){ fn() }}}),
        };

        controller = $controller('WardRoundDetailCtrl', {
            $scope         : $scope,
            $modal         : $modal,
            Flow           : Flow,
            episode        : episode,
            wardroundDetail: {episodeIds: [123]},
            metadata       : metadata,
            referencedata  : referencedata,
            profile        : profile
        });
    });

    describe('initialization', function(){

        it('should set up state', function(){
            $httpBackend.expectGET('/wardround/templates/list.html').respond('notarealtemplate');
            expect($scope.episode).toEqual(episode);
        });
    });

    describe('discharging an episode', function(){

        beforeEach(function(){
            $httpBackend.expectGET('/wardround/templates/list.html').respond('notarealtemplate');
        });

        it('should call the exit flow', function(){

            $scope.dischargeEpisode();
            expect(Flow.exit).toHaveBeenCalledWith(
                $scope.episode,
                {
                    current_tags: {
                        tag   : undefined,
                        subtag: undefined
                    },
                }
            );
            $rootScope.$apply();
            $httpBackend.flush();
        });

        describe('for a readonly user', function(){
            beforeEach(function(){
                profile.readonly = true;
            });

            it('should return null', function(){
                expect($scope.dischargeEpisode()).toBe(null);
            });

            afterEach(function(){
                profile.readonly = false;
            });
        });
    });

    describe('addEpisode()', function() {

        describe('success!', function() {

            beforeEach(function(){
                Flow = {enter: jasmine.createSpy('Flow.enter').and.callFake(function(){
                    return {then: function(success, err){ success(episodeData) }}}) };

                controller = $controller('WardRoundDetailCtrl', {
                    $scope         : $scope,
                    $modal         : $modal,
                    $location      : $location,
                    Flow           : Flow,
                    episode        : episode,
                    wardroundDetail: {episodeIds: [123]},
                    metadata       : metadata,
                    referencedata  : referencedata,
                    profile        : profile
                });
            });

            it('should go to the episde', function() {
                spyOn($location, 'path');
                $scope.addEpisode();
                expect(Flow.enter).toHaveBeenCalledWith(
                    {
                        current_tags: {
                            tag   : 'mine',
                            subtag: ''
                        },
                        hospital_number: '555-333'
                    }
                );
                expect($location.path).toHaveBeenCalledWith('/episode/123');
            });
        });

        describe('failure!', function() {

            beforeEach(function(){
                Flow = {enter: jasmine.createSpy('Flow.enter').and.callFake(function(){
                    return {then: function(success, err){ err(episodeData); }}}) };

                controller = $controller('WardRoundDetailCtrl', {
                    $scope         : $scope,
                    $modal         : $modal,
                    Flow           : Flow,
                    episode        : episode,
                    wardroundDetail: {episodeIds: [123]},
                    metadata       : metadata,
                    referencedata  : referencedata,
                    profile        : profile
                });
            });

            it('should reset state if cancelled', function() {
                $httpBackend.expectGET('/wardround/templates/list.html').respond('notarealtemplate');

                $scope.addEpisode();
                expect(Flow.enter).toHaveBeenCalledWith(
                    {
                        current_tags: {
                            tag   : 'mine',
                            subtag: ''
                        },
                        hospital_number: '555-333'

                    }
                );
                $rootScope.$apply();
                $httpBackend.flush();
                expect($scope.state).toEqual('normal');
            });

        });

    });

    describe('jumpToTag()', function() {

        it('should go to the tag', function() {
            spyOn($location, 'path');
            $scope.jumpToTag('id_inpatients');
            expect($location.path).toHaveBeenCalledWith('id-inpatients');
        });

    });

});
