var controllers = controllers || {};

controllers.CommonController = ['$scope', 'AuthProvider', 'SessionFactory', 'usSpinnerService', '$location', function($scope, AuthProvider, SessionFactory, usSpinnerService, $location){
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

    //log out user
    $scope.logOut = function() {
        //show spinner
        usSpinnerService.spin('spinner');

        AuthProvider.logoutUser(
        //success function
        function(){
            //show spinner
            usSpinnerService.stop('spinner');

            //redirect to homepage 
            $location.path('/').search({'disconnected':true});
        }, 
        //error function
        function(){
            
        });
    };
}];