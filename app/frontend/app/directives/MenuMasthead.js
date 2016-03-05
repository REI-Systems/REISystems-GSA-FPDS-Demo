(function () {

  angular.module('app')
    .directive('menuMasthead', menuMasthead);

  function menuMasthead() {
    return {
      restrict: 'E',
      templateUrl: 'templates/menu-masthead.html'
    }
  }

})();

