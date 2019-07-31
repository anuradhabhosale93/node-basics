(function () {
  'use strict';

  angular
    .module('expences')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('expences', {
        abstract: true,
        url: '/expences',
        template: '<ui-view/>'
      })
      .state('expences.list', {
        url: '',
        templateUrl: 'modules/expences/client/views/list-expences.client.view.html',
        controller: 'ExpencesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Expences List'
        }
      })
      .state('expences.create', {
        url: '/create',
        templateUrl: 'modules/expences/client/views/form-expence.client.view.html',
        controller: 'ExpencesController',
        controllerAs: 'vm',
        resolve: {
          expenceResolve: newExpence
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Expences Create'
        }
      })
      .state('expences.edit', {
        url: '/:expenceId/edit',
        templateUrl: 'modules/expences/client/views/form-expence.client.view.html',
        controller: 'ExpencesController',
        controllerAs: 'vm',
        resolve: {
          expenceResolve: getExpence
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Expence {{ expenceResolve.name }}'
        }
      })
      .state('expences.view', {
        url: '/:expenceId',
        templateUrl: 'modules/expences/client/views/view-expence.client.view.html',
        controller: 'ExpencesController',
        controllerAs: 'vm',
        resolve: {
          expenceResolve: getExpence
        },
        data: {
          pageTitle: 'Expence {{ expenceResolve.name }}'
        }
      });
  }

  getExpence.$inject = ['$stateParams', 'ExpencesService'];

  function getExpence($stateParams, ExpencesService) {
    return ExpencesService.get({
      expenceId: $stateParams.expenceId
    }).$promise;
  }

  newExpence.$inject = ['ExpencesService'];

  function newExpence(ExpencesService) {
    return new ExpencesService();
  }
}());
