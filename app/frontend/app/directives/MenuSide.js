(function () {

  angular.module('app')
    .directive('menuSide', menuSide);

  function menuSide() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'templates/menu-side.html'
    }
  }

})();

