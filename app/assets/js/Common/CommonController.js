var controllers = controllers || {};

controllers.CommonController = ['$scope', '$rootScope', 'AuthProvider', 'SessionFactory', 'usSpinnerService', '$location', function($scope, $rootScope, AuthProvider, SessionFactory, usSpinnerService, $location){
    
    $scope.isUserAuthenticated = function() {
        //verify if user is aythenticated, if yes init scope
        AuthProvider.isUserAuthenticated(
        function(){
            $scope.isUserAuth = true;
        }, function(){
            $scope.isUserAuth = false;
        }, function() {
            //get logged in user info
            $scope.user = SessionFactory.getSession().user;
        });
    };

    //verify if user is authenticated
    $scope.isUserAuthenticated();

    //create event caller in order to refresh nav bar
    $rootScope.$on('refreshNavBar', function (event, args) {
        $scope.isUserAuthenticated();
    });

    //log out user
    $scope.logOut = function() {
        //show spinner
        usSpinnerService.spin('spinner');

        AuthProvider.logoutUser(
        //success function
        function(){
            //show spinner
            usSpinnerService.stop('spinner');

            //verify if user is authenticated
            $scope.isUserAuthenticated();

            //redirect to homepage 
            $location.path('/').search({'disconnected':true});
        }, 
        //error function
        function(){
            
        });
    };
    
    // Init main nav dropdowns
    $scope.initDropdown = function(){
      $(function () {
        // wait till all resources are available
        $('.ui.dropdown').dropdown();
      });
    };
    $scope.initDropdown();
    
}];