var controllers = controllers || {};

controllers.HomeController = ['$scope', 'AuthProvider', 'SessionFactory', function($scope, AuthProvider, SessionFactory){
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

}];