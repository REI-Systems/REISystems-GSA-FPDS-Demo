var controllers = controllers || {};

controllers.ResetPasswordController = ['$scope', '$location', 'AuthProvider', 'usSpinnerService',
    function($scope, $location, AuthProvider, usSpinnerService){

    //verify if user is aythenticated, if yes redirect to home page
    AuthProvider.isUserAuthenticated(
    function(){
        $location.path('/');
    }, 
    //user not authenticated
    function(){
        
    });

    //reset password
    $scope.resetPassword = function() {
        console.log($scope.email);
    };
}];