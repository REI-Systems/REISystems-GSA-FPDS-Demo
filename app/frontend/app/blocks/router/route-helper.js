(function() {
  'use strict';

  angular
    .module('blocks.router')
    .provider('routehelperConfig', routehelperConfig)
    .factory('routehelper', routehelper);

  routehelperConfig.$inject = ['$urlRouterProvider'];
  routehelper.$inject = ['routehelperConfig'];

  // Must configure via the routehelperConfigProvider
  function routehelperConfig($urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');

    this.config = {
      // These are the properties we need to set
      // $routeProvider: undefined
    };

    this.$get = function() {
      return {
        config: this.config
      };
    };
  }

  function routehelper(routehelperConfig) {

    var routes = [];
    var $routeProvider = routehelperConfig.config.$routeProvider;

    var service = {
      configureRoutes: configureRoutes
    };

    return service;
    ///////////////

    function configureRoutes(routes) {
      routes.forEach(function(route) {
        $routeProvider.state(route.name, route.config);
      });
    }

  }
})();