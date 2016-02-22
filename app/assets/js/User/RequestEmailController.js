var controllers = controllers || {};

controllers.RequestEmailController = ['$scope', '$location', 'AuthProvider', 'usSpinnerService',
    function($scope, $location, AuthProvider, usSpinnerService){

    //verify if user is aythenticated, if yes redirect to home page
    AuthProvider.isUserAuthenticated(
    function(){
        $location.path('/');
    }, 
    //user not authenticated
    function(){
        
    });

    //send email activation/forgot password
    $scope.sendEmail = function(type) {
        if(typeof $scope.email !== 'undefined') {
            //show spinner
            usSpinnerService.spin('spinner');
            var oParam = {
                email: $scope.email,
                type: type
            };

            //send request for reset password
            AuthProvider.sendEmailToken(oParam).then(
            function(data){
                $scope.flash = {
                    "type": "alert-success",
                    "message": data.message
                };
            },
            function(error){
                $scope.flash = {
                    "type": "alert-danger",
                    "message": error.message
                };
            })
            .finally(function () {
                usSpinnerService.stop('spinner');
            });
        }
    };
}];