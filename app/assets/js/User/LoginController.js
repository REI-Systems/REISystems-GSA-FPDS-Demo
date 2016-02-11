var controllers = controllers || {};

controllers.LoginController = ['$scope', '$rootScope', '$location', '$timeout', 'AuthProvider', 'usSpinnerService', 'SessionFactory',
    function($scope, $rootScope, $location, $timeout, AuthProvider, usSpinnerService, SessionFactory){

    //verify if user is aythenticated, if yes redirect to home page
    AuthProvider.isUserAuthenticated(
    function(){
        $location.path('/');
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

                    //refresh nav bar
                    $rootScope.$emit('refreshNavBar', { });

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