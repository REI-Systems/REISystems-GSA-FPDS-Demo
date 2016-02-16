var controllers = controllers || {};

controllers.SearchController = ['$scope', '$location', 'AuthProvider', 'usSpinnerService', 'SearchService', 'SessionFactory', 'ApiService', function($scope, $location, AuthProvider, usSpinnerService, SearchService, SessionFactory, ApiService){
    //verify if user is aythenticated, if yes redirect to home page
    AuthProvider.isUserAuthenticated(
    function(){
        $scope.isUserAuth = true;

        //get logged in user info
        $scope.user = SessionFactory.getSession().user;

        //show spinner
        usSpinnerService.spin('spinner');

        //populate filter fields
         var aFilterCol = ['contractactiontype', 'agencyid', 'contractingofficeagencyid',
                    'maj_agency_cat', 'psc_cat', 'vendorname',
                    'pop_state_code', 'localareasetaside'];
        var aResultFilterCol = {};

        SearchService.getFieldsFacet(aFilterCol)
            .then(function(data){
    //            console.log(data);
                angular.forEach(data, function(row){
    //                console.log(row.data);
                    if(row.data) {
                        angular.forEach(row.data, function(element){
                            var key = Object.keys(element)[0];
                            var value = element[Object.keys(element)[0]];

                            //make sure the value is not empty
                            if(value !== '') {
                                if(aResultFilterCol.hasOwnProperty(key)) { //exist
                                    aResultFilterCol[key].push(value);
                                } else { //doesnt exist, create entry
                                    aResultFilterCol[key] = [value];
                                }
                            }
                        });
                    }
                });

    //        console.log(aResultFilterCol);
            $scope.filters = {
                agencies: aResultFilterCol.agencyid,
                contractTypes: aResultFilterCol.contractactiontype,
                contractingAgencies: aResultFilterCol.contractingofficeagencyid,
                localAreas: aResultFilterCol.localareasetaside,
                department: aResultFilterCol.maj_agency_cat,
                popStates: aResultFilterCol.pop_state_code,
                psc: aResultFilterCol.psc_cat,
                vendorname: aResultFilterCol.vendorname
            };

            //stop spinner
            usSpinnerService.stop('spinner');

            //load search and show table
            $scope.searchDataset();
        });
    },
    function(){
        $location.path('/');
    });

    //search dataset
    $scope.searchDataset = function() {
        //show spinner
        usSpinnerService.spin('spinner');

        var sqlClause = '';
        //build query clause/order... dynamically based on searchFilterForm form
        angular.forEach($scope.searchFilterForm, function(value, key) {
            if(key[0] === '$') return;

            //this field have changed
            if(!value.$pristine && value.$modelValue !== '') {
//                var str = ' '+key+" like '%"+value.$modelValue+"%'";
                var str = ' '+key+"='"+value.$modelValue+"'";

                sqlClause += (sqlClause !== '') ? ' AND'+str : ' WHERE'+str;
            }
//            console.log(key, value.$pristine);
//            console.log(key, value);
        });

//        console.log('Clause Where, '+sqlClause);

        SearchService.sqlSearch(sqlClause).then(function(data){
            var source =
            {
                localdata: data,
                datafields: [{ name: 'contractactiontype'},{ name: 'agencyid'},
                    { name: 'signeddate'},{ name: 'contractingofficeagencyid'},{ name: 'maj_agency_cat'},
                    { name: 'dollarsobligated'},{ name: 'principalnaicscode'},{ name: 'psc_cat'},
                    { name: 'vendorname'},{ name: 'zipcode'},{ name: 'placeofperformancecountrycode'},
                    { name: 'pop_state_code'},{ name: 'localareasetaside'},{ name: 'fiscal_year'},
                    { name: 'effectivedate'}, { name: 'unique_transaction_id'}, { name: 'solicitationid'},
                    { name: 'dunsnumber'}, { name: 'descriptionofcontractrequirement'}
                ],
                id: 'unique_transaction_id',
                datatype: "json"
            };

            jQuery("#jqxgrid").jqxGrid(
            {
                theme: 'ui-sunny',
                width: jQuery('#jqxWidget').parent().width(),
                height: 450,
                source: source,
                selectionmode: 'multiplerowsextended',
                sortable: true,
                pageable: true,
                autoheight: true,
                autoloadstate: false,
                autosavestate: false,
                columnsresize: true,
                columnsreorder: true,
                //showfilterrow: true,
                filterable: true,
                columns: [
                  //pre-default user column's order
                    { datafield: 'contractactiontype', text: 'Contract Type', width: '20%'},
                    { datafield: 'agencyid', text: 'Agency Code', width: '20%'},
                    { datafield: 'signeddate', text: 'Date Signed', width: '20%'},
                    { datafield: 'contractingofficeagencyid', text: 'Contracting Agency ID', width: '20%'},
                    { datafield: 'maj_agency_cat', text: 'Department Full Name', width: '20%'},
                    { datafield: 'dollarsobligated', text: 'Action Obligation ($)', width: '20%'},
                    { datafield: 'principalnaicscode', text: 'NAICS', width: '20%'},
                    { datafield: 'psc_cat', text: 'PSC', width: '20%'},
                    { datafield: 'vendorname', text: 'Vendor State', width: '20%'},
                    { datafield: 'zipcode', text: 'Vendor ZIP Code', width: '20%'},
                    { datafield: 'placeofperformancecountrycode', text: 'PoP Country Name', width: '20%'},
                    { datafield: 'pop_state_code', text: 'PoP State Name', width: '20%'},
                    { datafield: 'localareasetaside', text: 'Local Area Set Aside', width: '20%'},
                    { datafield: 'fiscal_year', text: 'Contract Fiscal Year', width: '20%'}
                ]
            });

            //load user jgxGrid last state and apply it
            var state = $scope.user.preferences.jqxGridState;
            if (state) {
                console.log($scope.user.preferences.jqxGridState);
                $("#jqxgrid").jqxGrid('loadstate', state);
            }

            //on column reorder, save state in user database
            $("#jqxgrid").on('columnreordered', function (event) {
                //get new state jqxGrid
                state = $("#jqxgrid").jqxGrid('savestate');
//                console.log(state);

                $scope.$apply(function(){
                    //update state in user scope preferences
                    $scope.user.preferences.jqxGridState = state;

                    /**
                     * SAVE jqxGris State in user preferences
                     */
                    //show spinner
                    usSpinnerService.spin('spinner');

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
                        function(data){
                            $scope.flash = {
                                "type": "alert-success",
                                "message": "User preferences are saved !"
                            };

                            //stop spinner
                            usSpinnerService.stop('spinner');
                        },
                        function(error){
                            $scope.flash = {
                                "type": "alert-danger",
                                "message": "There was an error with saving User preferences, Please try again !"
                            };

                            //stop spinner
                            usSpinnerService.stop('spinner');
                        }
                    );
                });
            });

            //on click event, 
            $("#jqxgrid").on("cellclick", function (event) 
            {
                // event arguments.
                var args = event.args;
                //console.log(args.row.bounddata);

                $scope.$apply(function(){
                    // perform any model changes or method invocations here on angular app.
                    $scope.row = args.row.bounddata;

                    //load tabs
                    $('#jqxtabs').jqxTabs({ width: jQuery('#jqxWidget').parent().width(), height: 250, theme: 'ui-sunny' });
                });
            });

            //stop spinner
            usSpinnerService.stop('spinner');
        },
        function(error) {
            
        });
    };
}];