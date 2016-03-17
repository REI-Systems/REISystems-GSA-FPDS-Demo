(function() {
  'use strict';

  angular
    .module('app.account')
    .controller('Register', Register);

  Register.$inject = ['$scope', 'userAuthorization', 'apiService', 'userSession'];

  function Register($scope, userAuthorization, apiService, userSession) {
    var vm = this;

    //verify if user is aythenticated, if yes init scope
    userAuthorization.isUserAuthenticated(
      function() {
        $scope.isUserAuth = true;
      }, function() {
        $scope.isUserAuth = false;
      }, function() {
        //get logged in user info
        $scope.user = userSession.getSession().user;

        //init form
        $scope.initForm();
      });

    $scope.initForm = function() {
      if ($scope.isUserAuth && $scope.user) {
        //empty password
        $scope.user.password = '';
        //create attribute for form populating fields
        $scope.user.typeDashboard = $scope.user.preferences.typeDashboard;
      }
    };

    //Register function
    $scope.saveUser = function() {
      if (typeof $scope.user !== 'undefined' &&
        typeof $scope.user.username !== 'undefined' &&
        typeof $scope.user.email !== 'undefined' &&
        typeof $scope.user.password !== 'undefined') {



        var oAPI = {
          'name': ($scope.isUserAuth) ? 'userUpdate' : 'userCreate',
          'suffix': ($scope.isUserAuth && $scope.user.id) ? $scope.user.id : ''
        };

        var oParams = {
          'username': $scope.user.username,
          'email': $scope.user.email,
          'password': $scope.user.password,
          'name': $scope.user.name,
          'preferences': {
            'typeDashboard': $scope.user.typeDashboard,
            'jqxGridState': ($scope.user.hasOwnProperty('preferences') && $scope.user.preferences.hasOwnProperty('jqxGridState')) ? $scope.user.preferences.jqxGridState : null,
          }
        };

        //apply login for connected user
        if ($scope.isUserAuth) {
          if ($scope.user.password === '') {
            delete oParams.password;
          }
        }

        //create user
        apiService.call(oAPI.name, oAPI.suffix, {}, oParams, 'POST').then(
          function(data) {
            $scope.flash = {
              "type": "positive",
              "message": ($scope.isUserAuth) ? "User updated !" : "User created !"
            };


          },
          function(error) {
            $scope.flash = {
              "type": "negative",
              "message": ($scope.isUserAuth) ? "An error has occured, please try later !" : "An error has occured, please make sure you are not using the same username and your email is valid !"
            };

          });
      }
    };


  }

} ());