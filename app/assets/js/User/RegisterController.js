var controllers = controllers || {};

controllers.RegisterController = ['$scope', '$location', 'AuthProvider', 'ApiService', 'SessionFactory', 'usSpinnerService',
    function($scope, $location, AuthProvider, ApiService, SessionFactory, usSpinnerService){

    //verify if user is aythenticated, if yes init scope
    AuthProvider.isUserAuthenticated(
    function(){
        //user connected, redirect to home page
        $scope.isUserAuth = true;
        $location.path('/');
    }, function(){
        $scope.isUserAuth = false;
    }, function() {
        //get logged in user info
        $scope.user = SessionFactory.getSession().user;
    });

    //Register function
    $scope.registerUser = function() {
        if(typeof $scope.user !== 'undefined' && 
            typeof $scope.user.username !== 'undefined' && 
            typeof $scope.user.email !== 'undefined' && 
            typeof $scope.user.password !== 'undefined') {

            //show spinner
            usSpinnerService.spin('spinner');

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
                    $scope.flash = {
                        "type": "alert-success",
                        "message": "User created !",
                    };

                    //stop spinner
                    usSpinnerService.stop('spinner');
                },
                function(error){
                    $scope.flash = {
                        "type": "alert-danger",
                        "message": "An error has occured, please make sure you are not using the same username !",
                    };

                    //stop spinner
                    usSpinnerService.stop('spinner');
            });
        }
    };
    
}];