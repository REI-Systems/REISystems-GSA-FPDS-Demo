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
        name: 'login',
        config: {
          url: '/login',
          views: {
            'pagecontent@': {
              templateUrl: 'account/login.html',
              controller: 'Login',
              controllerAs: 'vm'
            }
          }
        }
      },
      {
        name: 'register',
        config: {
          url: '/register',
          views: {
            'pagecontent@': {
              templateUrl: 'account/register.html',
              controller: 'Register',
              controllerAs: 'vm'
            }
          }
        }
      },
    ];
  }

})();