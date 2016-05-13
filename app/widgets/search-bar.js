(function() {
  'use strict';

  angular.module('app.widgets')
    .directive('searchBar', function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'widgets/search-bar.html',
        link: function(scope, element, attrs, controller) {
          angular.element(document).ready(function() {
            $('.ui.search')
              .search({
                apiSettings: {
                  url: 'api/search/category?q={query}'
                },
                type: 'category',
                onSelect: function(result, response) {
                    $(".prompt").attr('disabled', true);
                       var sqlClause = 'WHERE ' + result.column + "=" + "'" + result.title + "'";
                       scope.vm.updateTableResults(sqlClause);
                }
              });
          });
        }
      };
    });

})();