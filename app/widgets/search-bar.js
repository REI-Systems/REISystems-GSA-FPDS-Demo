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
                                    title   : 'piid',
                                    description: 'M',
                                    price: 'title'
                                },
                                debug: true,
                                type: 'category',
                                onSelect: function(result, response) {
                                    $('.prompt').attr('disabled', true);
                                    var sqlClause = 'WHERE ' + result.column + "=" + "'" + result.piid + "'" + 'AND ' + result.mod + "=" + "'" + result.M + "'";
                                    if (result.title !== '&nbsp;') {
                                        sqlClause = 'WHERE idvpiid = ' + "'" + result.title + "'";
                                    }
                                    scope.vm.updateTableResults(sqlClause);
                                    return false;
                                } 
                            });
                    });
                }
            };
        });

})();