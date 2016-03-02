(function () {

  angular.module('app')
    .directive('menuSide', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/menu-side.html',
        controller: function ($scope) {

          angular.element(document).ready(function () {
     
            // create sidebar and attach to menu open
            $('.ui.sidebar')
              .sidebar('attach events', '.toc.item');

          });

        }
      }
    });

} ());

