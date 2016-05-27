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
                                fields: {
                                    results : 'results',
                                    title   : 'title',
                                    description: 'piid',
                                    price: 'M'
                                },
                                debug: true,
                                type: 'category',
                                onSelect: function(result, response) {
                                    window.location= '/#/search'
                                    var sqlClause = 'WHERE ' + result.column + "=" + "'" + result.title + "'";
                                    scope.vm.updateTableResults(sqlClause);
                                }
                            });
                    });
                }
            };
        });

})();