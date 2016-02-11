var controllers = controllers || {};

controllers.LoginController = ['$scope', '$location', '$timeout', 'AuthProvider', 'usSpinnerService', 'SessionFactory',
    function($scope, $location, $timeout, AuthProvider, usSpinnerService, SessionFactory){

    //verify if user is aythenticated, if yes init scope
    AuthProvider.isUserAuthenticated(
    function(){
        $scope.isUserAuth = true;
        $location.path('/');
    }, function(){
        $scope.isUserAuth = false;
    }, function() {
        //get logged in user info
        $scope.user = SessionFactory.getSession().user;
    });

    //Register function
    $scope.loginUser = function() {
        if(typeof $scope.user !== 'undefined' && 
            typeof $scope.user.username !== 'undefined' && 
            typeof $scope.user.password !== 'undefined') {

            //show spinner
            usSpinnerService.spin('spinner');

            var aParams = {
                'username': $scope.user.username,
                'password': $scope.user.password
            };

            //login
            AuthProvider.loginUser(aParams).then(
                function(data){
                    $scope.flash = {
                        "type": "alert-success",
                        "message": "Welcome! You have been successfully logged in.",
                    };

                    //create user session
                    SessionFactory.setSession(data.user);

                    //stop spinner
                    usSpinnerService.stop('spinner');

                    //redirect to homepage after 2 secs
                    $timeout(function(){ $location.path('/').search({'logged':true}); }, 2000);
                },
                function(error){
                    $scope.flash = {
                        "type": "alert-danger",
                        "message": "Forbidden - user not found.",
                    };

                    //stop spinner
                    usSpinnerService.stop('spinner');
            });
        }
    };
    
}];