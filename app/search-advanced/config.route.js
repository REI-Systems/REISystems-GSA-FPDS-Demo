(function() {
  'use strict';

  angular
    .module('app.searchadvanced')
    .run(appRun);

  appRun.$inject = ['routehelper']

  function appRun(routehelper) {
    routehelper.configureRoutes(getRoutes());
  }

  function getRoutes() {
    return [
      {
        name: 'searchadvanced',
        config: {
          url: '/search-advanced',
          views: {
            'pagecontent@': {
              templateUrl: 'search-advanced/content.html',
              controller: 'SearchAdvanced',
              controllerAs: 'vm'
            }
          }
        }
      }
    ];
  }

})();