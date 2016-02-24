var controllers = controllers || {};

controllers.DefaultController = ['$scope', '$routeParams', 'ApiService', function($scope, $routeParams, ApiService){

    if(typeof $routeParams.disconnected !== 'undefined') {
        $scope.flash = {
            "type": "positive",
            "message": "You have been successfully disconnected !"
        };
    }

    //activate user account
    if(typeof $routeParams.token !== 'undefined') {

        ApiService.call('activateAccount', '', {}, {token: $routeParams.token}, 'POST').then(
          function(data) {
            $scope.flash = {
                "type": "positive",
                "message": data.message
            };
          },
          function(error){
            $scope.flash = {
                "type": "negative",
                "message": error.message
            };
        });
    }
    
    console.log($routeParams);
}];