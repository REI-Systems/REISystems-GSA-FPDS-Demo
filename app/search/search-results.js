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
      template: '<div id="jqxWidget"><div style="float: right;">Export: <input style="margin-right: 5px;" type="button" id="csvExport" value="CSV"><input type="button" id="pdfExport" value="PDF"></div><div class="ui accordion field"><div class="title"><i class="icon dropdown"></i> Show/Hide Columns</div><div class="content"><div style="float: left;" id="jqxlistbox"></div></div></div><div id="jqxgrid"></div></div>',
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


            console.log('/api/search/query?sql=SELECT ' + ColumnsValue + ' FROM contract ' + sqlClause)

            var oAPI = {
              "name": "search",
              "suffix": "",
              "method": "GET",
              "oData": {},
              "oParams": {
                "sql": "SELECT SUM(dollarsobligated) FROM contract " + sqlClause 
              }
            };


            //call SUM Api 
            apiService.call(oAPI.name, oAPI.suffix, oAPI.oParams, oAPI.oData, oAPI.method).then(
              function(data) {
                console.log(data)
                if(data.hasOwnProperty('rows') && data.rows.length > 0) {
                  $scope.totalDollarsObligated = data.rows[0].toString();
                }
              },
              function(error) {
                console.log(error);
                
              }
            );

            var oAPIChart = {
                "name": "search",
                "suffix": "",
                "method": "GET",
                "oData": {},
                "oParams": {
                    "sql": "SELECT agencyid, SUM(dollarsobligated) FROM contract " + sqlClause + " GROUP BY agencyid"
                }
            };

            //call SUM group by agencyid Api
            apiService.call(oAPIChart.name, oAPIChart.suffix, oAPIChart.oParams, oAPIChart.oData, oAPIChart.method).then(
                function(data) {
                    console.log(data)
                    if(data.hasOwnProperty('rows') && data.rows.length > 0) {
                        console.log(data);
                        $scope.oChartData = {
                            xAxis: [],
                            yAxis: []
                        };

                        for(var i=0; i<data.rows.length; i++){
                            $scope.oChartData.xAxis.push(data.rows[i][0]); //agency
                            $scope.oChartData.yAxis.push(data.rows[i][1]); //amount
                        }

                        $scope.labels = $scope.oChartData.xAxis;
                        $scope.series = ['Series A'];
                        $scope.data = [$scope.oChartData.yAxis];
                    }
                },
                function(error) {
                    console.log(error);

                }
            );

        });

        $("#jqxgrid").on('bindingcomplete', function() {
          var datainformation = $('#jqxgrid').jqxGrid('getdatainformation');
          var rowscount = datainformation.rowscount;
          $timeout(function() {
            $scope.vm.numresults = rowscount;
          });
            $(".prompt").removeAttr('disabled');
        });

        $scope.$on('loadTableState', function(element, preferences) {
          $("#jqxgrid").jqxGrid('loadstate', preferences);
        });


        $scope.createTable = function(data) {

          $scope.source =
            {
              url: '',
              datafields: [{ name: 'contractactiontype', map: '0' }, { name: 'agencyid', map: '1' },
                { name: 'signeddate', map: '2' }, { name: 'contractingofficeagencyid', map: '3' }, { name: 'idvpiid', map: '4' }, { name: 'maj_agency_cat', map: '5' },
                { name: 'dollarsobligated', map: '6' }, { name: 'principalnaicscode', map: '7' }, { name: 'psc_cat', map: '8' },
                { name: 'vendorname', map: '9' }, { name: 'zipcode', map: '10' }, { name: 'placeofperformancecountrycode', map: '11' },
                { name: 'pop_state_code', map: '12' }, { name: 'localareasetaside', map: '13' }, { name: 'fiscal_year', map: '14' },
                { name: 'effectivedate', map: '15' }, { name: 'unique_transaction_id', map: '16' }, { name: 'solicitationid', map: '17' },
                { name: 'dunsnumber', map: '18' }, { name: 'descriptionofcontractrequirement', map: '19' }
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
              altrows: true,
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
                { datafield: 'idvpiid', text: 'Reference Id', width: '20%' },
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

            $("#csvExport").jqxButton();
            $("#pdfExport").jqxButton();
            $("#csvExport").click(function () {
                $("#jqxgrid").jqxGrid('exportdata', 'csv', 'jqxGrid');
            });
            $("#pdfExport").click(function () {
                $("#jqxgrid").jqxGrid('exportdata', 'pdf', 'jqxGrid');
            });

            var listSource = [{ label: 'Contract Type', value: 'contractactiontype', checked: true }, 
                              { label: 'Agency Code', value: 'agencyid', checked: true }, 
                              { label: 'Date Signed', value: 'signeddate', checked: true },
                              { label: 'Contracting Agency ID', value: 'contractingofficeagencyid', checked: true}, 
                              { label: 'Reference ID', value: 'idvpiid', checked: true }, 
                              { label: 'Department Full Name', value: 'maj_agency_cat', checked: true},
                              { label: 'Action Obligation ($)', value: 'dollarsobligated', checked: true },
                              { label: 'NAICS', value: 'principalnaicscode', checked: true },
                              { label: 'PSC', value: 'psc_cat', checked: true },
                              { label: 'Vendor State', value: 'vendorname', checked: true },
                              { label: 'Vendor ZIP Code', value: 'zipcode', checked: true },
                              { label: 'PoP Country Name', value: 'placeofperformancecountrycode', checked: true },
                              { label: 'Pop State Name', value: 'pop_state_code', checked: true},
                              { label: 'Local Area Set Aside', value: 'localareasetaside', checked: true },
                              { label: 'Contract Fiscal Year', value: 'fiscal_year', checked: true }];
            $("#jqxlistbox").jqxListBox({ source: listSource, width: 200, height: 200,  checkboxes: true });
            $("#jqxlistbox").on('checkChange', function (event) {
                $("#jqxgrid").jqxGrid('beginupdate');
                if (event.args.checked) {
                    $("#jqxgrid").jqxGrid('showcolumn', event.args.value);
                }
                else {
                    $("#jqxgrid").jqxGrid('hidecolumn', event.args.value);
                }
                $("#jqxgrid").jqxGrid('endupdate');
            });
         
        };


        $scope.createTable();


        //save jqxGrid state in user preferences
        $scope.saveGridState = function(state) {
          if ( typeof $scope.vm.user !== "undefined" ) {
            $scope.vm.user.preferences.jqxGridState = state;
          }

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