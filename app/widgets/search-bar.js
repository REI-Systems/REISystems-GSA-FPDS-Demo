(function() {
    'use strict';

    angular.module('app.widgets')
        .directive('searchBar', ['$state', '$location', function($state, $location) {
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


                                    scope.$apply(function(){
                                        if(!$state.is('search')){
                                            $location.path('/search').search({ "result": encodeURIComponent(JSON.stringify(result)) });
                                        }
                                    });

                                    if(scope.vm.hasOwnProperty('updateTableResults')) {
                                        scope.vm.updateTableResults(sqlClause);
                                    }
                                } 
                            });
                    });
                }
            };
        }]);

})();