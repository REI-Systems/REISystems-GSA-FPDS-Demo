(function () {

  angular.module('app')
    .directive('searchContainer', function () {
      return {
        restrict: 'E',
        replace: true,
        template: '<div><div ng-transclude ></div></div>',
        transclude: true,
        link: function (scope, element, attrs, controller) {

        },
        controller: function ($scope) {

          this.getTableResults = function (selectedResult) {
            $scope.results = selectedResult;
            $scope.$broadcast('updateTable');
          }

        }
      };
    });


  angular.module('app')
    .directive('resultsTable', ['SearchService', function (SearchService) {
      return {
        restrict: 'E',
        replace: true,
        require: '^searchContainer',
        templateUrl: 'templates/results-table.html',
        controller: function ($scope) {

          $scope.$on('updateTable', function (e) {
            $scope.updateTable($scope.$parent.results);
          });

          $scope.updateTable = function (results) {
            console.log(results);
          }

          var columns = 'contractactiontype,agencyid,signeddate,contractingofficeagencyid,maj_agency_cat,dollarsobligated,principalnaicscode,psc_cat,vendorname,zipcode,placeofperformancecountrycode,pop_state_code,localareasetaside,fiscal_year,effectivedate,unique_transaction_id,solicitationid,dunsnumber,descriptionofcontractrequirement';

          SearchService.sqlSearch(columns).then(function (data) {

            $scope.source =
            {
              localdata: data.rows,
              datafields: [{ name: 'contractactiontype', map: '0' }, { name: 'agencyid', map: '1' },
                { name: 'signeddate', map: '2' }, { name: 'contractingofficeagencyid', map: '3' }, { name: 'maj_agency_cat', map: '4' },
                { name: 'dollarsobligated', map: '5' }, { name: 'principalnaicscode', map: '6' }, { name: 'psc_cat', map: '7' },
                { name: 'vendorname', map: '8' }, { name: 'zipcode', map: '9' }, { name: 'placeofperformancecountrycode', map: '10' },
                { name: 'pop_state_code', map: '11' }, { name: 'localareasetaside', map: '12' }, { name: 'fiscal_year', map: '13' },
                { name: 'effectivedate', map: '14' }, { name: 'unique_transaction_id', map: '15' }, { name: 'solicitationid', map: '16' },
                { name: 'dunsnumber', map: '17' }, { name: 'descriptionofcontractrequirement', map: '18' }
              ],
              datatype: "array"
            };

            var dataAdapter = new $.jqx.dataAdapter($scope.source);

            jQuery("#jqxgrid").jqxGrid(
              {
                source: dataAdapter,
                selectionmode: 'multiplerowsextended',
                sortable: true,
                pageable: true,
                autoheight: true,
                columnsresize: true,
                columnsreorder: true,
                filterable: true,
                columns: [
                  { datafield: 'contractactiontype', text: 'Contract Type', width: '20%' },
                  { datafield: 'agencyid', text: 'Agency Code', width: '20%' },
                  { datafield: 'signeddate', text: 'Date Signed', width: '20%' },
                  { datafield: 'contractingofficeagencyid', text: 'Contracting Agency ID', width: '20%' },
                  { datafield: 'maj_agency_cat', text: 'Department Full Name', width: '20%' },
                  { datafield: 'dollarsobligated', text: 'Action Obligation ($)', width: '20%' },
                  { datafield: 'principalnaicscode', text: 'NAICS', width: '20%' },
                  { datafield: 'psc_cat', text: 'PSC', width: '20%' },
                  { datafield: 'vendorname', text: 'Vendor State', width: '20%' },
                  { datafield: 'zipcode', text: 'Vendor ZIP Code', width: '20%' },
                  { datafield: 'placeofperformancecountrycode', text: 'PoP Country Name', width: '20%' },
                  { datafield: 'pop_state_code', text: 'PoP State Name', width: '20%' },
                  { datafield: 'localareasetaside', text: 'Local Area Set Aside', width: '20%' },
                  { datafield: 'fiscal_year', text: 'Contract Fiscal Year', width: '20%' }
                ]
              });

          }, function (error) { });

          angular.element(document).ready(function () {
            // document ready
          });

        }
      };
    }]);

  angular.module('app')
    .directive('searchBar', ['SearchService',function (SearchService) {
      return {
        restrict: 'E',
        replace: true,
        require: '^searchContainer',
        templateUrl: 'templates/search-bar.html',
        link: function (scope, element, attrs, controller) {

          angular.element(document).ready(function () {
            $('.ui.search')
              .search({
                apiSettings: {
                  url: 'api/search/category?q={query}'
                },
                type: 'category',
                onSelect: function (result, response) {
                  controller.getTableResults(result);

                  var columns = 'contractactiontype,agencyid,signeddate,contractingofficeagencyid,maj_agency_cat,dollarsobligated,principalnaicscode,psc_cat,vendorname,zipcode,placeofperformancecountrycode,pop_state_code,localareasetaside,fiscal_year,effectivedate,unique_transaction_id,solicitationid,dunsnumber,descriptionofcontractrequirement';

                  var sqlClause = '';
                  
                  if(result.category == 'vendor'){
                    var category = 'vendorname';
                  }else if(result.category == 'agency'){
                    var category = 'maj_agency_cat';
                  }else{
                    var category = 'maj_fund_agency_cat';
                  }
                  
                  sqlClause = 'WHERE ' + category + "=" + "'" + result.title + "'";

                  SearchService.sqlSearchAdvanced(columns, sqlClause).then(function (data) {
                    scope.source.localdata = data.rows;
                    // passing "cells" to the 'updatebounddata' method will refresh only the cells values when the new rows count is equal to the previous rows count.
                    $("#jqxgrid").jqxGrid('updatebounddata', 'cells');

                  },
                    function (error) {

                    });


                }
              });
          });

        }
      };
    }]);


  angular.module('app')
    .directive('advancedSearch', ['SearchService', function (SearchService) {
      return {
        restrict: 'E',
        replace: true,
        require: '^searchContainer',
        templateUrl: 'templates/search-advanced.html',
        link: function (scope, element, attrs, controller) {

          scope.searchDataset = function () {

            var columns = 'contractactiontype,agencyid,signeddate,contractingofficeagencyid,maj_agency_cat,dollarsobligated,principalnaicscode,psc_cat,vendorname,zipcode,placeofperformancecountrycode,pop_state_code,localareasetaside,fiscal_year,effectivedate,unique_transaction_id,solicitationid,dunsnumber,descriptionofcontractrequirement';

            var sqlClause = '';

            angular.forEach(scope.searchFilterForm, function (value, key) {

              if (key[0] === '$') return;

              if (!value.$pristine && value.$modelValue !== '') {
                var str = key + "='" + value.$modelValue + "'";

                sqlClause += (sqlClause !== '') ? ' AND ' + str : 'WHERE ' + str;
              }

            });

            SearchService.sqlSearchAdvanced(columns, sqlClause).then(function (data) {
              scope.source.localdata = data.rows;
              // passing "cells" to the 'updatebounddata' method will refresh only the cells values when the new rows count is equal to the previous rows count.
              $("#jqxgrid").jqxGrid('updatebounddata', 'cells');

            },
              function (error) {

              });
          };

          angular.element(document).ready(function () {
            $('.ui.accordion').accordion();
            $('.ui.dropdown').dropdown();
          });

        }
      };
    }]);


} ());

