var controllers = controllers || {};

controllers.CommonController = ['$scope', 'AuthProvider', function($scope, AuthProvider){
    //verify if user is aythenticated, if yes init scope
    AuthProvider.isUserAuthenticated(
    function(){
        $scope.isUserAuth = true;
    }, function(){
        $scope.isUserAuth = false;
    });
}];