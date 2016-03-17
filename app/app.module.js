(function() {
  'use strict';

  var app = angular.module('app', [

    'app.core',
    'app.data',
    'app.widgets',

    /*
     * Features
     */
    'app.account',
    'app.home',
    'app.search',
    'app.layout'

  ]);

})();