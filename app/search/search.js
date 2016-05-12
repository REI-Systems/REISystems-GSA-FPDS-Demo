(function() {
  'use strict';

  angular
    .module('app.search')
    .controller('Search', Search);

  Search.$inject = ['$scope', 'userAuthorization', 'userSession', 'searchService', '$state'];

  function Search($scope, userAuthorization, userSession, searchService, $state) {
    var vm = this;

    vm.numresults = '0';
    vm.updateTableResults = UpdateTableResults;

    userAuthorization.isUserAuthenticated(function() {
      vm.user = userSession.getSession().user;
      if (vm.user.preferences.jqxGridState) {
        $scope.$broadcast('loadTableState', vm.user.preferences.jqxGridState);
      } else {
        vm.user.preferences.jqxGridState = $("#jqxgrid").jqxGrid('savestate');
      }
      for (var columnName in vm.user.preferences.jqxGridState.columns) {
        if (!vm.user.preferences.jqxGridState.columns[columnName].hidden) {
          $('input[type=checkbox][name=' + columnName + ']').parent().checkbox('set checked');
        }
      }
    },
      function() {
        $state.go('search');
      });

    function UpdateTableResults(sqlClause) {
      $scope.$broadcast('updateTable', sqlClause);
    }


  }


})();