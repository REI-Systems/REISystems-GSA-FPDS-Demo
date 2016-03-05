(function () {

  angular
    .module('app')
    .directive('menuFixed', menuFixed);

  function menuFixed() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'templates/menu-fixed.html'
    }
  }

})();

