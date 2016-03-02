(function () {

  angular.module('app')
    .directive('menuSide', ['AuthProvider', '$state', '$rootScope', function (AuthProvider, $state, $rootScope) {
      return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'templates/menu-side.html',
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

          angular.element(document).ready(function () {
     
            // create sidebar and attach to menu open
            $('.ui.sidebar')
              .sidebar('attach events', '.toc.item');

          });

        }
      }
    }]);

} ());

