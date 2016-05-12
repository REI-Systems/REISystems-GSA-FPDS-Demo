(function() {
  'use strict';

  var app = angular.module('app', [

    'app.core',
    'app.data',
    'app.widgets',
    'chart.js',

    /*
     * Features
     */
    'app.account',
    'app.home',
    'app.search',
    'app.searchadvanced',
    'app.layout'

  ]);

})();