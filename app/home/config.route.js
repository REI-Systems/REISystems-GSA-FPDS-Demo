(function() {
  'use strict';

  angular
    .module('app.home')
    .run(appRun);

  appRun.$inject = ['routehelper']

  function appRun(routehelper) {
    routehelper.configureRoutes(getRoutes());
  }

  function getRoutes() {
    return [
      {
        name: 'home',
        config: {
          url: '/',
          views: {
            'masthead@': {
              templateUrl: 'home/home-masthead.html',
              controller: 'Home',
              controllerAs: 'vm'
            },
            'pagecontent@': {
              templateUrl: 'home/home.html',
              controller: 'Home',
              controllerAs: 'vm'
            }
          }
        }
      }
    ];
  }

})();