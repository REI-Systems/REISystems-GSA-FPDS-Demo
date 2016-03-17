(function() {
  'use strict';

  angular
    .module('app.search')
    .directive('resultsTable', resultsTable);

  resultsTable.$inject = ['searchService', 'ColumnsValue', 'apiService', '$timeout'];

  function resultsTable(searchService, ColumnsValue, apiService, $timeout) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div id="jqxWidget"><div id="jqxgrid"></div></div>',
      link: function(scope, element, attrs, controller) {
        angular.element(document).ready(function() {

          // Initialize tabs
          $('.pointing.secondary.menu .item').tab();

          // Save State
          $("#jqxgrid").on('columnreordered', function(event) {
            var state = $("#jqxgrid").jqxGrid('savestate');
            scope.saveGridState(state);
          });

          $('.message .close')
            .on('click', function() {
              $(this)
                .closest('.message')
                .transition('fade')
                ;
            })
            ;

          // On row select populate tabs
          $("#jqxgrid").on("rowselect", function(event) {
            scope.$apply(function() {
              scope.row = event.args.row;
            });
          });

          // Temp
          $('.list .master.checkbox')
            .checkbox({
              // check all children
              onChecked: function() {
                var
                  $childCheckbox = $(this).closest('.checkbox').siblings('.grid').find('.checkbox')
                  ;
                $childCheckbox.checkbox('check');
              },
              // uncheck all children
              onUnchecked: function() {
                var
                  $childCheckbox = $(this).closest('.checkbox').siblings('.grid').find('.checkbox')
                  ;
                $childCheckbox.checkbox('uncheck');
              }
            })
            ;

          $('.list .child.checkbox')
            .checkbox({
              // Fire on load to set parent value
              fireOnInit: true,
              // Change parent state on each child checkbox change
              onChange: function() {
                var
                  $listGroup = $(this).closest('.grid'),
                  $parentCheckbox = $listGroup.closest('.item').children('.checkbox'),
                  $checkbox = $listGroup.find('.checkbox'),
                  allChecked = true,
                  allUnchecked = true
                  ;
                // check to see if all other siblings are checked or unchecked
                $checkbox.each(function() {
                  if ($(this).checkbox('is checked')) {
                    allUnchecked = false;
                  }
                  else {
                    allChecked = false;
                  }
                });
                // set parent checkbox state, but dont trigger its onChange callback
                if (allChecked) {
                  $parentCheckbox.checkbox('set checked');
                }
                else if (allUnchecked) {
                  $parentCheckbox.checkbox('set unchecked');
                }
                else {
                  $parentCheckbox.checkbox('set indeterminate');
                }
                scope.saveGridState($("#jqxgrid").jqxGrid('savestate'));
              },
              onChecked: function() {
                $("#jqxgrid").jqxGrid('showcolumn', this.name);
                //scope.saveGridState($("#jqxgrid").jqxGrid('savestate'));
              },
              onUnchecked: function() {
                $("#jqxgrid").jqxGrid('hidecolumn', this.name);
                //scope.saveGridState($("#jqxgrid").jqxGrid('savestate'));
              }
            })
            ;


        });
      },
      controller: function($scope) {

        $scope.$on('updateTable', function(element, sqlClause) {
          $('#jqxgrid').jqxGrid('showloadelement');

          $scope.source.url = '/api/search/query?sql=SELECT ' + ColumnsValue + ' FROM contract ' + sqlClause;
          $("#jqxgrid").jqxGrid({ source: $scope.source });

        });

        $("#jqxgrid").on('bindingcomplete', function() {
          var datainformation = $('#jqxgrid').jqxGrid('getdatainformation');
          var rowscount = datainformation.rowscount;
          $timeout(function() {
            $scope.vm.numresults = rowscount;
          });
        });

        $scope.$on('loadTableState', function(element, preferences) {
          $("#jqxgrid").jqxGrid('loadstate', preferences);
        });

        $scope.createTable = function(data) {

          $scope.source =
            {
              url: '',
              datafields: [{ name: 'contractactiontype', map: '0' }, { name: 'agencyid', map: '1' },
                { name: 'signeddate', map: '2' }, { name: 'contractingofficeagencyid', map: '3' }, { name: 'maj_agency_cat', map: '4' },
                { name: 'dollarsobligated', map: '5' }, { name: 'principalnaicscode', map: '6' }, { name: 'psc_cat', map: '7' },
                { name: 'vendorname', map: '8' }, { name: 'zipcode', map: '9' }, { name: 'placeofperformancecountrycode', map: '10' },
                { name: 'pop_state_code', map: '11' }, { name: 'localareasetaside', map: '12' }, { name: 'fiscal_year', map: '13' },
                { name: 'effectivedate', map: '14' }, { name: 'unique_transaction_id', map: '15' }, { name: 'solicitationid', map: '16' },
                { name: 'dunsnumber', map: '17' }, { name: 'descriptionofcontractrequirement', map: '18' }
              ],
              datatype: "json",
              root: "rows"
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
        $scope.saveGridState = function(state) {
          //console.log($scope);
          //console.log($scope.vm.user.preferences);
          $scope.vm.user.preferences.jqxGridState = state;

          /**
           * SAVE jqxGris State in user preferences
           */

          var oAPI = {
            'name': 'userUpdate',
            'suffix': $scope.vm.user.id
          };

          var oParams = {
            'preferences': {
              'typeDashboard': $scope.vm.user.preferences.typeDashboard,
              'jqxGridState': state
            }
          };

          //update user
          apiService.call(oAPI.name, oAPI.suffix, {}, oParams, 'POST').then(
            function(data) {
              $scope.flash = {
                "type": "positive",
                "message": "User preferences are saved !"
              };
            },
            function(error) {
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
  }

})();