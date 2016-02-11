var controllers = controllers || {};

controllers.RegisterController = ['$scope', '$location', 'AuthProvider', 'ApiService', function($scope, $location, AuthProvider, ApiService){
    //verify if user is aythenticated, if yes init scope
    AuthProvider.isUserAuthenticated(
    function(){
        //user connected, redirect to home page
        $scope.isUserAuth = true;
        $location.path('/');
    }, function(){
        $scope.isUserAuth = false;
    });

    //Register function
    $scope.registerUser = function() {
        if(typeof $scope.user !== 'undefined' && 
            typeof $scope.user.username !== 'undefined' && 
            typeof $scope.user.email !== 'undefined' && 
            typeof $scope.user.password !== 'undefined') {

            var aParams = {
                'username': $scope.user.username,
                'email': $scope.user.email,
                'password': $scope.user.password,
                'name': $scope.user.name,
                'preferences': {
                    'typeDashboard': $scope.user.typeDashboard
                }
            };

            //create user
            ApiService.call('userCreate', '', {}, aParams, 'POST').then(
                function(data){
                    console.log(data);
                }, 
                function(error){
                    console.log(error);
            });
        }
    };
    
}];