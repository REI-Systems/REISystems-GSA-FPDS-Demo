(function() {
  'use strict';

  var core = angular.module('app.core');

  core.config(configure);

  configure.$inject = ['$stateProvider', 'routehelperConfigProvider'];

  function configure($stateProvider, routehelperConfigProvider) {

    // Configure the common route provider
    routehelperConfigProvider.config.$routeProvider = $stateProvider;

  }
})();
