(function () {
  'use strict';

  describe('Expences Route Tests', function () {
    // Initialize global variables
    var $scope,
      ExpencesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ExpencesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ExpencesService = _ExpencesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('expences');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/expences');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ExpencesController,
          mockExpence;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('expences.view');
          $templateCache.put('modules/expences/client/views/view-expence.client.view.html', '');

          // create mock Expence
          mockExpence = new ExpencesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Expence Name'
          });

          // Initialize Controller
          ExpencesController = $controller('ExpencesController as vm', {
            $scope: $scope,
            expenceResolve: mockExpence
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:expenceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.expenceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            expenceId: 1
          })).toEqual('/expences/1');
        }));

        it('should attach an Expence to the controller scope', function () {
          expect($scope.vm.expence._id).toBe(mockExpence._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/expences/client/views/view-expence.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ExpencesController,
          mockExpence;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('expences.create');
          $templateCache.put('modules/expences/client/views/form-expence.client.view.html', '');

          // create mock Expence
          mockExpence = new ExpencesService();

          // Initialize Controller
          ExpencesController = $controller('ExpencesController as vm', {
            $scope: $scope,
            expenceResolve: mockExpence
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.expenceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/expences/create');
        }));

        it('should attach an Expence to the controller scope', function () {
          expect($scope.vm.expence._id).toBe(mockExpence._id);
          expect($scope.vm.expence._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/expences/client/views/form-expence.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ExpencesController,
          mockExpence;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('expences.edit');
          $templateCache.put('modules/expences/client/views/form-expence.client.view.html', '');

          // create mock Expence
          mockExpence = new ExpencesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Expence Name'
          });

          // Initialize Controller
          ExpencesController = $controller('ExpencesController as vm', {
            $scope: $scope,
            expenceResolve: mockExpence
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:expenceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.expenceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            expenceId: 1
          })).toEqual('/expences/1/edit');
        }));

        it('should attach an Expence to the controller scope', function () {
          expect($scope.vm.expence._id).toBe(mockExpence._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/expences/client/views/form-expence.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
