(function() {
  'use strict';

  angular
    .module('app.layout')
    .controller('Navigation', Navigation);

  Navigation.$inject = ['$state', '$rootScope', 'userAuthorization'];

  function Navigation($state, $rootScope, userAuthorization) {
    var vm = this;

    $rootScope.$on('updateNav', function(element, args) {
      if (args === 'login') {
        vm.isUserAuth = true;
      } else if (args === 'logout') {
        vm.isUserAuth = false;
      }
    });

    userAuthorization.isUserAuthenticated(
      function() {
        vm.isUserAuth = true;
      },
      function() {
        vm.isUserAuth = false;
      }
    );

    vm.logOut = function() {
      userAuthorization.logoutUser(
        function() {
          $rootScope.$emit('updateNav', 'logout');
          $state.go('home');
        }
      );
    };

    angular.element(document).ready(function() {

      var mobileWidth = 700;

      $('.masthead')
        .visibility({
          once: false,
          onBottomPassed: function(calculations) {
            if (calculations.width > mobileWidth) {
              $('.fixed.menu').transition('fade in');
            }
          },
          onBottomPassedReverse: function(calculations) {
            if (calculations.width > mobileWidth) {
              $('.fixed.menu').transition('fade out');
            }
          },
          onUpdate: function(calculations) {
            if (calculations.width < mobileWidth) {
              $('.fixed.menu').transition('hide');
            }
          }
        });

      // create sidebar and attach to menu open
      $('.ui.sidebar')
        .sidebar('attach events', '.toc.item');

    });


  }

})();

