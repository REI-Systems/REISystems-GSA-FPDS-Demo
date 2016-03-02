(function () {

  angular.module('app')
    .directive('menuMasthead', ['AuthProvider', '$state', '$rootScope', function (AuthProvider, $state, $rootScope) {
      return {
        restrict: 'E',
        templateUrl: 'templates/menu-masthead.html',
        scope: {},
        controller: function ($scope) {

          $rootScope.$on('updateNav', function (e, args) {
            if(args === 'login'){
              $scope.isUserAuth = true;
            }else if(args === 'logout'){
              $scope.isUserAuth = false;
            }            
          });

          AuthProvider.isUserAuthenticated(
            function () {
              $scope.isUserAuth = true;
            },
            function () {
              $scope.isUserAuth = false;
            }
            );

          $scope.logOut = function () {
            AuthProvider.logoutUser(
              function () {
                $rootScope.$emit('updateNav','logout');
                $state.go('home');
              }
              );
          };

        }
      }
    }]);

} ());

