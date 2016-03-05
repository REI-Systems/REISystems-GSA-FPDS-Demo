(function () {

  angular.module('app')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$scope', 'AuthProvider', 'SessionFactory', 'SearchService'];

  function SearchController($scope, AuthProvider, SessionFactory, SearchService) {

    var vm = this;

    vm.numresults = '0';
    vm.updateTableResults = UpdateTableResults;

    AuthProvider.isUserAuthenticated(function () {
      vm.user = SessionFactory.getSession().user;
      if (vm.user.preferences.jqxGridState) {
        $scope.$broadcast('loadTableState', vm.user.preferences.jqxGridState);
      }
    });

    function UpdateTableResults(sqlClause) {
      $scope.$broadcast('updateTable', sqlClause);
    }
    
    //populate filter fields
    var aFilterCol = ['contractactiontype', 'agencyid', 'contractingofficeagencyid',
      'maj_agency_cat', 'psc_cat', 'vendorname',
      'pop_state_code', 'localareasetaside'];

    var aResultFilterCol = {};

    SearchService.getFieldsFacet(aFilterCol)
      .then(function (response) {

        angular.forEach(response, function (content) {

          if (content.data && !content.data.error) {

            var key = content.data.cols[0];

            angular.forEach(content.data.rows, function (row) {

              if (aResultFilterCol.hasOwnProperty(key)) {
                aResultFilterCol[key].push(row[0]);
              } else {
                aResultFilterCol[key] = [];
              }

            });
          }
        });

        vm.filters = {
          agencies: aResultFilterCol.agencyid,
          contractTypes: aResultFilterCol.contractactiontype,
          contractingAgencies: aResultFilterCol.contractingofficeagencyid,
          localAreas: aResultFilterCol.localareasetaside,
          department: aResultFilterCol.maj_agency_cat,
          popStates: aResultFilterCol.pop_state_code,
          psc: aResultFilterCol.psc_cat,
          vendorname: aResultFilterCol.vendorname
        };
        
      });

  }

})();