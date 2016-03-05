(function () {

  angular.module('app')
    .controller('NavController', NavController);

  NavController.$inject = ['$state', '$rootScope', 'AuthProvider'];

  function NavController($state, $rootScope, AuthProvider) {
    
    // View Model
    var vm = this;

    $rootScope.$on('updateNav', function (element, args) {
      if (args === 'login') {
        vm.isUserAuth = true;
      } else if (args === 'logout') {
        vm.isUserAuth = false;
      }
    });

    AuthProvider.isUserAuthenticated(
      function () {
        vm.isUserAuth = true;
      },
      function () {
        vm.isUserAuth = false;
      }
      );

    vm.logOut = function () {
      AuthProvider.logoutUser(
        function () {
          $rootScope.$emit('updateNav', 'logout');
          $state.go('home');
        }
        );
    };

    angular.element(document).ready(function () {

      var mobileWidth = 700;

      $('.masthead')
        .visibility({
          once: false,
          onBottomPassed: function (calculations) {
            if (calculations.width > mobileWidth) {
              $('.fixed.menu').transition('fade in');
            }
          },
          onBottomPassedReverse: function (calculations) {
            if (calculations.width > mobileWidth) {
              $('.fixed.menu').transition('fade out');
            }
          },
          onUpdate: function (calculations) {
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

