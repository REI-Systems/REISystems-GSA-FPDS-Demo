(function () {

  var app = angular.module('app', [
    'ui.router'
  ]);

  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        views: {
          'masthead@': {
            templateUrl: 'templates/home-masthead.html',
            controller: 'HomeController',
            controllerAs: 'home'
          },
          'pagecontent@': {
            templateUrl: 'templates/home.html',
            controller: 'HomeController',
            controllerAs: 'home'
          }
        }
      })
      .state('login', {
        url: '/login',
        views: {
          'pagecontent@': {
            templateUrl: 'templates/login.html',
            controller: 'LoginController',
            controllerAs: 'login',
          }
        }
      })
      .state('search', {
        url: '/search',
        views: {
          'pagecontent@': {
            templateUrl: 'templates/search.html',
            controller: 'SearchController',
            controllerAs: 'search',
          }
        }
      })
      .state('register', {
        url: '/register',
        views: {
          'pagecontent@': {
            templateUrl: 'templates/register.html',
            controller: 'RegisterController',
            controllerAs: 'register'
          }
        }

      });

    $urlRouterProvider.otherwise('/');

  }]);


} ());