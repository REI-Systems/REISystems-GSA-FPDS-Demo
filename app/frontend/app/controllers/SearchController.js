(function() {

  angular.module('app')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$scope', 'AuthProvider', 'SessionFactory', 'SearchService'];

  function SearchController($scope, AuthProvider, SessionFactory, SearchService) {

    var vm = this;

    vm.numresults = '0';
    vm.updateTableResults = UpdateTableResults;

    AuthProvider.isUserAuthenticated(function() {
      vm.user = SessionFactory.getSession().user;
      if (vm.user.preferences.jqxGridState) {
        $scope.$broadcast('loadTableState', vm.user.preferences.jqxGridState);
        for (var columnName in vm.user.preferences.jqxGridState.columns) {
          if (!vm.user.preferences.jqxGridState.columns[columnName].hidden) {
            $('input[type=checkbox][name=' + columnName + ']').parent().checkbox('set checked');
          }
        }
      }
    });

    function UpdateTableResults(sqlClause) {
      $scope.$broadcast('updateTable', sqlClause);
    }

  }

})();