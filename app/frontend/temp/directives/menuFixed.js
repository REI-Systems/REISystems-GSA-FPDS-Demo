(function () {

  angular.module('app')
    .directive('menuFixed', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/menu-fixed.html',
        controller: function ($scope) {
          
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
                onUpdate: function (calculations){
                  if (calculations.width < 700) {
                    $('.fixed.menu').transition('hide');
                  }
                }
              });

          });
          
        }
      }
    });

} ());

