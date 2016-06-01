(function() {
  'use strict';

  angular
    .module('app.search')
    .run(appRun);

  appRun.$inject = ['routehelper']

  function appRun(routehelper) {
    routehelper.configureRoutes(getRoutes());
  }

  function getRoutes() {
    return [
      {
        name: 'search',
        config: {
          url: '/search?result',
          views: {
            'pagecontent@': {
              templateUrl: 'search/search.html',
              controller: 'Search',
              controllerAs: 'vm'
            }
          }
        }
      }
    ];
  }

})();