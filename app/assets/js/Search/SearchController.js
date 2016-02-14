var controllers = controllers || {};

controllers.SearchController = ['$scope', '$location', 'AuthProvider', 'usSpinnerService', 'SearchService', function($scope, $location, AuthProvider, usSpinnerService, SearchService){
    //verify if user is aythenticated, if yes redirect to home page
    AuthProvider.isUserAuthenticated(
    function(){
        $scope.isUserAuth = true;
    },
    function(){
        $location.path('/');
    });

//    SearchService.getFieldFacet('contractactiontype').then(
//        function(data){
//            console.log(data);
//        }, function(error){
//        console.log(error);
//    });

//    SearchService.getFieldsFacet(['contractactiontype', 'agencyid']).then(
//        function(data){
//            console.log(data);
//        }, function(error){
//        console.log(error);
//    });
    

    var data = new Array();
    var firstNames =
    [
        "Andrew", "Nancy", "Shelley", "Regina", "Yoshi", "Antoni", "Mayumi", "Ian", "Peter", "Lars", "Petra", "Martin", "Sven", "Elio", "Beate", "Cheryl", "Michael", "Guylene"
    ];
    var lastNames =
    [
        "Fuller", "Davolio", "Burke", "Murphy", "Nagase", "Saavedra", "Ohno", "Devling", "Wilson", "Peterson", "Winkler", "Bein", "Petersen", "Rossi", "Vileid", "Saylor", "Bjorn", "Nodier"
    ];
    var productNames =
    [
        "Black Tea", "Green Tea", "Caffe Espresso", "Doubleshot Espresso", "Caffe Latte", "White Chocolate Mocha", "Cramel Latte", "Caffe Americano", "Cappuccino", "Espresso Truffle", "Espresso con Panna", "Peppermint Mocha Twist"
    ];
    var priceValues =
    [
        "2.25", "1.5", "3.0", "3.3", "4.5", "3.6", "3.8", "2.5", "5.0", "1.75", "3.25", "4.0"
    ];
    for (var i = 0; i < 100; i++) {
        var row = {};
        var productindex = Math.floor(Math.random() * productNames.length);
        row["ShipName"] = firstNames[Math.floor(Math.random() * firstNames.length)];
        row["ShipCity"] = lastNames[Math.floor(Math.random() * lastNames.length)];
        row["ShipCountry"] = productNames[productindex];
        data[i] = row;
    }
    
    var source =
    {
        localdata: data,
        datatype: "array"
    };

    var dataAdapter = new $.jqx.dataAdapter(source, {
        loadComplete: function (data) { },
        loadError: function (xhr, status, error) { }      
    });

    $("#jqxgrid").jqxGrid(
    {
        width: 850,
        source: source,
        selectionmode: 'multiplerowsextended',
        sortable: true,
        pageable: true,
        autoheight: true,
        autoloadstate: false,
        autosavestate: false,
        columnsresize: true,
        columnsreorder: true,
        showfilterrow: true,
        filterable: true,
        columns: [
          { text: 'Ship Name', filtercondition: 'starts_with', datafield: 'ShipName', width: 250 },
          { text: 'Ship City', datafield: 'ShipCity', width: 200 },
          { text: 'Ship Country', datafield: 'ShipCountry' }
        ]
    });
//    $("#saveState").jqxButton({ theme: theme });
//    $("#loadState").jqxButton({ theme: theme });
    var state = null;
    $("#saveState").click(function () {
        // save the current state of jqxGrid.
        state = $("#jqxgrid").jqxGrid('savestate');
    })
    ;
    $("#loadState").click(function () {
        // load the Grid's state.
        if (state) {
            $("#jqxgrid").jqxGrid('loadstate', state);
        }
        else {
            $("#jqxgrid").jqxGrid('loadstate');
        }
    });
}];