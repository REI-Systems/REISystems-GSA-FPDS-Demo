var controllers = controllers || {};

controllers.DefaultController = ['$scope', '$routeParams', 'SessionFactory', function($scope, $routeParams){

    if(typeof $routeParams.disconnected !== 'undefined') {
        $scope.flash = {
            "type": "alert-success",
            "message": "You have been successfully disconnected !"
        };
    }
}];