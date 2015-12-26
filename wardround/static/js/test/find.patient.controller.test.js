describe('WardRoundFindPatientCtrl', function (){
    "use strict";

    var $scope, $httpBackend, $modalInstance;
    var $rootScope, episodes, controller;
    var demographics1, demographics2;

    beforeEach(module('opal.wardround'));

    beforeEach(inject(function($injector){
        var $rootScope   = $injector.get('$rootScope');
        var $controller  = $injector.get('$controller');
        var $modal       = $injector.get('$modal');
        $scope       = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');

        $modalInstance = $modal.open({template: 'Not a real template'});
        demographics1 = {name: 'Amy Andrews', hospital_number: '1111', id: 1};
        demographics2 = {name: 'Brenda Benson', hospital_number: '2222', id: 2};
        var wardround = {episodes: [demographics1, demographics2]};

        controller = $controller('WardRoundFindPatientCtrl', {
            $scope        : $scope,
            $modalInstance: $modalInstance,
            wardround      : wardround,
            episode: demographics1
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('get_filtered_episodes()', function (){

        it('Should allow all episodes when the query is ""', function () {
            $scope.$digest();
            expect($scope.filter.query).toBe("");
            expect($scope.episodes).toEqual([demographics1, demographics2]);
        });

        it('Should filter on hospital number', function () {
            $scope.filter.query = '1111';
            $scope.$digest();
            expect($scope.episodes).toEqual([demographics1]);
        });

        it('Should filter on name', function () {
            $scope.filter.query = 'Benson';
            $scope.$digest();
            expect($scope.episodes).toEqual([demographics2]);
        });

        it('Should filter on name case insensitively', function () {
            $scope.filter.query = 'benson';
            $scope.$digest();
            expect($scope.episodes).toEqual([demographics2]);
        });

        // todo discuss with David
        // it('Should filter out episodes without demographics', function () {
        //     $scope.$digest();
        //     $scope.episodes.push({});
        //     $scope.$digest();
        //     expect($scope.episodes).toEqual([demographics1, demographics2]);
        // });
    });

});
