(function () {

  angular.module('app')
    .directive('menuFixed', ['AuthProvider', '$state', '$rootScope', function (AuthProvider, $state, $rootScope) {
      return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'templates/menu-fixed.html',
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
     
            // fix menu when passed
            $('.masthead')
              .visibility({
                once: false,
                onBottomPassed: function (calculations) {
                  if (calculations.width > 700) {
                    $('.fixed.menu').transition('fade in');
                  }
                },
                onBottomPassedReverse: function (calculations) {
                  if (calculations.width > 700) {
                    $('.fixed.menu').transition('fade out');
                  }
                },
                onUpdate: function (calculations) {
                  if (calculations.width < 700) {
                    $('.fixed.menu').transition('hide');
                  }
                }
              });

          });

        }
      }
    }]);

} ());

