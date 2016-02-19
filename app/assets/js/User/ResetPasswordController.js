var controllers = controllers || {};

controllers.ResetPasswordController = ['$scope', '$location', '$routeParams', 'AuthProvider', 'ApiService', 'usSpinnerService',
    function($scope, $location, $routeParams, AuthProvider, ApiService, usSpinnerService){

    //verify if user is aythenticated, if yes redirect to home page
    AuthProvider.isUserAuthenticated(
    function(){
        $location.path('/');
    }, 
    //user not authenticated
    function(){
        
    });

    $scope.token = $routeParams.token;

    //reset password
    $scope.resetPassword = function() {
        if(typeof $scope.password !== 'undefined') {
            //create user
            ApiService.call('resetPassword', '', {}, {password: $scope.password, token: $routeParams.token}, 'POST').then(
                function(data){
                    $scope.flash = {
                        "type": "alert-success",
                        "message": data.message
                    };

                    //stop spinner
                    usSpinnerService.stop('spinner');
                },
                function(error){
                    $scope.flash = {
                        "type": "alert-danger",
                        "message": error.message
                    };

                    //stop spinner
                    usSpinnerService.stop('spinner');
            });
        }
    };
}];