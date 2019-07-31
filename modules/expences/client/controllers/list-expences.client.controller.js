(function () {
  'use strict';

  angular
    .module('expences')
    .controller('ExpencesListController', ExpencesListController);

  ExpencesListController.$inject = ['ExpencesService'];

  function ExpencesListController(ExpencesService) {
    var vm = this;

    vm.expences = ExpencesService.query();
  }
}());
