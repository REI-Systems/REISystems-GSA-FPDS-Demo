var controllers = controllers || {};

controllers.HomeController = ['$scope', 'AuthProvider', function($scope, AuthProvider){
    //verify if user is aythenticated, if yes init scope
    AuthProvider.isUserAuthenticated(
    function(){
        $scope.isUserAuth = true;
    }, function(){
        $scope.isUserAuth = false;
    });

    AuthProvider.loginUser({'username':null,'password':null}).then(function(data){
        console.log(data);
    }, 
    function(error){
        console.log(error);
    });
}];