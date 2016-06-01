(function() {
  'use strict';

  angular
    .module('app.search')
    .controller('Search', Search);

  Search.$inject = ['$scope', 'userAuthorization', 'userSession', 'searchService', '$state', '$stateParams', '$timeout'];

  function Search($scope, userAuthorization, userSession, searchService, $state, $stateParams, $timeout) {

    console.log("ON THE SEARCH CONTROLLER");
    var vm = this;
    vm.searchLoading = false;
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

    if($stateParams.hasOwnProperty('result') && typeof $stateParams.result !== 'undefined') {
      var result = JSON.parse(decodeURIComponent($stateParams.result));

      var sqlClause = 'WHERE ' + result.column + "=" + "'" + result.piid + "'" + 'AND ' + result.mod + "=" + "'" + result.M + "'";
      if (result.title !== '&nbsp;') {
        sqlClause = 'WHERE idvpiid = ' + "'" + result.title + "'";
      }

      $timeout(function(){
        UpdateTableResults(sqlClause);
      }, 2000);
    }
  }


})();