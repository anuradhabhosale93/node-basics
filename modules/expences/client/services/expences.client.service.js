// Expences service used to communicate Expences REST endpoints
(function () {
  'use strict';

  angular
    .module('expences')
    .factory('ExpencesService', ExpencesService);

  ExpencesService.$inject = ['$resource'];

  function ExpencesService($resource) {
    return $resource('api/expences/:expenceId', {
      expenceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
