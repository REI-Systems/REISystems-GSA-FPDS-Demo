(function () {

  angular.module('app')
    .directive('searchContainer', ['SessionFactory', 'AuthProvider', function (SessionFactory, AuthProvider) {
      return {
        restrict: 'E',
        replace: true,
        template: '<div><div ng-transclude ></div></div>',
        transclude: true,
        controller: function ($scope) {

          AuthProvider.isUserAuthenticated(function () {
            $scope.user = SessionFactory.getSession().user;
            if ($scope.user.preferences.jqxGridState) {
              $scope.$broadcast('loadTableState', $scope.user.preferences.jqxGridState);
            }
          });

          this.updateTableResults = function (sqlClause) {
            $scope.$broadcast('updateTable', sqlClause);
          }

        }
      };
    }]);


  angular.module('app')
    .directive('resultsTable', ['SearchService', 'ColumnsValue', 'ApiService', function (SearchService, ColumnsValue, ApiService) {
      return {
        restrict: 'E',
        replace: true,
        require: '^searchContainer',
        templateUrl: 'templates/results-table.html',
        link: function (scope, element, attrs, controller) {
          angular.element(document).ready(function () {
            
            //on column reorder, save state in user database
            $("#jqxgrid").on('columnreordered', function (event) {
              var state = $("#jqxgrid").jqxGrid('savestate');
              scope.saveGridState(state);
            });

          });
        },
        controller: function ($scope) {

          $scope.$on('updateTable', function (element, sqlClause) {
            $('#jqxgrid').jqxGrid('showloadelement');
            SearchService.sqlSearchAdvanced(ColumnsValue, sqlClause).then(function (data) {
              $scope.source.localdata = data.rows;
              $("#jqxgrid").jqxGrid('updatebounddata', 'data');
              $('#jqxgrid').jqxGrid('hideloadelement');
            }, function (error) { });
          });


          $scope.$on('loadTableState', function (element, preferences) {
            $("#jqxgrid").jqxGrid('loadstate', preferences);
          });

          $scope.createTable = function (data) {

            $scope.source =
            {
              localdata: data,
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
                width: '100%',
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
          }

          $scope.createTable();
          
          
          //save jqxGrid state in user preferences
          $scope.saveGridState = function (state) {
            
            $scope.$parent.user.preferences.jqxGridState = state;
            
            /**
             * SAVE jqxGris State in user preferences
             */

            var oAPI = {
              'name': 'userUpdate',
              'suffix': $scope.$parent.user.id
            };

            var oParams = {
              'preferences': {
                'typeDashboard': $scope.$parent.user.preferences.typeDashboard,
                'jqxGridState': state
              }
            };

            //update user
            ApiService.call(oAPI.name, oAPI.suffix, {}, oParams, 'POST').then(
              function (data) {
                $scope.flash = {
                  "type": "positive",
                  "message": "User preferences are saved !"
                };
              },
              function (error) {
                console.log(error);
                $scope.flash = {
                  "type": "negative",
                  "message": "There was an error with saving User preferences, Please try again !"
                };
              }
              );
          }

        }
      };
    }]);

  angular.module('app')
    .directive('searchBar', function () {
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
                  var sqlClause = 'WHERE ' + result.column + "=" + "'" + result.title + "'";
                  controller.updateTableResults(sqlClause);
                }
              });
          });
        }
      };
    });


  angular.module('app')
    .directive('advancedSearch', function () {
      return {
        restrict: 'E',
        replace: true,
        require: '^searchContainer',
        templateUrl: 'templates/search-advanced.html',
        link: function (scope, element, attrs, controller) {

          scope.searchDataset = function () {

            var sqlClause = '';

            angular.forEach(scope.searchFilterForm, function (value, key) {
              if (key[0] === '$') return;
              if (!value.$pristine && value.$modelValue !== '') {
                var str = key + "='" + value.$modelValue + "'";
                sqlClause += (sqlClause !== '') ? ' AND ' + str : 'WHERE ' + str;
              }
            });

            controller.updateTableResults(sqlClause);

          };

          angular.element(document).ready(function () {
            $('.ui.accordion').accordion();
            $('.ui.dropdown').dropdown();
          });

        }
      };
    });


} ());

