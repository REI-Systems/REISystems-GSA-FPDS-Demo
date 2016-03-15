(function() {
  'use strict';

  angular
    .module('app.account')
    .controller('Login', Login);

  Login.$inject = ['$scope', '$rootScope', '$location', '$timeout', 'userAuthorization', 'userSession', '$state'];

  function Login($scope, $rootScope, $location, $timeout, userAuthorization, userSession, $state) {
    var vm = this;

    //verify if user is aythenticated, if yes redirect to home page
    userAuthorization.isUserAuthenticated(
      function() {
        $location.path('/');
      });

    //Register function
    $scope.loginUser = function() {
      if (typeof $scope.user !== 'undefined' &&
        typeof $scope.user.username !== 'undefined' &&
        typeof $scope.user.password !== 'undefined') {

        var aParams = {
          'username': $scope.user.username,
          'password': $scope.user.password
        };

        //login
        userAuthorization.loginUser(aParams).then(
          function(data) {
            $scope.flash = {
              "type": "positive",
              "message": "Welcome! You have been successfully logged in.",
            };

            //create user session
            userSession.setSession(data.user);

            //refresh nav bar
            $rootScope.$broadcast('updateNav', 'login');

            //redirect to homepage after 2 secs
            $timeout(function() { $location.path('/').search({ 'logged': true }); }, 2000);
          },
          function(error) {
            $scope.flash = {
              "type": "negative",
              "message": error.message
            };

          });
      }
    };

  }

})();