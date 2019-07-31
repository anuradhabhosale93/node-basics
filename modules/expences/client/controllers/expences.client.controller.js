(function () {
  'use strict';

  // Expences controller
  angular
    .module('expences')
    .controller('ExpencesController', ExpencesController);

  ExpencesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'expenceResolve'];

  function ExpencesController ($scope, $state, $window, Authentication, expence) {
    var vm = this;

    vm.authentication = Authentication;
    vm.expence = expence;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Expence
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.expence.$remove($state.go('expences.list'));
      }
    }

    // Save Expence
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.expenceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.expence._id) {
        vm.expence.$update(successCallback, errorCallback);
      } else {
        vm.expence.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('expences.view', {
          expenceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
