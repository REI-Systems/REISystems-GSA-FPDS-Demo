var fpds = angular.module('FPDS', [
    'ngRoute',
    'ngAnimate',
    'ngAria',
    'ngResource',
    'ngCookies',
    'ngMessages',
    'ngSanitize',
    'ngTouch',
    'angularSpinner'
]).
config(['$routeProvider', 'usSpinnerConfigProvider', function ($routeProvider, usSpinnerConfigProvider) {
    $routeProvider
        .when('/',
        {
            controller: 'HomeController',
            templateUrl: 'templates/partials/home/_index.html'
        })
        .when('/login',
        {
            controller: 'LoginController',
            templateUrl: 'templates/partials/user/_login.html'
        })
        .when('/register',
        {
            controller: 'RegisterController',
            templateUrl: 'templates/partials/user/_register.html'
        })
        .otherwise({redirectTo: '/'});

        //customizing spinner
        usSpinnerConfigProvider.setDefaults({color: 'black', radius:30, width:12, length: 25});
}]);

//assign all defined factories to this module 'factory'
fpds.factory(factories);

//assign all defined providers to this module 'provider'
fpds.provider(providers);

//assign all defined services to this module 'service'
fpds.service(services);

//assign all defined factories to this module 'factory'
fpds.filter(filters);

//assign all defined directives to this app module 'directive'
fpds.directive(directives);

//assign all defined controller to this module controller
fpds.controller(controllers);