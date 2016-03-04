(function () {

  angular.module('app')
    .controller('SearchController', ['$scope', '$location', 'AuthProvider', 'SearchService', 'SessionFactory', 'ApiService', SearchController]);

  function SearchController($scope, $location, AuthProvider, SearchService, SessionFactory, ApiService) {
    var vm = this;

    $scope.results = "from controller";
    
    //verify if user is aythenticated, if yes redirect to home page
    // AuthProvider.isUserAuthenticated(
    //   function () {
    //     $scope.isUserAuth = true;

    //     //get logged in user info
    //     $scope.user = SessionFactory.getSession().user;
    //     //console.log($scope);

    //     //populate filter fields
    //     var aFilterCol = ['contractactiontype', 'agencyid', 'contractingofficeagencyid',
    //       'maj_agency_cat', 'psc_cat', 'vendorname',
    //       'pop_state_code', 'localareasetaside'];

    //     var aResultFilterCol = {};

    //     SearchService.getFieldsFacet(aFilterCol)
    //       .then(function (response) {

    //         angular.forEach(response, function (content) {
              
    //           if (content.data && !content.data.error) {
                
    //             var key = content.data.cols[0];
                
    //             angular.forEach(content.data.rows, function (row) {

    //               if (aResultFilterCol.hasOwnProperty(key)) {
    //                 aResultFilterCol[key].push(row[0]);
    //               } else {
    //                 aResultFilterCol[key] = [];
    //               }
                  
    //             });
    //           }
    //         });

    //         $scope.filters = {
    //           agencies: aResultFilterCol.agencyid,
    //           contractTypes: aResultFilterCol.contractactiontype,
    //           contractingAgencies: aResultFilterCol.contractingofficeagencyid,
    //           localAreas: aResultFilterCol.localareasetaside,
    //           department: aResultFilterCol.maj_agency_cat,
    //           popStates: aResultFilterCol.pop_state_code,
    //           psc: aResultFilterCol.psc_cat,
    //           vendorname: aResultFilterCol.vendorname
    //         };

    //         //load dataset and show table
    //         //$scope.loadDataSet();
    //       });
    //   },
    //   function () {
    //     $location.path('/login');
    //   });
      
      
      
    //load datasets
    $scope.loadDataSet = function () {

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
          //id: 'unique_transaction_id',
          datatype: "array"
        };

        var dataAdapter = new $.jqx.dataAdapter($scope.source);

        jQuery("#jqxgrid").jqxGrid(
          {
            //theme: 'ui-sunny',
            //width: jQuery('#jqxWidget').parent().width(),
            //height: 450,
            source: dataAdapter,
            //ready: function () {
            // callback function which is called by jqxGrid when the widget is initialized and the binding is completed.
            // },
            selectionmode: 'multiplerowsextended',
            sortable: true,
            pageable: true,
            autoheight: true,
            // autoloadstate: false,
            // autosavestate: false,
            columnsresize: true,
            columnsreorder: true,
            //showfilterrow: true,
            filterable: true,
            columns: [
              //pre-default user column's order
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

        //load user jgxGrid last state and apply it
        var state = $scope.user.preferences.jqxGridState;
        if (state) {
          $("#jqxgrid").jqxGrid('loadstate', state);
        }

        //hide/show columns
        $scope.listSource = [{ value: 'contractactiontype', label: 'Contract Type', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.contractactiontype.hidden : true },
          { value: 'agencyid', label: 'Agency Code', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.agencyid.hidden : true },
          { value: 'signeddate', label: 'Date Signed', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.signeddate.hidden : true },
          { value: 'contractingofficeagencyid', label: 'Contracting Agency ID', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.contractingofficeagencyid.hidden : true },
          { value: 'maj_agency_cat', label: 'Department Full Name', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.maj_agency_cat.hidden : true },
          { value: 'dollarsobligated', label: 'Action Obligation ($)', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.dollarsobligated.hidden : true },
          { value: 'principalnaicscode', label: 'NAICS', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.principalnaicscode.hidden : true },
          { value: 'psc_cat', label: 'PSC', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.psc_cat.hidden : true },
          { value: 'vendorname', label: 'Vendor State', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.vendorname.hidden : true },
          { value: 'zipcode', label: 'Vendor ZIP Code', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.zipcode.hidden : true },
          { value: 'placeofperformancecountrycode', label: 'PoP Country Name', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.placeofperformancecountrycode.hidden : true },
          { value: 'pop_state_code', label: 'PoP State Name', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.pop_state_code.hidden : true },
          { value: 'localareasetaside', label: 'Local Area Set Aside', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.localareasetaside.hidden : true },
          { value: 'fiscal_year', label: 'Contract Fiscal Year', checked: (state && state.hasOwnProperty('columns')) ? !state.columns.fiscal_year.hidden : true }];

        $("#jqxlistbox").jqxListBox({ source: $scope.listSource, width: jQuery('#jqxWidget').parent().width(), height: 100, checkboxes: true });

        $("#jqxlistbox").on('checkChange', function (event) {
          $("#jqxgrid").jqxGrid('beginupdate');
          if (event.args.checked) {
            $("#jqxgrid").jqxGrid('showcolumn', event.args.value);
          } else {
            $("#jqxgrid").jqxGrid('hidecolumn', event.args.value);
          }
          $("#jqxgrid").jqxGrid('endupdate');

          //get new state jqxGrid
          state = $("#jqxgrid").jqxGrid('savestate');
          //save state
          $scope.$apply(function () {
            $scope.saveGridState(state);
          });
        });

        //on column reorder, save state in user database
        $("#jqxgrid").on('columnreordered', function (event) {
          //get new state jqxGrid
          state = $("#jqxgrid").jqxGrid('savestate');

          //save state
          $scope.$apply(function () {
            $scope.saveGridState(state);
          });
        });

        //on click event, 
        $("#jqxgrid").on("rowselect", function (event) {
          // event arguments.
          var args = event.args;
          //console.log(args.row.bounddata);

          $scope.$apply(function () {
            // perform any model changes or method invocations here on angular app.
            $scope.row = args.row;

          });
        });

      },
        function (error) {
          console.log("errorr");
        });
    };
    
    
    
    //search dataset
    $scope.searchDataset = function () {

      var sqlClause = '';
      //build query clause/order... dynamically based on searchFilterForm form
      angular.forEach($scope.searchFilterForm, function (value, key) {
        if (key[0] === '$') return;

        //this field have changed
        if (!value.$pristine && value.$modelValue !== '') {
          // var str = ' '+key+" like '%"+value.$modelValue+"%'";
          var str = ' ' + key + "='" + value.$modelValue + "'";

          sqlClause += (sqlClause !== '') ? ' AND' + str : ' WHERE' + str;
        }

      });

      SearchService.sqlSearch(sqlClause).then(function (data) {
        $scope.source.localdata = data;
        // passing "cells" to the 'updatebounddata' method will refresh only the cells values when the new rows count is equal to the previous rows count.
        $("#jqxgrid").jqxGrid('updatebounddata', 'cells');

      },
        function (error) {
          console.log("search dataset error");
        });
    };
    
    
    
    
    //save jqxGrid state in user preferences
    $scope.saveGridState = function (state) {
      //update state in user scope preferences
      $scope.user.preferences.jqxGridState = state;

      /**
       * SAVE jqxGris State in user preferences
       */

      var oAPI = {
        'name': 'userUpdate',
        'suffix': $scope.user.id
      };

      var oParams = {
        'preferences': {
          'typeDashboard': $scope.user.preferences.typeDashboard,
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
          $scope.flash = {
            "type": "negative",
            "message": "There was an error with saving User preferences, Please try again !"
          };
        }
        );
    }




  }

} ());